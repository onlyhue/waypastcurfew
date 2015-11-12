app.controller("groupInfoController", function($scope, $state, usersFactory, groupsFactory, $ionicLoading, $ionicViewSwitcher) {
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.data = {};
        $scope.data.group = groupsFactory.getGroup();
        if (usersFactory.getUID() == $scope.data.group.creator) {
            $scope.data.isCreator = true;
        }
        $scope.data.edit = false;
        $scope.data.editOrSave = "Edit";
    });

    $scope.group = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go(groupsFactory.getCurrentTab());
    };

    $scope.editOrSave = function() {
        if ($scope.data.editOrSave == "Edit") {
            $scope.data.edit = true;
            $scope.data.editOrSave = "Save";
            $scope.data.error = "";
        } else if ($scope.data.editOrSave == "Save") {
            $scope.data.edit = false;
            $scope.data.editOrSave = "Edit";
            $scope.data.group.$save();
            $scope.data.error = "Saved!";
        }
    };

    $scope.leaveGroup = function() {
        $ionicViewSwitcher.nextDirection('none');
        $state.go("leaveGroup");
    };
});