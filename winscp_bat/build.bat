@ECHO ON
SET winscpscript=aa.txt
SET srcdir=E:\test\vuedemo\
cd /d %srcdir% && rmdir /s /q .\node_modules
git stash save "temp" && git pull && yarn && git stash pop && npm run build
winscp /script=%winscpscript%
