app.factory("usersFactory", function($firebaseAuth, $q, $firebaseObject, $firebaseArray) {
    var ref = new Firebase("https//onlyhue.firebaseIO.com/users");
    var authObj = $firebaseAuth(ref);
    var users = $firebaseObject(ref);
    var nextPage;
    var listener;
    var UID;
    var profile;
    var myGroupsList;

    return {
        getAuthObj: function() {
            return authObj;
        },

        getUsers: function() {
            return users;
        },

        setNextPage: function(theNextPage){
            nextPage = theNextPage;
        },

        getNextPage: function() {
            return nextPage;
        },

        registerListener: function() {
            var deferred = $q.defer();
            listener = authObj.$onAuth(function(authData) {
                if (authData != null) {
                    deferred.resolve(authData);
                }
            });
            return deferred.promise;
        },

        unregisterListener: function() {
            listener();
        },

        loginFacebook: function(token) {
            var deferred = $q.defer();
            authObj.$authWithOAuthToken("facebook", token, function(error, authData) {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(authData);
                }
            });
            return deferred.promise;
        },

        loginGoogle: function() {
            var deferred = $q.defer();
            ref.authWithOAuthPopup("google", function(error, authData) {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(authData);
                }
            }, {
                scope: "email"
            });
            return deferred.promise;
        },

        unauth: function() {
            authObj.$unauth();
        },

        pullProfile: function(theUID) {
            UID = theUID;
            var userRef = new Firebase("https//onlyhue.firebaseIO.com/users/" + theUID);
            profile = $firebaseObject(userRef);
            var myGroupsRef = new Firebase("https//onlyhue.firebaseIO.com/users/" + theUID + "/groups");
            myGroupsList = $firebaseArray(myGroupsRef);
        },

        getUID: function() {
            return UID;
        },

        getProfile: function() {
            return profile;
        },

        getMyGroupsList: function() {
            return myGroupsList;
        },

        getMemberGroupsList: function(UID) {
            var memberGroupsRef = new Firebase("https//onlyhue.firebaseIO.com/users/" + UID + "/groups");
            return $firebaseArray(memberGroupsRef);
        }
    };
});