var fs = require('fs');

module.exports = function(filename, not) {
    
    return new Promise(function(resolv, reject) {
        
        fs.exists(filename, function (exists) {
            
            if (not) exists = !exists;
            
            if (exists) reject(new Error(filename + " exists"));
            else resolv();
           
        });
        
    });
}