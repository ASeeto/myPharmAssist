window.AboutView = Backbone.View.extend({

    initialize:function () {
        console.log('Initializing About View');
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    }

});