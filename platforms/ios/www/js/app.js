var app = angular.module("starter", ["ionic", "firebase", "ngCordova"])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                StatusBar.styleDefault();
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

            .state('items', {
                url: '/items',
                templateUrl: 'templates/items.html',
                controller: 'itemsController'
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

            .state('songs', {
                url: '/songs',
                templateUrl: 'templates/songs.html',
                controller: 'songsController'
            })

            .state('forgot', {
                url: '/forgot',
                templateUrl: 'templates/forgot.html',
                controller: 'forgotController'
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