app.controller("tracksController", function($scope, $q, $interval, tracksFactory, $state, $ionicLoading, $ionicViewSwitcher, $cordovaFile) {
    $scope.$on('$ionicView.enter', function() {
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner><br>Loading Song...'
        });
        $scope.data = {};
        $scope.data.song = tracksFactory.getSong();
        $scope.data.tracksList = tracksFactory.getTracks();
        $scope.data.tracks = [];
        $scope.data.loaded = false;
        $scope.data.loadedTracks = 0;
        $scope.data.masterTrack = {};
        $scope.data.duration = 0;
        $scope.data.position = 0;
        $scope.data.isPlayingAll = false;
        $scope.data.recordIcon = "ion-android-microphone";
        $scope.data.latestRecordingNumber = 1;
        $scope.data.tracksList.$loaded().then(function(tracks) {
            $scope.data.originalTracksLength = tracks.length;
            for (i = 0; i < tracks.length; i++) {
                var track;
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
        });
    });

    var isApp = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;

    var mediaSuccess = function(id) {
        if (!$scope.data.loaded) {
            $scope.data.loadedTracks++;
            $scope.data.tracks[id].startTime = 0;
            $scope.data.tracks[id].endTime = $scope.data.tracks[id].getDuration() * 1000;
            if ($scope.data.tracks[id].getDuration() * 1000 > $scope.data.duration) {
                $scope.data.duration = $scope.data.tracks[id].getDuration() * 1000;
                $scope.data.masterTrack = $scope.data.tracks[id];
            }
            if ($scope.data.loadedTracks == $scope.data.originalTracksLength) {
                listDir(cordova.file.documentsDirectory + $scope.data.song.uid + "/" + tracksFactory.getArtistTitle() + "/recordings/");
                function listDir(path) {
                    window.resolveLocalFileSystemURL(path,
                        function(fileSystem) {
                            var reader = fileSystem.createReader();
                            reader.readEntries(
                                function(entries) {
                                    $scope.data.assigner = $scope.data.originalTracksLength;
                                    for (i = 0; i < entries.length; i++) {
                                        if (entries[i].isFile && entries[i].name.substring(entries[i].name.indexOf(".")) == ".wav") {
                                            $scope.data.recordingNumber = parseInt(entries[i].name.substring(0, entries[i].name.indexOf(".")));
                                            $scope.data.tracks[$scope.data.loadedTracks] = new Media("documents://" + $scope.data.song.uid + "/" + tracksFactory.getArtistTitle() + "/recordings/" + $scope.data.recordingNumber + ".wav", function(){}, null, mediaStatusRecording, $scope.data.tracks.length);
                                            $scope.data.tracks[$scope.data.loadedTracks].play();
                                            $scope.data.tracks[$scope.data.loadedTracks].stop();
                                            $scope.data.tracks[$scope.data.loadedTracks].icon = "ion-music-note";
                                            $scope.data.tracks[$scope.data.loadedTracks].label = $scope.data.recordingNumber.toString();
                                            $scope.data.tracks[$scope.data.loadedTracks].title = "recording";
                                            $scope.data.tracks[$scope.data.loadedTracks].isPlaying = true;
                                            $scope.data.tracks[$scope.data.loadedTracks].withinNewSeek = false;
                                            $scope.data.tracks[$scope.data.loadedTracks].isRecording = true;
                                            $scope.data.tracks[$scope.data.loadedTracks].recordingNumber = angular.copy($scope.data.recordingNumber);
                                            $scope.data.loadedTracks++;
                                            if ($scope.data.recordingNumber >= $scope.data.latestRecordingNumber) {
                                                $scope.data.latestRecordingNumber = $scope.data.recordingNumber + 1;
                                            }
                                            $cordovaFile.readAsText(cordova.file.documentsDirectory + $scope.data.song.uid + "/" + tracksFactory.getArtistTitle() + "/recordings/", $scope.data.recordingNumber + ".txt")
                                                .then(function(success) {
                                                    $scope.data.tracks[$scope.data.assigner].startTime = success.substring(0, success.indexOf("."));
                                                    $scope.data.tracks[$scope.data.assigner].endTime = success.substring(success.indexOf(".") + 1);
                                                    $scope.data.assigner++;
                                                }, function(error) {
                                                    console.log(error);
                                                });
                                        }
                                    }
                                    $cordovaFile.createFile(cordova.file.documentsDirectory + $scope.data.song.uid + "/" + tracksFactory.getArtistTitle() + "/recordings/", $scope.data.latestRecordingNumber + ".wav", false)
                                        .then(function(success) {
                                            $scope.data.newRecording = new Media("documents://" + $scope.data.song.uid + "/" + tracksFactory.getArtistTitle() + "/recordings/" + $scope.data.latestRecordingNumber + ".wav", function(){}, null, mediaStatusRecording, $scope.data.tracks.length);
                                            $scope.data.newRecording.play();
                                            $scope.data.newRecording.stop();
                                            $ionicLoading.hide();
                                            $scope.data.loaded = true;
                                        }, function(error) {
                                            $scope.data.newRecording = new Media("documents://" + $scope.data.song.uid + "/" + tracksFactory.getArtistTitle() + "/recordings/" + $scope.data.latestRecordingNumber + ".wav", function(){}, null, mediaStatusRecording, $scope.data.tracks.length);
                                            $scope.data.newRecording.play();
                                            $scope.data.newRecording.stop();
                                            $ionicLoading.hide();
                                            $scope.data.loaded = true;
                                        });
                                }, function(error) {
                                    console.log(error);
                                });
                        }, function(error) {
                            console.log(error);
                        });
                }
            }
        }
    };

    var mediaStatus = function(id, status) {
        if ($scope.data.tracks[id] == $scope.data.masterTrack) {
            if (status == 4) {
                $scope.data.position = 0;
                $scope.data.isPlayingAll = false;
                if ($scope.data.nowRecording) {
                    $scope.stopRecording();
                    $scope.data.tracks[$scope.data.loadedTracks - 1].endTime = $scope.data.duration;
                }
            }
        }
    };

    var mediaStatusRecording = function(id, status) {
        if (status == 4) {
            $scope.data.tracks[id].isPlaying = false;
        }
    };

    var load = function(track) {
        track.isMuted = false;
        if (isApp) {
            track.setVolume(0.0);
            track.play();
            $scope.stop(track);
            track.setVolume(1.0);
        } else {
            track.play();
            $scope.stop(track);
            track.addEventListener("loadeddata", function() {
                if (!$scope.data.loaded) {
                    $scope.data.loadedTracks++;
                    if (track.duration * 1000 > $scope.data.duration) {
                        $scope.data.duration = track.duration * 1000;
                        $scope.data.masterTrack = track;
                    }
                    if ($scope.data.loadedTracks == $scope.data.originalTracksLength) {
                        $scope.data.masterTrack.addEventListener("ended", function() {
                            $scope.stopAll();
                        });
                        $ionicLoading.hide();
                        $scope.data.loaded = true;
                    }
                }
            })
        }
    };

    $scope.stop = function(track) {
        if (isApp) {
            track.stop();
            track.seekTo(0);
        } else {
            track.pause();
            track.currentTime = 0;
        }
    };

    $scope.muteUnmute = function(id) {
        track = $scope.data.tracks[id];
        track.isMuted = !track.isMuted;
        if (track.isMuted) {
            track.color = "#F3F3F3";
            track.iconColor = "#F3F3F3";
            track.background = "#FFFFFF";
            if (isApp) {
                track.setVolume(0.0);
            } else {
                track.muted = true;
            }
        } else {
            track.color = "#19BFEF";
            track.iconColor = "#FFFFFF";
            track.background = "#19BFEF";
            if (isApp) {
                track.setVolume(1.0);
            } else {
                track.muted = false;
            }
        }
    };

    $scope.seeking = function() {
        $interval.cancel($scope.data.seeker);
        if ($scope.data.nowRecording) {
            $scope.stopRecording();
        }
    };

    $scope.positionChange = function() {
        for (i = 0; i < $scope.data.originalTracksLength; i++) {
            if (isApp) {
                $scope.data.tracks[i].seekTo($scope.data.position);
            } else {
                $scope.data.tracks[i].currentTime = $scope.data.position / 1000;
            }
        }
        for (i = $scope.data.originalTracksLength; i < $scope.data.tracks.length; i++) {
            $scope.data.tracks[i].withinNewSeek = true;
        }
        $interval.cancel($scope.data.seeker);
        $scope.data.seeker = $interval(function() {
            if (isApp) {
                $scope.data.masterTrack.getCurrentPosition(function(position) {
                    if (position == -1) {
                        $interval.cancel($scope.data.seeker);
                    } else {
                        $scope.data.position = position * 1000;
                        for (i = $scope.data.originalTracksLength; i < $scope.data.tracks.length; i++) {
                            if (!$scope.data.tracks[i].isPlaying && $scope.data.position >= $scope.data.tracks[i].startTime && $scope.data.position < $scope.data.tracks[i].endTime) {
                                $scope.data.tracks[i].seekTo($scope.data.position - $scope.data.tracks[i].startTime);
                                $scope.data.tracks[i].isPlaying = true;
                                $scope.data.tracks[i].play();
                            } else if ($scope.data.tracks[i].isPlaying && ($scope.data.position < $scope.data.tracks[i].startTime || $scope.data.position >= $scope.data.tracks[i].endTime)) {
                                $scope.data.tracks[i].stop();
                            } else if ($scope.data.tracks[i].withinNewSeek && $scope.data.tracks[i].isPlaying && $scope.data.position >= $scope.data.tracks[i].startTime && $scope.data.position < $scope.data.tracks[i].endTime) {
                                $scope.data.tracks[i].withinNewSeek = false;
                                $scope.data.tracks[i].seekTo($scope.data.position - $scope.data.tracks[i].startTime);
                            }
                        }
                    }
                });
            } else {
                $scope.data.position = $scope.data.masterTrack.currentTime * 1000;
            }
        }, 50);
    };

    $scope.playPauseAll = function() {
        if ($scope.data.nowRecording) {
            $scope.stopRecording();
        }
        $scope.data.isPlayingAll = !$scope.data.isPlayingAll;
        if ($scope.data.isPlayingAll) {
            for (i = 0; i < $scope.data.originalTracksLength; i++) {
                $scope.data.tracks[i].play();
            }
            $scope.data.seeker = $interval(function() {
                if (isApp) {
                    $scope.data.masterTrack.getCurrentPosition(function(position) {
                        if (position == -1) {
                            $interval.cancel($scope.data.seeker);
                        } else {
                            $scope.data.position = position * 1000;
                            for (i = $scope.data.originalTracksLength; i < $scope.data.tracks.length; i++) {
                                if (!$scope.data.tracks[i].isPlaying && $scope.data.position >= $scope.data.tracks[i].startTime && $scope.data.position < $scope.data.tracks[i].endTime) {
                                    $scope.data.tracks[i].seekTo($scope.data.position - $scope.data.tracks[i].startTime);
                                    $scope.data.tracks[i].isPlaying = true;
                                    $scope.data.tracks[i].play();
                                }
                            }
                        }
                    });
                } else {
                    $scope.data.position = $scope.data.masterTrack.currentTime * 1000;
                }
            }, 50);
        } else {
            for (i = 0; i < $scope.data.tracks.length; i++) {
                $scope.data.tracks[i].pause();
            }
            for (i = $scope.data.originalTracksLength; i < $scope.data.tracks.length; i++) {
                $scope.data.tracks[i].isPlaying = false;
            }
            $interval.cancel($scope.data.seeker);
        }
    };

    $scope.stopAll = function() {
        $interval.cancel($scope.data.seeker);
        if ($scope.data.nowRecording) {
            $scope.stopRecording();
        }
        for (i = 0; i < $scope.data.tracks.length; i++) {
            $scope.stop($scope.data.tracks[i]);
        }
        $scope.data.position = 0;
        $scope.data.isPlayingAll = false;
        for (i = $scope.data.originalTracksLength; i < $scope.data.tracks.length; i++) {
            $scope.data.tracks[i].isPlaying = false;
        }
    };

    $scope.songsPage = function() {
        $scope.stopAll();
        if (isApp) {
            for (i = 0; i < $scope.data.tracks.length; i++) {
                $scope.data.tracks[i].release();
            }
            $scope.data.newRecording.release();
        }
        $scope.data = {};
        $ionicViewSwitcher.nextDirection('back');
        $state.go("songs");
    };

    $scope.startRecording = function() {
        $scope.data.tracks[$scope.data.loadedTracks] = $scope.data.newRecording;
        $scope.data.tracks[$scope.data.loadedTracks].icon = "ion-music-note";
        $scope.data.tracks[$scope.data.loadedTracks].label = $scope.data.latestRecordingNumber.toString();
        $scope.data.tracks[$scope.data.loadedTracks].title = "recording";
        $scope.data.tracks[$scope.data.loadedTracks].isPlaying = true;
        $scope.data.tracks[$scope.data.loadedTracks].withinNewSeek = true;
        $scope.data.tracks[$scope.data.loadedTracks].startRecord();
        $scope.data.tracks[$scope.data.loadedTracks].startTime = parseInt($scope.data.position);
        $scope.data.nowRecording = true;
        $scope.data.loadedTracks++;
        $scope.data.recordIcon = "ion-android-microphone-off";
    };

    $scope.stopRecording = function() {
        $scope.data.nowRecording = false;
        $scope.data.tracks[$scope.data.loadedTracks - 1].stopRecord();
        $scope.data.tracks[$scope.data.loadedTracks - 1].endTime = parseInt($scope.data.position) - 250;
        $scope.data.tracks[$scope.data.loadedTracks - 1].isPlaying = false;
        $scope.data.tracks[$scope.data.loadedTracks - 1].isRecording = true;
        $scope.data.latestRecordingNumber++;
        $scope.data.recordIcon = "ion-android-microphone";
        $cordovaFile.writeFile(cordova.file.documentsDirectory + $scope.data.song.uid + "/" + tracksFactory.getArtistTitle() + "/recordings/", $scope.data.latestRecordingNumber - 1 + ".txt",  + $scope.data.tracks[$scope.data.loadedTracks - 1].startTime + "." + $scope.data.tracks[$scope.data.loadedTracks - 1].endTime, false)
            .then(function(success) {
                // do nothing
            }, function(error) {
                console.log(error);
            });
        $cordovaFile.createFile(cordova.file.documentsDirectory + $scope.data.song.uid + "/" + tracksFactory.getArtistTitle() + "/recordings/", $scope.data.latestRecordingNumber + ".wav", false)
            .then(function(success) {
                $scope.data.newRecording = new Media("documents://" + $scope.data.song.uid + "/" + tracksFactory.getArtistTitle() + "/recordings/" + $scope.data.latestRecordingNumber + ".wav", function(){}, null, mediaStatusRecording, $scope.data.tracks.length);
                $scope.data.newRecording.play();
                $scope.data.newRecording.stop();
            }, function(error) {
                console.log(error);
            });
    };

    $scope.recordButton = function() {
        if ($scope.data.nowRecording) {
            $scope.stopRecording();
        } else {
            if (!$scope.data.isPlayingAll) {
                $scope.playPauseAll();
            }
            $scope.startRecording();
        }
    };

    $scope.deleteRecording = function(key) {
        console.log($scope.data.tracks[key].recordingNumber);
        $scope.data.loadedTracks--;
        $scope.data.tracks.splice(key, 1);
    }
});