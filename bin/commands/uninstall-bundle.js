 "use strict";

var config = require("../config"),
    rmdir = require("../promises/rmdir"),
    path = config.paths;

module.exports = function(bundle, options) {

     if (options.client === undefined && options.server === undefined) {
        options.client = true;
        options.server = true;
    } 
    
    if (options.client) rmdir(path.bundles + bundle);
    if (options.server) rmdir(path.server + bundle);
    
}