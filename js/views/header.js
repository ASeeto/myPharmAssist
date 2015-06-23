window.HeaderView = Backbone.View.extend({

    initialize: function () {
        var url = SLIMLOC+'/session';
        $.ajax({
            url:url,
            type:'GET',
            success:function () {
                $("#logout").show();
            }
        });
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    },

    events: {},

    select: function(menuItem) {
        $('.nav li').removeClass('active');
        $('.' + menuItem).addClass('active');
    }

});