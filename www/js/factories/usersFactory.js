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
            if (profile != null) {
                data.first_name = profile.first_name;
                data.last_name = profile.last_name;
                data.gender = profile.gender;
                data.picture = profile.picture;
            }
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

        returnProfile: function() {
            return data;
        },

        pullProfile: function(email) {
            ref.child(email.replace(/\./g, '')).once("value", function(snapshot) {
                var profile = snapshot.val();
                if (profile != null) {
                    data.email = email;
                    data.first_name = profile.first_name;
                    data.last_name = profile.last_name;
                    data.gender = profile.gender;
                    data.picture = profile.picture;
                }
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
        }
    };
});