app.controller("groupAnnouncementsController", function($scope, $state, usersFactory, groupsFactory, $ionicLoading, $ionicViewSwitcher, $ionicModal) {
    $scope.$on('$ionicView.beforeEnter', function() {
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner><br>Loading...'
        });
        $scope.data = {};
        $scope.data.user = usersFactory.getProfile();
        $scope.data.group = groupsFactory.getGroup();
        $scope.data.groupAnnouncements = groupsFactory.getGroupAnnouncements();
        $scope.data.users = usersFactory.getUsers();
        $scope.data.group.$loaded().then(function(group) {
            $scope.data.isCreator = group.creator == usersFactory.getUID();
            $ionicLoading.hide();
        });
    });

    $scope.groups = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go("groups");
    };

    $scope.groupSettings = function() {
        groupsFactory.setCurrentTab("groupAnnouncements");
        $ionicViewSwitcher.nextDirection('forward');
        $state.go("groupInfo");
    };

    $scope.groupSongs = function() {
        $ionicViewSwitcher.nextDirection('none');
        $state.go("groupSongs");
    };

    $scope.groupMembers = function() {
        $ionicViewSwitcher.nextDirection('none');
        $state.go("groupMembers");
    };

    $scope.groupTasks = function() {
        $ionicViewSwitcher.nextDirection('none');
        $state.go("groupTasks");
    };

    $scope.createAnnouncement = function() {
        $ionicViewSwitcher.nextDirection('forward');
        $state.go("createAnnouncement");
    };

    $scope.viewAnnouncement = function(announcement) {
        $scope.data.selectedAnnouncement = announcement;
        $ionicModal.fromTemplateUrl('templates/announcementDetailsOverlay.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    };

    $scope.confirmRemoveAnnouncement = function(announcement) {
        $scope.data.selectedAnnouncement = announcement;
        $ionicModal.fromTemplateUrl('templates/removeAnnouncementOverlay.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    };

    $scope.removeAnnouncement = function() {
        $scope.data.groupAnnouncements.$remove($scope.data.selectedAnnouncement);
        $scope.modal.hide();
    };
});