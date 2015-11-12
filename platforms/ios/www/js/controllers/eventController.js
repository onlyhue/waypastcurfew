app.controller("eventController", function($scope, $state, $ionicLoading, $ionicViewSwitcher) {

        var myLatlng = new google.maps.LatLng(1.251746,103.818540);

        var mapOptions = {
            center: myLatlng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        map.setCenter(new google.maps.LatLng(1.251746,103.818540));

        navigator.geolocation.getCurrentPosition(function(pos) {
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(1.251746,103.818540),
                map: map,
                title: "My Location"
            });
        });

        $scope.map = map;

    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.data = {};
    });


    $scope.main = function() {
        $ionicViewSwitcher.nextDirection('none');
        $state.go("main");
    };

    $scope.aboutWPC = function() {
        $ionicViewSwitcher.nextDirection('none');
        $state.go("aboutWPC");
    };

    $scope.feedback = function() {
        $ionicViewSwitcher.nextDirection('none');
        $state.go("feedback");
    };

    $scope.voteSong = function() {
        $ionicViewSwitcher.nextDirection('none');
        $state.go("voteSong");
    };
});