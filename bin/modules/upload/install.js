"use strict";

var Module = require("../module");

class Upload extends Module {
    
    get id() {
        return 'ainput[type="file"]';
    }
    
    schema() {
        
        return  "{{name}} : { " + 
        " name: {{> schema}}, " +
        " type: {{> schema}}, " +
        " original: {{> schema}}, " +
        " size: {{> schema}}" +
       " } "
        
    }
    
    blockServerModel(block, schema) {
        
         block.pipe({
             file:   "upload", 
             areaId: "model",
             data: {
                obj: schema.obj,
                filter: {isUpload: true}
            }
        });
        
        return block;
    }
    
    blockClientModel(block, schema) {
        
        block.pipe({
             content: "upload: true,", 
             areaId:  "options"
        });
        
        return block;
    }
    
}

module.exports = Upload;