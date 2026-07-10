# Analytics Agent — Documentação da API

Backend que executa comandos `adb` (via `Makefile`) e expõe métricas de
performance do app mobile em JSON, além de receber logs de rede enviados
pelo próprio app via interceptor.

Base URL local: `http://localhost:3333`

---

## `AnalyticsController` — `/analytics`

Métricas extraídas via `adb shell dumpsys` e comandos correlatos.

### `GET /analytics/meminfo`

Roda `dumpsys meminfo` no device e retorna o resultado parseado.

**Request:** sem parâmetros.

**Response `200`:**
```json
{
  "pid": 1234,
  "packageName": "com.example.app",
  "totalPssKB": 50000,
  "totalRssKB": 55000,
  "totalSwapPssKB": 500,
  "breakdown": [
    {
      "category": "Native Heap",
      "pssTotal": 12345,
      "privateDirty": 12000,
      "privateClean": 100,
      "swapPssDirty": 0,
      "rssTotal": 13000,
      "heapSize": 20000,
      "heapAlloc": 15000,
      "heapFree": 5000
    }
  ],
  "appSummary": {
    "javaHeapKB": 5000,
    "nativeHeapKB": 12000,
    "codeKB": 2000,
    "stackKB": 500,
    "graphicsKB": 3000,
    "privateOtherKB": 1000,
    "systemKB": 2000,
    "unknownKB": 1000
  }
}
```

**O que cada campo quer dizer:**

- **`totalPssKB` (PSS — Proportional Set Size)**: quanto de RAM o processo
  realmente "custa" ao sistema, já dividindo memória compartilhada
  proporcionalmente entre os processos que a usam. É a métrica mais justa
  pra comparar consumo de memória entre apps, e a que você deve olhar
  primeiro quando quiser saber "quanta RAM esse app está usando".
- **`totalRssKB` (RSS — Resident Set Size)**: quanto de RAM está
  fisicamente carregada pro processo, sem dividir memória compartilhada.
  Sempre ≥ PSS. Útil pra detectar picos reais de uso físico, mas superestima
  o "custo real" porque conta memória compartilhada por inteiro.
- **`totalSwapPssKB`**: quanto foi parar em swap (comprimido/paginado pro
  disco). Se esse valor cresce, é sinal de pressão de memória no device
  como um todo, não só do seu app.
- **`breakdown`**: separa o consumo por categoria de memória (`Native
  Heap`, `Dalvik Heap`, `.so mmap`, `.dex mmap`, etc). Cada linha traz
  `pssTotal`/`rssTotal` (quanto essa categoria pesa) e, quando aplicável,
  `heapSize`/`heapAlloc`/`heapFree` (tamanho do heap reservado vs. quanto
  está de fato alocado — a diferença é memória "reservada mas ociosa").
  **Native Heap crescendo sem parar entre capturas é o sinal clássico de
  memory leak em código nativo (JNI, C++).**
- **`appSummary`**: a mesma informação resumida do ponto de vista da
  aplicação (`Java Heap`, `Native Heap`, `Code`, `Stack`, `Graphics`,
  `Private Other`, `System`, `Unknown`). `Graphics` alto costuma indicar
  muitas texturas/bitmaps não liberados; `Stack` alto é raro e pode indicar
  recursão profunda ou muitas threads.

**Response `500`:** `{ "error": "Falha ao ler meminfo", "details": "..." }`
— acontece se o comando `adb` falhar (device desconectado, app não
rodando, etc).

---

### `GET /analytics/gfxinfo`

Roda `dumpsys gfxinfo` no device e retorna o resultado parseado (frames
renderizados, jank, percentis de tempo de frame).

**Request:** sem parâmetros.

**Response `200`:**
```json
{
  "pid": 1234,
  "packageName": "com.example.app",
  "totalFramesRendered": 3611,
  "jankyFrames": { "count": 25, "percent": 0.69 },
  "percentiles": { "p50": 6, "p90": 10, "p95": 12, "p99": 21 },
  "missedVsync": 1,
  "highInputLatency": 0,
  "slowUiThread": 3,
  "slowBitmapUploads": 1,
  "slowIssueDrawCommands": 4,
  "frameDeadlineMissed": 5
}
```

**O que cada campo quer dizer:**

- **`totalFramesRendered`**: quantos frames o Android desenhou pra esse
  app desde a última captura/reset das estatísticas. É só volume de
  amostra — sozinho não indica qualidade, mas quanto maior, mais confiável
  fica o percentual de jank calculado em cima dele.
- **`jankyFrames.percent`**: porcentagem de frames que "engasgaram" (não
  foram entregues a tempo, gerando soluço visual perceptível). Referência
  de indústria: **abaixo de 1-2% é ótimo; acima de 5% já é perceptível
  pelo usuário como travamento.**
