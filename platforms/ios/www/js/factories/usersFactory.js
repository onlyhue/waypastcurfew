app.factory("usersFactory", function($firebaseObject) {
    var ref = new Firebase("https//incandescent-heat-862.firebaseio.com/users");
    return $firebaseObject(ref);
});