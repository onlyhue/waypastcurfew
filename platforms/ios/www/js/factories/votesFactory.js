app.factory("votesFactory", function($firebaseObject) {
    // initiate firebase reference + authentication object
    var votesRef;
    var votesFirebaseObj;

    // factory methods
    return {
        pullVotes: function(userID) {
            votesRef = new Firebase("https//onlyhue.firebaseIO.com/votes/" + userID);
            votesFirebaseObj = $firebaseObject(votesRef);
        },

        getVotes: function() {
            return votesFirebaseObj;
        }
    };
});
