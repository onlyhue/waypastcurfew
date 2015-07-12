app.controller("songsController", function($scope, $cordovaMedia, songsFactory, $q, $timeout, $interval) {
    $scope.songsList = songsFactory;
    $scope.songs = {};
    $scope.data = {};
    $scope.data.volume = 100;
    $scope.data.volumePercent = {};
    $scope.data.volumePercentTemp = {};
    $scope.data.position = 0;
    $scope.data.duration = 0;
    $scope.data.isPlayingAll = false;

    var isApp = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;

    var mediaSuccess = function(id, status) {
        $scope.$apply(function() {
            $scope.songs[id].isLoaded = true;
            if (isApp) {
                $scope.data.duration = Math.floor($scope.songs[id].getDuration() * 1000);
            }
        });
    };

    var mediaStatus = function(id, status) {
        if (status == 4) {
            $scope.$apply(function() {
                $scope.songs[id].isPlaying = false;
                $scope.data.position = 0;
                $scope.data.isPlayingAll = false;
            });
        }
    };

    $scope.playPause = function(id) {
        if ($scope.songs[id].isPlaying) {
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

    var load = function(song) {
        var defer = $q.defer();

        if (isApp) {
            $timeout(function() {
                $scope.playPause(song.id);
                $scope.stop(song.id);
                defer.resolve(song);
            }, 1000);
        } else {
            $scope.playPause(song.id);
            $scope.stop(song.id);
            song.addEventListener("ended", function() {
                $scope.stop(song.id);
                $scope.data.position = 0;
                $scope.data.isPlayingAll = false;
            });
            song.addEventListener("loadeddata", function () {
                $scope.songs[song.id].isLoaded = true;
                $scope.data.duration = Math.floor(song.duration * 1000);
                defer.resolve(song);
            })
        }

        return defer.promise;
    }

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

        $scope.songs[song.id].isMuted = false;
        $scope.data.volumePercent[song.id] = 100;
    }

    $scope.isLoaded = function(id) {
        return $scope.songs[id].isLoaded;
    }

    $scope.isMuted = function (id) {
        return $scope.songs[id].isMuted;
    }

    $scope.muteUnmute = function(id) {
        if ($scope.songs[id].isMuted) {
            $scope.songs[id].isMuted = false;
            if (isApp) {
                $scope.songs[id].setVolume($scope.data.volumePercentTemp[id] / 100);
            } else {
                $scope.songs[id].muted = false;
            }
        } else {
            $scope.songs[id].isMuted = true;
            if (isApp) {
                $scope.data.volumePercentTemp[id] = $scope.data.volumePercent[id];
                $scope.songs[id].setVolume(0.0);
            } else {
                $scope.songs[id].muted = true;
            }
        }
    };

    $scope.volumeChange = function(id) {
        if (isApp) {
            $scope.songs[id].setVolume($scope.data.volume / 100 * $scope.data.volumePercent[id] / 100);
        } else {
            $scope.songs[id].volume = $scope.data.volume / 100 * $scope.data.volumePercent[id] / 100;
        }
    }

    $scope.volumeChangeAll = function() {
        if (isApp) {
            for (var id in $scope.songs) {
                $scope.songs[id].setVolume($scope.data.volume / 100 * $scope.data.volumePercent[id] / 100);
            }
        } else {
            for (var id in $scope.songs) {
                $scope.songs[id].volume = $scope.data.volume / 100 * $scope.data.volumePercent[id] / 100;
            }
        }
    }

    $scope.positionChange = function() {
        if (isApp) {
            for (var id in $scope.songs) {
                $scope.songs[id].seekTo($scope.data.position);
            }
        } else {
            for (var id in $scope.songs) {
                $scope.songs[id].currentTime = $scope.data.position / 1000;
            }
        }
    }

    $scope.playPauseAll = function() {
        for (var id in $scope.songs) {
            $scope.playPause(id);
        }

        $scope.data.isPlayingAll = !$scope.data.isPlayingAll;

        if ($scope.data.isPlayingAll) {
            $scope.data.seeker = $interval(function() {
                if (isApp) {
                    $scope.songs[0].getCurrentPosition(function(position) {
                        if (position == -1) {
                            $interval.cancel($scope.data.seeker);
                        } else {
                            $scope.data.position = position * 1000;
                        }
                        $scope.ha = $scope.data.position;
                    });
                } else {
                    $scope.data.position = $scope.songs[0].currentTime * 1000;
                }
            }, 50);
        } else {
            $interval.cancel($scope.data.one);
        }
    }

    $scope.stopAll = function() {
        if (isApp) {
            for (var id in $scope.songs) {
                $scope.songs[id].stop();
            }
        } else {
            for (var id in $scope.songs) {
                $scope.songs[id].pause();
                $scope.songs[id].currentTime = 0;
            }
        }
        for (var id in $scope.songs) {
            $scope.songs[id].isPlaying = false;
        }
        $scope.data.isPlayingAll = false;
    }

    document.getElementById("lyrics").innerHTML = "Only you can make this world seem right\n\
                                                    Only you can make the darkness bright\n\
                                                    Only you and you alone can thrill me like you do\n\
                                                    And fill my heart with love for only you\n\
                                                    \n\
                                                    Only you can make this change in me\n\
                                                    For it's true, you are my destiny\n\
                                                    When you hold my hand I understand the magic that you do\n\
                                                    You're my dream come true, my one and only you\n\
                                                    \n\
                                                    Only you can make this change in me\n\
                                                    For it's true, you are my destiny\n\
                                                    When you hold my hand I understand the magic that you do\n\
                                                    You're my dream come true, my one and only you\n\
                                                    \n\
                                                    (One and only you)".replace(/\n/g, "<br>");

    $scope.records = {};
    for (i = 1; i < 6; i++) {
        $scope.records[i] = {};
        $scope.records[i].selected = false;
    }

    $scope.recordSelect = function(id) {
        $scope.records[id].selected = !$scope.records[id].selected;
    }
});