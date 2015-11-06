app.controller("tracksController", function($scope, $q, $interval, tracksFactory, $state, $ionicLoading, $timeout) {
    $scope.data = {};
    // on page enter, load song and tracks + reset defaults
    $scope.$on('$ionicView.beforeEnter', function() {
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner><br>Loading Song...'
        });
        $scope.data.song = tracksFactory.getSong();
        $scope.data.tracksList = tracksFactory.getTracks();
        $scope.data.tracks = {};
        $scope.data.loaded = false;
        $scope.data.durations = [];
        $scope.data.duration = 0;
        $scope.data.tracksList.$loaded().then(function(tracks) {
            //tracks assignment
            for (i = 0; i < tracks.length; i++) {
                var track = null;
                if (isApp) {
                    track = new Media("documents://" + $scope.data.song.uid + "/" + tracksFactory.getArtistTitle() + "/" + tracks[i].track, mediaSuccess, null, mediaStatus, i);
                } else {
                    track = new Audio(tracks[i].url);
                }
                $scope.data.tracks[i] = track;
                $scope.data.tracks[i].icon = tracks[i].icon;
                $scope.data.tracks[i].label = tracks[i].label;
                $scope.data.tracks[i].title = tracks[i].title;
                load(track);
            }
            $ionicLoading.hide();
        });
        $scope.data.position = 0;
        $scope.data.isPlayingAll = false;
    });

    var isApp = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;

    var mediaSuccess = function(id) {
        if (!$scope.data.loaded) {
            $scope.$apply(function() {
                $scope.data.durations.push($scope.data.tracks[id].getDuration());
                if ($scope.data.durations.length == $scope.data.tracksList.length) {
                    $scope.data.loaded = true;
                    $scope.data.duration = Math.max.apply(Math, $scope.data.durations) * 1000;
                }
            });
        }
    };

    var mediaStatus = function(id, status) {
        if (status == 4) {
            $scope.$apply(function() {
                $scope.data.tracks[id].isPlaying = false;
                $scope.data.position = 0;
                $scope.data.isPlayingAll = false;
            });
        }
    };

    var load = function(track) {
        track.isMuted = false;
        if (isApp) {
            track.setVolume(0.0);
            $scope.playPause(track);
            $scope.stop(track);
            track.setVolume(1.0);
        } else {
            $scope.playPause(track);
            $scope.stop(track);
            track.addEventListener("ended", function() {
                $scope.stop(track);
                $scope.data.position = 0;
                $scope.data.isPlayingAll = false;
            });
            track.addEventListener("loadeddata", function() {
                if (!$scope.data.loaded) {
                    $scope.$apply(function() {
                        $scope.data.durations.push(track.duration);
                        if ($scope.data.durations.length == $scope.data.tracksList.length) {
                            $scope.data.loaded = true;
                            $scope.data.duration = Math.max.apply(Math, $scope.data.durations) * 1000;
                        }
                    });
                }
            })
        }
    };

    $scope.playPause = function(track) {

        if (track.isPlaying) {
            track.pause();
            track.isPlaying = false;
        } else {
            track.play();
            track.isPlaying = true;
        }
    };

    $scope.stop = function(track) {
        if (isApp) {
            track.stop();
        } else {
            track.pause();
            track.currentTime = 0;
        }
        track.isPlaying = false;
    };

    $scope.muteUnmute = function(id) {
        track = $scope.data.tracks[id];
        if (track.isMuted) {
            track.isMuted = false;
            track.color = "#19BFEF";
            track.iconColor = "#FFFFFF";
            track.background = "#19BFEF";
            if (isApp) {
                track.setVolume(1.0);
            } else {
                track.muted = false;
            }
        } else {
            track.isMuted = true;
            track.color = "#F3F3F3";
            track.iconColor = "#F3F3F3";
            track.background = "#FFFFFF";
            if (isApp) {
                track.setVolume(0.0);
            } else {
                track.muted = true;
            }
        }
    };

    $scope.positionChange = function() {
        for (var id in $scope.data.tracks) {
            if (isApp) {
                $scope.data.tracks[id].seekTo($scope.data.position);
            } else {
                $scope.data.tracks[id].currentTime = $scope.data.position / 1000;
            }
        }
    };

    $scope.playPauseAll = function() {
        for (var id in $scope.data.tracks) {
            $scope.playPause($scope.data.tracks[id]);
        }

        $scope.data.isPlayingAll = !$scope.data.isPlayingAll;

        if ($scope.data.isPlayingAll) {
            $scope.data.seeker = $interval(function() {
                if (isApp) {
                    $scope.data.tracks[0].getCurrentPosition(function(position) {
                        if (position == -1) {
                            $interval.cancel($scope.data.seeker);
                        } else {
                            $scope.data.position = position * 1000;
                        }
                    });
                } else {
                    $scope.data.position = $scope.data.tracks[0].currentTime * 1000;
                }
            }, 50);
        } else {
            $interval.cancel($scope.data.seeker);
        }
    };

    $scope.stopAll = function() {
        $interval.cancel($scope.data.seeker);
        for (var id in $scope.data.tracks) {
            if (isApp) {
                $scope.data.tracks[id].stop();
            } else {
                $scope.data.tracks[id].pause();
                $scope.data.tracks[id].currentTime = 0;
            }
            $scope.data.tracks[id].isPlaying = false;
        }
        $scope.data.isPlayingAll = false;
    };

    $scope.songsPage = function() {

        $scope.stopAll();
        if (isApp) {
            for (var id in $scope.data.tracks) {
                $scope.data.tracks[id].release();
                //$scope.data.tracks[id] = {};
            }
        }$ionicLoading.show({
            template: '<ion-spinner></ion-spinner><br>Loading Song...'
        });
        $timeout(function() {
            $state.go("songs");
        }, 200);
        $ionicLoading.hide();
    };
});