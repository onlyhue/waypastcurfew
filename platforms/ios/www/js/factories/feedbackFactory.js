app.factory("feedbackFactory", function($firebaseArray) {
    // initiate firebase reference + object
    var ref = new Firebase("https//onlyhue.firebaseIO.com/feedback");
    var firebaseArr = $firebaseArray(ref);

    // factory methods
    return {
        addFeedback: function (feedback) {
            firebaseArr.$add(feedback);
        }
    }
});
