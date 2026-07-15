# Módulo Realm — Documentação

Documentação do módulo de leitura do banco Realm via ADB, integrado ao dashboard de analytics mobile. Permite inspecionar o banco de um app Android em desenvolvimento sem alterar código do app e sem precisar de `console.log` manual.

---

## Visão geral do fluxo

```
find (descobre o .realm no device)
   ↓
pull (adb exec-out run-as → copia pro servidor)
   ↓
Realm SDK (Node) abre o arquivo em modo readOnly
   ↓
Express expõe os dados via REST e/ou terminal interno
```

O arquivo `.realm` puxado fica em cache local (`/data`) e só é buscado novamente no device quando não existe em cache ou quando o refresh é forçado explicitamente — evitando I/O desnecessário em polling automático do dashboard.

---

## Pré-requisitos

- Device conectado via USB com depuração habilitada
- App alvo precisa ser **debuggable** (builds de dev/staging), já que a leitura depende de `run-as`
- Pacote `realm` instalado no servidor Node:
  ```bash
  npm install realm
  ```
- `.gitignore` deve conter a pasta de cache local:
  ```gitignore
  data/
  ```
  Os arquivos `.realm` puxados são dumps reais de dados do app (podem conter dados de usuário, tokens, etc.) e não devem ser versionados.

---

## Endpoints REST

Todos os endpoints usam **query params**, não body. `package` é obrigatório em todos.

### `GET /analytics/realm/tableNames`
Lista apenas os nomes das tabelas do banco, sem os registros. Endpoint leve, ideal para popular um seletor no dashboard antes de o dev escolher qual tabela inspecionar.

```
GET /analytics/realm/tableNames?package=com.smv.mais
```

**Resposta:**
```json
{
  "pacote": "com.smv.mais",
  "tabelas": ["User", "Order", "Product", "Settings"]
}
```

---

### `GET /analytics/realm/table`
Retorna todos os registros de uma tabela específica.

```
GET /analytics/realm/table?package=com.smv.mais&table=User
```

| Parâmetro | Obrigatório | Descrição |
|---|---|---|
| `package` | sim | Nome do pacote do app (ex: `com.smv.mais`) |
| `table` | sim | Nome da tabela/schema a ser lida |
| `file` | não | Nome do arquivo `.realm`, caso o app tenha mais de um |

**Resposta:**
```json
[
  { "id": 1, "nome": "Erik", "ativo": true },
  { "id": 2, "nome": "Maria", "ativo": false }
]
```

---

### `GET /analytics/realm/access`
Retorna **todas as tabelas com todos os registros** de uma vez (snapshot completo do banco). Usa cache local se já existir; só faz pull do device se o arquivo não estiver em cache.

```
GET /analytics/realm/access?package=com.smv.mais&file=default.realm
```

| Parâmetro | Obrigatório | Descrição |
|---|---|---|
| `package` | sim | Nome do pacote do app |
| `file` | não | Nome do arquivo `.realm` específico |

**Resposta:**
```json
{
  "User": [{ "id": 1, "nome": "Erik" }],
  "Order": [{ "id": 10, "total": 250.5 }]
}
```

---

### `GET /analytics/realm/refresh`
Força um novo `pull` do device, ignorando qualquer cache local. Deve ser usado como botão explícito de "atualizar" no dashboard — não recomendado em polling automático, pelo custo de I/O no device.

```
GET /analytics/realm/refresh?package=com.smv.mais
```

**Resposta:** mesmo formato do `/access`.

---

### `GET /analytics/realm/discover`
Lista os caminhos completos de todos os arquivos `.realm` encontrados no diretório do app no device. Útil quando o app tem mais de um banco (ex: sync realms com nome UUID) e o dev precisa escolher qual inspecionar.

```
GET /analytics/realm/discover?package=com.smv.mais
```

**Resposta:**
```json
{
  "files": ["/data/data/com.smv.mais/files/default.realm"]
}
```

---

## Comandos no terminal interno do dashboard

Sintaxe pensada para ser digitada diretamente no terminal embutido do dashboard, sem precisar sair para a documentação.

```
realm tables                          -> lista nomes de tabelas
realm access <table>                  -> lista todos os dados da tabela
realm access <table> "<query>"        -> lista dados filtrados pela query
realm refresh                         -> força pull novo do device
```

