# Limitações conhecidas

- Telemetria Android varia por versão, fabricante, kernel e permissões.
- Alguns contadores não estão disponíveis em todos os dispositivos.
- Observabilidade externa via ADB não substitui toda instrumentação dentro do aplicativo.
- Dados privados do aplicativo podem exigir build debuggable ou integração autorizada.
- Ausência de uma métrica não significa valor zero.
- Correlação temporal não prova causalidade.
- Resolução de DNS e conexões depende das informações expostas pelo Android.
- Builds Beta sem assinatura comercial podem acionar o SmartScreen.
- Autenticação e traduções publicadas dependem de conectividade com serviços externos.
