/**
 *  DEFAULT variables for my personal directory hierarchy
 */
var BASEURL = '/projects/';
var PROJECT = 'myPharmAssist';
var SLIMLOC = BASEURL+PROJECT+'/api';

window.Pharmacy = Backbone.Model.extend({

    urlRoot:SLIMLOC+'/pharmacy',

});