app.controller("loginController", function($scope, usersFactory, $state, $ionicLoading) {
    // selected login mode, default email
    $scope.email = true;
    $scope.facebook = false;
    $scope.create = false;

    // select login mode method
    $scope.loginMode = function(mode) {
        if (mode == "email") {
            // email selected
            $scope.email = true;
            $scope.facebook = false;
            $scope.create = false;
        } else if (mode == "facebook") {
            // facebook selected
            $scope.email = false;
            $scope.facebook = true;
            $scope.create = false;
        } else if (mode == "create") {
            // create account selected
            $scope.email = false;
            $scope.facebook = false;
            $scope.create = true;
        }
    }

    // retrieve firebase authentication object
    var authObj = usersFactory.getAuthObj();

    // facebook login listener
    var listener;

    // on page enter, initiate facebook login listener
    $scope.$on('$ionicView.enter', function() {
        $scope.data = {};

        // initiate facebook login listener
        listener = authObj.$onAuth(function(authData) {
            // check for logged in facebook account
            if (authData != null) {
                $ionicLoading.show({
                    template: '<ion-spinner></ion-spinner><br>Logging in...'
                });

                // check for existing facebook email in firebase
                try {
                    usersFactory.checkEmail(authData.facebook.email.replace(/\./g, ''), function (emailAvailable) {
                        if (emailAvailable) {
                            // firebase account not created, go to create page
                            $state.go("create");
                            $ionicLoading.hide();
                        } else {
                            // firebase account already created, go to main page
                            $state.go("main");
                            $ionicLoading.hide();
                        }
                        //update usersFactory profile
                        usersFactory.pullProfile(authData.facebook.email);
                    })
                } catch (error) {
                    // not logged in with facebook
                    usersFactory.pullProfile($scope.data.email);
                }
            }
            //clear variables
            $scope.data = {};
        })
    })

    // on page leave, unsubscribe listener + clear variables
    $scope.$on('$ionicView.leave', function() {
        // unsubscribe listener
        listener();

        // clear variables
        $scope.data = {};
        $scope.errorCreate = "";
        $scope.errorEmail = "";
    })

    // facebook login method
    $scope.loginFB = function() {
        // initialize plugin for browser
        if (!window.cordova) {
            facebookConnectPlugin.browserInit(120329051634496);
        }

        // firebase login with facebook access token
        facebookConnectPlugin.login(['email'], function(status) {
            facebookConnectPlugin.getAccessToken(function(token) {
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
        })
    }

    // email login method
    $scope.loginEmail = function() {
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner><br>Logging in...'
        });

        // firebase login with password
        authObj.$authWithPassword({
            email: $scope.data.email,
            password: $scope.data.password
        }).then(function() {
            $state.go("main");
            $ionicLoading.hide();
        }).catch(function(error) {
            $ionicLoading.hide();
            $scope.errorEmail = "Invalid email or password!";
        });
    }

    // email and password validation method
    $scope.validateEmail = function() {
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner><br>Validating...'
        });
        // check for existing email in firebase
        usersFactory.checkEmail($scope.data.email, function (emailAvailable) {
            if (emailAvailable) {
                // email available, validate password
                if ($scope.data.password != $scope.data.confirmPassword) {
                    // passwords not matching display error message
                    $scope.$apply(function () {
                        $scope.errorCreate = "Passwords do not match!";
                        $ionicLoading.hide();
                    })
                } else {
                    // email and password validated, go to next page
                    // ***ADD VALID-EMAIL VERIFICATION STEPS HERE***
                    $state.go("create");
                    $ionicLoading.hide();
                    usersFactory.setProfile($scope.data.email, null, null, null, null, $scope.data.password);
                }
            } else {
                // email not available, display error message
                $scope.$apply(function () {
                    $ionicLoading.hide();
                    $scope.errorCreate = "Email already exists!";
                })
            }
        });
    };
});