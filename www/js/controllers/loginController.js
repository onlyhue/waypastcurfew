app.controller("loginController", function($scope, usersFactory, $state, $ionicLoading, songsFactory, votesFactory) {
    // on page enter, initiate data object, select mode and login listener
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.data = {};
        $scope.data.emailSelect = true;
        // register login listener
        usersFactory.registerListener().then(function(authData) {
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner><br>Logging in...'
            });
            if (authData.facebook != null) {
                // check for existing UID in firebase
                usersFactory.checkUID(authData.uid, function (UIDAvailable) {
                    if (UIDAvailable) {
                        // firebase account not created, update profile and go to main page
                        usersFactory.setProfile(authData.uid, authData.facebook.cachedUserProfile.first_name + " " + authData.facebook.cachedUserProfile.last_name, authData.facebook.email);
                        usersFactory.pushProfile();
                        $state.go("main");
                        $ionicLoading.hide();
                    } else {
                        // firebase account already created, pull profile and go to main page
                        songsFactory.pullSongs(authData.uid);
                        votesFactory.pullVotes(authData.uid);
                        usersFactory.pullProfile(authData.uid).then(function() {
                            $state.go("main");
                            $ionicLoading.hide();
                        });
                    }
                })
            } else {
                // login success, pull profile and go to main page
                songsFactory.pullSongs(authData.uid);
                votesFactory.pullVotes(authData.uid);
                usersFactory.pullProfile(authData.uid).then(function() {
                    $state.go("main");
                    $ionicLoading.hide();
                });
            }
        })
    });

    // select login mode method
    $scope.loginMode = function(mode) {
        $scope.data.error = "";
        if (mode == "email") {
            // email selected
            $scope.data.emailSelect = true;
            $scope.data.facebookSelect = false;
            $scope.data.createSelect = false;
        } else if (mode == "facebook") {
            // facebook selected
            $scope.data.emailSelect = false;
            $scope.data.facebookSelect = true;
            $scope.data.createSelect = false;
        } else if (mode == "create") {
            // create account selected
            $scope.data.emailSelect = false;
            $scope.data.facebookSelect = false;
            $scope.data.createSelect = true;
        }
    };

    // on page leave, unsubscribe listener + clear variables
    $scope.$on('$ionicView.leave', function() {
        // unregister login listener
        usersFactory.unregisterListener();
        // clear variables
        $scope.data = {};
    });

    // facebook login method
    $scope.loginFB = function() {
        // clear previous session
        facebookConnectPlugin.logout();
        // initialize plugin for browser
        if (!window.cordova) {
            facebookConnectPlugin.browserInit(998885986831037);
        }
        // firebase login with facebook access token
        facebookConnectPlugin.login(['email'], function(status) {
            facebookConnectPlugin.getAccessToken(function(token) {
                usersFactory.loginFacebook(token).then(function(authData) {
                    console.log('Authenticated successfully with payload:', authData);
                }, function(error) {
                    console.log('Firebase login failed!', error);
                })
            }, function(error) {
                console.log('Could not get access token', error);
            });
        }, function(error) {
            console.log('An error occurred logging the user in', error);
        })
    };

    // email login method
    $scope.loginEmail = function() {
        var re = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b$/;
        if ($scope.data.email == "" || $scope.data.email == null ||
            $scope.data.password == "" || $scope.data.password == null) {
            // incomplete field(s), display error message
            $scope.data.error = "Please complete all fields!";
        } else if (!re.test($scope.data.email)) {
            // invalid email, display error message
            $scope.data.error = "Invalid email!";
        } else {
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner><br>Logging in...'
            });
            // attempt firebase login
            usersFactory.loginEmail($scope.data.email, $scope.data.password).then(function () {
                // login success, go to main page (handled by login listener)
            }, function (error) {
                // login error, display error message
                $ionicLoading.hide();
                if (error.code == "INVALID_PASSWORD") {
                    $scope.data.error = "Invalid email or password!";
                } else {
                    $scope.data.error = "An error occured!";
                }
            });
        }
    };

    // create email account
    $scope.createAccount = function() {
        var re = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b$/;
        if ($scope.data.email == "" || $scope.data.email == null ||
            $scope.data.password == "" || $scope.data.password == null ||
            $scope.data.confirmPassword == "" || $scope.data.confirmPassword == null) {
            // incomplete field(s), display error message
            $scope.data.error = "Please complete all fields!";
        } else if (!re.test($scope.data.email)) {
            // invalid email, display error message
            $scope.data.error = "Invalid email!";
        } else if ($scope.data.password != $scope.data.confirmPassword) {
            // passwords don't match, display error message
            $scope.data.error = "Passwords do not match!";
        } else {
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner><br>Validating...'
            });
            usersFactory.createUser($scope.data.email, $scope.data.password).then(function(authData) {
                // success, set profile, push profile and go to main page
                usersFactory.setProfile(authData.uid, $scope.data.email.substring(0, $scope.data.email.indexOf("@")), $scope.data.email);
                usersFactory.pushProfile();
                $state.go("main");
                $ionicLoading.hide();
            }, function(error) {
                // email not available, display error message
                $ionicLoading.hide();
                if (error.code == "EMAIL_TAKEN") {
                    $scope.data.error = "Email already taken!";
                } else {
                    $scope.data.error = "An error occured!";
                }
            });
        }
    };
});
