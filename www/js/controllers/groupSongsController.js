app.controller("groupSongsController", function($scope, $state, $ionicViewSwitcher, usersFactory, groupsFactory) {
    $scope.myGroups = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go("myGroups");
    };

    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.data = {};
        $scope.data.user = usersFactory.returnProfile();
        $scope.data.group = groupsFactory.getGroup();
    });
});