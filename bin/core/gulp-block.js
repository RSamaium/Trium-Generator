"use strict";

var through = require('through2');

var jsdiff = require('diff');
var _ = require('lodash');
var inquirer = require("inquirer");
var beautify = require('js-beautify').js_beautify;
var config = require("../config"),
    parse = require("./parse"),
    _path = require("path"),
    path = config.paths;

var colors = require('colors'),
    fs = require('fs');

var writeFile = require("../promises/writeFile"),
    exists = require("../promises/exists"),
    template = require("../promises/template");

var jsdom = require("jsdom");


class Block {

    constructor(nameFileBlock, nameBlock) {
        
        if (!nameBlock) {
            nameBlock = nameFileBlock;
        }
        
        this.nameFile = nameFileBlock;
        this.name = nameBlock;
        this.contentBlock = "";
        
    }
    
    open(data, notFile) {
        var self = this;
        return template(notFile ? this.nameFile.content : _path.join(__dirname, "../blocks/" + this.nameFile + ".js"), data, {
            notFile: notFile
        }).then(function(content) {
            self.contentBlock = content;
        });
    }
    
    addIn(content, area) {
        
        var self  = this;
        
        return new Promise(function(resolv, reject) {
            
                jsdom.env(content,
                    ["http://code.jquery.com/jquery.js"],
                    function (errors, window) {
                        var $ = window.$;
                        var elArea =  $("generate-area[" + area + "]");
                        var block = elArea.children("generate-block[" + self.name + "]");

                        if (!elArea.length) {
                            reject(new Error("Unable to add a block in " + area + " area : Area not Found"));
                            return;
                        }

                        function writeBlock(block, action) {
                            block.text("\n" + self.contentBlock + "\n// ");
                            var newContent = elArea.parent().html();
                            newContent = beautify(newContent, { max_preserve_newlines:  2 });
                            if (action == "create") {
                               
                                console.log(("--> Create " + self.nameFile + " block in " + area).green);
                            }
                            else {
                                console.log(("--> Update " + self.nameFile + " block in " + area).yellow);
                            }
                            resolv(newContent);
                        }
                    
                       
                       
                        // create
                        if (!block.length) {
                            block = $("<generate-block>").attr(self.name, true);
                            elArea.append(block);
                            writeBlock(block, "create");
                        }
                        else {
                            var diff = jsdiff.diffChars(block.html(), self.contentBlock + "\n// ");

                            var str = "", isEdit = false;
                            diff.forEach(function(part){
                                if ((part.added || part.removed) && (!/[\n\r ]+/.test(part.value))) {
                                    isEdit = true;
                                }
                                var color = part.added ? 'green' :
                                part.removed ? 'red' : 'grey';
                                str += part.value[color];
                            });
                            

                            if (isEdit) {

                                console.log(("The block " + area + "." + self.name + " has been modified").blue); 
                                console.log(str);
                                inquirer.prompt([
                                    {
                                        type: "confirm",
                                        name: "edit",
                                        message: "Do you want to change this block?",
                                        default: true
                                    }
                                ], function(result) {
                                    if (result.edit) {
                                        writeBlock(block, "update");
                                    }
                                    else {
                                        resolv(false);
                                    }
                                });

                            }
                            else {
                                resolv(false);
                            }


                        }


                    }
                );



           // }); // fs.readFile
            
            
        });
        
     
        
       
    }

}

function gulpBlock(blockfile, blockname, data, area) {
    
  return through.obj(function(file, enc, cb) {
      
        if (file.isStream()) {
            this.emit('error', new Error('Stream not supported!'));
            return cb();
        }
      
      if (file.isBuffer()) {
          
    
        var block = new Block(blockfile, blockname),
            self  = this;

        block.open(data, !_.isString(blockfile)).then(function() {

            block.addIn(file.contents.toString(), area).then(function(ret) {
                if (ret) {
                    file.contents = new Buffer(ret);
                }
                cb(null, file);
            }).catch(function(err) {
                console.log(err.stack.red);
            });
            
        }).catch(function(err) {
            console.log(err.stack.red); 
        });

        
        through().on('error', this.emit.bind(this, 'error'));
      
    }
      
  });
}

// exporting the plugin main function
module.exports = gulpBlock;