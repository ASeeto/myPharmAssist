/**
 *  DEFAULT variables for my personal directory hierarchy
 */
var BASEURL = '/projects/';
var PROJECT = 'myPharmAssist';
var SLIMLOC = BASEURL+PROJECT+'/api';

window.Prescription = Backbone.Model.extend({

    urlRoot:SLIMLOC+'/prescriptions',

});

window.PrescriptionCollection = Backbone.Collection.extend({

    model: Prescription,

    url:SLIMLOC+'/prescriptions',

    getPrescriptions:function(id) {
        var url = SLIMLOC+'/prescriptions/'+id;
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