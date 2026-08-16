<div align="center">
  <img src="./assets/analyticsmb-icon.svg" width="128" height="128" alt="Logo do AnalyticsMB">

  # AnalyticsMB

  **Estação de observabilidade, diagnóstico e automação de testes para aplicações Android.**

  [![Versão](https://img.shields.io/badge/vers%C3%A3o-22.0.20261-6b7280?style=flat-square)](./package.json)
  ![Windows](https://img.shields.io/badge/Windows-10%20%7C%2011-0078D4?style=flat-square&logo=windows11&logoColor=white)
  ![Android](https://img.shields.io/badge/Android-ADB-3DDC84?style=flat-square&logo=android&logoColor=white)
  ![Node.js](https://img.shields.io/badge/Node.js-22-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white)
  ![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=111827)
  ![Escopo](https://img.shields.io/badge/escopo-developer%20showcase-8B5CF6?style=flat-square)
</div>

## O problema que o projeto resolve

Investigações de performance Android normalmente exigem combinar manualmente `adb`, `dumpsys`, `/proc`, `gfxinfo`, `meminfo`, `logcat`, dados de bateria, conexões de rede, Maestro, scrcpy e bancos locais. Cada ferramenta entrega informações em formatos e momentos diferentes, deixando a evidência fragmentada.

Isso dificulta responder perguntas importantes durante desenvolvimento, QA e investigação de incidentes:

- em que momento a CPU aumentou;
- se a carga veio do dispositivo ou da aplicação monitorada;
- se FPS e jank pioraram no mesmo intervalo;
- quanto de memória e energia foi consumido;
- se o processo foi encerrado ou recriado pelo Android;
- se houve crash ou ANR durante uma jornada automatizada;
- se uma versão regrediu em comparação com outra;
- como preservar os dados para análise e relatório posteriores.

O AnalyticsMB centraliza esses sinais em uma estação desktop e os organiza como telemetria temporal sincronizada. A coleta principal ocorre externamente por ADB, sem exigir um SDK dentro do APK monitorado. Métricas ausentes permanecem indisponíveis em vez de serem convertidas artificialmente em zero, e correlação temporal não é apresentada automaticamente como causalidade.

## Recursos

- Performance: FPS, jank, CPU, memória, pressão de heap e qualidade geral.
- Estabilidade: logs, crashes e ANRs com filtros por período e exportação.
- Dispositivo: bateria, temperatura, informações do Android e resiliência de processos em segundo plano.
- Rede: tráfego, sockets e conexões do pacote monitorado.
- Realm: localização, dump, exploração paginada, filtros e consultas em builds depuráveis.
- Histórico: armazenamento SQLite por pacote, versão e sessão de monitoramento.
- Relatórios: comparação entre versões e aplicativos com gráficos e KPIs.
- Testes: execução Maestro associada à captura de telemetria da jornada.
- Terminal: comandos ADB integrados, histórico, ajuda e preenchimento com `Tab`.
- Espelhamento: abertura opcional do scrcpy nativo.

## Arquitetura

![Diagrama da arquitetura do AnalyticsMB](./docs/diagrams/diagram_project.png)

```text
Interface React
      │
      ▼
API Express ───── SQLite / sessões / relatórios
      │
      ▼
Comandos → parsers → calculators
      │
      ▼
Dispositivo Android e pacote monitorado
```

| Camada | Tecnologia |
|---|---|
| Interface | React 19, TypeScript, MUI X Charts |
| API e coleta | Node.js 22, Express 5, comandos ADB e parsers TypeScript |
| Persistência | SQLite e exploração de Realm |
| Desktop | Electron/Nativefier e ferramentas nativas Windows |
| Automação | Maestro e scrcpy |

## Exemplo de fluxo real

1. Um QA conecta um dispositivo Android autorizado.
2. O pacote alvo e uma sessão de monitoramento são selecionados.
3. CPU, memória, FPS, jank, energia, rede e estabilidade são observados.
4. Um cenário Maestro reproduz uma jornada real.
5. A telemetria é associada à janela da execução.
6. O desenvolvedor identifica picos, degradações sustentadas ou regressões.
7. A evidência pode ser comparada e preservada em relatório técnico.

## Interface do AnalyticsMB

### Preparação do ambiente

![Tela de preparação do ambiente](./docs/screenshots/loading_page.png)

### Autenticação

![Tela de autenticação](./docs/screenshots/login_page.png)

### Visão geral

![Tela de visão geral](./docs/screenshots/overview_page.png)

### Informações do dispositivo

![Tela de informações do dispositivo](./docs/screenshots/device_page.png)

### Performance

![Primeira página de performance](./docs/screenshots/perfomance_page.png)

![Segunda página de performance](./docs/screenshots/perfomance_page_page2.png)

### Rede

![Tela de análise de rede](./docs/screenshots/network_page.png)

### Estabilidade

![Tela de estabilidade, logs, crashes e ANRs](./docs/screenshots/stability_page.png)

### Testes automatizados

![Tela de execução de testes Maestro](./docs/screenshots/tests.page.png)

### Relatórios

![Tela de geração e comparação de relatórios](./docs/screenshots/report_page.png)

### Configurações e temas

![Configurações com o tema Neo Green e terminal](./docs/screenshots/settings_page_neon_green_theme_terminal.png)

![Configurações com o tema Cyber Orange](./docs/screenshots/settings_page_orange_theme.png)

## Conteúdo deste repositório

Este repositório é uma demonstração técnica curada. Ele contém documentação de arquitetura, decisões de engenharia, dados artificiais e exemplos representativos e sanitizados.

A implementação completa de produção permanece privada. Não estão incluídos a orquestração ADB, collectors completos, persistência, execução Maestro, engine de relatórios, terminal, autenticação, launcher, instalador ou configurações de produção.

## Documentação pública

- [Informações da versão pública](./RELEASE.md)
- [Arquitetura](./docs/ARCHITECTURE.md)
- [Decisões de engenharia](./docs/ENGINEERING_DECISIONS.md)
- [Observabilidade Android](./docs/OBSERVABILITY.md)
- [Exemplo backend de CPU](./showcase/backend/cpu-example/README.md)
- [Padrões frontend selecionados](./showcase/frontend/README.md)

## Executar as validações do showcase

Use somente Yarn:

```powershell
yarn install
yarn build
yarn test
```

## Observações

- Os dados demonstrativos são artificiais e usam pacotes fictícios.
- Nenhuma credencial, banco, log real ou binário de ferramenta faz parte do showcase.
- O código apresentado é apenas para portfólio e demonstração.
- Nenhuma licença de redistribuição ou reutilização comercial é concedida sem autorização explícita.

---

Desenvolvido por **Erik Alves Vilar — Software Developer**.
