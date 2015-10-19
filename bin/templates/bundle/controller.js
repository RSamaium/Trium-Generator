app.controller("{{entity}}Ctrl", function($scope, controllerCrud) {
    
    // <generate-area references>

    // </generate-area>
    
    controllerCrud.set("{{entity}}", ["get", "save"], $scope);
    
});

app.controller("{{entity}}sCtrl", function($scope, controllerCrud, $location) {
    
    controllerCrud.set("{{entity}}", ["query", "delete"], $scope);

});