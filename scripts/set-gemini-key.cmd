@echo off
:: One-time helper to set your Gemini API key on Windows
:: NOTE: Replace YOUR_GEMINI_API_KEY below, then run this file once.
:: After running, CLOSE and REOPEN your terminal to use the new environment variable.

set KEY=YOUR_GEMINI_API_KEY

if "%KEY%"=="YOUR_GEMINI_API_KEY" (
  echo [!] Please edit scripts\set-gemini-key.cmd and replace YOUR_GEMINI_API_KEY with your real key.
  echo     This file will NOT send anything to the network; it just calls setx locally.
  goto :EOF
)

echo Setting GOOGLE_API_KEY...
setx GOOGLE_API_KEY "%KEY%"

if %ERRORLEVEL% NEQ 0 (
  echo [x] Failed to set GOOGLE_API_KEY.
  goto :EOF
)

echo [OK] GOOGLE_API_KEY has been set.
echo Close and reopen your terminal for the change to take effect.
