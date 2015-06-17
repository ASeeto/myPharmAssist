/**
 *  DEFAULT variables for my personal directory hierarchy
 */
var BASEURL = '/projects/';
var PROJECT = 'myPharmAssist';
var SLIMLOC = BASEURL+PROJECT+'/api';

window.PrescriptionView = Backbone.View.extend({

    initialize:function () {
        this.profiles = new ProfileCollection();
        this.profiles.getProfiles();
        this.profilesView = new ProfilesView({model: this.profiles, className: 'profiles'});
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
        "click .deleteProfile": "deleteProfile",
        "click .updateProfile": "updateProfile",
        "click .profile.col-md-4": "getDetails",
        "mouseenter .profile.col-md-4": "showButtons",
        "mouseleave .profile.col-md-4": "hideButtons"
    },

    insertProfile: function() {
        event.preventDefault(); // Don't let this button submit the form
        console.log($(event.currentTarget));
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
                if(data.error) {  // If there is an error, show the error messages
                    $('.alert-error').text(data.error.text).show();
                }else{
                    console.log('Created profile succesfully.');
                    $('.bs-example-modal-sm').modal('hide');
                }
            },
            error:function(data) {
                alert('Error creating profile.');
            }
        });
    },

    deleteProfile: function() {
        event.preventDefault(); // Don't let this button submit the form
        $('.alert-error').hide(); // Hide any errors on a new submit
        var url = SLIMLOC+'/deleteProfile';
        var formValues = {
            name: $('#inputName').val(),
            color: $('#inputColor').val()
        };
        $.ajax({
            url:url,
            type:'DELETE',
            dataType:"json",
            data: formValues,
            success:function (data) {
                if(data.error) {  // If there is an error, show the error messages
                    $('.alert-error').text(data.error.text).show();
                }else{
                    console.log('Deleted profile succesfully.');
                    $('.bs-example-modal-sm').modal('hide');
                }
            },
            error:function(data) {
                alert('Error deleting profile.');
            }
        });
    },

    updateProfile: function(event) {
        event.preventDefault(); // Don't let this button submit the form
        $('.alert-error').hide(); // Hide any errors on a new submit
        var url = SLIMLOC+'/updateProfile';
        var formValues = {
            name: $('#inputName').val(),
            color: $('#inputColor').val()
        };
        $.ajax({
            url:url,
            type:'PUT',
            dataType:"json",
            data: formValues,
            success:function (data) {
                if(data.error) {  // If there is an error, show the error messages
                    $('.alert-error').text(data.error.text).show();
                }else{
                    console.log('Updated profile succesfully.');
                    $('.bs-example-modal-sm').modal('hide');
                }
            },
            error:function(data) {
                alert('Error updating profile.');
            }
        });
    },

    getDetails: function() {
        console.log('Clicked');
    },

    showButtons: function(event) {
        $('.profile-button', event.currentTarget).show();
    },

    hideButtons: function() {
        $('.profile-button', event.currentTarget).fadeOut('fast');
    },

    select: function(menuItem) {
        $('.nav li').removeClass('active');
        $('.' + menuItem).addClass('active');
    }

});