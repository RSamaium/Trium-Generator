#!/usr/bin/env node

/*
    inquirer = require("inquirer"),
    colors = require('colors'),
    fs = require('fs'),
    _ = require("lodash"),
   
    beautify = require('js-beautify').js_beautify;

var mkdir = require("./promises/mkdir"),
    rmdir = require("./promises/rmdir"),
    writeFile = require("./promises/writeFile"),
    exists = require("./promises/exists"),
    template = require("./promises/template");

var config = require("./config"),
    parse = require("./parse"),
    Shortcut = require("./shortcut"),
    Block = require("./block"),
    path = config.paths;
*/
var program = require('commander');

var createApp = require("./commands/create-app.js"),
    createBundle = require("./commands/create-bundle.js"),
    generateBundle = require("./commands/generate-bundle.js"),
    parseBundle = require("./commands/parse-bundle.js"),
    uninstallBundle = require("./commands/uninstall-bundle.js"),
    updateBundle = require("./commands/update-bundle.js");


program
  .version('0.1.1');

program
  .command('install')
  .description('create a project')
  .action(createApp);

program
  .command('create <name>')
  .description('create a empty bundle')
  .action(createBundle);

program
  .command('uninstall <bundle>')
  .option('-s, --server', 'only server')
  .option('-c, --client', 'only client')
  .description('Remove a bundle')
  .action(uninstallBundle);

program
  .command('parse <bundle>')
  .description('Parse a bundle and display properties')
  .action(parseBundle);


program
  .command('update <bundle>')
  .description('update a bundle')
  .action(updateBundle);

program
  .command('generate <bundle>')
  .option('-s, --server', 'only server')
  .option('-c, --client', 'only client')
  .description('generate CRUD')
  .action(generateBundle);

program
  .command('*')
  .action(function(env){
    console.log('Enter a Valid command');
});

program.parse(process.argv);


