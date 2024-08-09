@echo off
mkdocs get-deps>requirements.txt
mkdocs gh-deploy
pause