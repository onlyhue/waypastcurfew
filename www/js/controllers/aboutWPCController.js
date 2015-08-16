app.controller("aboutWPCController", function($scope, $state, $ionicViewSwitcher) {
    $scope.main = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go("main");
    }
});