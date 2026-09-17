@echo off
title Servidor Local - Grupo Imperio Web
echo ======================================================
echo   Iniciando Servidor Web Local para Grupo Imperio...
echo ======================================================
start http://localhost:3000
node preview-server.js
pause
