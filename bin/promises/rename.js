var fs = require('fs-extra');

module.exports = function(oldPath, newPath) {
    
    return new Promise(function(resolv, reject) {
        
        var callback = function(err) {
            if (err) {
                reject(err);
                return;
            }
            resolv();
        }

        if (fs.statSync(oldPath).isDirectory()) {
            fs.move(oldPath, newPath, callback);
        }
        else {
            fs.rename(oldPath, newPath, callback);
        }

    }).then(function() {
        console.log("Move Directory --> " + oldPath + "-> " + newPath);
    });
    
}