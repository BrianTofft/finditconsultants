@echo off
git rm -r --cached node_modules 2>nul
git rm -r --cached .next 2>nul
git add .
git commit -m "%~1"
git rm -r --cached node_modules 2>nul
git commit --amend --no-edit
git push origin main --force