app.controller("forgotController", function($scope, usersFactory, $state, $ionicLoading, $timeout, $ionicViewSwitcher) {
    // retrieve firebase authentication object
    var authObj = usersFactory.getAuthObj();

    $scope.data = {};

    $scope.resetPassword = function() {
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner><br>Loading...'
        });
        authObj.$resetPassword({
            email: $scope.data.email
        }).then(function() {
            $ionicLoading.show({
                template: 'An email has been sent to ' + $scope.data.email + '!'
            });
            $state.go("login");
            $scope.data = {};
            $timeout(function() {
                $ionicLoading.hide();
            }, 3000);
        }).catch(function(error) {
            $ionicLoading.hide();
            $scope.data.error = "Invalid user!";
        });
    }

    $scope.cancel = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go("login");
        $scope.data = {};
    }
});