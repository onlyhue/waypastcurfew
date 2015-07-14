app.controller("itemsController", function($scope, itemsFactory) {
    var ref = itemsFactory.$ref();
    $scope.items = $firebaseArray(ref);

    $scope.addItem = function() {
        var name = prompt("What item to add?");
        if (name) {
            $scope.items.$add({
                "name": name
            });
        }
    };

    $scope.deleteItem = function(index) {
        $scope.items.$remove(index);
    };
});