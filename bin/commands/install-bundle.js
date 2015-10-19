"use strict";

var _package = {
    
    "User": "https://github.com/RSamaium/Trium-Bundle-User"
    
};

var git = require("gift"),
    colors = require('colors'),
    exists = require("../promises/exists"),
    rename = require("../promises/rename"),
    mkdir = require("../promises/mkdir"),
    rmdir = require("../promises/rmdir");

module.exports = function(bundle) {
    
    var repo = _package[bundle];
    
    if (!repo) {
        console.log(bundle + " Bundle not found");
        return;
    }
    
    console.log("-- Download Trium Bundle Package : " + repo + " --");
    
    exists(".tmp").then(function(ret) {
        
        if (!ret) {
            return mkdir(".tmp", true);
        }
        
    }).then(function() {
        
        return new Promise(function(resolv, reject) {
            git.clone(repo, ".tmp", function(err, repo) {
                 if (err) {
                     reject("[error]" + err);
                     return;
                 }
                resolv();
            });
        });
    
    }).then(function() {
        
       return rename(".tmp/client", "client/app/bundles/" + bundle);
        
    }).then(function() {
        
        return rename(".tmp/server", "server/bundles/" + bundle);
    
    }).then(function() {
        
        return rename(".tmp/trium.json", "server/bundles/" + bundle + "/trium.json");
        
    }).then(function() {
        
        return rmdir(".tmp");
        
    }).then(function() {
        console.log((bundle + " has been installed. Restart server to view the modifications").green);
    })
    .catch(function(err) {
        console.log(err);
    })

    
}