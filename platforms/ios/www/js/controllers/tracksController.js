app.controller("tracksController", function($scope, $q, $timeout, $interval, tracksFactory, $state) {
    $scope.data = {};
    // on page enter, load song and tracks + reset defaults
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.data.song = tracksFactory.getSong();
        document.getElementById("lyrics").innerHTML = $scope.data.song.lyrics;
        $scope.data.tracksList = tracksFactory.getTracks();
        $scope.data.tracks = {};
        $scope.data.loaded = false;
        $scope.data.durations = [];
        $scope.data.duration = 0;
        $scope.data.tracksList.$loaded()
            .then(function() {
                //tracks assignment
                for (i = 0; i < $scope.data.tracksList.length; i++) {
                    var track = null;
                    if (isApp) {
                        track = new Media($scope.data.tracksList[i].url, mediaSuccess, null, mediaStatus, i);
                    } else {
                        track = new Audio($scope.data.tracksList[i].url);
                    }
                    $scope.data.tracks[i] = track;
                    $scope.data.tracks[i].icon = $scope.data.tracksList[i].icon;
                    $scope.data.tracks[i].label = $scope.data.tracksList[i].label;
                    load(track);
                }
            });
        $scope.data.position = 0;
        $scope.data.isPlayingAll = false;
        $scope.data.records = {};
        for (i = 1; i < 6; i++) {
            $scope.data.records[i] = {};
            $scope.data.records[i].selected = false;
        }
    });

    var isApp = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;

    var mediaSuccess = function(id) {
        if (!$scope.data.loaded) {
            $scope.$apply(function () {
                $scope.data.tracks[id].isLoaded = true;
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
            track.addEventListener("loadeddata", function () {
                if (!$scope.data.loaded) {
                    $scope.$apply(function () {
                        track.isLoaded = true;
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

    $scope.isLoaded = function(id) {
        return $scope.data.tracks[id].isLoaded;
    };

    $scope.muteUnmute = function(id) {
        track = $scope.data.tracks[id];
        if (track.isMuted) {
            track.isMuted = false;
            track.opacity = 1.0;
            if (isApp) {
                track.setVolume(1.0);
            } else {
                track.muted = false;
            }
        } else {
            track.isMuted = true;
            track.opacity = 0.25;
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

    $scope.recordSelect = function(id) {
        $scope.data.records[id].selected = !$scope.data.records[id].selected;
    };

    $scope.songsPage = function() {
        $scope.stopAll();
        if (isApp) {
            for (var id in $scope.data.tracks) {
                $scope.data.tracks[id].release();
            }
        }
        $scope.data = {};
        $state.go("songs");
    };
});
