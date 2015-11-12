app.controller("leaveGroupController", function($scope, $state, usersFactory, groupsFactory, $ionicViewSwitcher) {
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.data = {};
        $scope.data.group = groupsFactory.getGroup();
        $scope.data.groupMembers = groupsFactory.getGroupMembers();
        $scope.data.myGroupsList = usersFactory.getMyGroupsList();
    });

    $scope.group = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go(groupsFactory.getCurrentTab());
    };

    $scope.leaveGroup = function() {
        var UID = usersFactory.getUID();
        var GID = groupsFactory.getGID();
        if ($scope.data.group.creator == usersFactory.getUID()) {
            var groupMembersCount = $scope.data.groupMembers.length;
            for (i = 0; i < groupMembersCount; i++) {
                var memberUID = $scope.data.groupMembers[i].$value;
                var count = 0;
                usersFactory.getMemberGroupsList(memberUID).$loaded().then(function(memberGroups) {
                    for (i = 0; i < memberGroups.length; i++) {
                        if (memberGroups[i].$value == GID) {
                            memberGroups.$remove(i);
                            count++;
                            if (count == groupMembersCount) {
                                $scope.data.group.$remove();
                            }
                            break;
                        }
                    }
                });
            }
        } else {
            for (i = 0; i < $scope.data.groupMembers.length; i++) {
                if ($scope.data.groupMembers[i].$value == UID) {
                    $scope.data.groupMembers.$remove(i);
                    break;
                }
            }
            for (i = 0; i < $scope.data.myGroupsList.length; i++) {
                if ($scope.data.myGroupsList[i].$value == GID) {
                    $scope.data.myGroupsList.$remove(i);
                    break;
                }
            }
        }
        $ionicViewSwitcher.nextDirection('back');
        $state.go("groups");
    };

    $scope.groupInfo = function() {
        $ionicViewSwitcher.nextDirection('none');
        $state.go("groupInfo");
    };
});