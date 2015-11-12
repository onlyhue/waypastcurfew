app.factory("feedbackFactory", function($firebaseArray) {
    var ref = new Firebase("https//onlyhue.firebaseIO.com/feedback");
    var firebaseArr = $firebaseArray(ref);

    return {
        addFeedback: function(feedback) {
            firebaseArr.$add(feedback);
        }
    }
});