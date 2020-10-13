@echo off
REM Create a git commit using with the branch JIRA id prefixed to the commit message
REM Prevents copy and pasting
REM git branch format `feature/jiraID_descriptive_name`
REM example usuage: _git_commit "MESSAGE"
REM Example output: git commit -m "jiraID MESSAGE"
REM date created: Oct 12, 2020


for /f "tokens=*" %%a in (
    'git branch --show-current'
) do (
    set BRANCH_NAME=%%a
)

for /f "tokens=1 delims=_" %%a in (
    'git branch --show-current'
) do (
    set BRANCH_ID=%%a
)
for /f "tokens=1 delims=feature/" %%a in (
    "%BRANCH_ID%"
) do (
    set BRANCH_ID=%%a
)

set MESSAGE=%~1%

set gitCommand=git commit -m "%BRANCH_ID% %MESSAGE%"
echo %gitCommand%

REM Pause doesn't work right. Have a if then goto :EOF
pause
%gitCommand%
