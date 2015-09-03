app.factory("songsFactory", function($firebaseObject) {
    // set global firebase reference, firebase object and userID
    var ref;
    var songs;
    var uid;
    var clientRef = new Firebase("https//onlyhue.firebaseIO.com/songs/facebook:10153560146409496");
    var clientSongs = $firebaseObject(clientRef);
    var clientUID = "facebook:10153560146409496";

    return {
        pullSongs: function(userID) {
            uid = userID;
            ref = new Firebase("https//onlyhue.firebaseIO.com/songs/" + uid);
            songs = $firebaseObject(ref);
        },

        getSongs: function() {
            return songs;
        },

        getClientSongs: function() {
            return clientSongs;
        },

        getUID: function() {
            return uid;
        },

        getClientUID: function() {
            return clientUID;
        }
    };
});
