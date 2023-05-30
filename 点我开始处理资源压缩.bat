@echo off
set /p a=������Ҫѹ�����ļ�������
set testtime=%time%
set  tmpIntText=%testtime:~0,2%
if "%tmpIntText:~0,1%" == "0" ( set  tmpIntText=%tmpIntText:~1,1%) 
set /a batStartH=%tmpIntText%
set  tmpIntText=%testtime:~6,2%
if "%tmpIntText:~0,1%" == "0" ( set  tmpIntText=%tmpIntText:~1,1%) 
set /a batStartS=%tmpIntText%
set  tmpIntText=%testtime:~3,2%
if "%tmpIntText:~0,1%" == "0" ( set  tmpIntText=%tmpIntText:~1,1%)
set /a batStartM=%tmpIntText%

echo ��ʼ�ռ���Ҫ�������Դ�����Ժ�...
node "./resCompress/getRes.js" %a%

echo ��ʼѹ��PNG�����Ժ�...
for /R ./resCompress/pngTemp/ %%i in (*.png) do (
	.\resCompress\pngquant -f --ext .png --speed 3 --quality 50-80 --skip-if-larger "%%i"
)

echo ��ʼѹ��JPG�����Ժ�...
.\resCompress\JPG-C_v4.0.21.902 -m 1 -q 5 -di .\resCompress\jpgTemp

echo ��ʼѹ��MP3, ABRģʽ...
for /R ./resCompress/mp3Temp/ %%i in (*.mp3) do (
	.\resCompress\lame -h --abr 24 --mp3input "%%i"
)

echo ��Դѹ����ɣ���ʼд�뱾�ػ���...
node "./resCompress/addResCache.js"
echo ���ػ�����ɣ�ִ��ѹ���滻...
node "./resCompress/copyRes.js"
echo �滻��ɣ�������ʱ��Դ...
node "./resCompress/clearRes.js"

set testtime=%time%
set  tmpIntText=%testtime:~0,2%
if "%tmpIntText:~0,1%" == "0" ( set  tmpIntText=%tmpIntText:~1,1%)
set /a batEndH=%tmpIntText%
set  tmpIntText=%testtime:~6,2%
if "%tmpIntText:~0,1%" == "0" ( set  tmpIntText=%tmpIntText:~1,1%)
set /a batEndS=%tmpIntText%
set  tmpIntText=%testtime:~3,2%
if "%tmpIntText:~0,1%" == "0" ( set  tmpIntText=%tmpIntText:~1,1%)
set /a batEndM=%tmpIntText%
set /a batdiffH_=%batEndH%-%batStartH%
set /a batdiffS_=%batEndS%-%batStartS%
set /a batdiffM_=%batEndM%-%batStartM%
if "%batdiffH_:~0,1%" == "-" ( set /a batdiffH_=24-%batStartH%+%batEndH%)
if "%batdiffM_:~0,1%" == "-" ( set /a batdiffM_=60-%batStartM%+%batEndM%
set /a batdiffH_=%batdiffH_%-1)
if "%batdiffS_:~0,1%" == "-" ( set /a batdiffS_=60-%batStartS%+%batEndS% 
	if batdiffM_==0 ( set /a batdiffH_=%batdiffH_%-1) 
	if batdiffM_ neq 0 (set /a batdiffM_=%batdiffM_%-1)
)
echo ��Դѹ����ɣ���ʱ��%batdiffH_%ʱ%batdiffM_%��%batdiffS_%�� ,��ʼ���zip�����Ժ�...
node "./resCompress/zip.js" %a%
pause