- **`percentiles` (p50/p90/p95/p99)**: tempo de renderização de cada
  frame, ordenado — cada percentil mostra "X% dos frames levaram até
  esse tempo". O mais importante é o **orçamento de frame de 16.67ms**
  (necessário pra manter 60fps). Se o `p99` já estoura 16.67ms, significa
  que pelo menos 1% dos frames do app estão furando o orçamento de 60fps —
  mesmo que o `p50` pareça ótimo. Olhar só a média esconde esse problema;
  por isso os percentis são melhores que uma média simples.
- **`missedVsync`**: quantas vezes o app perdeu o sinal de sincronização
  do display (vsync), forçando o sistema a reusar o frame anterior —
  causa direta de jank visível.
- **`highInputLatency`**: frames onde o tempo entre o toque do usuário e
  a resposta visual foi alto demais. Afeta a sensação de "responsividade",
  não necessariamente a fluidez da animação.
- **`slowUiThread`**: frames onde a *main thread* (onde o layout/desenho
  Android roda) demorou demais pra montar o frame. Costuma indicar
  trabalho pesado (parsing, cálculo, I/O) rodando na thread errada.
- **`slowBitmapUploads`**: frames lentos por causa de upload de bitmap pra
  GPU — geralmente imagens grandes demais sendo carregadas sem
  redimensionamento/otimização.
- **`slowIssueDrawCommands`**: frames onde o tempo de emitir comandos de
  desenho pra GPU foi alto — hierarquias de view muito profundas/complexas
  costumam causar isso.
- **`frameDeadlineMissed`**: contagem "oficial" (métrica mais recente do
  Android) de frames que perderam o prazo de entrega — em geral acompanha
  de perto o `jankyFrames.count`.

**Response `500`:** mesmo formato de erro do `meminfo`.

---

### `GET /analytics/cpu`

Roda `dumpsys cpuinfo | grep <package>` e retorna o uso de CPU do
processo (e de processos secundários do mesmo pacote, se houver).

**Request:** sem parâmetros.

**Response `200`:**
```json
{
  "rows": [
    {
      "totalPercent": 0.3,
      "pid": 3017,
      "label": "com.project_mobile",
      "userPercent": 0.1,
      "kernelPercent": 0.1,
      "faultsMinor": 1822,
      "faultsMajor": 1210
    }
  ],
  "totalPercent": 0.3
}
```

**O que cada campo quer dizer:**

- **`totalPercent` (por linha)**: percentual de um núcleo de CPU usado por
  aquele processo/thread durante a janela de amostragem do `dumpsys`
  (tipicamente os últimos segundos). Pode passar de 100% se o processo usa
  mais de um núcleo simultaneamente.
- **`userPercent` vs `kernelPercent`**: `user` é tempo de CPU gasto
  rodando código do próprio app (sua lógica, sua UI); `kernel` é tempo
  gasto em chamadas de sistema (I/O, alocação de memória, syscalls em
  geral). **`kernelPercent` alto e sustentado costuma indicar I/O
  excessivo** (disco, rede, muitas alocações) em vez de processamento puro.
- **`faultsMinor`**: número de "page faults" resolvidos sem precisar ir ao
  disco (a página já estava em memória, só precisou ser mapeada de novo).
  Normal e esperado em quantidade razoável.
- **`faultsMajor`**: page faults que exigiram ir ao disco/swap pra
  resolver. **Esse é o número que importa mais**: valores altos ou
  crescentes indicam pressão de memória real (o sistema está trocando
  páginas do seu processo pra swap), o que causa lentidão perceptível.
- **`totalPercent` (nível raiz)**: soma de todas as linhas retornadas —
  aproxima o custo total de CPU do pacote, somando processo principal e
  eventuais processos secundários (ex: `:push`, `:remote`).

**Response `500`:** `{ "error": "Falha ao ler cpuinfo", "details": "..." }`

---

### `GET /analytics/battery`

Roda `dumpsys battery` filtrado e retorna nível, temperatura, status e
saúde da bateria no momento da captura.

**Request:** sem parâmetros.

**Response `200`:**
```json
{
  "level": 85,
  "temperatureCelsius": 32.0,
  "status": "DISCHARGING",
  "health": "GOOD"
}
```

**O que cada campo quer dizer:**

- **`level`**: percentual de carga (0-100). Sozinho não diz muito — o que
  importa é a **taxa de queda ao longo do tempo** com o app em uso; quedas
  rápidas indicam consumo anormal de bateria pelo app.
- **`temperatureCelsius`**: temperatura da bateria em graus Celsius (o
  Android reporta em décimos de grau, já convertido aqui). Acima de ~40°C
  sustentado com o app em uso é sinal de CPU/GPU trabalhando pesado demais
  — relaciona diretamente com os dados de `cpu` e `gfxinfo`.
