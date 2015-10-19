var express = require('express');
var route = require('../../../core/route');
var model = require("../../../core/initModel");
// <generate-area require>

// </generate-area>


module.exports = function(app) {
    
    var {{variable}} = model("{{entity}}", app),
        router = express.Router();
         
     
    route(router, {{variable}}, "{{variable}}_id");
   
    app.use('{{api_path}}', router);
         
    // <generate-area routes>

    // </generate-area>   
    
    return app;
}
