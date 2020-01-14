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
rem 进入项目上级目录
cd /d %program_dist%

rem 创建临时目录
mkdir _tmp

rem 首先把需要修改的文件进行备份
for /l %%i in (1,1,%ignor_count%) do (
copy .\%program_name%\!ignor[%%i]! .\_tmp\
)

rem 删除项目资源
rd /s /q %program_name%

rem 然后使用git clone拉取新代码
git clone %src_git%

rem 把备份的文件覆盖到项目
for /l %%j in (1,1,%ignor_count%) do (
copy .\_tmp\!ignor[%%j]! .\%program_name%\
)

rem 进入项目目录
cd %program_name%

rem 安装依赖 && build
call yarn.cmd install 2> %err_log%
call npm.cmd run build 2> %err_log%

rem 创建template目录
mkdir .\dist\template

rem 把本地template下的文件copy到资源的dist下面
copy %cur_dist%template\. .\dist\template\

rem 运行winscp脚本
winscp /script=%scp_script%

echo `deployed completion at %time%` >> %suc_log%
@echo end