### Regras de sintaxe

- A **query** (quando usada) deve obrigatoriamente vir entre aspas duplas `" "`, pois pode conter espaços e operadores.
- A query usa a **sintaxe nativa do Realm (RQL — Realm Query Language)**, a mesma usada no `.filtered()` do SDK mobile. Isso significa que o dev pode copiar/colar queries que já usa no código do app.

### Exemplos

**Listar tabelas disponíveis:**
```
realm tables
```

**Listar todos os registros de uma tabela:**
```
realm access Cliente
```

**Listar registros filtrados por query:**
```
realm access Cliente "codigoFilialOrigem == 1 AND (skuProduto == \"ABC123\" OR skuProduto == \"FAM01\") AND codigoIbgeEstadoDestino == '3550308' AND regiaoRoteiro == 'SP-CAPITAL'"
```

**Forçar atualização do banco (novo pull do device):**
```
realm refresh
```

### Operadores RQL suportados (referência rápida)

| Operador | Uso |
|---|---|
| `==`, `!=` | igualdade / diferença |
| `>`, `>=`, `<`, `<=` | comparação numérica |
| `AND`, `OR`, `NOT` | combinação lógica |
| `CONTAINS` | contém substring |
| `BEGINSWITH`, `ENDSWITH` | prefixo/sufixo de string |
| `( )` | agrupamento de condições |

---

## Formato de saída no terminal

O resultado de comandos `realm` é renderizado no terminal como uma tabela ASCII com colunas alinhadas, em vez de JSON cru.

```
📦 com.smv.mais → tabela: Cliente
🔍 query: codigoFilialOrigem == 1 AND regiaoRoteiro == 'SP-CAPITAL'
codigoFilialOrigem │ skuProduto │ regiaoRoteiro
────────────────────┼────────────┼──────────────
1                   │ ABC123     │ SP-CAPITAL
1                   │ FAM01      │ SP-CAPITAL
Total: 2 registro(s)
```

- Cabeçalho mostra pacote e, se aplicável, tabela e query usada.
- Colunas são calculadas dinamicamente a partir da união de todos os campos presentes nos registros (Realm permite campos opcionais).
- Valores muito longos (objetos aninhados) são truncados para não quebrar o layout do terminal.
- Se nenhum registro for encontrado, exibe `(nenhum registro encontrado)`.

---

## Estrutura de arquivos

```
adb.service.ts       -> comandos ADB genéricos (memória, cpu, rede, etc.)
realm.service.ts      -> classe RealmService: find, pull, cache, leitura, query
controller.ts          -> handlers HTTP dos endpoints /realm/*
routes.ts              -> definição das rotas Express
promptRequest.ts        -> parser do terminal interno (tokenizer + roteamento de comandos)
formatPromptResult.ts   -> formatação de saída (ASCII table, help, etc.)
```

---

## Notas técnicas importantes

### Abertura em modo `readOnly`
O `RealmService` abre o arquivo sempre com `readOnly: true`. Isso evita dois problemas:
1. Conflito de `schemaVersion` (o arquivo real do app pode estar em uma versão de schema avançada; abrir sem `readOnly` e sem schema explícito pode disparar erro de "downgrade" de versão).
2. Qualquer risco de escrita acidental no snapshot puxado — o servidor nunca deveria alterar o arquivo, só ler.

### Consistência do snapshot
O Realm mantém arquivos auxiliares (`.lock`, pasta `.management`) enquanto o app está com o banco aberto. Um `pull` feito com o app em uso ativo e gravando pode, em casos raros, capturar o arquivo em estado transitório. Prefira puxar com o app em idle, ou repita o `refresh` se os dados parecerem inconsistentes.

### Banco criptografado
Se o app usa `encryptionKey` no `Realm.open()`, a leitura externa só é possível se essa key também for informada ao `RealmService`. Sem ela, não há forma de abrir o arquivo — isso é esperado, é o propósito da criptografia.

### Múltiplos arquivos `.realm`
Use `/analytics/realm/discover` ou o parâmetro `file` nos demais endpoints quando o app tiver mais de um banco (comum em apps com sync ou múltiplos módulos).
