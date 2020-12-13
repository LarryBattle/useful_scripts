// Create cmd shortucts for windows
// How to use: Use this node script to generate the batch commands to a directory.
// Link your path to the directory to make them accessiable in cmd
// date created: Dec 12, 2020

const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = "out";

function echoOff(cmdContent){
    return `@echo off
${cmdContent}`;
}

function cleanOutputDir(dirPath){
    if(fs.existsSync(dirPath)){
        fs.rmdirSync(dirPath, {recursive: true});
    }
    fs.mkdirSync(dirPath);
}

function createFile(dirPath, fileName, data){
    if(!fileName || !data){
        throw new Error(`A filename is required.`);
    }
    const filePath = path.normalize(`${dirPath}\\${fileName}.cmd`);
    console.debug({
        filePath,
        data
    });
    fs.writeFileSync(filePath, data);
}

function createCommands(dirPath){
    for(let [shortcutName, command] of Object.entries(standardCommands)){
        createFile(dirPath, shortcutName, command);
    }
}

const standardCommands = {
    // git commands
    _ga : echoOff(`git add . -A`),
    _gb : echoOff(`git branch -a -vv`),
    _gclp : echoOff(`git checkout develop && git pull`),
    _gcmp : echoOff(`git checkout master && git pull`),
    _gd : echoOff(`git diff`),
    _gdh : echoOff(`git diff HEAD~1`),
    _gds : echoOff(`git diff --staged`),
    _gl : echoOff(`git log -3`),
    _gpl : echoOff(`git pull`),
    _gs : echoOff(`git status`),

    // local paths
    _x : echoOff(`cd %LB_HOME_DIR%`),
    _x_root : echoOff(`cd %USERPROFILE`),
    _x_scripts : echoOff(`cd %LB_SCRIPTS_DIR%`),
    
    // local commands
    _c : echoOff(`cls`),
    _cd : echoOff(`cls && dir`),
    _e : echoOff(`exit`)
};


(function init(){
    cleanOutputDir(OUTPUT_DIR);
    createCommands(OUTPUT_DIR);
})();
