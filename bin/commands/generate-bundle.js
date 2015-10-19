 "use strict";

var program = require('commander'),
    inquirer = require("inquirer"),
    colors = require('colors'),
    fs = require('fs'),
    _ = require("lodash"),
    beautify = require('js-beautify').js_beautify,
    mkdir = require("../promises/mkdir"),
    writeFile = require("../promises/writeFile"),
    template = require("../promises/template"),
    exists = require("../promises/exists"),
    config = require("../config"),
    update = require("./update-bundle"),
    parse = require("../core/parse"),
    fspath = require("path"),
    path = config.paths;

module.exports = function(name, options) {

    if (options.client === undefined && options.server === undefined) {
        options.client = true;
        options.server = true;
    } 

    var bundleClient = path.bundles + name,
        bundleServer = path.server + name;

    var lowerName = name.toLowerCase();

    var directories = {
        // filename : destination
        "controller.js":  "controllers/" + name + ".js",
        "model.js": "models/" + name + ".js",
        "route.js": "routes/" + name + ".js",
        "list.html": "views/" + lowerName + "s.html"
    };

    var tplData = {
        obj: "{}"
    };

    function copy(promise, dname, dest, tplData, options) {
        return promise.then(function() {

            //tplData.obj = schema;

            return template(options.pathSrc + dname, tplData);

        }).then(function(source) {

            if (!/\.html$/.test(dest)) {
                source =  beautify(source, { indent_size: 2 });
            }

            return writeFile(options.pathDest + "/" + dest, source);
        });
    }

    inquirer.prompt([
        {
            type: "input",
            name: "api_path",
            message: "Path of API",
            default: "/api/" + lowerName
        },
        {
            type: "input",
            name: "client_path",
            message: "Route of backoffice CRUD",
            default: "/" + lowerName + "s"
        },
        {
            type: "input",
            name: "title",
            message: "Title",
            default: name
        }
    ], function(result) {

        tplData = {
            entity: name,
            variable: lowerName,
            api_path: result.api_path + "s",
            client_path: result.client_path,
            filter: {isUpload: true}
        }

        var p = exists(config.getBinPath("templates", "view.html"), true).then(function() {

            var tpl = bundleClient + "/views/" +  lowerName + ".html";
            return parse(tpl, lowerName);

        }).then(function(schema) {

            tplData.obj = schema.build().toObject();

        });

        if (options.client) {

            for (var key in directories) {
                p = copy(p, key, directories[key], tplData, {
                    pathSrc: fspath.join(__dirname, "../" + path.templates),
                    pathDest : bundleClient
                });
            }

        }

        if (options.server) {

                p = p
                    .then(function() {
                        return mkdir(bundleServer);
                    })
                    .then(function() {
                        return mkdir(bundleServer + "/middlewares");
                    })
                    .then(function() {
                        return mkdir(bundleServer + "/model");
                    })
                    .then(function() {
                        return mkdir(bundleServer + "/routes");
                    })
                    .then(function() {
                        return mkdir(bundleServer + "/schema");
                    });

                directories = {
                    // filename : destination
                    "model.js"      : "model/" + name + ".js",
                    "router.js"     : "routes/index.js",
                    "schema.js"     : "schema/index.js",
                    "schemaObj.js"  : "schema/schema.js"
                };

                for (var key in directories) {
                    p = copy(p, key, directories[key], tplData, {
                        pathSrc: fspath.join(__dirname, "../" + path.templateServer),
                        pathDest : bundleServer
                    });
                }
        }

        p = p.then(function() {

            return update(name);
        });

        p.catch(function(err) {
            console.log(err.stack.red);
        });



    });
    
}