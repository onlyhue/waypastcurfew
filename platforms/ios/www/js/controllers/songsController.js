app.controller("songsController", function($scope, $state, songsFactory, tracksFactory, usersFactory, $ionicModal, $cordovaFileTransfer, $cordovaFile, $q) {
    // initialize data object
    $scope.data = {};
    $scope.data.availableSongs = {};
    $scope.data.clientSongs = songsFactory.getClientSongs();
    var clientUID = songsFactory.getClientUID();
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.data.clientSongs.$loaded().then(function (data) {
            angular.forEach(data, function (value, key) {
                $scope.data.availableSongs[key] = value;
                value.uploader = "WayPastCurfew";
                if (isApp) {
                    var songDownloaded = true;
                    tracksFactory.pullTracks(value.uid, key, value);
                    $scope.data.tracksList = tracksFactory.getTracks();
                    $scope.data.tracksList.$loaded().then(function (data) {
                        var deferred = $q.defer();
                        for (i = 0; i < data.length; i++) {
                            $cordovaFile.checkFile(cordova.file.documentsDirectory + usersFactory.returnProfile().uid.replace(/:/g, "") + "/" + value.uid + "/" + key + "/", data[i].track, i)
                                .then(function (success) {
                                    success.file(function (file) {
                                        if (file.lastModified < data[success.id].modified || file.size != data[success.id].size) {
                                            songDownloaded = false;
                                        }
                                        if (success.id == data.length - 1) {
                                            deferred.resolve();
                                        }
                                    });
                                }, function (error) {
                                    songDownloaded = false;
                                });
                        }
                        return deferred.promise;
                    }).then(function () {
                        if (songDownloaded) {
                            $scope.data.downloadedSongs[key] = angular.copy($scope.data.songs[key]);
                            delete $scope.data.availableSongs[key];
                        }
                    });
                }
            })
        });
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
            if ($scope.data.song != null) {
                $scope.data.song.pause();
            }
        }
        $scope.data.song = null;
    });

    $scope.hide = function() {
        $scope.modal.hide();
    };

    $scope.details = function(key) {
        $scope.modal.show();
        $scope.data.selectedSong = $scope.data.songs[key];
    };

    $scope.downloadOrPlay = function(key, song) {
        if ($scope.data.available) {
            if (isApp) {
                if (!song.downloading) {
                    song.downloading = true;
                    tracksFactory.pullTracks(song.uid, key, song);
                    $scope.data.tracksList = tracksFactory.getTracks();
                    $scope.data.tracksList.$loaded().then(function (data) {
                        var downloadedTracks = 0;
                        var individualProgress = [];
                        var totalProgress = 0;
                        var totalSize = 0;
                        song.percentageDone = 0;
                        for (i = 0; i < data.length; i++) {
                            totalSize += data[i].size;
                        }
                        for (i = 0; i < data.length; i++) {
                            $cordovaFileTransfer.download(decodeURI(data[i].url), (cordova.file.documentsDirectory + usersFactory.returnProfile().uid.replace(/:/g, "") + "/" + song.uid + "/" + key + "/" + data[i].track).replace(/ /g, "%20"), {id: i}, true)
                                .then(function (success) {
                                    song.percentageDone = null;
                                    downloadedTracks++;
                                    if (downloadedTracks == data.length) {
                                        song.downloading = false;
                                        $scope.data.downloadedSongs[key] = angular.copy($scope.data.songs[key]);
                                        delete $scope.data.availableSongs[key];
                                        delete $scope.data.songs[key];
                                    }
                                }, function (error) {
                                    console.log(error);
                                    $ionicLoading.hide();
                                }, function (progress) {
                                    totalProgress = 0;
                                    individualProgress[progress.id] = progress.loaded;
                                    for (i = 0; i < individualProgress.length; i++) {
                                        totalProgress += individualProgress[i];
                                    }
                                    song.percentageDone = Math.floor(totalProgress / totalSize * 100) + "%"
                                });
                        }
                    });
                }
            } else {
                $scope.data.downloadedSongs[key] = angular.copy($scope.data.songs[key]);
                delete $scope.data.availableSongs[key];
                delete $scope.data.songs[key];
            }
        } else {
            tracksFactory.pullTracks(song.uid, key, song);
            $state.go("tracks");
        }
    };

    $scope.search = function() {
        if ($scope.data.songsTemp != null) {
            $scope.data.songs = $scope.data.songsTemp;
        }
        $scope.data.songsTemp = angular.copy($scope.data.songs);
        $scope.data.songs = {};
        angular.forEach($scope.data.songsTemp, function(value, key) {
            if (key.indexOf($scope.data.search.toLowerCase()) != -1 || value.genre.toLowerCase().indexOf($scope.data.search.toLowerCase()) != -1) {
                $scope.data.songs[key] = angular.copy($scope.data.songsTemp[key]);
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
        var key = $scope.data.selectedSong.artist.toLowerCase() + " - " + $scope.data.selectedSong.title.toLowerCase();
        if (isApp) {
            $cordovaFile.removeRecursively(cordova.file.documentsDirectory + usersFactory.returnProfile().uid.replace(/:/g, "") + "/" + $scope.data.selectedSong.uid + "/" + key + "/", "")
                .then(function (success) {
                    $scope.data.availableSongs[key] = angular.copy($scope.data.selectedSong);
                    delete $scope.data.songs[key];
                    delete $scope.data.downloadedSongs[key];
                    $scope.modal.hide();
                }, function (error) {
                    console.log(error);
                    $scope.modal.hide();
                });
        } else {
            $scope.data.availableSongs[key] = angular.copy($scope.data.selectedSong);
            delete $scope.data.songs[key];
            delete $scope.data.downloadedSongs[key];
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
            $scope.data.song.play();
        }
    };
});
