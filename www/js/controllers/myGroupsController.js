app.controller("myGroupsController", function($scope, $state, $ionicViewSwitcher, $ionicModal) {
    $scope.data = {};

    $scope.main = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go("main");
    };

    $scope.groups = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go("myGroups");
    };

    $ionicModal.fromTemplateUrl('templates/myGroupsOverlay.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.details = function() {
        $scope.modal.show()
    };

    $scope.hide = function() {
        $scope.modal.hide();
    };

    /* on page load, populate all the groups the user belongs to */
    /*$scope.$on('$ionicView.beforeEnter', function() {
        $scope.data.user = usersFactory.returnProfile();
        $scope.data.groups = groupsFactory.getGroups();
        $scope.data.myGroups = {};
        $scope.data.groups.$loaded().then(function() {
            angular.forEach($scope.data.user.groups, function(value, key) {
                $scope.data.myGroups[value] = $scope.data.groups[value];
            });
        });
    });

    $scope.createGroup = function() {
        if ($scope.data.groupName != null && $scope.data.groupName != "") {
            var GID = groupsFactory.createGroup($scope.data.groupName, usersFactory.getUID());
            if ($scope.data.user.groups != null) {
                $scope.data.user.groups.push(GID);
            } else {
                $scope.data.user.groups = [GID];
            }
            $scope.data.user.$save().then(function() {
                $scope.data.myGroups[GID] = $scope.data.groups[GID];
                $scope.modal.hide();
                $scope.data.groupName = "";
            });
        }
    };

     $scope.search = function() {
     if ($scope.data.myGroupsTemp != null) {
     $scope.data.myGroups = $scope.data.myGroupsTemp;
     }
     $scope.data.myGroupsTemp = angular.copy($scope.data.myGroups);
     $scope.data.myGroups = {};
     angular.forEach($scope.data.myGroupsTemp, function(value, key) {
     if (value.name.toLowerCase().indexOf($scope.data.search.toLowerCase()) != -1) {
     $scope.data.myGroups[key] = angular.copy($scope.data.myGroupsTemp[key]);
     }
     });
     };

     $scope.clear = function() {
     $scope.data.search = "";
     $scope.search();
     };

     $scope.viewGroup = function(GID) {
     groupsFactory.pullGroup(GID);
     $state.go("announcements");
     };
    */

});