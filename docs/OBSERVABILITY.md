# Observabilidade Android

## CPU

A CPU global utiliza deltas dos contadores acumulativos de `/proc/stat`. A CPU da aplicação utiliza os ticks do processo em `/proc/<pid>/stat` no mesmo intervalo global. Uma mudança de PID cria uma nova linha de base; um processo ausente representa dado indisponível, não 0%.

```text
CPU do dispositivo = (delta total - delta ocioso) / delta total
CPU da aplicação   = delta do processo / delta total
```

## Memória

PSS estima a atribuição proporcional de memória física. RSS descreve páginas residentes, enquanto os heaps Java e nativo representam domínios diferentes de alocação. O limite de heap do runtime Android fornece contexto, mas não equivale à memória total do processo.

## Renderização

O FPS é contextualizado com frame time e jank. Percentis como P50, P90, P95 e P99 são mais representativos do que um máximo isolado. Um pico transitório e uma degradação sustentada são tratados de formas diferentes.

## Energia

Quando tensão e corrente estão disponíveis, a potência instantânea do dispositivo é derivada por `potência = tensão × corrente`. W/mW expressam intensidade; mWh representa energia acumulada; mAh representa carga; e o percentual da bateria indica um estado aproximado. A potência do dispositivo não deve ser atribuída exclusivamente a uma aplicação.

## Rede

O tráfego é representado por deltas associados a timestamps. Informações de destino são evidências contextuais e podem estar incompletas devido a permissões do Android, criptografia e suporte da plataforma.

## Estabilidade e ciclo de vida

Crashes, ANRs, remoção de tarefa, morte e recriação de processo são eventos distintos. A continuidade do PID é observada para impedir que um processo reiniciado produza deltas artificiais de telemetria.

## Amostragem e validade

Cada sinal possui uma frequência útil diferente. Observações brutas podem ser atualizadas mais rapidamente que a persistência durável. Amostras inválidas são excluídas de médias, picos e percentis em vez de serem silenciosamente convertidas.

