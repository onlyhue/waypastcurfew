app.controller("profileController", function($scope, usersFactory, $firebaseAuth, $state) {
    // retrieve firebase authentication object
    var authObj = usersFactory.getAuthObj();

    // on page enter,
    $scope.$on('$ionicView.enter', function() {
        $scope.data = usersFactory.getProfile();
    })

    // logout method
    $scope.logout = function() {
        authObj.$unauth();
        $state.go("login");
    }
});