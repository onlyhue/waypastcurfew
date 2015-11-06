app.controller("announcementsController", function($scope, $state, $ionicViewSwitcher, $ionicModal) {
    $scope.myGroups = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go("myGroups");
    };

    $ionicModal.fromTemplateUrl('templates/announcementsOverlay.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.settings = function() {
        $scope.modal.show()
    };

    $scope.hide = function() {
        $scope.modal.hide();
    };

});