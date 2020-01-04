@echo on && setlocal enabledelayedexpansion
set cur_dist=%~dp0
set src_git=git@github.com:jimole775/app-platform.git
set program_dist=E:\project\test
set program_name=app-platform
set err_log=%cur_dist%error.log
set suc_log=%cur_dist%deployed.log
set scp_script=%cur_dist%script.txt
set ignor[1]=.gitignore
set ignor[2]=README.md
set ignor[3]=package.json
set ignor_count=3

cls
rem 首先把需要修改的文件进行备份
mkdir %program_dist%\_tmp
for /l %%i in (1,1,%ignor_count%) do (
copy %program_dist%\%program_name%\!ignor[%%i]! %program_dist%\_tmp\
)

rem 删除项目资源
rd /s /q %program_dist%\%program_name%\

rem 然后使用git clone拉取新代码
git clone %src_git%

rem 把备份的文件覆盖到项目
for /l %%j in (1,1,%ignor_count%) do (
copy %program_dist%\_tmp\!ignor[%%j]! %cur_dist%\%program_name%\
)

rem 安装依赖 && build
cd %program_name%
yarn install >> %err_log% 2>&1
pause
yarn run build >> %err_log% 2>&1
pause

rem 把template安装到dist
rem mkdir .\dist\template
rem copy %cur_dist%template\. .\dist\template\
winscp /script=%scp_script%
echo `deploys completion at %time%` >> %suc_log%
@echo end
