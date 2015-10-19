var config  = require("../config"),
    gulp    = require("gulp"),
    block   = require("./gulp-block"),
    _       = require("lodash"),
    _path   = config.paths,
    colors = require('colors');

var sprintf = require("sprintf-js").sprintf;

/**

     Block(bundleServer + "/schema/schema.js")
                .pipe({
                     content:   "uiGmapgoogle-maps,", 
                     blockId: "uiGmapgoogle-maps", 
                     areaId: "modules",
                     data: {}
                 })
                .end();

*/
var Block =  function(path, bundle, file) {
    
    var stream, lowerName, capiName, bundleClient, bundleServer;
    
     if (file == null) {
         file = _.capitalize(bundle) + ".js";
     }
    
     if (!file) {
         file = bundle;
         bundle = false;
     }
    
     if (bundle) {
         lowerName = bundle.toLowerCase();
         capiName = _.capitalize(bundle);

         bundleClient = _path.bundles + capiName,
         bundleServer = _path.server + capiName;
         
         if (/\[client\]/.test(path)) {
             path = path.replace("[client]", "");
             path = sprintf(path, bundleClient);
         }
         else {
             path = sprintf(path, bundleServer);
         }
         
     }
    
    stream = gulp.src(path + "/" + file);
    
    console.log(("Search blocks in " + path).blue);

    return {
        
        pipe: function(condition, args)  {
            
            if (!args) {
                args = condition;
                condition = "noop";
            }
            
            if (condition !== "noop" && !condition) {
                return this;
            }
            
            var content = args.content ? {content: args.content} : args.file;
            
            args.data = args.data || {};
            
            if (!_.isArray(args.data) && lowerName && capiName) {
                 if (!args.data.entity) args.data.entity = capiName;
                 if (!args.data.variable) args.data.variable = lowerName;
            }
            stream = stream.pipe(block(content, args.blockId, args.data, args.areaId));
            return this;
        },
        
        data: function() {
            return {
                entity: capiName,
                variable: lowerName
            }
        },
    
        end: function() {
             stream.pipe(gulp.dest(path));
        }
    
    }
    
    
}

Block.CLIENT = "%s";
Block.BUNDLE_SERVER_SCHEMA = "%s/schema";
Block.BUNDLE_SERVER_MODEL = "%s/model";
Block.BUNDLE_CLIENT_MODEL = "[client]%s/models";
Block.BUNDLE_SERVER_ROUTES = "%s/routes";
    
module.exports = Block;