- **`status`**: `CHARGING`, `DISCHARGING`, `NOT_CHARGING`, `FULL` ou
  `UNKNOWN`. Pra medir consumo do app, a captura precisa estar em
  `DISCHARGING` (com carregador desconectado) — do contrário o `level`
  não reflete o consumo real.
- **`health`**: `GOOD`, `OVERHEAT`, `DEAD`, `OVER_VOLTAGE`,
  `UNSPECIFIED_FAILURE`, `COLD` ou `UNKNOWN`. Normalmente é `GOOD`; outros
  valores indicam problema físico da bateria, não do app.

**Response `500`:** `{ "error": "Falha ao ler battery", "details": "..." }`

---

### `GET /analytics/pid`

Roda `adb shell pidof <package>` — usado mais como sinal de "o app está
rodando?" do que como métrica de performance em si.

**Request:** sem parâmetros.

**Response `200`:**
```json
{
  "pids": [3017],
  "running": true
}
```

**O que cada campo quer dizer:**

- **`pids`**: lista de PIDs do pacote. Normalmente um só, mas pode ter
  mais de um se o app declara processos separados no manifest (ex:
  `:push`, WebView isolado).
- **`running`**: `false` quando `pidof` não retorna nada — sinal de que o
  app crashou, foi fechado, ou nunca foi aberto. Vale checar isso antes de
  chamar `meminfo`/`gfxinfo`/`cpu`, já que todos esses vão falhar ou
  retornar vazio se o app não estiver rodando.

**Response `500`:** `{ "error": "Falha ao ler pid", "details": "..." }`

---

### `GET /analytics/quality`

Roda `meminfo` e `gfxinfo` em paralelo e calcula uma nota de qualidade de
0 a 10, combinando fluidez de UI (jank/fps) e uso de heap.

**Request:** sem parâmetros.

**Response `200`:**
```json
{
  "score": 7.8,
  "label": "Boa",
  "breakdown": { "fpsScore": 8.2, "heapScore": 7.0 },
  "metrics": {
    "jankyPercent": 0.69,
    "p90Ms": 10,
    "p99Ms": 21,
    "totalPssKB": 220000
  },
  "raw": {
    "meminfo": { "...": "objeto completo do /analytics/meminfo" },
    "gfxinfo": { "...": "objeto completo do /analytics/gfxinfo" }
  }
}
```

**O que cada campo quer dizer:**

- **`score`**: nota final 0-10, `fpsScore * 0.6 + heapScore * 0.4`. Pensada
  pra ser a métrica única que você planta num gráfico de linha ao longo do
  tempo/versões pra ver a saúde geral do app numa olhada só.
- **`breakdown.fpsScore`**: nota 0-10 derivada de `jankyFrames.percent`
  (peso 0.5), `p90` (peso 0.3) e `p99` (peso 0.2) do gfxinfo, usando
  16.67ms como orçamento de frame. Cai quando o app engasga ou os
  percentis de frame time estouram o orçamento de 60fps.
- **`breakdown.heapScore`**: nota 0-10 derivada de `totalPssKB` do
  meminfo — 10 se ≤150MB, 0 se ≥400MB, interpolado linear no meio. Cai
  conforme o app consome mais RAM.
- **`label`**: tradução textual do `score` (`Excelente` ≥9, `Boa` ≥7,
  `Regular` ≥5, `Ruim` ≥3, `Critica` <3) — pra exibir direto na UI sem
  precisar de lógica de faixa no front.
- **`metrics`**: os números brutos que alimentaram o cálculo, já
  extraídos pra fácil acesso sem precisar navegar dentro de `raw`.
- **`raw`**: os objetos completos de `/analytics/meminfo` e
  `/analytics/gfxinfo`, caso você precise de algum campo que não entrou
  no resumo (ex: `breakdown` de memória por categoria).

Os limites de heap (`HEAP_GOOD_KB`, `HEAP_BAD_KB`) e os pesos
(`WEIGHT_FPS`, `WEIGHT_HEAP`) são constantes no topo de
`src/services/quality.service.ts` — ajuste conforme o perfil de memória
real do seu app.

**Response `500`:** `{ "error": "Falha ao calcular quality", "details": "..." }`

---

## `NetworkController` — `/network`

Não usa `adb`/proxy — o próprio app envia cada chamada HTTP feita (via
interceptor do axios, ver `network-interceptor.example.ts`) e o backend
guarda em memória.

### `POST /network`

Registra uma chamada de rede feita pelo app. Chamado automaticamente pelo
interceptor, não precisa ser chamado manualmente.

**Request body:**
```json
{
  "timestamp": 1735000000000,
  "method": "GET",
  "url": "https://api.exemplo.com/users/42",
  "status": 200,
  "requestPayload": null,
  "responsePayload": { "id": 42, "name": "..." },
  "durationMs": 184
}
```
Campos obrigatórios: `url`, `method`. O resto é opcional.

