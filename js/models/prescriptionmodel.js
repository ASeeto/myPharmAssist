window.Prescription = Backbone.Model.extend({

    urlRoot:SLIMLOC+'/prescriptions',

});

window.PrescriptionCollection = Backbone.Collection.extend({

    model: Prescription,

    url:SLIMLOC+'/prescriptions',

    getPrescriptions:function(id, page) {
        var url = SLIMLOC+'/prescriptions/'+id;
        var self = this;
        $.ajax({
            url:url,
            dataType:"json",
            success:function (data) {
                self.reset(data);
                data.length == 0 ? $('#defaultPrescriptions', page.el).show() : $('#defaultPrescriptions', page.el).hide();
            }
        });
    }

});