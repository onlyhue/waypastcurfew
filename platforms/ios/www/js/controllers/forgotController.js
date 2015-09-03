app.controller("forgotController", function($scope, usersFactory, $state, $ionicLoading, $timeout, $ionicViewSwitcher) {
    // initialize data object
    $scope.data = {};

    $scope.resetPassword = function() {
        var re = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b$/;
        if (!re.test($scope.data.email)) {
            // invalid email, display error message
            $scope.data.error = "Invalid email!";
        } else {
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner><br>Loading...'
            });
            usersFactory.resetPassword($scope.data.email).then(function () {
                // success, display success message and go back to login page
                $ionicLoading.show({
                    template: 'An email has been sent to ' + $scope.data.email + '!'
                });
                $state.go("login");
                $timeout(function () {
                    $ionicLoading.hide();
                }, 3000);
            }, function () {
                // error, display error message
                $ionicLoading.hide();
                $scope.data.error = "Invalid user!";
            });
        }
    };

    $scope.cancel = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go("login");
    };

    $scope.$on('$ionicView.leave', function() {
        // clear variables
        $scope.data = {};
    });
});
