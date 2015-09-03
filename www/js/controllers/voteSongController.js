app.controller("voteSongController", function($scope, $state, $ionicViewSwitcher, songsFactory, votesFactory) {
    $scope.data = {};
    var userID;

    $scope.$on('$ionicView.beforeEnter', function() {
        songsFactory.getClientSongs().$loaded().then(function(data) {
            $scope.data.songs = angular.copy(data);
            votesFactory.getVotes().$loaded().then(function(data) {
                $scope.data.votes = data;
                angular.forEach($scope.data.votes, function(value, key) {
                    $scope.data.songs[key].selected = value;
                })
            });
        });
    });

    $scope.main = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go("main");
    };

    $scope.voteSong = function(key) {
        if ($scope.data.songs[key].selected) {
            $scope.data.votes[key] = false;
        } else {
            $scope.data.votes[key] = true;
        }
        $scope.data.votes.$save();
        $scope.data.songs[key].selected = !$scope.data.songs[key].selected;
    };
});
