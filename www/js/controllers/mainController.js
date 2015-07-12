app.controller("mainController", function($scope, usersFactory, $firebaseAuth, $state) {
    // retrieve firebase reference + authentication object
    var ref = usersFactory.getRef();
    var authObj = usersFactory.getAuthObj();

    // redirect to login page if not logged in
    if(authObj.$getAuth() == null) {
        // not logged in, go to login page
        $state.go("login");
    } else {
        // this check is solely for the unlikely event that a new user logs in with facebook and then
        // closes the app before creating an account on firebase (i.e. at the create page)
        var email;
        try {
            // facebook account logged in
            email = authObj.$getAuth().facebook.email.replace(/\./g, '');
            ref.once("value", function(snapshot) {
                if(snapshot.child(email).val() == null) {
                    // facebook account not created, aunauth and go back to login page
                    authObj.$unauth();
                    $state.go("login");
                }
            });
        } catch (error) {
            // not a new facebook account, do nothing
        }
    }

    // on page enter, update user profile
    $scope.$on('$ionicView.enter', function() {
        $scope.data = usersFactory.getProfile();
        if (authObj.$getAuth() != null) {
            try {
                // facebook account logged in
                $scope.data.email = authObj.$getAuth().facebook.email;
            } catch (error) {
                // email account logged in
                $scope.data.email = authObj.$getAuth().password.email;
            }

            // update user profile
            ref.child($scope.data.email.replace(/\./g, '')).once("value", function(snapshot) {
                var profile = snapshot.val();
                if (profile != null) {
                    $scope.data.first_name = profile.first_name;
                    $scope.data.last_name = profile.last_name;
                    $scope.data.gender = profile.gender;
                    $scope.data.picture = profile.picture;
                }
            })
        }
    })
});