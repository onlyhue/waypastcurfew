var io = Ionic.io();
var user = Ionic.User.current();
var app = angular.module("starter", ["ionic",'ionic.service.core','ionic.service.analytics', "firebase", "ngCordova", "ngIOS9UIWebViewPatch"])

    .run(function($ionicPlatform, $cordovaStatusbar, $ionicAnalytics, $cordovaGeolocation, mapFactory) {
        $ionicPlatform.ready(function() {

            var a = {};

            document.addEventListener("deviceready", onDeviceReady, false);
            function onDeviceReady() {
                var onSuccess = function(position) {
                    a["latitude"] = position.coords.latitude;
                    a["longitude"] = position.coords.longitude;
                    mapFactory.addCoordinates(a);
                };
                navigator.geolocation.getCurrentPosition(onSuccess);
            }


            /*$ionicAnalytics.setGlobalProperties({
                timestamp: Date.now(),
                latitude: a.latitude,
                longitude: a.longitude
            });

            //$ionicAnalytics.register();*/

           /* $ionicAnalytics.register({

             // Don't send any events to the analytics backend.
             // (useful during development)
             dryRun: true

             });*/

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
            })

            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'loginController'
            })

            .state('events', {
                url: '/events',
                templateUrl: 'templates/events.html',
                controller: 'eventController'
            })

            .state('myAccount', {
                url: '/myAccount',
                templateUrl: 'templates/myAccount.html',
                controller: 'myAccountController'
            })

            .state('groups', {
                url: '/groups',
                templateUrl: 'templates/groups.html',
                controller: 'groupsController'
            })

            .state('createGroup', {
                url: '/createGroup',
                templateUrl: 'templates/createGroup.html',
                controller: 'createGroupController'
            })

            .state('groupAnnouncements', {
                url: '/groupAnnouncements',
                templateUrl: 'templates/groupAnnouncements.html',
                controller: 'groupAnnouncementsController'
            })

            .state('groupInfo', {
                url: '/groupInfo',
                templateUrl: 'templates/groupInfo.html',
                controller: 'groupInfoController'
            })

            .state('leaveGroup', {
                url: '/leaveGroup',
                templateUrl: 'templates/leaveGroup.html',
                controller: 'leaveGroupController'
            })

            .state('groupMembers', {
                url: '/groupMembers',
                templateUrl: 'templates/groupMembers.html',
                controller: 'groupMembersController'
            })

            .state('createAnnouncement', {
                url: '/createAnnouncement',
                templateUrl: 'templates/createAnnouncement.html',
                controller: 'createAnnouncementController'
            })

            .state('groupSongs', {
                url: '/groupSongs',
                templateUrl: 'templates/groupSongs.html',
                controller: 'groupSongsController'
            })

            .state('groupSongsAssignment', {
                url: '/groupSongsAssignment',
                templateUrl: 'templates/groupSongsAssignment.html',
                controller: 'groupSongsController'
            })

            .state('groupTasks', {
                url: '/groupTasks',
                templateUrl: 'templates/groupTasks.html',
                controller: 'groupTasksController'
            })

            .state('groupTasksAssignment', {
                url: '/groupTasksAssignment',
                templateUrl: 'templates/groupTasksAssignment.html',
                controller: 'groupTasksController'
            })

            .state('groupTasksAssignment2', {
                url: '/groupTasksAssignment2',
                templateUrl: 'templates/groupTasksAssignment2.html',
                controller: 'groupTasksController'
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