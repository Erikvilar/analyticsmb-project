# Contribuindo

Este é um repositório de showcase; alguns módulos do produto permanecem privados. Contribuições públicas devem se limitar à documentação, dados sintéticos, exemplos e correções nos módulos demonstrativos.

## Pré-requisitos e configuração

- Node.js 22;
- Yarn;
- Git.

```bash
yarn install
yarn build
yarn test
```

## Fluxo

- use branches como `docs/<tema>`, `fix/<tema>` ou `feature/<tema>`;
- escreva commits objetivos, com título imperativo e contexto na descrição;
- preserve TypeScript tipado, responsabilidades pequenas e extensão por registry;
- inclua testes proporcionais ao risco e atualize o contrato alterado;
- preencha o template de pull request.

Não copie módulos privados, endpoints internos, credenciais, bancos, logs, packages corporativos ou dados reais. Problemas de segurança seguem [SECURITY.md](SECURITY.md), nunca uma pull request pública.
