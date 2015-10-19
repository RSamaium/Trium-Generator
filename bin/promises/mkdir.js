var fs = require('fs');

module.exports = function(name, ignore) {
    
    return new Promise(function(resolv, reject) {
        
        fs.exists(name, function (exists) {
            
            if (exists) {
                if (ignore) {
                    resolv(name);
                    return;
                }
                reject(new Error(name + " - Directory exists"));
                return;
            }
        
            fs.mkdir(name, function(err) {
                if (err) reject(err);
                else resolv(name);
            });
            
        });

    }).then(function() {
        console.log("Create Directory --> " + name);
    });
    
}