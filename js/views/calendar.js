window.CalendarView = Backbone.View.extend({

    initialize:function () {
        console.log('Initializing Calendar View');
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    },

    events: {},

    select: function(menuItem) {
        $('.nav li').removeClass('active');
        $('.' + menuItem).addClass('active');
    }

});