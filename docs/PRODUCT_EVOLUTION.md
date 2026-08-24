# Evolução do produto

## Da investigação manual ao workspace unificado

O AnalyticsMB nasceu da necessidade de investigar comportamento Android sem alternar continuamente entre comandos, planilhas, logs e ferramentas isoladas. A primeira etapa reuniu ADB, memória, renderização e informações do dispositivo em uma interface coerente.

## Métricas com contexto

O foco passou de “mostrar percentuais” para preservar significado técnico: deltas na mesma janela, ausência diferente de zero, mudança de PID invalidando baseline e correlação sem afirmação automática de causalidade.

## Histórico e comparação

Sessões locais permitiram comparar versões, packages e períodos. Políticas de retenção foram introduzidas para guardar sinais relevantes sem crescimento indefinido do banco.

## Testes reproduzíveis

A integração Maestro transformou flows em cenários reutilizáveis. Durante cada teste, o AnalyticsMB captura apenas a telemetria contextual necessária e produz um dossiê com métricas, falhas e evidências.

## Produto distribuível e sustentável

O runtime Windows tornou-se autocontido, com validação de dependências, instalador, desinstalador e verificação SHA-256. Em paralelo, menus, widgets, comandos, temas e métricas migraram para contracts e registries, reduzindo o custo de evolução.

## Linha de raciocínio

```text
Problema real
  → evidência observável
  → métrica válida
  → sessão histórica
  → reprodução automatizada
  → relatório técnico
  → decisão de engenharia
```
