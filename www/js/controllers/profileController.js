app.controller("profileController", function($scope, usersFactory, $state, $ionicLoading, $interval) {
    // retrieve firebase authentication object
    var authObj = usersFactory.getAuthObj();

    // on page enter,
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.data = usersFactory.returnProfile();

        if ($scope.data.last_name == null) {
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner><br>Loading...'
            });
        }

        $scope.data.edit = false;
        $scope.data.topRight = "Edit";
        $scope.data.topLeft = "Main";
        $scope.data.edited = false;
        $scope.data.changePassword = false;
        $scope.data.passwordLabel = "Password";
        $scope.data.oldPassword = "password";
        $scope.data.error = "";

        var loading = $interval(function() {
            if ($scope.data.last_name != null) {
                $ionicLoading.hide();
                $interval.cancel(loading);
            }
        }, 250);
    })

    // logout method
    $scope.logout = function() {
        authObj.$unauth();
        $state.go("login");
    };

    $scope.mainOrCancel = function() {
        if($scope.data.edit) {
            $scope.data.topRight = "Edit";
            $scope.data.topLeft = "Main";
            $scope.data.passwordLabel = "Password";
            $scope.data.oldPassword = "password";
            $scope.data.error = "";
            $scope.data.edit = false;
            $scope.data.changePassword = false;
        } else {
            $state.go('main');
        }
    };

    $scope.editOrSave = function() {
        if($scope.data.edit && !$scope.data.edited && !$scope.data.changePassword) {
            return;
        }

        $scope.data.edit = !$scope.data.edit;
        if ($scope.data.edit) {
            $scope.data.topRight = "Done";
            $scope.data.topLeft = "Cancel";
            $scope.data.passwordLabel = "Old Password";
            $scope.data.edited = false;
            $scope.data.changePassword = false;
            $scope.data.oldPassword = "";
            $scope.data.newPassword = "";
            $scope.data.confirmPassword = "";
            $scope.data.error = "";
        } else {
            if ($scope.data.edited) {
                usersFactory.pushProfile();
            }
            if ($scope.data.changePassword) {
                if (($scope.data.newPassword == "" || $scope.data.newPassword == null) && ($scope.data.confirmPassword == "" || $scope.data.confirmPassword == null)) {
                    $scope.data.edit = true;
                    $scope.data.error = "Password cannot be blank!";
                    return;
                } else if ($scope.data.newPassword == $scope.data.confirmPassword) {
                    $ionicLoading.show({
                        template: '<ion-spinner></ion-spinner><br>Loading...'
                    });
                    authObj.$changePassword({
                        email: $scope.data.email,
                        oldPassword: $scope.data.oldPassword,
                        newPassword: $scope.data.newPassword
                    }).then(function() {
                        $scope.data.oldPassword = "password";
                        $scope.data.error = "Password changed!";
                        $ionicLoading.hide();
                    }).catch(function(error) {
                        $scope.data.edit = true;
                        $scope.data.edited = true;
                        $scope.data.oldPassword = $scope.data.oldPasswordTemp;
                        $scope.data.changePassword = true;
                        $scope.data.topRight = "Done";
                        $scope.data.topLeft = "Cancel";
                        $scope.data.error = "Incorrect old password!";
                        $ionicLoading.hide();
                        return;
                    });
                } else {
                    $scope.data.edit = true;
                    $scope.data.error = "Passwords do not match!";
                    return;
                }
            }
            $scope.data.topRight = "Edit";
            $scope.data.topLeft = "Main";
            $scope.data.oldPasswordTemp = $scope.data.oldPassword;
            $scope.data.oldPassword = "password";
            $scope.data.passwordLabel = "Password";
            $scope.data.error = "";
            $scope.data.edited = false;
            $scope.data.changePassword = false;
        }
    }

    $scope.edited = function() {
        $scope.data.edited = true;
    }

    $scope.changePassword = function() {
        if ($scope.data.oldPassword == "" || $scope.data.oldPassword == null) {
            $scope.data.changePassword = false;
        } else {
            $scope.data.changePassword = true;
        }
    }
});