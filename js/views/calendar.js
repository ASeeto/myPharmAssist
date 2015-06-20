/**
 *  DEFAULT variables for my personal directory hierarchy
 */
var BASEURL = '/projects/';
var PROJECT = 'myPharmAssist';
var SLIMLOC = BASEURL+PROJECT+'/api';

window.CalendarView = Backbone.View.extend({

    initialize:function () {
        console.log('Initializing Calendar View');
    },

    render:function () {
        $(this.el).html(this.template());
        /** Execute function after render completes */
        setTimeout(function() {
            /** Requires calendar div to have been rendered. */
            var calendar = $("#calendar").calendar(
                {
                    tmpl_path: BASEURL+PROJECT+"/tmpls/",
                    events_source: function () { return []; }
                });
        }, 0);
        return this;
    },

    events: {},

    select: function(menuItem) {
        $('.nav li').removeClass('active');
        $('.' + menuItem).addClass('active');
    }

});