app.controller("myAccountController", function($scope, $state, $ionicViewSwitcher, usersFactory, $ionicLoading, $ionicHistory) {
    $scope.main = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go("main");
    };

    // retrieve firebase authentication object
    var authObj = usersFactory.getAuthObj();

    // on page enter,
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.data = usersFactory.returnProfile();
        $scope.data.edit = false;
        $scope.data.topRight = "Edit";
        $scope.data.nameEdited = false;
        $scope.data.passwordChanged = false;
        $scope.data.error = "";
    });

    // logout method
    $scope.logout = function() {
        facebookConnectPlugin.logout();
        usersFactory.unauth();
        $ionicViewSwitcher.nextDirection('forward');
        $state.go("login");
        $ionicHistory.clearCache();
    };

    $scope.editOrCancel = function() {
        if($scope.data.edit) {
            $scope.data.first_name = $scope.data.first_nameTemp;
            $scope.data.last_name = $scope.data.last_nameTemp;
            $scope.data.topRight = "Edit";
            $scope.data.oldPassword = "";
            $scope.data.newPassword = "";
            $scope.data.confirmPassword = "";
            $scope.data.passwordChanged = false;
            $scope.data.error = "";
            $scope.data.edit = false;
        } else {
            $scope.data.first_nameTemp = angular.copy($scope.data.first_name);
            $scope.data.last_nameTemp = angular.copy($scope.data.last_name);
            $scope.data.topRight = "Cancel";
            $scope.data.edit = true;
            $scope.data.error = "";
        }
    };

    $scope.save = function() {
        if ($scope.data.passwordChanged) {
            if (($scope.data.newPassword == "" || $scope.data.newPassword == null) && ($scope.data.confirmPassword == "" || $scope.data.confirmPassword == null)) {
                $scope.data.edit = true;
                $scope.data.error = "Password cannot be blank!";
                return;
            } else if ($scope.data.newPassword == $scope.data.confirmPassword) {
                $ionicLoading.show({
                    template: '<ion-spinner></ion-spinner><br>Loading...'
                });
                //usersFactory.changePassword();
                authObj.$changePassword({
                    email: $scope.data.email,
                    oldPassword: $scope.data.oldPassword,
                    newPassword: $scope.data.newPassword
                }).then(function() {
                    if ($scope.data.nameEdited) {
                        usersFactory.pushProfile();
                        $scope.data.nameEdited = false;
                    }
                    $scope.data.error = "Password changed!";
                    $ionicLoading.hide();
                }).catch(function(error) {
                    $scope.data.edit = true;
                    $scope.data.topRight = "Cancel";
                    $scope.data.error = "Incorrect old password!";
                    $ionicLoading.hide();
                });
            } else {
                $scope.data.edit = true;
                $scope.data.error = "Passwords do not match!";
                return;
            }
        } else if ($scope.data.nameEdited) {
            usersFactory.pushProfile();
            $scope.data.nameEdited = false;
        }
        $scope.data.edit = false;
        $scope.data.topRight = "Edit";
        $scope.data.oldPassword = "";
        $scope.data.newPassword = "";
        $scope.data.confirmPassword = "";
        $scope.data.error = "";
        $scope.data.passwordChanged = false;
    };

    $scope.nameEdited = function() {
        $scope.data.nameEdited = true;
    };

    $scope.passwordChanged = function() {
        $scope.data.passwordChanged = true;
        if (($scope.data.oldPassword == null || $scope.data.oldPassword == "") && ($scope.data.newPassword == null || $scope.data.newPassword == "") && ($scope.data.confirmPassword == null || $scope.data.confirmPassword == "")) {
            $scope.data.passwordChanged = false;
        }
    };
});