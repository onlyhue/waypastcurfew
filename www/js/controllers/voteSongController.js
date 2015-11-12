app.controller("voteSongController", function($scope, $state, $ionicModal, votesFactory, $ionicViewSwitcher) {
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.data = {};
        $scope.data.votes = votesFactory.getVotes();
    });

    $scope.main = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go("main");
    };

    $scope.voteSong = function(key) {
        $scope.data.votes[key].voteCount++;
        $scope.data.votes.$save();
        $scope.modal.show()
    };

    $ionicModal.fromTemplateUrl('templates/voteSongOverlay.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.hide = function() {
        $scope.modal.hide();
    };

    $scope.feedback = function() {
        $ionicViewSwitcher.nextDirection('none');
        $state.go("feedback");
    };

    $scope.aboutWPC = function() {
        $ionicViewSwitcher.nextDirection('none');
        $state.go("aboutWPC");
    };

    $scope.events = function() {
        $ionicViewSwitcher.nextDirection('none');
        $state.go("events");
    };
});