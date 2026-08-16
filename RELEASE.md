# Release do AnalyticsMB

## Identificação

| Campo | Valor |
|---|---|
| Versão | `22.0.20261` |
| Canal | Beta |
| Data do build | 16 de agosto de 2026 |
| Plataforma | Windows 10 e 11 x64 |
| Arquitetura | x64 |
| SHA-256 | Pendente da geração do artefato final |

> Esta versão deve ser publicada no GitHub como **pre-release** enquanto permanecer no canal Beta.

## Download

O instalador será disponibilizado na página de releases:

[Baixar a versão mais recente do AnalyticsMB](https://github.com/Erikvilar/analyticsmb-project/releases/latest)

Utilize somente os artefatos publicados no repositório oficial. O ZIP automático de código-fonte criado pelo GitHub não corresponde ao instalador do AnalyticsMB.

## Requisitos

- Windows 10 ou Windows 11 x64;
- dispositivo Android com depuração USB habilitada;
- autorização da chave RSA apresentada pelo Android ao conectar o dispositivo;
- conexão com a internet para autenticação e carregamento dos recursos de idioma;
- porta USB e cabo com suporte à transferência de dados;
- permissões de usuário para instalar e executar a aplicação.

ADB, Maestro, SQLite e demais ferramentas necessárias ao runtime devem ser fornecidos pelo pacote oficial. Não é necessário instalá-los manualmente quando a distribuição estiver completa.

## Verificação de integridade

Após gerar o artefato final, calcule o SHA-256 no PowerShell:

```powershell
Get-FileHash -Algorithm SHA256 .\AnalyticsMB-22.0.20261-beta.exe
```

O valor publicado nesta página e nas notas do GitHub Release deve ser exatamente igual ao resultado local. Nunca reutilize o hash de um build anterior.

## Changelog

### `22.0.20261-beta` — 16 de agosto de 2026

- disponibilização inicial do AnalyticsMB como versão pública Beta;
- observabilidade de CPU, memória, FPS, jank, bateria e energia;
- acompanhamento de rede, estabilidade, crashes e ANRs;
- execução de cenários Maestro associada à captura de performance;
- histórico local e comparação de sessões e versões;
- geração de relatórios técnicos;
- exploração de bancos compatíveis;
- terminal integrado e suporte ao espelhamento nativo;
- temas visuais, internacionalização e autenticação Firebase.

## Limitações conhecidas da versão Beta

- determinados dados dependem do suporte oferecido pelo fabricante e pela versão do Android;
- exploração de arquivos privados pode exigir uma aplicação Android depurável;
- a precisão de algumas métricas depende dos contadores disponibilizados pelo dispositivo;
- o instalador ainda deve ser validado em diferentes instalações limpas do Windows 10 e 11;
- assinatura de código ainda é recomendada para aumentar a confiança do Windows no instalador.

## Escopo e suporte

O repositório contém uma demonstração técnica sanitizada. A implementação completa permanece privada. Problemas devem ser registrados sem anexar tokens, bancos, logs sensíveis, serial de dispositivo ou dados empresariais.
