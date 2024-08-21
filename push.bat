@echo off
ipconfig /flushdns
mkdocs get-deps>requirements.txt
mkdocs gh-deploy -v
pause