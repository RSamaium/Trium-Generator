"use strict";

var Module = require("../module");

class GoogleMap extends Module {
    
    get id() {
        return "ui-gmap-google-map";
    }
    
    attrs() {
        return {
            center: {
                latitude: "Number",
                longitude: "Number"
            },
            zoom: "Number"
        }
    }
    
    libraries() {
        return [
            "lodash",
            "angular-google-maps"
        ];
    }
    
    headerScripts() {
        return [
            "<script src='/path/to/lodash[.min].js'></script>",
            "<script src='/path/to/angular-google-maps[.min].js'></script>",
            "<script src='//maps.googleapis.com/maps/api/js?sensor=false'></script>"
        ]
    }
    
    blocks() {

            this.block(Block.CLIENT, "app.js")
             .pipe({
                     content:   "uiGmapgoogle-maps,", 
                     blockId: "uiGmapgoogle-maps", 
                     areaId: "modules"
            })
            .end();
        
    }
    
}

module.exports = GoogleMap;