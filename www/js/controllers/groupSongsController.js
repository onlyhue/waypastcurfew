app.controller("groupSongsController", function($scope, $state, $ionicViewSwitcher, groupsFactory) {
    $scope.groups = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go("groups");
    };

    $scope.groupSettings = function() {
        groupsFactory.setCurrentTab("groupTasks");
        $ionicViewSwitcher.nextDirection('forward');
        $state.go("groupInfo");
    };

    $scope.assignSongs = function() {
        $ionicViewSwitcher.nextDirection('forward');
        $state.go("groupSongsAssignment");
    };

    $scope.groupMembers = function() {
        $ionicViewSwitcher.nextDirection('none');
        $state.go("groupMembers");
    };

    $scope.groupAnnouncements = function() {
        $ionicViewSwitcher.nextDirection('none');
        $state.go("groupAnnouncements");
    };

    $scope.groupSongs = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go("groupSongs");
    };

    $scope.groupTasks = function() {
        $ionicViewSwitcher.nextDirection('none');
        $state.go("groupTasks");
    };
});