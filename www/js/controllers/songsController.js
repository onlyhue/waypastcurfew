app.controller("songsController", function($scope, $cordovaMedia, songsFactory, $q, $timeout) {
    var isApp = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;

    $scope.songsList = songsFactory;

    $scope.songs = {};

    $scope.playPause = function(id) {
        if ($scope.isPlaying(id)) {
            $scope.songs[id].isPlaying = false;
            $scope.songs[id].pause();
        } else {
            $scope.songs[id].isPlaying = true;
            $scope.songs[id].play();
        }
    };

    $scope.stop = function(id) {
        if (isApp) {
            $scope.songs[id].stop();
        } else {
            $scope.songs[id].pause();
            $scope.songs[id].currentTime = 0;
        }
        $scope.songs[id].isPlaying = false;
    };

    $scope.muteUnmute = function(id) {
        if ($scope.songs[id].isMuted) {
            $scope.songs[id].isMuted = false;
            if (isApp) {
                $scope.songs[id].setVolume(1.0);
            } else {
                $scope.songs[id].muted = false;
            }
        } else {
            $scope.songs[id].isMuted = true;
            if (isApp) {
                $scope.songs[id].setVolume(0.0);
            } else {
                $scope.songs[id].muted = true;
            }
        }
    };

    $scope.isPlaying = function (id) {
        return $scope.songs[id].isPlaying;
    };

    $scope.isMuted = function (id) {
        return $scope.songs[id].isMuted;
    }

    $scope.isLoaded = function(id) {
        return $scope.songs[id].isLoaded;
    }

    var load = function(song) {
        var defer = $q.defer();

        if (isApp) {
            $timeout(function() {
                $scope.playPause(song.id);
                $scope.playPause(song.id);
                $scope.stop(song.id);
                defer.resolve(song);
            }, 1000);
        } else {
            $scope.playPause(song.id);
            $scope.stop(song.id);
            song.addEventListener("ended", function() {
                $scope.$apply(function() {
                    $scope.stop(song.id);
                });
            });
            song.addEventListener("loadeddata", function () {
                $scope.$apply(function() {
                    $scope.songs[song.id].isLoaded = true;
                });
                defer.resolve(song);
            })
        }

        return defer.promise;
    }

    var mediaSuccess = function(id, status) {
        $scope.$apply(function() {
            $scope.songs[id].isLoaded = true;
        });
    };

    var mediaStatus = function(id, status) {
        if (status == 4) {
            $scope.$apply(function() {
                $scope.songs[id].isPlaying = false;
            });
        }
    };

    //songs assignment
    for (i = 0; i < $scope.songsList.length; i++) {
        var song;

        if (isApp) {
            song = new Media($scope.songsList[i].url, mediaSuccess, null, mediaStatus, i)
        } else {
            song = new Audio($scope.songsList[i].url);
            song.id = i;
        }

        $scope.songs[song.id] = song;

        load($scope.songs[song.id]);

        //set isPlaying to false
        $scope.songs[song.id].isPlaying = false;
        $scope.songs[song.id].isMuted = false;
    }
});