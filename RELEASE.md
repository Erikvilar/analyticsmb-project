# AnalyticsMB 22.4.20265

## Publicação atual

A publicação mais recente por data no GitHub é **release v22.4.20265**, disponibilizada em 13 de outubro de 2026. As informações abaixo foram conferidas na API pública do GitHub.

A tag dessa publicação ainda se chama `beta-release-v22.1.20265`. Os links usam essa tag para apontar ao artefato correto; o número exibido nesta página acompanha o título da release.

## Identificação

| Campo | Valor |
| --- | --- |
| Versão pública (título da release) | `22.4.20265` |
| Tag no GitHub | `beta-release-v22.1.20265` |
| Versão interna do código principal consultado | `22.4.2026` |
| Status do produto | Beta |
| Status da publicação no GitHub | Publicada; não marcada como pre-release |
| Data de publicação | 13 de outubro de 2026, 20:17 (America/Sao_Paulo) |
| Plataforma | Windows 10/11 x64 |
| Arquivo | `AnalyticsMB.7z` |
| Tamanho | 328.543.602 bytes |

A release não possui notas descritivas no GitHub. As melhorias verificadas no repositório principal estão no [README](README.md), sem presumir que o identificador interno do código seja o mesmo do binário distribuído.

## Download

[Baixar AnalyticsMB.7z](https://github.com/Erikvilar/analyticsmb-project/releases/download/beta-release-v22.1.20265/AnalyticsMB.7z) · [Abrir a release 22.4.20265](https://github.com/Erikvilar/analyticsmb-project/releases/tag/beta-release-v22.1.20265) · [Todas as releases](https://github.com/Erikvilar/analyticsmb-project/releases)

Confira o hash do arquivo baixado, extraia o pacote completo e siga as instruções incluídas na distribuição. O ZIP automático de código-fonte do GitHub não corresponde ao instalador do produto.

## SHA-256

```text
a92c144b8488e2c99a0d8ea055c6b462ca8cbf65a652234e6674b9d44900a15a
```

Digest informado pelo GitHub para **`AnalyticsMB.7z`**. Ele se aplica ao arquivo compactado, não ao executável extraído. Valide no PowerShell:

```powershell
Get-FileHash .\AnalyticsMB.7z -Algorithm SHA256
```

## Requisitos

- Windows 10 ou 11 x64;
- Android com depuração USB e autorização RSA;
- cabo com transferência de dados;
- internet para autenticação e recursos de idioma;
- permissão de instalação do usuário.

## Limitações conhecidas

- disponibilidade das métricas varia por Android e fabricante;
- dados privados podem exigir build debuggable;
- observabilidade ADB não substitui toda instrumentação in-app;
- build Beta sem assinatura comercial pode acionar o SmartScreen;
- correlação temporal não prova causalidade.

Consulte o [changelog completo](CHANGELOG.md), a [distribuição](docs/DISTRIBUTION.md) e as [limitações](docs/LIMITATIONS.md).
