app.controller("feedbackController", function($scope, $state, songsFactory, feedbackFactory, $ionicViewSwitcher) {
    $scope.data = {};
    $scope.data.clientSongs = songsFactory.getClientSongs();

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
            if (selectedNodeSong.value != "SONG TITLE" && selectedNodeKey.value == "KEY") {
                $scope.data.message = "Please select a song!";
                return;
            } else if (selectedNodeSong.value == "SONG TITLE" && selectedNodeKey.value != "KEY") {
                $scope.data.message = "Please select a key!";
                return;
            }
            var feedback = {};
            feedback["song"] = selectedNodeSong.value;
            feedback["key"] = selectedNodeKey.value;
            if ($scope.data.newSong == null) {
                feedback["newSong"] = "";
            } else {
                feedback["newSong"] = $scope.data.newSong;
            }
            if ($scope.data.feedback == null) {
                feedback["feedback"] = "";
            } else {
                feedback["feedback"] = $scope.data.feedback;
            }
            feedbackFactory.addFeedback(feedback);
            document.getElementById("song").selectedIndex = "0";
            document.getElementById("key").selectedIndex = "0";
            $scope.data.newSong = "";
            $scope.data.feedback = "";
            $scope.data.message = "Your feedback has been submitted!";
        }
    };

    $scope.voteSong = function() {
        $ionicViewSwitcher.nextDirection('none');
        $state.go("voteSong");
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
