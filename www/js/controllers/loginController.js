app.controller("loginController", function($scope, usersFactory, $state, $ionicLoading) {
    // initialize data object
    $scope.data = {};

    // on page enter, initiate select mode and facebook login listener
    $scope.$on('$ionicView.beforeEnter', function() {
        // default select mode
        $scope.data.emailSelect = true;
        // register login listener
        usersFactory.registerListener().then(function(authData) {
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner><br>Logging in...'
            });
            if (authData.facebook != null) {
                // check for existing facebook email in firebase
                usersFactory.checkEmail(authData.facebook.email.replace(/\./g, ''), function (emailAvailable) {
                    if (emailAvailable) {
                        // firebase account not created, update profile and go to create page
                        usersFactory.setProfile(authData.facebook.email,
                            authData.facebook.cachedUserProfile.first_name,
                            authData.facebook.cachedUserProfile.last_name,
                            authData.facebook.cachedUserProfile.gender.charAt(0).toUpperCase() +
                            authData.facebook.cachedUserProfile.gender.slice(1),
                            authData.facebook.cachedUserProfile.picture.data.url,
                            null);
                        $state.go("create");
                        $ionicLoading.hide();
                    } else {
                        // firebase account already created, update profile and go to main page
                        usersFactory.pullProfile(authData.facebook.email);
                        $state.go("main");
                        $ionicLoading.hide();
                    }
                })
            } else {
                // login success, go to main page
                $state.go("main");
                usersFactory.pullProfile(authData.password.email);
                $ionicLoading.hide();
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
            facebookConnectPlugin.browserInit(120329051634496);
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
                $scope.data.error = "Invalid email or password!";
            })
        }

    };

    // email and password validation method
    $scope.validateEmail = function() {
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
            // check for existing email in firebase
            usersFactory.checkEmail($scope.data.email, function (emailAvailable) {
                if (emailAvailable) {
                    // email available, go to create page
                    $state.go("create");
                    $ionicLoading.hide();
                    usersFactory.setProfile($scope.data.email, null, null, null, null, $scope.data.password);
                } else {
                    // email not available, display error message
                    $ionicLoading.hide();
                    $scope.data.error = "Email already taken!";
                }
            });
        }
    };
});