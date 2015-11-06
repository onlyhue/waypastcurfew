app.factory("votesFactory", function($firebaseObject) {
    // initiate firebase reference + authentication object
    var votesRef = new Firebase("https//onlyhue.firebaseIO.com/voteClient/");
    var votesFirebaseObj;

    // factory methods
    return {
        getVotes: function() {
            return votesFirebaseObj = $firebaseObject(votesRef);
        }
    };
});
