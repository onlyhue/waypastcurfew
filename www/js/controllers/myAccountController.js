app.controller("myAccountController", function($scope, $state, $ionicViewSwitcher, usersFactory, $ionicLoading, $ionicHistory) {
    $scope.main = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go("main");
    };

    // on page enter,
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.data = {};
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner><br><br><span style="font-family: Aller Light; font-size: 0.8em;">LOADING...</span>'
        });
        usersFactory.registerListener().then(function() {
            $scope.data.user = usersFactory.getProfile();
            $scope.data.user.$loaded().then(function() {
                $scope.data.displayNameTemp = angular.copy($scope.data.user.displayName);
                $ionicLoading.hide();
            });
        });
        $scope.data.edit = false;
        $scope.data.topRight = "Edit";
        $scope.data.nameEdited = false;
        $scope.data.logoutOrSave = "Logout";
        $scope.data.error = "";
    });

    $scope.editOrCancel = function() {
        if ($scope.data.edit) {
            $scope.data.user.displayName = $scope.data.displayNameTemp;
            $scope.data.topRight = "Edit";
            $scope.data.error = "";
            $scope.data.edit = false;
            $scope.data.logoutOrSave = "Logout";
        } else {
            $scope.data.displayNameTemp = angular.copy($scope.data.user.displayName);
            $scope.data.topRight = "Cancel";
            $scope.data.edit = true;
            $scope.data.error = "";
            $scope.data.logoutOrSave = "Save";
        }
    };

    $scope.logoutOrSave = function() {
        if ($scope.data.edit) {
            if ($scope.data.nameEdited) {
                if ($scope.data.user.displayName == "") {
                    $scope.data.error = "Display name cannot be blank!";
                } else {
                    $scope.data.user.$save();
                    $scope.data.nameEdited = false;
                    $scope.data.edit = false;
                    $scope.data.topRight = "Edit";
                    $scope.data.error = "Saved!";
                    $scope.data.logoutOrSave = "Logout";
                }
            } else {
                $scope.data.nameEdited = false;
                $scope.data.edit = false;
                $scope.data.topRight = "Edit";
                $scope.data.error = "Saved!";
                $scope.data.logoutOrSave = "Logout";
            }
        } else {
            facebookConnectPlugin.logout();
            usersFactory.unauth();
            $ionicViewSwitcher.nextDirection('forward');
            $state.go("main");
            $ionicHistory.clearCache();
        }
    };

    $scope.nameEdited = function() {
        $scope.data.nameEdited = true;
    };
});