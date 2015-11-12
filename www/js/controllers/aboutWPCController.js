app.controller("aboutWPCController", function($scope, $state, $ionicViewSwitcher) {
    $scope.main = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go("main");
    }

    $scope.events = function() {
        $ionicViewSwitcher.nextDirection('none');
        $state.go("events");
    };

    $scope.feedback = function() {
        $ionicViewSwitcher.nextDirection('none');
        $state.go("feedback");
    };

    $scope.voteSong = function() {
        $ionicViewSwitcher.nextDirection('none');
        $state.go("voteSong");
    };


});