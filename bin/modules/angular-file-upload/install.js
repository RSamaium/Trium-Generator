"use strict";

var Module = require("../module");

class FileUpload extends Module {
    
    get id() {
        return "input[uploader]";
    }
    

    libraries() {
        return [
            
            
        ];
    }
    
    headerScripts() {
        return [
           
        ]
    }
    
    blocks() {

            this.block(Block.CLIENT, "app.js")
             .pipe({
                 content:   "angularFileUpload,", 
                 blockId: "angularFileUpload", 
                 areaId: "modules"
            })
            .end();
        
    }
    
}

module.exports = FileUpload;