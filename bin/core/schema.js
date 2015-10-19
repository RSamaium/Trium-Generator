"use strict";

var _ = require("lodash");
var template = require("../promises/template");

class Input {

    constructor(input) {
        this._input = input;
        this._module = null;
        this._parent = null;
    }

    get mapType() {
        return {
            "text":     "String",
            "file":     "String",
            "number":   "Number",
            "range":    "Number",
            "date":     "Date",
            "search":   "String",
            "color":    "String",
            "checkbox": "Boolean",
            "email":    "String",
            "url":      "String",
            "password": "String",
            "radio":    "String",
            "tel":      "String",
            "hidden":   "String"
        }
    } 

    get input() {
        return this._input;
    }
    
    attr() {
        var val;
        for (let i=0 ; i < arguments.length ; i++) {
            val = this.input.getAttribute(arguments[i]);
            if (val != null) break;
        } 
        return val;
    }

    getName() {
        var name, prop;
        
        name = this.attr('ng-model', 'name');
        
        if (!name) {
            console.log("name or ng-model attribute is not found");
            return;
        }
        
        prop = name.split(".");
        
        if (prop.length > 2) {
            this._parent = prop.slice(1, prop.length-1);
        }
        
        prop = prop[prop.length-1];
        
        return prop;
    }

    getType() {
        
        if (this.module) {
            return this.module.type;
        }
        
        var type = this.attr('type');
        return this.mapType[type];
    }
    
    customAttr() {
        if (this.isModule() && this.module.attrs) {
            return this.module.attrs();
        }
    }
    
    generate() {
        var generate = this.attr("generate");
        
        if (generate == null) {
            generate = "true";
        }

        return generate == "true" ? true : false;
    }
    
    getModuleName() {
        return this.attr("_module-name");
    }
    
    get module() {
        return this._module;
    }
    
    get parent() {
        return this._parent;
    }
    
    set module(val) {
        this._module = val;
    }
    
    getTitle() {
        return this.attr("title");
    }
        
    isModule() {
       return this.getModuleName() ? true : false;
    }
    
    isRequired() {
        var val = this.attr("required", "ng-required");
        return val != null ? true : null;
    }
    
    isEmail() {
        return this.attr("type") == "email";
    }
    
    isURL() {
        return this.attr("type") == "url";
    }
    
    min() {
        return this.attr("min");
    }
    
    max() {
        return this.attr("max");
    }
    
    
    match() {
        return this.attr("pattern", "ng-pattern")
    }
    
    enum() {
        
    }
    
    default() {
        return this.attr("placeholder");
    }
    
    isPassword() {
        return this.attr("type") == "password";
    }
    
    isHexColor() {
        return this.attr("type") == "color";
    }
    
    maxlength() {
        return this.attr("maxlength");
    }

}



class Schema {

    constructor(form, inputs, modules, entityName) {
        this._form = form;
        this._inputs = inputs;
        this._schema = [];
        this._upload = false;
        this.name = entityName;
        this._ref = form.getAttribute("ref");
        this._modules = modules;
        this.refSchema = {};
        if (this._ref) {
            this._ref = this._ref.split(",");
        }
    }
    
    get obj() {
        return this._obj;
    }
    
    get shortcuts() {
        return this._shortcuts;
    }

    build() {
        for (let i=0 ; i < this.inputs.length ; i++) {
            let schema = new Input(this.inputs[i]);
            if (schema.isModule()) {
                schema.module = this.getModule(schema.getModuleName());
            }
            if (schema.generate()) {
                this.schema.push(schema);
            }
            
        }
        return this;
    }
    
    
    get ref() {
        return  this._ref || [];
    }

    get schema() {
        return this._schema;
    }
    
    get inputs() {
        return this._inputs;
    }
    
    get form() {
        return this._form;
    }
    
    get modules() {
        return this._modules;
    }
    
    getModule(name) {
        if (!_.isString(name)) {
            return this.modules[name.getModule()];
        }
        return this.modules[name];
    }

    toObject() {
        var obj = {},
            parent = {},
            objDeep = {},
            self = this;
        
        function buildObj(p, parentObj) {
            if (!parentObj[p]) {
                parentObj[p] = {};
            }
            return parentObj[p];
        }
        
        function generateid() {
            return "##"  + (("" + Math.random()).split(".")[1]) + "##";
        }
        
        var schema;
    
            
        for (let i=0 ; i < this.schema.length ; i++) {
            let s = this.schema[i];
            let validates = [];
            let name = s.getName();
            let testValidates = ["isEmail", "isURL", "isHexColor"];
            let _id = generateid();
            
            for (let v of testValidates) {
                if (s[v]()) validates.push(v);
            }
            
            schema = {
                name: name,
                type: s.getType(),
                title: s.getTitle(),
                module: s.module,
                required: s.isRequired(),
                min: s.min(),
                max: s.max(),
                match: s.match(),
                enum: s.enum(),
                default: s.default(),
                validates: validates,
                isPassword: s.isPassword(),
                custom: s.customAttr()
            };
            
          
            
            this.refSchema[_id] = schema;
            
            if (s.parent) {
                var parentObj = parent = {};
                for (let p of s.parent) {
                    parentObj = buildObj(p, parentObj);
                }
                parentObj[name] = _id;
                obj = _.merge(parent, obj);
            }
            else {
                obj[name] = _id;
                
            }
            
            
            
        }
        
        for (var ref of this.ref) {
            let _id = generateid();
            
            schema  = {
                type: "mongoose.Schema.Types.ObjectId",
                ref: ref,
                childPath: this.name
            }; 
            
            this.refSchema[_id] = schema;
            
            obj[ref.toLowerCase()] = _id;
        }
        
        
        return this._obj = obj;
    }
}

module.exports = Schema;