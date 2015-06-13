window.HomeView = Backbone.View.extend({

    initialize:function () {
        console.log('Initializing Home View');
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