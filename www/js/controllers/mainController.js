app.controller("mainController", function($scope, $state, usersFactory, $ionicViewSwitcher, $ionicAnalytics) {
    $scope.data = {};
    $scope.data.mainToSongs = Date.now();

    try {
        usersFactory.pullProfile(usersFactory.getAuthObj().$getAuth().uid);
    } catch (error) {
        // not logged in
    }

    $scope.songs = function() {

        $ionicViewSwitcher.nextDirection('forward');
        $state.go("songs");
    };

    $scope.feedback = function() {
        $ionicViewSwitcher.nextDirection('forward');
        $state.go("feedback");
    };

    $scope.aboutWPC = function() {
        $ionicViewSwitcher.nextDirection('forward');
        $state.go("aboutWPC");
    };

    $scope.events = function() {
        $ionicViewSwitcher.nextDirection('forward');
        $state.go("events");
    };

    $scope.myAccount = function() {
        usersFactory.setNextPage("myAccount");
        if (usersFactory.getAuthObj().$getAuth() == null) {
            $ionicViewSwitcher.nextDirection('forward');
            $state.go("login");
        } else {
            $ionicViewSwitcher.nextDirection('forward');
            $state.go("myAccount");
        }
    };

    $scope.groups = function() {
        usersFactory.setNextPage("groups");
        if (usersFactory.getAuthObj().$getAuth() == null) {
            $ionicViewSwitcher.nextDirection('forward');
            $state.go("login");
        } else {
            $ionicViewSwitcher.nextDirection('forward');
            $state.go("groups");
        }
    };
});