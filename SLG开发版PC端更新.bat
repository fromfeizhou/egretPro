@echo off
::svn 安装目录
set svn_bin=D:\Program Files\TortoiseSVN\bin
::文件更新目录
set client_dir=%cd%
TortoiseProc.exe /command:update /path:%client_dir% /closeonend:2
::执行命令
cmd /k "cd /d %client_dir%&&egret build"
