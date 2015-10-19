module.exports = {
    
    paths: {
   
        bundles: "client/app/bundles/",
        templates: "templates/bundle/",
        templateServer: "templates/server/",
        server: "server/bundles/"
   
    },
    
    getBinPath: function(type, file) {
        return __dirname + "/" + this.paths[type] + file;
    }
    
}