app.controller("mainController", function($scope, usersFactory, $firebaseAuth) {
    var ref = usersFactory.$ref();
    var authObj = $firebaseAuth(ref);

    authObj.$onAuth(function(authData) {
        if (authData !== null) {
            try {
                ref.child(authData.password.email.replace(/\./g, '')).on("value", function (snapshot) {
                    var snapshot = snapshot.val();
                    $scope.first_name = snapshot.first_name;
                    $scope.last_name = snapshot.last_name;
                });
            } catch(error) {
                ref.child(authData.facebook.email.replace(/\./g, '')).on("value", function (snapshot) {
                    var snapshot = snapshot.val();
                    $scope.first_name = snapshot.first_name;
                    $scope.last_name = snapshot.last_name;
                });
            }
        }
    });
});