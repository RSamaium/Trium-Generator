var fs = require("fs");
var path = require("path");


module.exports = function(dir) {

     return new Promise(function(resolv, reject) {

         var rmdir = function(dir) {
            var list = fs.readdirSync(dir);

            for(var i = 0; i < list.length; i++) {
                var filename = path.join(dir, list[i]);
                var stat = fs.statSync(filename);

                if(filename == "." || filename == "..") {
                    // pass these files
                } else if(stat.isDirectory()) {
                    // rmdir recursively
                    rmdir(filename);
                } else {
                    // rm fiilename
                    fs.unlinkSync(filename);
                }
            }
            fs.rmdirSync(dir);
         }

         fs.exists(dir, function(exists) {
             if (exists) {
               rmdir(dir);
             }
             resolv();
         });

    }).then(function() {
        console.log("Delete Directory --> " + dir);
    });
}
