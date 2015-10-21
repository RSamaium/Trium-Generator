"use strict";

require('shelljs/global');

var colors = require('colors');
var fs  = require("fs");
var inquirer = require("inquirer");
var beautify = require('js-beautify').js_beautify;
var program = require('commander');
var exists = require("../promises/exists");
var block  = require("./block");
var config  = require("../config"),
    _       = require("lodash"),
    path   = config.paths;

module.exports = {
    
    _install: function(type, name) {
        return new Promise(function(resolv, reject) {
            var isExec = exec(type + ' install ' + name).code !== 0;
            if (isExec) {
                console.log(('Error: ' + type + ' install ' + name + ' failed').red);
                reject();
            }
            else {
                console.log((type + ' install ' + name + ' successful').green);
                resolv();
            }
        });
        
    },
    
    npmInstall: function(name) {
        return this._install("npm", name);
    },
    
    bowerInstall: function(name, done) {
        return this._install("bower", name);
    },
    
    bundleExist: function(name, callback) {
        fs.exists("server/bundles/" + name + "/bin", callback);
    },
    
    block: block,
    inquirer: inquirer,
    beautify: beautify,
    program: program,
    exec: exec
    
};