app.factory("votesFactory", function($firebaseObject) {
    var votesRef = new Firebase("https//onlyhue.firebaseIO.com/voteClient/");
    var votesFirebaseObj;

    return {
        getVotes: function() {
            return votesFirebaseObj = $firebaseObject(votesRef);
        }
    };
});