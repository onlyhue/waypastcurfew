app.controller("feedbackController", function($scope, $state, $ionicViewSwitcher, songsFactory, feedbackFactory) {
    $scope.data = {};
    $scope.data.clientSongs = songsFactory.getClientFirebaseObj();

    $scope.main = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go("main");
    };

    $scope.submit = function() {
        $scope.data.message = "";
        var elemSong = document.getElementById("song");
        var selectedNodeSong = elemSong.options[elemSong.selectedIndex];
        var elemKey = document.getElementById("key");
        var selectedNodeKey = elemKey.options[elemKey.selectedIndex];
        if ((selectedNodeSong.value != "SONG TITLE")
            || (selectedNodeKey.value != "KEY")
            || ($scope.data.newSong != null && $scope.data.newSong != "")
            || ($scope.data.feedback != null && $scope.data.feedback != "")) {
            var feedback = {};
            feedback["song"] = selectedNodeSong.value;
            feedback["key"] = selectedNodeKey.value;
            feedback["newSong"] = $scope.data.newSong;
            feedback["feedback"] = $scope.data.feedback;
            feedbackFactory.addFeedback(feedback);
            document.getElementById("song").selectedIndex = "0";
            document.getElementById("key").selectedIndex = "0";
            $scope.data.newSong = "";
            $scope.data.feedback = "";
            $scope.data.message = "Your feedback has been submitted!";
        }
    };
});