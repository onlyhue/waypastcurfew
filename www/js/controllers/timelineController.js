app.controller("timelineController", function($scope, $state, $ionicViewSwitcher) {
    $scope.main = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go("main");
    };
});
