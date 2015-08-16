app.controller("mainController", function($scope, $state, usersFactory, songsFactory) {
    $scope.songs = function() {
        songsFactory.assignRef(usersFactory.returnProfile().email.replace(/\./g, ''));
        $state.go("songs");
    }
});