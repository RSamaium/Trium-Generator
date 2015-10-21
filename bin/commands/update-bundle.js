 "use strict";

var program = require('commander'),
    inquirer = require("inquirer"),
    colors = require('colors'),
    fs = require('fs'),
    process = require('process'),
    _ = require("lodash"),
    beautify = require('js-beautify').js_beautify,
    mkdir = require("../promises/mkdir"),
    writeFile = require("../promises/writeFile"),
    template = require("../promises/template"),
    exists = require("../promises/exists"),
    config = require("../config"),
    parse = require("../core/parse"),
    Block = require("../core/block"),
    fspath = require("path"),
    system = require("../core/system"),
    path = config.paths;

module.exports = function(bundleName, options) {

   var lowerName = bundleName.toLowerCase(),
        capiName = _.capitalize(bundleName);
    
     var bundleClient = path.bundles + capiName,
        bundleServer = path.server + capiName;
    
    
    return exists(config.getBinPath("templates", "view.html"), true).then(function() {
           
        var tpl = bundleClient + "/views/" +  lowerName + ".html";
        return parse(tpl, lowerName);

    }).then(function(schema) {

        schema.build();
        

        var obj = schema.toObject();
        var hasRef = schema.ref.length > 0;
        var data = {}, str = "";
        
        if (hasRef) data.parent =  schema.ref[0].toLowerCase();
        

        var b = Block(Block.BUNDLE_SERVER_SCHEMA, bundleName, "schema.js")
         
        var o;
        for (var name in obj) {
            o = obj[name];
            str = JSON.stringify(o);
            
            
            
            str = str.replace(/"(##[0-9]+##)"/g, function(undefined,id) { 
                
 
                return template(fspath.join(__dirname, "../blocks/schema-obj.js"), schema.refSchema[id], {
                    sync: true
                });
                
            }); 
            
            b.pipe({
                 content: '"' + name + '": ' + str + ',', 
                 blockId: name, 
                 areaId: "schema"
            });
            
            if (o.module) {
                console.log(o.module.schema);
            }
            
            /* if (o.module) {
                b.pipe({
                     content: o.module.schema, 
                     blockId: o.name, 
                     areaId: "schema",
                     data: o
                });
            }
            else {
                 b.pipe({
                     content: '"{{name}}" :  {{> schema}},', 
                     blockId: o.name, 
                     areaId: "schema",
                     data: o
                });
            }
            */
           
        }
         
        return b.end();
        
        if (schema.ref.length > 0) {
            var b = Block(Block.BUNDLE_SERVER_MODEL, bundleName, null)

            .pipe(schema.ref.length > 0, {
                     file:   "populate", 
                     areaId: "model",
                     data: {
                        variable: schema.ref[0].toLowerCase()   
                     }
            })
            .end();
        }
        
        /*Block(Block.BUNDLE_CLIENT_MODEL, bundleName, null)
         .pipe(schema.isUpload, {
                 file:   "upload-client", 
                 areaId: "options",
                 data: data
        })
        .end();*/
        
       
        if (hasRef) {
            data =  _.merge(data, { 
                        variable: lowerName,
                        entity: capiName
                    });
            Block(Block.BUNDLE_SERVER_ROUTES, schema.ref[0], "index.js")
             .pipe({
                     file:   "require-route", 
                     blockId: lowerName + "_route", 
                     areaId: "require",
                     data: data
            })
             .pipe({
                     file:   "route", 
                     blockId: lowerName + "_route", 
                     areaId: "routes",
                     data: data
            })
            .end();
            
             Block(Block.BUNDLE_SERVER_SCHEMA, schema.ref[0], "schema.js")
             .pipe({
                     content: '"{{name}}" :  {{> schema}},', 
                     blockId: lowerName, 
                     areaId: "schema",
                     data: {
                         name: data.variable,
                         type: "mongoose.Schema.Types.ObjectId",
                         ref: data.entity
                     }
            })
            .end();
            
            Block(Block.BUNDLE_SERVER_SCHEMA, bundleName, "index.js")
             .pipe({
                     file:   "schema", 
                     areaId: "schema",
                     data: data
            })
            .end();
        }
    

    }).then(function() {
        
        return new Promise(function(resolv, reject) {
            var updateFile = process.cwd() + "/server/bundles/" + bundleName + "/bin/update.js";
            
            fs.exists(updateFile, function (exists) {
            
                if (exists) {
                    console.log("Execute `update.js`".yellow);
                    require(updateFile)(bundleName, resolv, reject, system);
                }
                else {
                    resolv();
                }

            });

        });
        
    }).catch(function(err) {
        console.log(err.stack.red);
    });
    
}