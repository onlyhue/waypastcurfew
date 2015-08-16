var app = angular.module("starter", ["ionic", "firebase", "ngCordova"])

    .run(function($ionicPlatform, $cordovaStatusbar) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if(window.StatusBar) {
                $cordovaStatusbar.hide();
            }
        });
    })

    .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $stateProvider

            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'loginController'
            })

            .state('main', {
                url: '/main',
                templateUrl: 'templates/main.html',
                controller: 'mainController'
            })

            .state('profile', {
                url: '/profile',
                templateUrl: 'templates/profile.html',
                controller: 'profileController'
            })

            .state('create', {
                url: '/create',
                templateUrl: 'templates/create.html',
                controller: 'createController'
            })

            .state('tracks', {
                url: '/tracks',
                templateUrl: 'templates/tracks.html',
                controller: 'tracksController'
            })

            .state('forgot', {
                url: '/forgot',
                templateUrl: 'templates/forgot.html',
                controller: 'forgotController'
            })

            .state('songs', {
                url: '/songs',
                templateUrl: 'templates/songs.html',
                controller: 'songsController'
            });

        $urlRouterProvider.otherwise('/login');

        $ionicConfigProvider.views.forwardCache(true);
        $ionicConfigProvider.views.swipeBackEnabled(false);
    });

try {
    // ios
    cordova.plugins.Keyboard.disableScroll(true);
} catch (error) {
    // browser
}