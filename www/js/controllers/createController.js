app.controller("createController", function($scope, usersFactory, $firebaseAuth) {
    var ref = usersFactory.$ref();
    var authObj = $firebaseAuth(ref);

    $scope.data = {};

    $scope.create = function() {
        authObj.$createUser({
            email: $scope.data.email,
            password: $scope.data.password
        }).then(function (userData) {
            console.log("User " + $scope.data.email + " created successfully!");

            return authObj.$authWithPassword({
                email: $scope.data.email,
                password: $scope.data.password
            });
        }).then(function (authData) {
            console.log("Logged in as:", authData.password.email);

            var profile = {
                            first_name: $scope.data.first_name,
                            last_name: $scope.data.last_name,
                            email: $scope.data.email,
                            gender: $scope.data.gender,
                            picture: "",
                            uid: authData.uid
                        };

            ref.child(authData.password.email.replace(/\./g, '')).set(profile);
        }).catch(function (error) {
            console.error("Error: ", error);
            if (error.code == "EMAIL_TAKEN") {
                $scope.error = "Email taken!";
            } else {
                $scope.error = "Error!";
            }
        })
    };
});