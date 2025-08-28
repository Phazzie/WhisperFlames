@echo off
REM Simple smoke test: backend health + generate, frontend root head request
setlocal
set ERR=0

REM Backend health
for /f "usebackq tokens=*" %%i in (`curl -s -o NUL -w "%%{http_code}" http://localhost:3333/health`) do set H=%%i
echo backend /health => %H%
if NOT "%H%"=="200" set ERR=1

REM Backend /generate minimal
echo {"topic":"smoke","mood":"ok","verses":{"v1":{"content":"hi"}},"chorus":{"content":"hook"}} > tmp\smoke.json
for /f "usebackq tokens=*" %%i in (`curl -s -o NUL -w "%%{http_code}" -H "Content-Type: application/json" -d @tmp\smoke.json http://localhost:3333/generate`) do set G=%%i
echo backend /generate => %G%
if NOT "%G%"=="200" if NOT "%G%"=="422" if NOT "%G%"=="502" set ERR=1

REM Frontend root
for /f "usebackq tokens=*" %%i in (`curl -s -o NUL -w "%%{http_code}" http://localhost:5173/`) do set F=%%i
echo frontend / => %F%
if NOT "%F%"=="200" set ERR=1

if %ERR%==0 (
  echo Smoke: PASS
  exit /b 0
) else (
  echo Smoke: FAIL
  exit /b 1
)
