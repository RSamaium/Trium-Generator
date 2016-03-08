"use strict";

const REPO = "https://github.com/RSamaium/Trium.git";

var git = require("gift"),
    install = require("gulp-install"),
    gulp    = require("gulp"),
    colors = require('colors'),
    mkdir = require("../promises/mkdir");



module.exports = function() {

    
    console.log("-- Download Trium Package : " + REPO + " --");
    git.clone(REPO, "./", function(err, repo) {
         if (err) {
             console.log(("[error]" + err).red);
             return;
         }
         console.log("[Success] Package downloaded".green);
         console.log("-- Install modules (bower & NPM) -- ".gray);
         gulp.src(['./client/bower.json', './package.json']).pipe(install());
         mkdir("./client/app/bundles");
         mkdir("./server/bundles");
    });
    
}