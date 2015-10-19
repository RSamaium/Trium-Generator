var schemaObj = require("./schema");
var schemaInit = require("../../../core/schema");
var relationship = require("mongoose-relationship");
// <generate-area require>

// </generate-area>

module.exports = function(app) {

    var schema = schemaInit(schemaObj, app);
    
    // <generate-area schema>

    // </generate-area>
    
    return schema;
    
};