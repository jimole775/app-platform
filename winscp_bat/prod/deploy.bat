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
rem ������Ŀ�ϼ�Ŀ¼
cd /d %program_dist%

rem ������ʱĿ¼
mkdir _tmp

rem ���Ȱ���Ҫ�޸ĵ��ļ����б���
for /l %%i in (1,1,%ignor_count%) do (
copy .\%program_name%\!ignor[%%i]! .\_tmp\
)

rem ɾ����Ŀ��Դ
rd /s /q %program_name%

rem Ȼ��ʹ��git clone��ȡ�´���
git clone %src_git%

rem �ѱ��ݵ��ļ����ǵ���Ŀ
for /l %%j in (1,1,%ignor_count%) do (
copy .\_tmp\!ignor[%%j]! .\%program_name%\
)

rem ������ĿĿ¼
cd %program_name%

rem ��װ���� && build
call yarn.cmd install 2> %err_log%
call npm.cmd run build 2> %err_log%

rem ����templateĿ¼
mkdir .\dist\template

rem �ѱ���template�µ��ļ�copy����Դ��dist����
copy %cur_dist%template\. .\dist\template\

rem ����winscp�ű�
winscp /script=%scp_script%

echo `deployed completion at %time%` >> %suc_log%
@echo end
