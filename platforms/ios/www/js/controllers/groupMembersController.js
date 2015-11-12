app.controller("groupMembersController", function($scope, $state, $ionicModal, usersFactory, groupsFactory, $ionicLoading, $ionicViewSwitcher) {
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

    $scope.search = function() {
        if ($scope.data.groupsTemp != null) {
            $scope.data.groups = $scope.data.groupsTemp;
        }
        $scope.data.groupsTemp = angular.copy($scope.data.groups);
        $scope.data.groups = {};
        angular.forEach($scope.data.groupsTemp, function(value, key) {
            if (value.name.toLowerCase().indexOf($scope.data.search.toLowerCase()) != -1) {
                $scope.data.groups[key] = angular.copy($scope.data.groupsTemp[key]);
            }
        });
    };

    $scope.clear = function() {
        $scope.data.search = "";
        $scope.search();
    };

    $ionicModal.fromTemplateUrl('templates/removeMemberOverlay.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.hide = function() {
        $scope.modal.hide();
    };

    $scope.showMyGroups = function() {
        $scope.data.showAllGroups = false;
        $scope.data.groups = $scope.data.myGroups;
        $scope.data.groupsTemp = null;
        $scope.search();
    };

    $scope.showAllGroups = function() {
        $scope.data.showAllGroups = true;
        $scope.data.groups = $scope.data.allGroups;
        $scope.data.groupsTemp = null;
        $scope.search();
    };

    $scope.groups = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go("groups");
    };

    $scope.groupSettings = function() {
        groupsFactory.setCurrentTab("groupMembers");
        $ionicViewSwitcher.nextDirection('forward');
        $state.go("groupInfo");
    };

    $scope.groupAnnouncements = function() {
        $ionicViewSwitcher.nextDirection('none');
        $state.go("groupAnnouncements");
    };

    $scope.memberStatus = function(member) {
        if (member.$value == $scope.data.group.creator) {
            return "Creator";
        } else {
            return "Member";
        }
    };

    $scope.showRemoveMember = function(member) {
        return (usersFactory.getUID() == $scope.data.group.creator) && (member.$value != $scope.data.group.creator);
    };

    $scope.confirmRemoveMember = function(member) {
        $scope.data.selectedMember = member;
        $scope.modal.show();
    };

    $scope.removeMember = function() {
        usersFactory.getMemberGroupsList($scope.data.selectedMember.$value).$loaded().then(function(memberGroups) {
            for (i = 0; i < memberGroups.length; i++) {
                if (memberGroups[i].$value == $scope.data.group.$id) {
                    memberGroups.$remove(i);
                    $scope.data.groupMembers.$remove($scope.data.selectedMember);
                    break;
                }
            }
            $scope.modal.hide();
        });
    };
});