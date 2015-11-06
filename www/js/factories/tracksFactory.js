app.factory("tracksFactory", function($firebaseArray) {
    var ref;
    var tracks;
    var artistTitle;
    var song;

    return {
        pullTracks: function(userID, theArtistTitle, theSong) {
            ref = new Firebase("https//onlyhue.firebaseIO.com/tracks/" + userID + "/" + theArtistTitle);
            tracks = $firebaseArray(ref);
            artistTitle = theArtistTitle;
            song = theSong;
        },

        getTracks: function() {
            return tracks;
        },

        getArtistTitle: function() {
            return artistTitle;
        },

        getSong: function() {
            return song;
        }
    };
});