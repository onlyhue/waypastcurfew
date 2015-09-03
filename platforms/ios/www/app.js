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
            })

            .state('aboutWPC', {
                url: '/aboutWPC',
                templateUrl: 'templates/aboutWPC.html',
                controller: 'aboutWPCController'
            })

            .state('myGroups', {
                url: '/myGroups',
                templateUrl: 'templates/myGroups.html',
                controller: 'myGroupsController'
            })

            .state('myAccount', {
                url: '/myAccount',
                templateUrl: 'templates/myAccount.html',
                controller: 'myAccountController'
            })

            .state('voteSong', {
                url: '/voteSong',
                templateUrl: 'templates/voteSong.html',
                controller: 'voteSongController'
            })

            .state('feedback', {
                url: '/feedback',
                templateUrl: 'templates/feedback.html',
                controller: 'feedbackController'
            })

            .state('upgrades', {
                url: '/upgrades',
                templateUrl: 'templates/upgrades.html',
                controller: 'upgradesController'
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