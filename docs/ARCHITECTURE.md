# Arquitetura

## Visão geral

O AnalyticsMB adota uma arquitetura desktop local orientada a observabilidade e diagnóstico de aplicações Android.

A aplicação analisada permanece independente do AnalyticsMB. A coleta é realizada externamente, utilizando interfaces e ferramentas disponibilizadas pelo ecossistema Android, sem exigir a inclusão de um SDK proprietário no aplicativo monitorado.

A arquitetura foi organizada para manter separadas quatro responsabilidades principais:

- apresentação e interação com o usuário;
- coordenação dos casos de uso;
- aquisição e normalização de dados;
- persistência e análise histórica.

Essa separação permite evoluir cada parte do sistema com baixo impacto sobre as demais.

---

## Fronteiras do sistema

Em alto nível, o produto pode ser representado da seguinte forma:

```text
┌──────────────────────────────────────────┐
│              Interface Desktop           │
│          React + TypeScript UI           │
└───────────────────┬──────────────────────┘
                    │
                    │ contratos locais
                    ▼
┌──────────────────────────────────────────┐
│          Camada de Aplicação             │
│   coordenação de casos de uso e estado   │
└───────────────┬───────────────┬──────────┘
                │               │
                ▼               ▼
      ┌────────────────┐  ┌────────────────┐
      │ Telemetria     │  │ Persistência   │
      │ Android        │  │ local          │
      └───────┬────────┘  └────────────────┘
              │
              ▼
      ┌────────────────┐
      │ Dispositivo    │
      │ Android        │
      └────────────────┘