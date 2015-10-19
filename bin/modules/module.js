"use strict";

var Block = require("../core/block"),
    fs = require("fs"),
    path = require("path");
    

class Module {
    
    set elementsFound(val) {
         this._elementsFound = val;
    }
    
    get elementsFound() {
        return this._elementsFound;
    }
    
    set name(val) {
        this._name = val;
    }
    
    get schema() {
        return fs.readFileSync(path.join(__dirname, this.name +  "/schema.hbs"), {encoding: "utf-8"});
    }
    
    get name() {
        return this._name;
    }
    
    get type() {
        return "String";
    }
    
    isEmpty() {
        return this.elementsFound == 0;
    }
    
    block() {
        return Block;
    }
    
}

module.exports = Module;