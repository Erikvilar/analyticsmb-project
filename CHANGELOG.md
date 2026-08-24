# Changelog

## [0.1.0-beta.1] - 2026-08-23

### Adicionado

- monitor de resiliência e ciclo de vida do processo;
- relatórios de cenários Maestro com telemetria contextual;
- diagnóstico de FPS, jank, CPU, memória, energia e estabilidade;
- sessões históricas e comparações por versão, pacote e período;
- exploração de bancos mobile e suporte a scrcpy;
- distribuição Windows autocontida e verificação SHA-256;
- showcase público com exemplos sanitizados.

### Alterado

- coleta de CPU passou a usar deltas sincronizados dos contadores do kernel;
- persistência foi organizada por sessões e políticas de retenção;
- menus, widgets, comandos e temas passaram a usar catálogos extensíveis;
- empacotamento e validação de dependências do runtime foram reforçados.

### Corrigido

- transições de PID deixaram de produzir picos artificiais;
- ausência de processo deixou de ser representada como consumo zero;
- filas ADB e processos externos ganharam timeout e cancelamento isolados;
- resolução de caminhos e encerramento do runtime Windows foram estabilizados.

[0.1.0-beta.1]: https://github.com/Erikvilar/analyticsmb-project/releases/tag/v0.1.0-beta.1
