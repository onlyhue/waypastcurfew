app.controller("createController", function($scope, usersFactory, $state) {
    // on page enter, prepare page based on facebook or email account
    $scope.$on('$ionicView.beforeEnter', function() {
        // retrieve profile
        $scope.data = usersFactory.returnProfile();
        // check if password already entered
        if ($scope.data.password != null) {
            // email account, hide email and password fields
            $scope.data.hideEmail = true;
            $scope.data.hidePassword = true;
        } else {
            // facebook account, show email and password fields
            $scope.data.hideEmail = false;
            $scope.data.hidePassword = false;
        }
    });

    // create account method
    $scope.createUser = function() {
        // check if all fields are completed
        if ($scope.data.first_name == "" || $scope.data.first_name == null ||
            $scope.data.last_name == "" || $scope.data.last_name == null ||
            $scope.data.gender == "" || $scope.data.gender == null ||
            $scope.data.password == "" || $scope.data.password == null) {
            // incomplete field(s), display error message
            $scope.data.error = "Please complete all fields!";
        } else {
            // all fields are complete, create account
            usersFactory.createUser().then(function() {
                // success, push profile and go to main page
                usersFactory.pushProfile();
                $state.go("main");
            }, function(error) {
                // error, display error message
                $scope.data.error = "An error occured!";
                console.log(error);
            });
        }
    };

    // on page leave, clear variables
    $scope.$on('$ionicView.leave', function() {
        // clear variables
        $scope.data = {};
    });

    // cancel account creation
    $scope.cancel = function() {
        usersFactory.unauth();
        $state.go("login");
    }
});