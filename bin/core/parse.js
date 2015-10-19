var jsdom = require("jsdom");
var fs = require("fs");
var Schema = require("./schema");

module.exports = function(filename, entityName) {
    
    return new Promise(function(resolv, reject) {
        
        fs.readFile(filename, {encoding: "utf8"}, function(err, html) {
            if (err) reject(err);
            else resolv(html);
        });
        
    }).then(function(html) {
        
        return new Promise(function(resolv, reject) {
            jsdom.env(html, function (errors, window) {
                if (errors) reject(errors);
                else resolv(window); 
            });
        });
        
    }).then(function(window) {
        var path = __dirname + "/../modules";
        return new Promise(function(resolv, reject) {
            fs.readdir(path, function(err, dirs) {
                var stat, mod, modules = {};
                
                if (err) reject(err);
                
                for (var i=0 ; i < dirs.length ; i++) {
                     stat = fs.statSync(path + "/" + dirs[i]);         
                     if (stat.isDirectory()) {
                         mod = require(path + "/" + dirs[i] + "/install");
                         modules[dirs[i]] = new mod();
                         modules[dirs[i]].name = dirs[i];
                     }
                }
                
                resolv({
                    modules: modules,
                    window: window
                });
            });
            
        });
        
    }) .then(function(info) {
        
        var selector = ["input"];
        
        var body = info.window.document.body,
            form = body.querySelector("form"),
            mod, elements;
        
        for (var name in info.modules) {
             mod = info.modules[name];
             elements = form.querySelectorAll(mod.id);
             for (var i=0 ; i < elements.length ; i++) {
                   elements[i].setAttribute("_module-name", name);
             }
             mod.elementsFound = elements.length;
             selector.push(mod.id);
        }
        
        
        var inputs = form.querySelectorAll(selector.join(",")),
            shortcuts = form.querySelectorAll("shortcut");
        
        var schema =  new Schema(form, inputs, info.modules, entityName);
        
        return schema;
        
    }).catch(function(err) {
        console.log(err.stack);
    })
    
}