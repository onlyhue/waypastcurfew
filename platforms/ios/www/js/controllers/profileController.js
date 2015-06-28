app.controller("profileController", function($scope, usersFactory, $firebaseAuth, $state) {
    var ref = usersFactory.$ref();
    var authObj = $firebaseAuth(ref);

    authObj.$onAuth(function(authData) {
        if (authData !== null) {
            try {
                ref.child(authData.password.email.replace(/\./g, '')).on("value", function (snapshot) {
                    var snapshot = snapshot.val();
                    $scope.picture = snapshot.picture;
                    $scope.first_name = snapshot.first_name;
                    $scope.last_name = snapshot.last_name;
                    $scope.email = snapshot.email;
                    $scope.gender = snapshot.gender;
                });
            } catch(error) {
                ref.child(authData.facebook.email.replace(/\./g, '')).on("value", function (snapshot) {
                    var snapshot = snapshot.val();
                    $scope.picture = snapshot.picture;
                    $scope.first_name = snapshot.first_name;
                    $scope.last_name = snapshot.last_name;
                    $scope.email = snapshot.email;
                    $scope.gender = snapshot.gender;
                });
            }
        }
    });

    $scope.logout = function() {
        authObj.$unauth();
        $state.go('login');
    }
});