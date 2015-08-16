app.factory("songsFactory", function($firebaseObject) {
    // set global firebase reference, firebase object and userID
    var ref;
    var firebaseObj;
    var userID;
    var clientFirebaseObj;

    return {
        assignRef: function(theUserID) {
            userID = theUserID;
            ref = new Firebase("https//incandescent-heat-862.firebaseIO.com/songs/" + userID);
        },

        getFirebaseObj: function() {
            firebaseObj = $firebaseObject(ref);
            return firebaseObj;
        },

        getClientFirebaseObj: function() {
            var clientRef = new Firebase("https//incandescent-heat-862.firebaseIO.com/songs/imustnotbeknown@hotmailcom");
            clientFirebaseObj = $firebaseObject(clientRef);
            return clientFirebaseObj;
        },

        getUserID: function() {
            return userID;
        }
    };
});