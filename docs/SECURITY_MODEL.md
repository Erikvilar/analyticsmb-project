# Modelo de segurança

## Princípios

- **Local-first:** coleta, correlação e persistência operacional permanecem no computador do usuário.
- **Menor privilégio:** o produto solicita somente o acesso necessário ao dispositivo e aos arquivos escolhidos.
- **Separação de segredos:** credenciais privilegiadas não pertencem ao frontend, ao showcase ou ao pacote público.
- **Minimização de dados:** somente métricas úteis à sessão são persistidas; retenção evita crescimento indefinido.
- **Falha explícita:** amostras inválidas e dependências indisponíveis não são convertidas em resultados aparentemente válidos.

## Fronteiras de confiança

O Android autoriza a estação via ADB. A API local atende somente a interface desktop e não é apresentada como serviço de rede público. Firebase é autoridade de autenticação; o banco local guarda perfil e dados analíticos, nunca senha ou token como identidade paralela.

Ferramentas externas, como ADB, Maestro e scrcpy, ficam atrás de adapters com argumentos controlados, timeout e cancelamento. O terminal aplica política explícita de comandos permitidos e restritos.

## Escopo público

O showcase omite portas, endpoints internos, collectors completos, credenciais, bancos, logs, automação de produção e detalhes do launcher. Os exemplos usam packages e dispositivos sintéticos.
