app.factory("{{entity}}", function(Model) {
   
    class {{entity}} extends Model {
        
        get url() {
            return "{{api_path}}";
        }
        
        get name() {
            return "{{entity}}";
        }
        
       
        get options() {
            return {
                 // <generate-area options>

                 // </generate-area>
            }
        }

        
        
    }
    
    return {{entity}};
    
});