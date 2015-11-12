app.controller("eventController", function($scope, $state, $ionicLoading, $cordovaCamera, $ionicViewSwitcher, $ionicModal,  $http) {

    var myLatlng = new google.maps.LatLng(1.251746,103.818540);

    var mapOptions = {
        center: myLatlng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    if(document.getElementById("map") != null){
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        map.setCenter(new google.maps.LatLng(1.251746,103.818540));
    }


    navigator.geolocation.getCurrentPosition(function(pos) {
        var myLocation = new google.maps.Marker({
            position: new google.maps.LatLng(1.251746,103.818540),
            map: map,
            title: "My Location"
        });
    });

    $http.get('https://www.googleapis.com/calendar/v3/calendars/j3u2c2sicto9ohfgg6ikcu1vu0@group.calendar.google.com/events?key=AIzaSyDdeNcgfzHqEz0ut6ntWzlUIm-hRXO5iC0').then(function(resp) {
        console.log('Success', resp);
        $scope.data.events = resp.data.items;
        console.log($scope.data.events);
        // For JSON responses, resp.data contains the result
    }, function(err) {
        console.error('ERR', err);
        // err.status will contain the status code
    })

    $scope.map = map;


    $scope.image = 'img/wpc/Header.png';

    $scope.crop = function(image) {
        $jrCrop.crop({
            url: image,
            width: 400,
            height: 200
        }).then(function(canvas) {
            $ionicModal.fromTemplateUrl('result-cropped.html', function(modal) {
                $scope.modal = modal;

                modal.show().then(function() {
                    document.querySelector('.cropped-canvas').appendChild(canvas);
                });
            })
        });
    };

    $scope.myImage='';
    $scope.myCroppedImage='';

    var handleFileSelect=function(evt) {
        var file=evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function($scope){
                $scope.myImage=evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);

    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.data = {};
    });


    $scope.addPhoto = function() {
        $ionicViewSwitcher.nextDirection('none');
        $state.go("addPhoto");
    };

    $scope.viewGallery = function() {
        $ionicViewSwitcher.nextDirection('none');
        $state.go("viewGallery");
    };


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

    $scope.data = { "ImageURI" :  "Select Image" };

    $scope.takePicture = function() {
        var options = {
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URL,
            sourceType: Camera.PictureSourceType.CAMERA
        };
        $cordovaCamera.getPicture(options).then(
            function(imageData) {
                $scope.picData = imageData;
                $scope.image = imageData;
                $scope.ftLoad = true;
                $localstorage.set('fotoUp', imageData);
                $ionicLoading.show({template: 'Photo Captured...', duration:500});
            },
            function(err){
                $ionicLoading.show({template: 'Loading Error...', duration:500});
            })
    };

    $scope.selectPicture = function() {
        var options = {
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        };

        $cordovaCamera.getPicture(options).then(
            function(imageURI) {
                window.resolveLocalFileSystemURI(imageURI, function(fileEntry) {
                    $scope.picData = fileEntry.nativeURL;

                    $scope.ftLoad = true;
                    var image = document.getElementById('myImage');
                    image.src = fileEntry.nativeURL;
                });
                $ionicLoading.show({template: 'Foto acquisita...', duration:500});
            },
            function(err){
                $ionicLoading.show({template: 'Errore di caricamento...', duration:500});
            })
    };

    $scope.uploadPicture = function() {
        $ionicLoading.show({template: 'Sto inviando la foto...'});
        var fileURL = $scope.picData;
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        options.chunkedMode = true;

        var params = {};
        params.value1 = "someparams";
        params.value2 = "otherparams";

        options.params = params;

        var ft = new FileTransfer();
        ft.upload(fileURL, encodeURI("http://www.yourdomain.com/upload.php"), viewUploadedPictures, function(error) {$ionicLoading.show({template: 'Errore di connessione...'});
            $ionicLoading.hide();}, options);
    }

    var viewUploadedPictures = function() {
        $ionicLoading.show({template: 'Sto cercando le tue foto...'});
        server = "http://www.yourdomain.com/upload.php";
        if (server) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange=function(){
                if(xmlhttp.readyState === 4){
                    if (xmlhttp.status === 200) {
                        document.getElementById('server_images').innerHTML = xmlhttp.responseText;
                    }
                    else { $ionicLoading.show({template: 'Errore durante il caricamento...', duration: 1000});
                        return false;
                    }
                }
            };
            xmlhttp.open("GET", server , true);
            xmlhttp.send()}	;
        $ionicLoading.hide();
    }

    $scope.viewPictures = function() {
        $ionicLoading.show({template: 'Sto cercando le tue foto...'});
        server = "http://www.yourdomain.com/upload.php";
        if (server) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange=function(){
                if(xmlhttp.readyState === 4){
                    if (xmlhttp.status === 200) {
                        document.getElementById('server_images').innerHTML = xmlhttp.responseText;
                    }
                    else { $ionicLoading.show({template: 'Errore durante il caricamento...', duration: 1000});
                        return false;
                    }
                }
            };
            xmlhttp.open("GET", server , true);
            xmlhttp.send()}	;
        $ionicLoading.hide();
    }




});