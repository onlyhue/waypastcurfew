app.controller("groupTasksController", function($scope, $state, $ionicViewSwitcher, groupsFactory, usersFactory, $ionicModal) {
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.data = {};
        $scope.data.group = groupsFactory.getGroup();
        $scope.data.users = usersFactory.getUsers();
        $scope.data.groupMembers = groupsFactory.getGroupMembers();
        $scope.sortByMemberName = function(member) {
            return $scope.data.users[member.$value].displayName;
        };
        $scope.data.search = "";
    });

    $scope.groups = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go("groups");
    };

    $scope.groupSettings = function() {
        groupsFactory.setCurrentTab("groupTasks");
        $ionicViewSwitcher.nextDirection('forward');
        $state.go("groupInfo");
    };

    $scope.createTask = function() {
        $ionicViewSwitcher.nextDirection('forward');
        $state.go("groupTasksAssignment");
    };

    $scope.createTask2 = function() {
        $ionicViewSwitcher.nextDirection('none');
        $state.go("groupTasksAssignment2");
    };

    $scope.createTask3 = function() {
        $ionicViewSwitcher.nextDirection('none');
        $state.go("groupTasksAssignment");
    };

    $scope.groupMembers = function() {
        $ionicViewSwitcher.nextDirection('none');
        $state.go("groupMembers");
    };

    $ionicModal.fromTemplateUrl('templates/groupTasksOverlay.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.show = function() {
        $scope.modal.show();
    };

    $scope.hide = function() {
        $scope.modal.hide();
    };

    $scope.groupAnnouncements = function() {
        $ionicViewSwitcher.nextDirection('none');
        $state.go("groupAnnouncements");
    };

    $scope.groupSongs = function() {
        $ionicViewSwitcher.nextDirection('none');
        $state.go("groupSongs");
    };

    $scope.groupTasks = function() {
        $scope.data = {};
        $ionicViewSwitcher.nextDirection('back');
        $state.go("groupTasks");
    };

    $scope.isCreator = function(member) {
        return (usersFactory.getUID() == $scope.data.group.creator) && (member.$value != $scope.data.group.creator);
    };

});