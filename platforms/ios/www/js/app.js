var io = Ionic.io();
var user = Ionic.User.current();
var app = angular.module("starter", ["ionic",'ionic.service.core','ionic.service.analytics', "firebase", "ngCordova"])

    .run(function($ionicPlatform, $cordovaStatusbar, $ionicAnalytics) {
        $ionicPlatform.ready(function() {

            /*$ionicAnalytics.setGlobalProperties({
                timestamp: Date.now()
            });

            $ionicAnalytics.register();*/

            $ionicAnalytics.register({

             // Don't send any events to the analytics backend.
             // (useful during development)
             dryRun: true

             });

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

    .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider) {
        $stateProvider

            .state('main', {
                url: '/main',
                templateUrl: 'templates/main.html',
                controller: 'mainController'
            })

            .state('tracks', {
                url: '/tracks',
                templateUrl: 'templates/tracks.html',
                controller: 'tracksController'
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

            .state('voteSong', {
                url: '/voteSong',
                templateUrl: 'templates/voteSong.html',
                controller: 'voteSongController'
            })

            .state('feedback', {
                url: '/feedback',
                templateUrl: 'templates/feedback.html',
                controller: 'feedbackController'
            });

        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|chrome-extension):|data:image\//);

        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);

        $urlRouterProvider.otherwise('/main');

        $ionicConfigProvider.views.forwardCache(true);
        $ionicConfigProvider.views.swipeBackEnabled(false);
    });

try {
    // ios
    cordova.plugins.Keyboard.disableScroll(true);
} catch (error) {
    // browser
}