app.controller("myGroupsController", function($scope, $state, $ionicViewSwitcher) {
    $scope.main = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go("main");
    }
});