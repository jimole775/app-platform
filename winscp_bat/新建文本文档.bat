SET SRC_DIR=E:\project\remoteController
SET IGNOR_1=readme.md
cd /d %SRC_DIR% && rmdir /s /q .\node_modules 
mkdir tmp && copy %SRC_DIR%\%IGNOR_1% %SRC_DIR%\tmp\
git pull -f
copy %SRC_DIR%\tmp\%IGNOR_1% %SRC_DIR%\%IGNOR_1%
yarn install && npm run build

PAUSE