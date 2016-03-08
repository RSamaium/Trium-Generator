"use strict";

var mkdir = require("../promises/mkdir"),
    writeFile = require("../promises/writeFile"),
    template = require("../promises/template"),
    config = require("../config"),
    path = config.paths;

var pluralize = require('pluralize');

module.exports = function(name) {

    var bundle = path.bundles + name;
    var tpl = bundle + "/views/show.html";

    mkdir(bundle).then(function() {

        return mkdir(bundle + "/controllers");

    }).then(function() {

        return mkdir(bundle + "/models");

    }).then(function() {

        return mkdir(bundle + "/routes");

    }).then(function() {

        return mkdir(bundle + "/views");

    }).then(function() {

        return template(config.getBinPath("templates", "view.html"), {
            entity:           name,
            entityLowerCase:  name.toLowerCase(),
            entityPluralize:  pluralize(name)
        });

    }).then(function(source) {

        return writeFile(tpl, source, true);

    }).then(function() {


        console.log(("Wow, you create a bundle! Change the template in `" + tpl + "` and generating entity with : ").yellow);
        console.log(("`trium generate " + name + "`").blue);

    }).catch(function(err) {
        console.log(err.stack);
    });

}
