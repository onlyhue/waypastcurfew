app.controller("createController", function($scope, usersFactory, $state) {
    // retrieve firebase reference + authentication object
    var ref = usersFactory.getRef();
    var authObj = usersFactory.getAuthObj();

    // on page enter, prepare page based on facebook or email account
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.data = usersFactory.returnProfile();
        if ($scope.data.password == null) {
            // facebook account, capitalize first letter of gender
            $scope.data.gender = $scope.data.gender.charAt(0).toUpperCase() + $scope.data.gender.slice(1);
        } else {
            // email account, hide email and password fields
            $scope.hideEmail = true;
            $scope.hidePassword = true;
        }
    })

    // create account method
    $scope.create = function() {
        if ($scope.data.first_name == "" || $scope.data.first_name == null || $scope.data.last_name == "" || $scope.data.last_name == null || $scope.data.gender == "" || $scope.data.gender == null) {
            $scope.error = "Please complete all fields!";
        } else {
            authObj.$createUser({
                email: $scope.data.email,
                password: $scope.data.password
            }).then(function (userData) {
                // login to firebase
                return authObj.$authWithPassword({
                    email: $scope.data.email,
                    password: $scope.data.password
                });
            }).then(function (authData) {
                // account successfully logged in, set profile
                usersFactory.setProfile($scope.data.email, $scope.data.first_name, $scope.data.last_name, $scope.data.gender, $scope.data.picture, null);
                // push profile to firebase
                usersFactory.pushProfile();
                // go to main page
                $state.go("main");
            }).catch(function (error) {
                // error (most likely invalid password), display error message
                $scope.error = "Invalid password!";
            })
        }
    }
});