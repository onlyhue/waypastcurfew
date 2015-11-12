app.factory("groupsFactory", function($firebaseArray, $firebaseObject) {
    var groupsRef = new Firebase("https//onlyhue.firebaseIO.com/groups");
    var groups = $firebaseArray(groupsRef);
    var GID;
    var group;
    var groupAnnouncements;
    var groupMembers;
    var currentTab;

    return {
        getGroups: function() {
            return groups;
        },

        pullGroup: function(theGID) {
            GID = theGID;
            var groupRef = new Firebase("https//onlyhue.firebaseIO.com/groups/" + GID);
            group = $firebaseObject(groupRef);
            var groupAnnouncementsRef = new Firebase("https//onlyhue.firebaseIO.com/groups/" + GID + "/announcements");
            groupAnnouncements = $firebaseArray(groupAnnouncementsRef);
            var groupMembersRef = new Firebase("https//onlyhue.firebaseIO.com/groups/" + GID + "/members");
            groupMembers = $firebaseArray(groupMembersRef);
        },

        getGID: function() {
            return GID;
        },

        getGroup: function() {
            return group;
        },

        getGroupAnnouncements: function() {
            return groupAnnouncements;
        },

        getGroupMembers: function() {
            return groupMembers;
        },

        setCurrentTab: function(theTab) {
            currentTab = theTab;
        },

        getCurrentTab: function() {
            return currentTab;
        }
    };
});