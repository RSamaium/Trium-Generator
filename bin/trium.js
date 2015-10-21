#!/usr/bin/env node

var program = require('commander'),
    
    createApp = require("./commands/create-app.js"),
    createBundle = require("./commands/create-bundle.js"),
    generateBundle = require("./commands/generate-bundle.js"),
    parseBundle = require("./commands/parse-bundle.js"),
    uninstallBundle = require("./commands/uninstall-bundle.js"),
    updateBundle = require("./commands/update-bundle.js"),
    installBundle = require("./commands/install-bundle.js");


program
  .version('0.1.1');

program
  .command('create-app')
  .description('create a project')
  .action(createApp);

program
  .command('install <bundle>')
  .description('install an existing bundle')
  .action(installBundle);

program
  .command('create <bundle>')
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


