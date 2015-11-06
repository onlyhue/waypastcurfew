app.controller("groupMembersController", function($scope, $state, $ionicViewSwitcher, $ionicListDelegate) {
    $scope.data = {
        showDelete: false
    };

    $scope.shouldShowDelete = false;
    $scope.shouldShowReorder = false;
    $ionicListDelegate.canSwipeItems = true;

    $scope.moveItem = function(item, fromIndex, toIndex) {
        $scope.items.splice(fromIndex, 1);
        $scope.items.splice(toIndex, 0, item);
    };

    $scope.onItemDelete = function(item) {
        $scope.items.splice($scope.items.indexOf(item), 1);
    };

    $scope.items = [
        { id: 0 },
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
        { id: 10 },
        { id: 11 },
        { id: 12 },
        { id: 13 },
        { id: 14 },
        { id: 15 },
        { id: 16 },
        { id: 17 },
        { id: 18 },
        { id: 19 },
        { id: 20 },
        { id: 21 },
        { id: 22 },
        { id: 23 },
        { id: 24 },
        { id: 25 },
        { id: 26 },
        { id: 27 },
        { id: 28 },
        { id: 29 },
        { id: 30 },
        { id: 31 },
        { id: 32 },
        { id: 33 },
        { id: 34 },
        { id: 35 },
        { id: 36 },
        { id: 37 },
        { id: 38 },
        { id: 39 },
        { id: 40 },
        { id: 41 },
        { id: 42 },
        { id: 43 },
        { id: 44 },
        { id: 45 },
        { id: 46 },
        { id: 47 },
        { id: 48 },
        { id: 49 },
        { id: 50 }
    ];

    $scope.myGroups = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go("myGroups");
    };

    /*$scope.$on('$ionicView.beforeEnter', function() {
        $scope.data = {};
        $scope.data.user = usersFactory.returnProfile();
        $scope.data.group = groupsFactory.getGroup();
        $scope.data.groupRows = [];
        $scope.data.group.$loaded().then(function(data) {
            $scope.data.allUseqrs = usersFactory.getAllUsers();
            $scope.data.allUsers.$loaded().then(function() {
                var keys = Object.keys(data.members);
                for (i = 0; i < keys.length; i++) {
                    var object = {};
                    object[keys[i]] = {displayName: $scope.data.allUsers[keys[i]].displayName, status: data.members[keys[i]]};
                    if (i != keys.length - 1) {
                        object[keys[i + 1]] = {displayName: $scope.data.allUsers[keys[i + 1]].displayName, status: data.members[keys[i + 1]]};
                    }
                    $scope.data.groupRows.push(object);
                    i++;
                }
            });
        });
    });*/
});