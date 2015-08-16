app.factory("tracksFactory", function($firebaseArray) {
    // set global firebase reference, firebase array, song object and tracks object
    var ref;
    var tracks;
    var song;

    return {
        assignRef: function(userID, songKey, theSong) {
            ref = new Firebase("https//incandescent-heat-862.firebaseIO.com/tracks/" + userID + "/" + songKey);
            song = theSong;
        },

        getTracks: function() {
            tracks = $firebaseArray(ref);
            return tracks;
        },

        getSong: function() {
            return song;
        },

        getLyrics: function() {
            return song.lyrics;
        }
    };
});