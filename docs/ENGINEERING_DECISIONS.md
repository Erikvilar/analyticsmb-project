# Decisões de engenharia

## Observação externa por ADB

O produto observa aplicações sem exigir um SDK incorporado. Isso permite analisar APKs existentes e separa as ferramentas de diagnóstico do código da aplicação. A concessão é a variabilidade entre dispositivos e versões do Android, tratada internamente por commands e parsers.

## Limite local do Express

Uma API local separa a apresentação React das ferramentas do sistema operacional e do Android. Componentes da interface não executam processos nem interpretam saídas do shell.

## SQLite para sessões históricas

O SQLite oferece persistência local transacional e portável para resumos de séries temporais e comparações. As frequências de coleta e persistência podem ser diferentes para evitar o armazenamento de ruído na mesma frequência de atualização da interface.

## Ausência não significa zero

Um processo ausente, um delta de contador inválido ou um sensor incompatível produz um dado indisponível. Convertê-lo em zero criaria uma evidência falsa e comprometeria médias e percentis.

## Correlação temporal não significa causalidade

Timestamps alinhados podem mostrar que CPU, FPS e memória mudaram juntos. O diagnóstico ainda exige contexto; o produto não afirma automaticamente que um sinal causou outro.

## Registries declarativos

Widgets, temas e itens de navegação são representados por metadados e implementações. Novas capacidades estendem um registry em vez de aumentar estruturas `switch` centrais.

## Separação entre parser e calculator

Parsers tratam textos incertos provenientes da plataforma. Calculators recebem snapshots tipados e contêm matemática determinística. Services coordenam coleta, ciclo de vida e persistência.

