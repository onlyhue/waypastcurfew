app.controller("songsController", function($scope, $state, songsFactory, tracksFactory, $ionicModal) {
    // initialize data object
    $scope.data = {};
    $scope.data.availableSongs = songsFactory.getFirebaseObj();
    angular.forEach($scope.data.availableSongs, function(value, key) {
        $scope.data.availableSongs[key].downloaded = false;
    });
    $scope.data.downloadedSongs = {};
    $scope.data.songs = $scope.data.availableSongs;
    $scope.data.search = "";
    $scope.data.available = true;
    $scope.data.downloaded = false;
    var isApp = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
    $scope.data.song;

    $ionicModal.fromTemplateUrl('templates/songOverlay.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.$on('modal.hidden', function() {
        if (isApp) {
            $scope.data.song.stop();
            $scope.data.song.release();
        } else {
            $scope.data.song.pause();
        }
        $scope.data.song = null;
    });

    $scope.hide = function() {
        $scope.modal.hide();
    }

    $scope.details = function(key) {
        $scope.modal.show();
        $scope.data.selectedSong = $scope.data.songs[key];
    };

    $scope.downloadOrPlay = function(key, song) {
        if ($scope.data.available) {
            $scope.data.downloadedSongs[key] = angular.copy($scope.data.songs[key]);
            delete $scope.data.availableSongs[key];
            delete $scope.data.songs[key];
        } else {
            tracksFactory.assignRef(songsFactory.getUserID().replace(/\./g, ''), key, song);
            $state.go("tracks");
        }
    };

    $scope.search = function() {
        if ($scope.data.songsTemp != null) {
            $scope.data.songs = $scope.data.songsTemp;
        }
        $scope.data.songsTemp = angular.copy($scope.data.songs);
        $scope.data.songs = {}
        angular.forEach($scope.data.songsTemp, function(value, key) {
            if (key.indexOf($scope.data.search.toLowerCase()) != -1 || value.genre.toLowerCase().indexOf($scope.data.search.toLowerCase()) != -1) {
                $scope.data.songs[key] = angular.copy($scope.data.songsTemp[key]);
            }
        });
    };

    $scope.available = function() {
        $scope.data.available = true;
        $scope.data.downloaded = false;
        $scope.data.songs = $scope.data.availableSongs;
        $scope.data.songsTemp = null;
        $scope.search();
    };

    $scope.downloaded = function() {
        $scope.data.downloaded = true;
        $scope.data.available = false;
        $scope.data.songs = $scope.data.downloadedSongs;
        $scope.data.songsTemp = null;
        $scope.search();
    };

    $scope.delete = function() {
        var key = $scope.data.selectedSong.artist.toLowerCase() + " - " + $scope.data.selectedSong.title.toLowerCase();
        $scope.data.availableSongs[key] = angular.copy($scope.data.selectedSong);
        delete $scope.data.songs[key];
        delete $scope.data.downloadedSongs[key];
        $scope.modal.hide();
    };

    $scope.preview = function() {
        if ($scope.data.song == null) {
            if (isApp) {
                $scope.data.song = new Media($scope.data.selectedSong.url, mediaSuccess, null, mediaStatus, i);
            } else {
                $scope.data.song = new Audio($scope.data.selectedSong.url);
            }
            $scope.data.song.play();
        }
    }
});