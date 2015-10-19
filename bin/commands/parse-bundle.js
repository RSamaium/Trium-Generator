 "use strict";

var config = require("../config"),
    parse = require("../core/parse"),
    path = config.paths;

module.exports = function(bundle, options) {

    var tpl = path.bundles + bundle + "/views/" +  bundle.toLowerCase() + ".html";
    parse(tpl, bundle.toLowerCase()).then(function(schema) {
        var s = schema.build(), o, str, theschema;
        var obj = s.toObject();

        /* for (var name in obj) {
            o = obj[name];
            str = JSON.stringify(o);
   
             
            str = str.replace(/"(##[0-9]+##)"/g, function(undefined,id) { 
                  
                return schema.refSchema[id]
                
            }); 
             
             console.log(name, str);
           
        } */
        
        console.log(schema.refSchema);
    })
    .catch(function(err) {
        console.log(err.stack.red); 
    });
    
}