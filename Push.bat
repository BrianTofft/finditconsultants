@echo off
git rm -r --cached node_modules
git rm -r --cached .next
git add .
git commit -m "%~1"
git rm -r --cached node_modules
git rm -r --cached .next
git commit --amend --no-edit
git push origin main --force