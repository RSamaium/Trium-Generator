var fs = require('fs');

module.exports = function(path, data, locked) {
    
    return new Promise(function(resolv, reject) {
        
        fs.exists(path, function (exists) {
            
            if (locked && exists) {
                reject(new Error(path + " - File exists"));
                return;
            }
        
            fs.writeFile(path, data, function (err) {
                if (err) reject(err);
                else resolv();
            });
            
        });

    }).then(function() {
        console.log("Create File --> " + path);
    });

        
}