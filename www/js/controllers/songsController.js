app.controller("songsController", function($scope, $state, songsFactory, tracksFactory, $ionicModal, $cordovaFileTransfer, $cordovaFile, $q, $ionicLoading, $ionicAnalytics, $ionicViewSwitcher) {
    var isApp = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
    $scope.data = {};
    $scope.data.availableSongs = {};
    $scope.data.downloadedSongs = {};
    $scope.data.clientSongs = songsFactory.getClientSongs();

    // solves issue of endless loading
    $scope.data.clientSongs.$loaded().then(function(clientSongs) {
        clientSongs.$save();
    });

    $ionicLoading.show({
        template: '<ion-spinner></ion-spinner><br><br><span style="font-family: Aller Light; font-size: 0.8em;">LOADING SONGS...</span>'
    });

    $scope.data.clientSongs.$watch(function() {
        $scope.data.clientSongs.$loaded().then(function(clientSongs) {
            $scope.data.downloadedSongs = {};
            $scope.data.availableSongs = {};
            var numOfSongs = 0;
            angular.forEach(clientSongs, function(value, key) {
                numOfSongs++;
            });
            var promises = [];
            angular.forEach(clientSongs, function(song, artistTitle) {
                if (isApp) {
                    var songDownloaded = true;
                    tracksFactory.pullTracks(song.uid, artistTitle, song);
                    $scope.data.tracksList = tracksFactory.getTracks();
                    $scope.data.tracksList.$loaded().then(function(tracks) {
                        if (tracks.length == 0) {
                            numOfSongs--;
                            songDownloaded = null;
                        } else {
                            var deferred = $q.defer();
                            promises.push(deferred);
                            for (i = 0; i < tracks.length; i++) {
                                $cordovaFile.checkFile(cordova.file.documentsDirectory + song.uid + "/" + artistTitle + "/", tracks[i].track, i)
                                    .then(function(success) {
                                        success.file(function(file) {
                                            if (file.lastModified < tracks[success.id].modified || file.size != tracks[success.id].size) {
                                                songDownloaded = false;
                                            }
                                            if (success.id == tracks.length - 1) {
                                                deferred.resolve();
                                            }
                                        });
                                    }, function(error) {
                                        songDownloaded = false;
                                        deferred.resolve();
                                    });
                            }
                            if (promises.length == numOfSongs) {
                                $q.all(promises).then(function(data) {
                                    if ($scope.data.available) {
                                        $scope.data.songs = $scope.data.availableSongs;
                                    } else {
                                        $scope.data.songs = $scope.data.downloadedSongs;
                                    }
                                    $ionicLoading.hide();
                                });
                            }
                            return deferred.promise;
                        }
                    }).then(function() {
                        if (songDownloaded) {
                            $scope.data.downloadedSongs[artistTitle] = song;
                        } else if (songDownloaded == false) {
                            $scope.data.availableSongs[artistTitle] = song;
                        }
                    });
                } else {
                    $scope.data.availableSongs[artistTitle] = song;
                }
            });
            if (!isApp) {
                $scope.data.songs = $scope.data.availableSongs;
                $scope.data.downloadedSongs = {};
                $scope.available();
                $ionicLoading.hide();
                $scope.modal.hide();
            }
        });
    });
    $scope.data.search = "";
    $scope.data.available = true;
    $scope.data.downloaded = false;
    $scope.data.song = null;

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
            if ($scope.data.song != null) {
                $scope.data.song.pause();
            }
        }
        $scope.data.song = null;
    });

    $scope.hide = function() {
        $scope.modal.hide();
    };

    $scope.details = function(artistTitle) {
        $scope.modal.show();
        $scope.data.selectedSong = $scope.data.songs[artistTitle];
    };

    $scope.downloadOrPlay = function(artistTitle, song) {
        if ($scope.data.available) {
            if (isApp) {
                $ionicLoading.show({
                    template: '<ion-spinner></ion-spinner><br><br><span style="font-family: Aller Light; font-size: 0.8em;">DOWNLOADING...</span>'
                });
                tracksFactory.pullTracks(song.uid, artistTitle, song);
                $scope.data.tracksList = tracksFactory.getTracks();
                $scope.data.tracksList.$loaded().then(function(tracks) {
                    var downloadedTracks = 0;
                    var individualProgress = [];
                    var totalProgress = 0;
                    var totalSize = 0;
                    song.percentageDone = 0;
                    for (i = 0; i < tracks.length; i++) {
                        totalSize += tracks[i].size;
                    }
                    for (i = 0; i < tracks.length; i++) {
                        $cordovaFileTransfer.download(decodeURI(tracks[i].url), (cordova.file.documentsDirectory + song.uid + "/" + artistTitle + "/" + tracks[i].track).replace(/ /g, "%20"), {id: i}, true)
                            .then(function(success) {
                                song.percentageDone = null;
                                downloadedTracks++;
                                if (downloadedTracks == tracks.length) {
                                    $scope.data.downloadedSongs[artistTitle] = angular.copy($scope.data.songs[artistTitle]);
                                    delete $scope.data.availableSongs[artistTitle];
                                    delete $scope.data.songs[artistTitle];
                                    $cordovaFile.createDir(cordova.file.documentsDirectory + song.uid + "/" + artistTitle + "/", "recordings", false)
                                        .then(function(success) {
                                            // do nothing
                                        }, function(error) {
                                            console.log(error);
                                        });
                                    $ionicLoading.hide();
                                    $ionicAnalytics.track('Download', {
                                        song: {
                                            title: song.title,
                                            artist: song.artist
                                        }
                                    });
                                }
                            }, function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                            }, function(progress) {
                                totalProgress = 0;
                                individualProgress[progress.id] = progress.loaded;
                                for (i = 0; i < individualProgress.length; i++) {
                                    totalProgress += individualProgress[i];
                                }
                                song.percentageDone = Math.floor(totalProgress / totalSize * 100) + "%";
                            });
                    }
                });
            } else {
                $scope.data.downloadedSongs[artistTitle] = angular.copy($scope.data.songs[artistTitle]);
                delete $scope.data.availableSongs[artistTitle];
                delete $scope.data.songs[artistTitle];
                $ionicAnalytics.track('Download', {
                    song: {
                        title: song.title,
                        artist: song.artist
                    }
                });
            }
        } else {
            tracksFactory.pullTracks(song.uid, artistTitle, song);
            $ionicAnalytics.track('Playback', {
                song: {
                    title: song.title,
                    artist: song.artist
                }
            });
            removeBlankRecording(cordova.file.documentsDirectory + song.uid + "/" + artistTitle + "/recordings/");
            function removeBlankRecording(path) {
                window.resolveLocalFileSystemURL(path,
                    function(fileSystem) {
                        var reader = fileSystem.createReader();
                        reader.readEntries(
                            function(entries) {
                                if (entries.length %2 == 0) {
                                    $ionicViewSwitcher.nextDirection('forward');
                                    $state.go("tracks");
                                } else {
                                    $cordovaFile.removeFile(cordova.file.documentsDirectory + song.uid + "/" + artistTitle + "/recordings/", entries[entries.length - 1].name)
                                        .then(function (success) {
                                            $ionicViewSwitcher.nextDirection('forward');
                                            $state.go("tracks");
                                        }, function (error) {
                                            console.log(error);
                                        });
                                }
                            },
                            function(error) {
                                console.log(error);
                            });
                    }, function(error) {
                        console.log(error);
                    });
            }
        }
    };

    $scope.search = function() {
        if ($scope.data.songsTemp != null) {
            $scope.data.songs = $scope.data.songsTemp;
        }
        $scope.data.songsTemp = angular.copy($scope.data.songs);
        $scope.data.songs = {};
        angular.forEach($scope.data.songsTemp, function(song, artistTitle) {
            if (artistTitle.indexOf($scope.data.search.toLowerCase()) != -1 || song.label.toLowerCase().indexOf($scope.data.search.toLowerCase()) != -1) {
                $scope.data.songs[artistTitle] = angular.copy($scope.data.songsTemp[artistTitle]);
            }
        });
    };

    $scope.clear = function() {
        $scope.data.search = "";
        $scope.search();
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
        var artistTitle = $scope.data.selectedSong.artist.toLowerCase() + " - " + $scope.data.selectedSong.title.toLowerCase();
        if (isApp) {
            $cordovaFile.removeRecursively(cordova.file.documentsDirectory + $scope.data.selectedSong.uid + "/" + artistTitle + "/", "")
                .then(function(success) {
                    $scope.data.availableSongs[artistTitle] = angular.copy($scope.data.selectedSong);
                    delete $scope.data.songs[artistTitle];
                    delete $scope.data.downloadedSongs[artistTitle];
                    $ionicAnalytics.track('delete', {
                        song: {
                            title: $scope.data.selectedSong.title,
                            artist: $scope.data.selectedSong.artist
                        }
                    });
                    $scope.modal.hide();
                }, function(error) {
                    console.log(error);
                    $scope.modal.hide();
                });
        } else {
            $scope.data.availableSongs[artistTitle] = angular.copy($scope.data.selectedSong);
            delete $scope.data.songs[artistTitle];
            delete $scope.data.downloadedSongs[artistTitle];
            $ionicAnalytics.track('delete', {
                song: {
                    title: $scope.data.selectedSong.title,
                    artist: $scope.data.selectedSong.artist
                }
            });
            $scope.modal.hide();
        }
    };

    $scope.preview = function() {
        if ($scope.data.song == null) {
            if (isApp) {
                $scope.data.song = new Media($scope.data.selectedSong.preview, null, null, null, 0);
            } else {
                $scope.data.song = new Audio($scope.data.selectedSong.preview);
            }
            $ionicAnalytics.track('preview', {
                song: {
                    title: $scope.data.selectedSong.title,
                    artist: $scope.data.selectedSong.artist
                }
            });
            $scope.data.song.play();
        }
    };

    $scope.openItunes = function() {
        $ionicAnalytics.track('itunes', {
            song: {
                title: $scope.data.selectedSong.title,
                artist: $scope.data.selectedSong.artist
            },
            link: $scope.data.selectedSong.itunes
        });
        window.open($scope.data.selectedSong.itunes, '_system', 'location=yes');

    };

    $scope.openSpotify = function() {
        $ionicAnalytics.track('spotify', {
            song: {
                title: $scope.data.selectedSong.title,
                artist: $scope.data.selectedSong.artist
            },
            link: $scope.data.selectedSong.spotify
        });
        window.open($scope.data.selectedSong.spotify, '_system', 'location=yes');
    };

    $scope.main = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go("main");
    };
});