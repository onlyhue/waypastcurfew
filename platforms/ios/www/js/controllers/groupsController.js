app.controller("groupsController", function($scope, $state, $ionicModal, usersFactory, groupsFactory, $ionicLoading, $ionicViewSwitcher) {
    $scope.main = function() {
        $ionicViewSwitcher.nextDirection('back');
        $state.go("main");
    };

    $scope.$on('$ionicView.beforeEnter', function() {
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner><br><br><span style="font-family: Aller Light; font-size: 0.8em;">LOADING...</span>'
        });
        $scope.data = {};
        $scope.data.user = usersFactory.getProfile();
        $scope.data.allGroups = groupsFactory.getGroups();
        $scope.data.myGroupsList = usersFactory.getMyGroupsList();
        $scope.data.allGroups.$loaded().then(function(allGroups) {
            if (allGroups.length == 0) {
                $ionicLoading.hide();
            }
            allGroups.$save(0);
            allGroups.$watch(function() {
                $scope.data.myGroupsList.$loaded().then(function(myGroupsList) {
                    if (myGroupsList.length == 0) {
                        if (!$scope.data.showAllGroups) {
                            $scope.data.groups = $scope.data.myGroups;
                        } else {
                            $scope.data.groups = $scope.data.allGroups;
                        }
                        $ionicLoading.hide();
                    }
                    myGroupsList.$save(0);
                    myGroupsList.$watch(function() {
                        $scope.data.myGroups = {};
                        for (i = 0; i < myGroupsList.length; i++) {
                            $scope.data.myGroups[myGroupsList[i].$value] = allGroups.$getRecord(myGroupsList[i].$value);
                        }
                        if (!$scope.data.showAllGroups) {
                            $scope.data.groups = $scope.data.myGroups;
                        } else {
                            $scope.data.groups = $scope.data.allGroups;
                        }
                        $ionicLoading.hide();
                    })
                });
            });
        });
        $scope.data.showAllGroups = false;
        $scope.data.search = "";
    });

    $scope.search = function() {
        if ($scope.data.groupsTemp != null) {
            $scope.data.groups = $scope.data.groupsTemp;
        }
        $scope.data.groupsTemp = angular.copy($scope.data.groups);
        $scope.data.groups = {};
        angular.forEach($scope.data.groupsTemp, function(value, key) {
            if (value.name.toLowerCase().indexOf($scope.data.search.toLowerCase()) != -1) {
                $scope.data.groups[key] = angular.copy($scope.data.groupsTemp[key]);
            }
        });
    };

    $scope.clear = function() {
        $scope.data.search = "";
        $scope.search();
    };

    $scope.groupDetails = function(GID) {
        $scope.data.selectedGroupGID = GID;
        var joined = false;
        for (i = 0; i < $scope.data.myGroupsList.length; i++) {
            if (GID == $scope.data.myGroupsList[i].$value) {
                joined = true;
                break;
            }
        }
        if (joined) {
            groupsFactory.pullGroup(GID);
            $ionicViewSwitcher.nextDirection('forward');
            $state.go("groupAnnouncements");
            $scope.modal.hide();
        } else {
            $scope.data.selectedGroup = $scope.data.allGroups[$scope.data.allGroups.$indexFor(GID)];
            $scope.modal.show();
        }
    };

    $ionicModal.fromTemplateUrl('templates/groupsOverlay.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.hide = function() {
        $scope.modal.hide();
    };

    $scope.createGroup = function() {
        $ionicViewSwitcher.nextDirection('forward');
        $state.go("createGroup");
    };

    $scope.showMyGroups = function() {
        $scope.data.showAllGroups = false;
        $scope.data.groups = $scope.data.myGroups;
        $scope.data.groupsTemp = null;
        $scope.search();
    };

    $scope.showAllGroups = function() {
        $scope.data.showAllGroups = true;
        $scope.data.groups = $scope.data.allGroups;
        $scope.data.groupsTemp = null;
        $scope.search();
    };

    $scope.joinGroup = function() {
        if ($scope.data.password == $scope.data.selectedGroup.password) {
            $scope.data.myGroupsList.$add($scope.data.selectedGroupGID);
            $scope.data.allGroups.$ref().child($scope.data.selectedGroupGID + "/members").push(usersFactory.getUID());
            groupsFactory.pullGroup($scope.data.selectedGroupGID);
            $ionicViewSwitcher.nextDirection('forward');
            $state.go("groupAnnouncements");
            $scope.modal.hide();
        } else {
            $scope.data.error = "Incorrect password!";
        }
    };

    $scope.rowColor = function(key) {
        if (key % 2 == 0) {
            return "white";
        } else {
            return "#043172";
        }
    };

    $scope.rowBackground = function(key) {
        if (key % 2 == 0) {
            return "#043172";
        } else {
            return "white";
        }
    };
});