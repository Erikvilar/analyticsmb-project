# Changelog do AnalyticsMB

Histórico executivo das evoluções publicadas no showcase. As versões mais recentes aparecem primeiro.

| Versão interna | Data | Categoria | O que mudou |
| --- | --- | --- | --- |
| `22.1.20265` | 27/08/2026 | Evolução do produto | A gravação de performance passou a reunir as telemetrias disponíveis em sessões consultáveis e exportáveis, com correlação temporal entre instabilidades de FPS e logs, crashes ou ANRs. A experiência de testes Maestro agora organiza fluxos e cenários por aplicação na pasta Documentos, preserva snapshots independentes e oferece edição segura. A navegação de relatórios foi simplificada e a interface recebeu tipografia, filtros, estados de carregamento e controles laterais mais claros. |
| `22.1.20264` | 26/08/2026 | Correção de confiabilidade | O FPS Timeline passou a descartar janelas `gfxinfo` com menos de 20 frames, eliminando registros artificiais de `0 FPS`. A leitura e o reset agora são coordenados por aplicação, sem reutilização do cache de telemetria e sem disputa entre consumidores simultâneos. |
| `22.1.20263` | 23/08/2026 | Evolução do produto | Consolidação do monitor de resiliência, relatórios Maestro com telemetria contextual, histórico comparativo por aplicação e versão, exploração de bancos mobile e distribuição Windows autocontida. |
| `22.0.20262` | 16/08/2026 | Plataforma e distribuição | Reforço do empacotamento self-contained, validação das dependências nativas, ampliação dos textos traduzíveis e verificação de integridade do artefato distribuído. |
| `22.0.20261` | 16/08/2026 | Primeira versão Beta | Lançamento da base pública com diagnóstico de FPS, jank, CPU, memória, energia e estabilidade; sessões históricas; relatórios; execução Maestro; terminal integrado e suporte a scrcpy. |

## Versão pública

| Canal | Release | Status | Observação |
| --- | --- | --- | --- |
| Beta | [`0.1.0-beta.1`](https://github.com/Erikvilar/analyticsmb-project/releases/tag/v0.1.0-beta.1) | Pre-release | O número público identifica a release disponível no GitHub; a versão interna identifica a evolução do build do produto. |

## Política do histórico

- **Evolução do produto:** nova capacidade ou melhoria relevante para usuários.
- **Correção de confiabilidade:** ajuste que aumenta a precisão, estabilidade ou confiança nos diagnósticos.
- **Plataforma e distribuição:** mudanças no runtime, instalador, dependências ou processo de entrega.
- Alterações internas sem impacto perceptível são agrupadas na versão correspondente para manter o histórico objetivo.
