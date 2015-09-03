app.factory("usersFactory", function($firebaseAuth, $q) {
    // initiate firebase reference + authentication object
    var ref = new Firebase("https//onlyhue.firebaseIO.com/users");
    var authObj = $firebaseAuth(ref);

    // initialize user profile data object
    var data = {};

    var listener;

    // factory methods
    return {
        getRef: function() {
            return ref;
        },

        getAuthObj: function() {
            return authObj;
        },

        checkUID: function(uid, callback) {
            ref.child(uid).once("value", function(snapshot) {
                callback(snapshot.val() == null);
            });
        },

        returnProfile: function() {
            return data;
        },

        pullProfile: function(uid) {
            var deferred = $q.defer();
            ref.child(uid).once("value", function(snapshot) {
                data = snapshot.val();
                data.uid = uid;
                deferred.resolve();
            });
            return deferred.promise;
        },

        pushProfile: function() {
            var profile = {
                displayName: data.displayName,
                email: data.email
            };
            ref.child(data.uid).set(profile);
        },

        createUser: function(email, password) {
            var deferred = $q.defer();
            authObj.$createUser({
                email: email,
                password: password
            }).then(function() {
                // firebase account created, log in to firebase
                return authObj.$authWithPassword({
                    email: email,
                    password: password
                });
            }).then(function(authData) {
                // firebase account logged in, resolve promise
                deferred.resolve(authData);
            }).catch(function(error) {
                // error occurred, reject promise
                deferred.reject(error);
            });
            return deferred.promise;
        },

        loginEmail: function(email, password) {
            var deferred = $q.defer();
            // firebase login with password
            authObj.$authWithPassword({
                email: email,
                password: password
            }).then(function() {
                deferred.resolve();
            }).catch(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        setProfile: function(uid, displayName, email) {
            if (uid != null) {
                data.uid = uid;
            }
            if (displayName != null) {
                data.displayName = displayName;
            }
            if (email != null) {
                data.email = email;
            }
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

        resetPassword: function(email) {
            var deferred = $q.defer();
            authObj.$resetPassword({
                email: email
            }).then(function() {
                deferred.resolve();
            }).catch(function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        unauth: function() {
            authObj.$unauth();
        }
    };
});
