app.controller("createGroupController", function($scope, $state, usersFactory, groupsFactory, $ionicViewSwitcher) {
    $scope.groups = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go("groups");
    };

    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.data = {};
        $scope.data.allGroups = groupsFactory.getGroups();
        $scope.data.myGroupsList = usersFactory.getMyGroupsList();
        $scope.data.newGroup = {};
        $scope.data.newGroup.name = "";
        $scope.data.newGroup.password = "";
        $scope.data.newGroup.description = "";
        $scope.data.newGroup.creator = usersFactory.getUID();
    });

    $scope.createGroup = function() {
        if ($scope.data.newGroup.name == "" || $scope.data.newGroup.password == "" || $scope.data.newGroup.description == ""){
            $scope.data.error = "Please fill in all fields!";
        } else {
            $scope.data.allGroups.$add($scope.data.newGroup).then(function(ref) {
                var GID = ref.key();
                groupsFactory.pullGroup(GID);
                groupsFactory.getGroupMembers().$add(usersFactory.getUID());
                $scope.data.myGroupsList.$add(GID);
            });
            $ionicViewSwitcher.nextDirection('back');
            $state.go("groups");
        }
    };
});