@echo off
set /p a=请输入要压缩的文件夹名称
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

echo 开始收集需要处理的资源，请稍候...
node "./resCompress/getRes.js" %a%

echo 开始压缩PNG，请稍候...
for /R ./resCompress/pngTemp/ %%i in (*.png) do (
	.\resCompress\pngquant -f --ext .png --speed 3 --quality 50-80 --skip-if-larger "%%i"
)

echo 开始压缩JPG，请稍候...
.\resCompress\JPG-C_v4.0.21.902 -m 1 -q 5 -di .\resCompress\jpgTemp

echo 开始压缩MP3, ABR模式...
for /R ./resCompress/mp3Temp/ %%i in (*.mp3) do (
	.\resCompress\lame -h --abr 24 --mp3input "%%i"
)

echo 资源压缩完成，开始写入本地缓存...
node "./resCompress/addResCache.js"
echo 本地缓存完成，执行压缩替换...
node "./resCompress/copyRes.js"
echo 替换完成，清理临时资源...
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
echo 资源压缩完成，耗时：%batdiffH_%时%batdiffM_%分%batdiffS_%秒 ,开始打包zip，请稍候...
node "./resCompress/zip.js" %a%
pause