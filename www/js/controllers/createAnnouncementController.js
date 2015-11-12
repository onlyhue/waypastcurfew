app.controller("createAnnouncementController", function($scope, $state, usersFactory, groupsFactory, $ionicLoading, $ionicViewSwitcher) {
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.data = {};
        $scope.data.newAnnouncement = {};
        $scope.data.announcements = groupsFactory.getGroupAnnouncements();
    });

    $scope.groupAnnouncements = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go("groupAnnouncements");
    };

    $scope.createAnnouncement = function() {
        $scope.data.newAnnouncement.date = (new Date()).toUTCString();
        $scope.data.announcements.$add($scope.data.newAnnouncement);
        $ionicViewSwitcher.nextDirection('forward');
        $state.go("groupAnnouncements");
    };
});