/**
 *  DEFAULT variables for my personal directory hierarchy
 */
var BASEURL = '/projects/';
var PROJECT = 'myPharmAssist';
var SLIMLOC = BASEURL+PROJECT+'/api';

window.PrescriptionsDivsView = Backbone.View.extend({

    tagName:'div',

    className:'prescriptions',

    initialize:function () {
        var self = this;
        this.model.bind("reset", this.render, this);
        this.model.bind("add", function (prescription) {
            $(self.el).append(new PrescriptionDivView({model:profile}).render().el);
        });
    },

    render:function () {
        $(this.el).empty();
        _.each(this.model.models, function (prescription) {
            $(this.el).append(new PrescriptionDivView({model:profile}).render().el);
        }, this);
        return this;
    }
});

window.PrescriptionDivView = Backbone.View.extend({

    tagName:"div",

    className:'prescription col-md-12',

    initialize:function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    events: {},

    render:function () {
        var prescription = this.model.toJSON();
        $(this.el).attr('id', prescription.id);
        $(this.el).append($('<div class="name col-md-4">' prescription.name '</div>');
        $(this.el).append($('<div class="dose col-md-4">' prescription.dose '</div>');
        $(this.el).append($('<div class="frequency col-md-4">' prescription.frequency '</div>');
        return this;
    }
});