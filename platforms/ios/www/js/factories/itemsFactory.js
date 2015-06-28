app.factory("itemsFactory", function($firebaseObject) {
    var ref = new Firebase("https://incandescent-heat-862.firebaseio.com/items");
    return $firebaseObject(ref);
});