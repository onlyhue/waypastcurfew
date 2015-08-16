app.factory("votesFactory", function($firebaseObject) {
    // initiate firebase reference + authentication object
    var songsRef = new Firebase("https//incandescent-heat-862.firebaseIO.com/songs/imustnotbeknown@hotmailcom");
    var songsFirebaseObj = $firebaseObject(songsRef);
    var votesRef;
    var votesFirebaseObj;

    // factory methods
    return {
        assignRef: function(userID) {
            votesRef = new Firebase("https//incandescent-heat-862.firebaseIO.com/votes/" + userID);
            votesFirebaseObj = $firebaseObject(votesRef);
        },

        getSongsFirebaseObj: function() {
            return songsFirebaseObj;
        },

        getVotesFirebaseObj: function() {
            return votesFirebaseObj;
        }
    };
});