/**
 *  DEFAULT variables for my personal directory hierarchy
 */
var BASEURL = '/projects/';
var PROJECT = 'myPharmAssist';
var SLIMLOC = BASEURL+PROJECT+'/api';

window.ProfilesView = Backbone.View.extend({

    initialize:function () {
        this.profiles = new ProfileCollection();
        this.profiles.getProfiles();
        this.profilesView = new ProfileDivsView({model: this.profiles, className: 'profiles'});
    },

    render:function () {
        $(this.el).html(this.template());
        $('#profiles', this.el).append(this.profilesView.render().el);
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
        "click #insertProfile": "insertProfile",
        "click #confirm_delete": "refresh",
        "click #confirm_update": "refresh"
    },

    insertProfile: function() {
        event.preventDefault(); // Don't let this button submit the form
        $('.alert-error').hide(); // Hide any errors on a new submit
        var url = SLIMLOC+'/insertProfile';
        var formValues = {
            name: $('#insertName').val(),
            color: $('#insertColor').val()
        };
        var that = this;
        $.ajax({
            url:url,
            type:'POST',
            dataType:"json",
            data: formValues,
            success:function (data) {
                if(data.error) {  // If there is an error, show the error messages
                    $('.alert-error').text(data.error.text).show();
                }else{
                    console.log('Created profile succesfully.');
                    $('.insert-profile').modal('hide');
                    that.refresh();
                }
            },
            error:function(data) {
                alert('Error creating profile.');
            }
        });
    },

    refresh: function() {
        this.profiles.getProfiles();
    },

    select: function(menuItem) {
        $('.nav li').removeClass('active');
        $('.' + menuItem).addClass('active');
    }

});