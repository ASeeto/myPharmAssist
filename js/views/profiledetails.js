/**
 *  DEFAULT variables for my personal directory hierarchy
 */
var BASEURL = '/projects/';
var PROJECT = 'myPharmAssist';
var SLIMLOC = BASEURL+PROJECT+'/api';

window.ProfileDetailsView = Backbone.View.extend({

    initialize:function () {
        console.log('Initializing Profile Details View');
        this.prescriptions = new PrescriptionCollection();
        this.prescriptions.getPrescriptions();
        this.prescriptionsView = new PrescriptionsDivsView({model: this.prescriptions, className: 'prescriptions'});
    },

    render:function () {
        $(this.el).html(this.template(this.model));
        $('#profiledetails', this.el).append(this.modelDiv);
        $('#prescriptions', this.el).append(this.prescriptionsView.render().el);
        /** Execute function after render completes
          * Solution Link: http://stackoverflow.com/a/9145790
          */
        setTimeout(function() {
            /** Requires form to have been rendered. */
            $('.pick-color').colorpicker({align:'left'});
        }, 0);
        return this;
    },

    events: {
        "click #confirm_delete": "redirect"
    },

    redirect: function() {
        window.location.replace(BASEURL+PROJECT+'/#profiles');
    }

});