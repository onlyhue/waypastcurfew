app.factory("usersFactory", function($firebaseAuth) {
    // initiate firebase reference + authentication object
    var ref = new Firebase("https//incandescent-heat-862.firebaseIO.com/users");
    var authObj = $firebaseAuth(ref);

    // user profile data
    var data = {};
    data.email;
    data.first_name;
    data.last_name;
    data.gender;
    data.picture;
    data.password;

    // refresh user profile on restart
    if (authObj.$getAuth() != null) {
        try {
            // facebook account logged in
            data.email = authObj.$getAuth().facebook.email;
        } catch (error) {
            // email account logged in
            data.email = authObj.$getAuth().password.email;
        }

        // update user profile with firebase data
        ref.child(data.email.replace(/\./g, '')).once("value", function(snapshot) {
            var profile = snapshot.val();
            data.first_name = profile.first_name;
            data.last_name = profile.last_name;
            data.gender = profile.gender;
            data.picture = profile.picture;
        })
    }

    // factory methods
    return {
        getRef: function() {
            return ref;
        },

        getAuthObj: function() {
            return authObj;
        },

        // checks for existing email in firebase
        checkEmail: function(email, callback) {
            ref.child(email.replace(/\./g, '')).once("value", function(snapshot) {
                callback(snapshot.val() == null);
            })
        },

        setProfile: function(email, firstName, lastName, gender, picture, password) {
            data.email = email;
            data.first_name = firstName;
            data.last_name = lastName;
            data.gender = gender;
            data.picture = picture;
            data.password = password;
        },

        getProfile: function() {
            return data;
        }
    };
});