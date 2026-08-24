# AnalyticsMB 0.1.0-beta.1

## Destaques

- Process Resilience Monitor;
- relatórios de cenários Maestro;
- runtime Windows autocontido;
- métricas históricas e comparativas;
- verificação SHA-256.

## Identificação

| Campo | Valor |
| --- | --- |
| Versão pública | `0.1.0-beta.1` |
| Versão interna do build | `22.0.20261` |
| Status | Beta / pre-release |
| Data | 16 de agosto de 2026 |
| Plataforma | Windows 10/11 x64 |

## Download

[Acessar as releases oficiais](https://github.com/Erikvilar/analyticsmb-project/releases)

O ZIP automático de código-fonte do GitHub não corresponde ao instalador do produto.

## SHA-256

```text
348002044314992354AF5E367A0E402DF8956B830C92A1AEBBA64FB7FC28BB0E
```

Valide no PowerShell:

```powershell
Get-FileHash .\AnalyticsMB-Setup.exe -Algorithm SHA256
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
