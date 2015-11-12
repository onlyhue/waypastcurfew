app.controller("loginController", function($scope, usersFactory, $state, $ionicLoading, $ionicViewSwitcher) {
    // on page enter, initiate data object, select mode and login listener
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.data = {};
        // register login listener
        usersFactory.registerListener().then(function(authData) {
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner><br>Logging in...'
            });
            usersFactory.pullProfile(authData.uid);
            var profile = usersFactory.getProfile();
            profile.$loaded().then(function(profile) {
                if (profile.displayName == null) {
                    if (authData.provider == "facebook") {
                        profile.displayName = authData.facebook.cachedUserProfile.first_name + " " + authData.facebook.cachedUserProfile.last_name;
                        profile.email = authData.facebook.email;
                    } else if (authData.provider == "google") {
                        profile.displayName = authData.google.cachedUserProfile.name;
                        profile.email = authData.google.email;
                    }
                    profile.$save();
                }
                $ionicViewSwitcher.nextDirection('forward');
                $state.go(usersFactory.getNextPage());
                $ionicLoading.hide();
            });
        })
    });

    $scope.main = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go("main");
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

    // google login method
    $scope.loginGoogle = function() {
        usersFactory.loginGoogle();
    };
});