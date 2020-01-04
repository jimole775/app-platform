@echo off
setlocal enabledelayedexpansion
set array[0]=1
set array[1]=2
set array[2]=3
rem echo %array%
for /l %%i in (0,1,2) do (
echo print i: %%i
echo print array: !array[%%i]!
)
pause