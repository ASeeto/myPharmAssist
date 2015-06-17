/**
 *  DEFAULT variables for my personal directory hierarchy
 */
var BASEURL = '/projects/';
var PROJECT = 'myPharmAssist';
var SLIMLOC = BASEURL+PROJECT+'/api';

window.Profile = Backbone.Model.extend({

    urlRoot:SLIMLOC+'/profiles',

});

window.ProfileCollection = Backbone.Collection.extend({

    model: Profile,

    url:SLIMLOC+'/profiles',

    getProfiles:function() {
        var url = SLIMLOC+'/profiles';
        var self = this;
        $.ajax({
            url:url,
            dataType:"json",
            success:function (data) {
                self.reset(data);
            }
        });
    }

});