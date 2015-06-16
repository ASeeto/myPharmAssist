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

    url:SLIMLOC+'/profiles'

});