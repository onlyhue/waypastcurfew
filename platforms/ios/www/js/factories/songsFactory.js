app.factory("songsFactory", function($firebaseObject) {
    var clientRef = new Firebase("https//onlyhue.firebaseIO.com/songs/f2d4dbf6-21a1-4676-a81e-aacdcd6d7a34");
    var clientSongs = $firebaseObject(clientRef);

    return {
        getClientSongs: function() {
            return clientSongs;
        }
    };
});