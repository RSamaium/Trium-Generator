var fs = require('fs'),
    _ = require("lodash"),
    Handlebars = require("handlebars");

module.exports = function(filename, data, options) {

    options = options || {};

   Handlebars.registerHelper('schema', function(context, filter, options) {

       var ret = "", array = [];

        if (!options) {
           options = filter;
           filter = false;
        }

       if (filter) {
            array = _.filter(context, filter);
       }
        else {
            array = context;
        }

        for(var i=0, j=array.length; i<j; i++) {
         ret += options.fn(array[i]) + ",";
        }

        ret = ret.replace(/,$/, "");

        return ret;
   });

     Handlebars.registerHelper('doc', function(context, options) {

        for(var i=0, j=context.length; i<j; i++) {
          ret += options.fn(context[i]) + "@apiSuccess {String} firstname Firstname of the User";
        }

   });

    Handlebars.registerHelper('table', function(context, entity, options) {
          var ret = "";

          for(var i=0, j=context.length; i<j; i++) {
              ret += "<td>";
              if (context[i].isUpload) {
                  ret += '<img ng-src="uploads/' + context[i].name + '/{{' + entity + '.' + context[i].name + '.name}}">';
              }
              else {
                 ret += "{{" + entity + "." + context[i].name + "}}";
              }
              ret += "</td>";

          }

          return ret;
       });

     Handlebars.registerHelper('tableHeader', function(context, options) {
          var ret = "";

          for(var i=0, j=context.length; i<j; i++) {
            ret += "<th>" + context[i].title + "</th>";
          }

          return ret;
       });



    Handlebars.registerPartial("schema", fs.readFileSync(__dirname + "/../blocks/schema-obj.js",  {encoding: "utf8"}));

    if (options.sync) {
        var source = fs.readFileSync(filename, {encoding: "utf8"});
        var template = Handlebars.compile(source);
        return template(data);
    }

   return new Promise(function(resolv, reject) {

        if (options.notFile) {
            resolv(filename);
            return;
        }

        fs.readFile(filename, {encoding: "utf8"}, function(err, data) {
            if (err) reject(err);
            else resolv(data);
        });

    }).then(function(source) {

        var template = Handlebars.compile(source);
        console.log(filename);
        return template(data);

    });


}
