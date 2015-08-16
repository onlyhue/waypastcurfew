app.factory("usersFactory", function($firebaseAuth, $q) {
    // initiate firebase reference + authentication object
    var ref = new Firebase("https//incandescent-heat-862.firebaseIO.com/users");
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

        checkEmail: function(email, callback) {
            ref.child(email.replace(/\./g, '')).once("value", function(snapshot) {
                callback(snapshot.val() == null);
            })
        },

        returnProfile: function() {
            return data;
        },

        pullProfile: function(email) {
            ref.child(email.replace(/\./g, '')).once("value", function(snapshot) {
                data = snapshot.val();
            })
        },

        pushProfile: function() {
            if (data.picture == null) {
                data.picture = "";
            }
            var profile = {
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
                gender: data.gender,
                picture: data.picture
            };
            ref.child(data.email.replace(/\./g, '')).set(profile);
        },

        createUser: function() {
            var deferred = $q.defer();
            authObj.$createUser({
                email: data.email,
                password: data.password
            }).then(function () {
                // firebase account created, log in to firebase
                authObj.$authWithPassword({
                    email: data.email,
                    password: data.password
                });
            }).then(function () {
                // firebase account logged in, resolve promise
                deferred.resolve();
            }).catch(function (error) {
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

        setProfile: function(email, first_name, last_name, gender, picture, password) {
            data.email = email;
            data.first_name = first_name;
            data.last_name = last_name;
            data.gender = gender;
            data.picture = picture;
            data.password = password;
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