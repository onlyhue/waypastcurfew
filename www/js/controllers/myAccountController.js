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
        $scope.data.displayNameTemp = angular.copy($scope.data.displayName);
        $scope.data.emailTemp = angular.copy($scope.data.email);
        $scope.data.edit = false;
        $scope.data.topRight = "Edit";
        $scope.data.nameEdited = false;
        $scope.data.emailEdited = false;
        if (authObj.$getAuth().facebook != null) {
            $scope.data.facebookAccount = true;
        } else {
            $scope.data.facebookAccount = false;
        }
        $scope.data.passwordChanged = false;
        $scope.data.error = "";
    });

    // on page leave,
    $scope.$on('$ionicView.leave', function() {
        $scope.data.displayName = $scope.data.displayNameTemp;
        $scope.data.email = $scope.data.emailTemp;
        $scope.data.topRight = "Edit";
        $scope.data.oldPassword = "";
        $scope.data.newPassword = "";
        $scope.data.confirmPassword = "";
        $scope.data.passwordChanged = false;
        $scope.data.error = "";
        $scope.data.edit = false;
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
            $scope.data.displayName = $scope.data.displayNameTemp;
            $scope.data.email = $scope.data.emailTemp;
            $scope.data.topRight = "Edit";
            $scope.data.oldPassword = "";
            $scope.data.newPassword = "";
            $scope.data.confirmPassword = "";
            $scope.data.passwordChanged = false;
            $scope.data.error = "";
            $scope.data.edit = false;
        } else {
            $scope.data.displayNameTemp = angular.copy($scope.data.displayName);
            $scope.data.emailTemp = angular.copy($scope.data.email);
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
                    $ionicLoading.hide();
                }).catch(function(error) {
                    $scope.data.displayNameTemp = $scope.data.displayName;
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
        }
        if ($scope.data.nameEdited || $scope.data.emailEdited) {
            var re = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b$/;
            if (!re.test($scope.data.email)) {
                // invalid email, display error message
                $scope.data.error = "Invalid email!";
                return;
            }
            if (authObj.$getAuth().facebook != null) {
                usersFactory.pushProfile(authObj.$getAuth().auth.uid);
            } else {
                usersFactory.pushProfile();
            }
            $scope.data.nameEdited = false;
            $scope.data.emailEdited = false;
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

    $scope.emailEdited = function() {
        $scope.data.emailEdited = true;
    }

    $scope.passwordChanged = function() {
        $scope.data.passwordChanged = true;
        if (($scope.data.oldPassword == null || $scope.data.oldPassword == "") && ($scope.data.newPassword == null || $scope.data.newPassword == "") && ($scope.data.confirmPassword == null || $scope.data.confirmPassword == "")) {
            $scope.data.passwordChanged = false;
        }
    };
});
