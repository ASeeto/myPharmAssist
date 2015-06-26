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

    events: {
        "click #switchcss":"togglecss"
    },

    /** Toggle between stylesheets */
    togglecss: function(){
        event.preventDefault();
        text = $('#switchcss').text();
        if(text == 'Switch to Light Side'){
            $('#current_style').attr('href','css/light.css');
            $('#switchcss a').text('Switch to Dark Side');
        }
        else{
            $('#current_style').attr('href','css/dark.css');
            $('#switchcss a').text('Switch to Light Side');
        }
    },

    select: function(menuItem) {
        $('.nav li').removeClass('active');
        $('.' + menuItem).addClass('active');
    }

});