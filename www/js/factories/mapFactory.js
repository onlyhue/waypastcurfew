app.factory("mapFactory", function($firebaseArray) {
    var ref = new Firebase("https//onlyhue.firebaseIO.com/mapFactory");
    var firebaseArr = $firebaseArray(ref);

    return {
        addCoordinates: function(coord) {
            firebaseArr.$add(coord);
        }
    }
});