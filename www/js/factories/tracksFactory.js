app.factory("tracksFactory", function($firebaseArray) {
    // set global firebase reference, firebase array, song object and tracks object
    var ref;
    var tracks;
    var song;
    var key;

    return {
        pullTracks: function(userID, songKey, theSong) {
            key = songKey;
            ref = new Firebase("https//onlyhue.firebaseIO.com/tracks/" + userID + "/" + songKey);
            song = theSong;
        },

        getTracks: function() {
            tracks = $firebaseArray(ref);
            return tracks;
        },

        getSong: function() {
            return song;
        },

        getKey: function() {
            return key;
        }
    };
});
