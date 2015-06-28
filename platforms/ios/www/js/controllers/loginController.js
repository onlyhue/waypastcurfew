app.controller("loginController", function($scope, usersFactory, $firebaseAuth, $state, $ionicViewSwitcher) {
    $scope.email = true;
    $scope.facebook = false;
    $scope.create = false;

    $scope.loginMode = function(mode) {
        if (mode == "email") {
            $scope.email = true;
            $scope.facebook = false;
            $scope.create = false;
        } else if (mode == "facebook") {
            $scope.email = false;
            $scope.facebook = true;
            $scope.create = false;
        } else if (mode == "create") {
            $scope.email = false;
            $scope.facebook = false;
            $scope.create = true;
        }
    }

    var ref = usersFactory.$ref();
    var authObj = $firebaseAuth(ref);

    $scope.loginFB = function() {
        if (!window.cordova) {
            // Initialize - only executed when testing in the browser.
            facebookConnectPlugin.browserInit(120329051634496);
        }

        facebookConnectPlugin.login(['email'], function(status) {
            facebookConnectPlugin.getAccessToken(function(token) {
                // Authenticate with Facebook using an existing OAuth 2.0 access token
                authObj.$authWithOAuthToken("facebook", token, function(error, authData) {
                    if (error) {
                        console.log('Firebase login failed!', error);
                    } else {
                        console.log('Authenticated successfully with payload:', authData);
                    }
                });
            }, function(error) {
                console.log('Could not get access token', error);
            });
        }, function(error) {
            console.log('An error occurred logging the user in', error);
        });

        authObj.$onAuth(function(authData) {
            if (authData === null) {
                // do nothing
            } else {
                var snapShot;
                ref.once('value', function(dataSnapshot) {
                    snapshot = dataSnapshot;
                });
                if (!snapshot.child(authData.facebook.email.replace(/\./g, '')).exists()) {
                    authObj.$createUser({
                        email: authData.facebook.email,
                        password: $scope.data.password
                    });
                    var profile = {
                        first_name: authData.facebook.cachedUserProfile.first_name,
                        last_name: authData.facebook.cachedUserProfile.last_name,
                        email: authData.facebook.cachedUserProfile.email,
                        gender: authData.facebook.cachedUserProfile.gender,
                        picture: authData.facebook.cachedUserProfile.picture.data.url
                    };
                    ref.child(authData.facebook.email.replace(/\./g, '')).set(profile);
                }
            }
        })
    };

    authObj.$onAuth(function(authData) {
        if (authData === null) {
        } else {
            $scope.error = "";
            $ionicViewSwitcher.nextDirection('none');
            $state.go('main');
        }
    })

    $scope.data = {};

    $scope.loginEmail = function() {
        authObj.$authWithPassword({
            email: $scope.data.email,
            password: $scope.data.password
        }).then(function(authData) {
            $scope.data.email = "";
            $scope.data.password = "";
        }).catch(function(error) {
            console.error("Authentication failed:", error);
            $scope.error = "Invalid email or password!";
        });
    }
});