window.PharmacyView = Backbone.View.extend({

    initialize:function () {},

    render:function () {
        $(this.el).html(this.template());

        /** Execute function after render completes
          * Solution Link: http://stackoverflow.com/a/9145790
          */
        setTimeout(function() {
            /** Requires map div to have been rendered. */
            initialize(loc);
            /** Requires search text input to have been rendered. */
            autosuggest();
        }, 0);

        return this;
    },

    events: {},

    select: function(menuItem) {
        $('.nav li').removeClass('active');
        $('.' + menuItem).addClass('active');
    }

});