app.controller("voteSongController", function($scope, $state, $ionicViewSwitcher, votesFactory, usersFactory) {
    $scope.data = {};
    var userID;

    $scope.$on('$ionicView.beforeEnter', function() {
        votesFactory.getSongsFirebaseObj().$loaded().then(function(data) {
            $scope.data.songs = angular.copy(data);
            userID = usersFactory.returnProfile().email.replace(/\./g, '');
            votesFactory.assignRef(userID);
            $scope.data.votes = votesFactory.getVotesFirebaseObj();
            $scope.data.votes.$loaded().then(function(data) {
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