@echo off
::svn ��װĿ¼
set svn_bin=D:\Program Files\TortoiseSVN\bin
::�ļ�����Ŀ¼
set client_dir=%cd%
TortoiseProc.exe /command:update /path:%client_dir% /closeonend:2
::ִ������
cmd /k "cd /d %client_dir%&&egret build"
