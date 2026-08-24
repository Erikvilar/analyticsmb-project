# Distribuição Windows

## Ambiente suportado

- Windows 10 ou 11 x64;
- runtime autocontido;
- dispositivo Android com depuração USB autorizada;
- internet para autenticação e conteúdo de idioma.

## Estrutura da distribuição

O instalador copia os recursos necessários para o diretório escolhido e registra um desinstalador próprio. Dependências do runtime permanecem dentro da instalação; o usuário não precisa manter a árvore completa de desenvolvimento.

## Integridade

Cada release pública deve informar versão, data, status, requisitos, changelog e SHA-256. Compare o hash do arquivo baixado antes da execução:

```powershell
Get-FileHash .\AnalyticsMB-Setup.exe -Algorithm SHA256
```

## SmartScreen e assinatura

Builds Beta ainda não assinadas podem apresentar aviso do SmartScreen. SHA-256 confirma integridade em relação ao artefato publicado, mas não substitui assinatura Authenticode e reputação de publisher.
