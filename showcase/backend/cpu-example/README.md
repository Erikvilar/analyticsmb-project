# Exemplo sanitizado de CPU

Este exemplo demonstra parsing defensivo e cálculos determinísticos baseados em deltas. Ele exclui intencionalmente comandos ADB, orquestração da coleta, compatibilidade por fabricante, diagnósticos, persistência e endpoints HTTP.

A CPU da aplicação é normalizada usando o intervalo agregado do dispositivo e não é dividida novamente pela quantidade de CPUs lógicas. Processos ausentes e mudanças de PID produzem `null`.

