# Analytics MB

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Platform](https://img.shields.io/badge/platform-Android-green)
![Runtime](https://img.shields.io/badge/runtime-Node.js-brightgreen)
![ADB](https://img.shields.io/badge/ADB-Debug%20Bridge-orange)
![Status](https://img.shields.io/badge/status-development-yellow)

## Visão geral

O **Analytics Agent** é uma plataforma de análise de performance para aplicações mobile Android.

A proposta do projeto é funcionar como um **profiler independente do aplicativo analisado**, coletando métricas diretamente do dispositivo através do `ADB`, sem necessidade de instalar SDKs, bibliotecas ou modificar o código-fonte do app monitorado.

O agente combina duas fontes principais de dados:

1. **Métricas do sistema Android**

   Coletadas através de comandos nativos como:

  * `dumpsys meminfo`
  * `dumpsys gfxinfo`
  * `dumpsys cpuinfo`
  * `dumpsys battery`
  * `ss`
  * `top`

   Essas métricas permitem analisar:

  * consumo de memória;
  * uso de CPU;
  * estabilidade da renderização;
  * quantidade de frames perdidos;
  * temperatura;
  * conexões TCP abertas;
  * estado do processo.

2. **Instrumentação opcional dentro do aplicativo**

   Quando disponível, o próprio aplicativo pode enviar informações adicionais através de interceptores HTTP, permitindo capturar:

  * URL chamada;
  * método HTTP;
  * tempo de resposta;
  * status HTTP;
  * payload enviado;
  * payload recebido.

---

# Conceito do Dashboard

O objetivo do dashboard é transformar dados técnicos de baixo nível em uma visão rápida da saúde da aplicação.

A ideia é permitir que um desenvolvedor execute um cenário dentro do aplicativo e acompanhe em tempo real como o sistema responde.

Exemplo de fluxo:

```
Usuário abre o aplicativo
          |
          |
          v
Analytics Agent inicia coleta
          |
          |
          +----------------+
          |                |
          v                v
    Android Metrics    Network Logs
          |                |
          |                |
          +-------+--------+
                  |
                  v
            Dashboard
```

---

## Visão principal

O dashboard deve responder rapidamente:

### "O aplicativo está saudável?"

Para isso, os principais indicadores são:

| Indicador       | Objetivo                  |
| --------------- | ------------------------- |
| Quality Score   | Nota geral da aplicação   |
| FPS / Jank      | Qualidade da renderização |
| Memory Usage    | Consumo de RAM            |
| CPU Usage       | Carga do processador      |
| Network Latency | Velocidade das APIs       |
| Error Rate      | Falhas HTTP               |
| Battery Impact  | Consumo energético        |

---

# Principais gráficos

## Performance de interface

Mostra a experiência visual do usuário.

Métricas:

* Frames renderizados;
* Janky Frames;
* P50/P90/P95/P99;
* Frames acima de 16.67ms.

Exemplo:

```
Frame Time

5ms   █████████████
10ms  █████████
20ms  ████
50ms  █
```

---

## Memória

Mostra evolução do consumo de RAM.

Indicadores:

* Java Heap;
* Native Heap;
* Graphics;
* Total PSS.

Exemplo:

```
RAM Usage

200MB ┤        █
150MB ┤    █ █ █
100MB ┤ █ █
 50MB ┤
```

Um crescimento contínuo sem liberação indica possível vazamento de memória.

---

## Rede

A camada de rede possui duas visões:

### HTTP

Obtida pelo interceptor:

* endpoint;
* latência;
* status;
* payload.

### TCP

Obtida pelo Android:

* IP remoto;
* porta;
* estado da conexão;
* hostname.

Isso permite detectar:

* APIs lentas;
* excesso de chamadas;
* conexões presas;
* SDKs de terceiros consumindo rede.

---

# Arquitetura

```
                 Dashboard
                     |
                     |
                REST API
                     |
          +----------+----------+
          |                     |
          v                     v
    AnalyticsService       NetworkService
          |
          |
      AdbService
          |
          |
       Makefile
          |
          |
      adb shell
          |
          |
       Android Device
```

---

# Características

## Não invasivo

O aplicativo analisado não precisa possuir:

* SDK específico;
* dependência adicional;
* código de instrumentação.

A coleta ocorre externamente através do Android Debug Bridge.

---

## Extensível

Novos coletores podem ser adicionados facilmente:

```
collectors/

├── MemoryCollector
├── GraphicsCollector
├── CpuCollector
├── BatteryCollector
├── NetworkCollector
└── ThermalCollector
```

Cada coletor possui:

* comando ADB;
* parser;
* modelo JSON;
* endpoint.

---

# Versão

## Current Version: 1.0.0

Primeira versão funcional contendo:

* coleta via ADB;
* parsers de métricas Android;
* análise de memória;
* análise gráfica;
* análise de CPU;
* monitoramento de rede;
* cálculo de qualidade da aplicação;
* API REST (offline/online) para integração com dashboards.

---