**O que cada campo quer dizer:**

- **`status`**: código HTTP da resposta. `>= 400` indica erro — é o
  primeiro filtro pra montar um gráfico de "taxa de erro por endpoint".
- **`requestPayload`/`responsePayload`**: corpo enviado/recebido, cru
  (sem mascaramento — ver observação de segurança no fim do documento).
  Útil pra depurar payloads gigantes ou malformados sem precisar abrir o
  debugger.
- **`durationMs`**: tempo entre o disparo da requisição e a resposta
  chegar. É a métrica principal pra achar endpoints lentos — agregando por
  `url`/`host` dá pra montar um ranking de latência.

**Response `201`:** `{ "status": "ok" }`

**Response `400`:** se faltar `url` ou `method`.

---

### `GET /network`

Retorna todas as chamadas registradas na sessão atual (até 500 mais
recentes — as mais antigas são descartadas automaticamente).

**Response `200`:**
```json
[
  {
    "timestamp": 1735000000000,
    "method": "GET",
    "url": "https://api.exemplo.com/users/42",
    "status": 200,
    "requestPayload": null,
    "responsePayload": { "id": 42, "name": "..." },
    "durationMs": 184
  }
]
```

Use esse endpoint pra alimentar os gráficos de rede: chamadas por minuto,
payload médio por endpoint, taxa de erro (`status >= 400`), latência
(`durationMs`) por endpoint.

---

### `DELETE /network`

Limpa o log em memória. Útil pra zerar entre sessões de teste.

**Response `200`:** `{ "status": "log limpo" }`

---

### `GET /network/package/:packageName`

Filtra conexões TCP abertas no nível de socket (via `ss -tunap`,
cruzando PID do processo) — complementar ao `/network`, mostra conexões
mesmo sem passar pelo interceptor do axios (ex: WebViews, SDKs de
terceiros, tráfego nativo).

**Response `200`:**
```json
[
  {
    "protocol": "tcp",
    "state": "ESTABLISHED",
    "pid": 3017,
    "localIp": "192.168.100.36",
    "localPort": 33238,
    "remoteIp": "32.187.6.94",
    "remotePort": 443,
    "hostname": "ec2-32-187-6-94.us-west-2.compute.amazonaws.com",
    "provider": "Unknown",
    "service": "Unknown"
  }
]
```

**O que cada campo quer dizer:**

- **`state`**: estado da conexão TCP. `ESTABLISHED` é uma conexão ativa
  trocando dados agora; `CLOSE-WAIT`/`FIN-WAIT-*` são conexões em
  processo de fechamento — muitas conexões presas em `CLOSE-WAIT` por
  tempo longo é sinal de socket não fechado corretamente pelo app (leak
  de conexão).
- **`remoteIp`/`remotePort`**: destino da conexão. Porta `443` = HTTPS,
  `80` = HTTP. Não mostra a URL/path (isso está cifrado a essa altura) —
  pra esse nível de detalhe, use o `/network` (via interceptor).
- **`hostname`**: resultado de reverse DNS do `remoteIp`. Pode vir
  genérico (ex: hostname da nuvem/CDN) em vez do domínio real que o app
  chamou, já que várias APIs compartilham IP/CDN.

---

## Resumo rápido

| Método | Rota | O que faz |
|---|---|---|
| `GET` | `/analytics/meminfo` | Uso de memória (heap, PSS/RSS) via `dumpsys meminfo` |
| `GET` | `/analytics/gfxinfo` | Fluidez de UI (jank, fps, percentis de frame) via `dumpsys gfxinfo` |
| `GET` | `/analytics/cpu` | Uso de CPU (user/kernel, faults) via `dumpsys cpuinfo` |
| `GET` | `/analytics/battery` | Nível, temperatura, status e saúde da bateria |
| `GET` | `/analytics/pid` | PID(s) do app e se está rodando |
| `GET` | `/analytics/quality` | Nota 0–10 combinando fps e heap |
| `POST` | `/network` | Registra uma chamada HTTP feita pelo app |
| `GET` | `/network` | Lista as chamadas HTTP registradas (com payload) |
| `DELETE` | `/network` | Limpa o log de chamadas HTTP |
| `GET` | `/network/package/:packageName` | Conexões TCP abertas do processo (sem payload) |

## Observação de segurança

`requestPayload`/`responsePayload` no `/network` são armazenados sem
mascaramento. Não exponha esse backend fora da rede de desenvolvimento —
qualquer token, senha ou dado sensível trafegado pelo app fica visível em
texto plano via `GET /network`.
MDEOF
echo "OK - $(wc -l < /mnt/user-data/outputs/API.md) linhas"