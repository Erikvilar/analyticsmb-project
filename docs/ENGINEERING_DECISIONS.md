# Decisões de engenharia

## Observação externa por ADB

### Contexto
Era necessário investigar APKs existentes sem alterar o aplicativo analisado.

### Decisão
Usar ADB como fronteira principal para diagnósticos locais.

### Por quê
Reduz acoplamento e permite observar aplicações de tecnologias diferentes.

### Trade-offs e consequências
Fabricantes, versões e permissões expõem capacidades diferentes; commands, parsers e estados indisponíveis precisam tratar essa variabilidade.

## API local entre UI e ferramentas

### Contexto
Componentes React não devem executar processos nem interpretar shell.

### Decisão
Isolar sistema operacional e Android atrás de uma API local e serviços de aplicação.

### Por quê
Mantém responsabilidades, cancelamento e políticas de segurança fora da apresentação.

### Trade-offs e consequências
Existe um processo adicional, compensado por loopback, lifecycle controlado e contratos pequenos.

## SQLite para histórico local

### Contexto
Comparações e relatórios exigem histórico estruturado sem infraestrutura remota obrigatória.

### Decisão
Persistir sessões e métricas normalizadas localmente.

### Por quê
Oferece transações, portabilidade e consultas analíticas em um único arquivo.

### Trade-offs e consequências
Retenção, índices, migrations e frequências de persistência precisam ser administrados explicitamente.

## Ausência não significa zero

### Contexto
Processos mortos e sensores incompatíveis eram passíveis de parecer consumo zero.

### Decisão
Representar indisponibilidade como `null` ou estado inválido.

### Por quê
Zero é uma medição; ausência é falta de evidência.

### Trade-offs e consequências
UI, estatísticas e relatórios precisam tratar validade, mas deixam de produzir conclusões falsas.

## Correlação não significa causalidade

### Contexto
CPU alta, FPS baixo e jank podem ocorrer juntos sem que um sinal prove a causa do outro.

### Decisão
Alinhar timestamps e apresentar evidências correlacionadas sem diagnóstico causal automático.

### Por quê
Preserva rigor técnico e espaço para contexto do teste.

### Trade-offs e consequências
Relatórios explicam sinais e limitações em vez de resumir tudo a uma nota opaca.

## Command → Parser → Calculator

### Contexto
Shell, parsing e matemática misturados tornavam testes e manutenção difíceis.

### Decisão
Separar aquisição, transformação e cálculo determinístico.

### Por quê
Cada responsabilidade pode evoluir e ser testada isoladamente.

### Trade-offs e consequências
Há mais módulos pequenos, porém menos acoplamento e menor risco de regressão.

## Runtime autocontido

### Contexto
O produto precisava funcionar em estações sem a árvore de desenvolvimento.

### Decisão
Empacotar dependências operacionais validadas e fornecer instalação nativa.

### Por quê
Reduz configuração manual e divergência de ambiente.

### Trade-offs e consequências
O artefato é maior e exige política de atualização, integridade e futura assinatura de código.

## Registries declarativos

### Contexto
Adicionar menus, widgets e comandos alterava arquivos centrais repetidamente.

### Decisão
Registrar metadata e implementações por contrato.

### Por quê
Extensões comuns passam a exigir uma entrada declarativa, não novos `switch`.

### Trade-offs e consequências
Contracts precisam permanecer específicos e semanticamente estáveis.
