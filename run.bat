@echo off
title Placement Prediction Application Runner

echo =======================================================
echo    Starting Placement Prediction System...
echo =======================================================

:: 1. Navigate to Project Directory
cd /d "%~dp0"

:: 2. Configure Java Environment (Portable JDK 21)
echo [1/3] Configuring Java 21 environment...
if exist "%~dp0jdk\jdk-21.0.12+8\bin\java.exe" (
    set "JAVA_HOME=%~dp0jdk\jdk-21.0.12+8"
)
if not "%JAVA_HOME%"=="" (
    set "PATH=%JAVA_HOME%\bin;%PATH%"
)

:: 3. Locate Maven Executable
echo [2/3] Locating Maven build tool...
set "MVN_CMD="

if exist "C:\Users\Roshi\Maven\apache-maven-3.9.9\bin\mvn.cmd" (
    set "MVN_CMD=C:\Users\Roshi\Maven\apache-maven-3.9.9\bin\mvn.cmd"
)
if "%MVN_CMD%"=="" if exist "%USERPROFILE%\Maven\apache-maven-3.9.9\bin\mvn.cmd" (
    set "MVN_CMD=%USERPROFILE%\Maven\apache-maven-3.9.9\bin\mvn.cmd"
)
if "%MVN_CMD%"=="" (
    where mvn.cmd >nul 2>&1 && for /f "delims=" %%I in ('where mvn.cmd') do set "MVN_CMD=%%I"
)
if "%MVN_CMD%"=="" (
    where mvn >nul 2>&1 && for /f "delims=" %%I in ('where mvn') do set "MVN_CMD=%%I"
)

if "%MVN_CMD%"=="" (
    echo.
    echo [ERROR] Maven was not found on your system!
    echo Checked locations:
    echo   - C:\Users\Roshi\Maven\apache-maven-3.9.9\bin\mvn.cmd
    echo   - System PATH
    echo Please install or configure Maven.
    echo.
    pause
    exit /b 1
)

echo       Maven found: %MVN_CMD%

:: 4. Ensure MySQL Database is Running
echo [3/3] Checking MySQL database status...
tasklist /fi "imagename eq mysqld.exe" 2>nul | findstr /i "mysqld.exe" >nul
if errorlevel 1 (
    echo       MySQL is not running. Starting MySQL server...
    if exist "C:\xampp\mysql\bin\mysqld.exe" (
        start "" /B "C:\xampp\mysql\bin\mysqld.exe" --defaults-file="C:\xampp\mysql\bin\my.ini" --standalone
        timeout /t 3 /nobreak >nul
        echo       MySQL started.
    ) else (
        echo       [WARNING] C:\xampp\mysql\bin\mysqld.exe not found.
        echo       Please ensure your MySQL server is running.
    )
) else (
    echo       MySQL is already running.
)

:: 5. Open browser automatically once Spring Boot is ready
start "" /B powershell -NoProfile -Command "for ($i=0; $i -lt 45; $i++) { Start-Sleep -Seconds 2; try { $r = Invoke-WebRequest -Uri 'http://localhost:8080' -UseBasicParsing -TimeoutSec 2; if ($r.StatusCode -eq 200 -or $r.StatusCode -eq 302) { Start-Process 'http://localhost:8080'; break; } } catch {} }"

:: 6. Launch the Application
echo =======================================================
echo    Launching Spring Boot Application...
echo    Access URL: http://localhost:8080
echo =======================================================
call "%MVN_CMD%" spring-boot:run

if errorlevel 1 (
    echo.
    echo [ERROR] The application stopped unexpectedly with an error.
    pause
)
