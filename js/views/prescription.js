/**
 *  DEFAULT variables for my personal directory hierarchy
 */
var BASEURL = '/projects/';
var PROJECT = 'myPharmAssist';
var SLIMLOC = BASEURL+PROJECT+'/api';

window.PrescriptionView = Backbone.View.extend({

    initialize:function () {
        this.profiles = new ProfilesView();
    },

    render:function () {
        $(this.el).html(this.template());

        var profiles = new ProfileCollection();
        profiles.fetch({
            success: function (profiles) {
                var template = _.template($('#item-list-template').html(), {profiles: profiles.models});
                that.$el.html(template);
            },
            error: function (){
                that.$el.html( ' Error when fetching collection. ');
            }
        })

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
        "click #insertProfile": "insertProfile"
    },

    insertProfile: function() {
        event.preventDefault(); // Don't let this button submit the form
        $('.alert-error').hide(); // Hide any errors on a new submit
        var url = SLIMLOC+'/insertProfile';
        var formValues = {
            name: $('#inputName').val(),
            color: $('#inputColor').val()
        };
        $.ajax({
            url:url,
            type:'POST',
            dataType:"json",
            data: formValues,
            success:function (data) {
                console.log(data);
            }
        });
    }

    select: function(menuItem) {
        $('.nav li').removeClass('active');
        $('.' + menuItem).addClass('active');
    }

});