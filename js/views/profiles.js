window.ProfilesView = Backbone.View.extend({

    initialize:function () {
        console.log('Initializing Profiles View');
        $('.modal-backdrop').remove();
        this.profiles = new ProfileCollection();
        this.profilesView = new ProfileDivsView({model: this.profiles, className: 'profiles'});
    },

    render:function () {
        $(this.el).html(this.template());
        /** Retrieve profiles to display from database */
        this.profiles.getProfiles();
        /** Append rendered profiles to template */
        $('#profiles', this.el).append(this.profilesView.render().el);

        /** Execute function after render completes */
        setTimeout(function() {
            /** Requires form to have been rendered. */
            $('.pick-color').colorpicker({align:'left'});
        }, 0);

        return this;
    },

    events: {
        "click #insertProfile": "insertProfile",
        "click .profile.col-md-4": "getDetails",
        "click .delete-btn": "deleteProfile",
        "click .update-btn": "updateProfile",
        "hidden.bs.modal .modal": "resetForms"
    },

    /** Reset form inputs to defaults */
    resetForms: function() {
        $(this.el).find('form')[0].reset();
        /** Triggering events that occur when users type so colorpicker is accurate... */
        $('#insertColor').keydown();
        $('#insertColor').keypress();
        $('#insertColor').keyup();
        $('#insertColor').blur();
        $('#insertColor').focus();
        $('#insertColor').change();
    },

    /** Retrieve details page for the profile that was clicked */
    getDetails: function(event) {
        // console.log(event.currentTarget);
        if($(event.currentTarget).is(':button')){
            console.log('Button clicked. Do nothing.');
        } else {
            var profile = $(event.currentTarget);
            var pid = profile.attr('id');
            window.location.replace(BASEURL+PROJECT+'/#profiles/'+pid);
        }
    },

    /** Open modal to allow for profile creation */
    insertProfile: function() {
        var that = this;
        event.preventDefault(); // Don't let this button submit the form
        $('.alert-error').hide(); // Hide any errors on a new submit
        var url = SLIMLOC+'/insertProfile';
        var formValues = {
            name: $('#insertName').val(),
            color: $('#insertColor').val(),
            gender: $('#insertGender').val()
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
                    $('.insert-profile').modal('hide');
                    that.refresh();
                }
            },
            error:function(data) {
                alert('Error creating profile.');
            }
        });
    },

    /** Open modal to allow for profile deletion */
    deleteProfile: function(event) {
        var that = this;
        /** Do not allow bubbling from button clicks */
        event.stopPropagation();
        /** Get the profile from the parent parent div of the button clicked */
        var profile = $(event.currentTarget).parent().parent();
        /** Open the delete modal */
        $('.delete-profile').modal('show');
        /** Confirm deletion of clicked profile */
        $('#confirm_delete_profile').off("click").on("click", function(event){
            event.preventDefault();
            var pid = profile.attr('id');
            var url = SLIMLOC+'/deleteProfile';
            $.ajax({
                url:url,
                type:'POST',
                dataType:"json",
                data: {id: pid},
                success:function (data) {
                    if(data.error) {
                        /** If error is returned from server, display message */
                        $('.alert-error').text(data.error.text).show();
                    }else{
                        console.log('Deleted profile succesfully.');
                        $('.delete-profile').modal('hide');
                        that.refresh();
                    }
                },
                error:function(data) {
                    alert('Error deleting profile.');
                }
            });
        });
        /** Cancel deletion of clicked profile */
        $('#cancel_delete_profile').off("click").on("click", function(event){
            event.preventDefault();
            $('.delete-profile').modal('hide');
        });
    },

    /** Open modal to allow for updates to be committed to profile */
    updateProfile: function(event) {
        var that = this;
        /** Do not allow bubbling from button clicks */
        event.stopPropagation();
        /** Get the profile from the parent parent div of the button clicked */
        var profile = $(event.currentTarget).parent().parent();
        /** Default the update modal values as the profile's current settings */
        label = profile.text();
        label = label.substring(10, label.length);
        color = rgb2hex(profile.css('background-color'));
        image = $('.pic', profile).children('img').attr('src');
        $('#updateProfileName').val(label);
        $('#updateProfileColor').val(color);
        /** Triggering events that occur when users type so colorpicker is accurate... */
        $('#updateProfileColor').keydown();
        $('#updateProfileColor').keypress();
        $('#updateProfileColor').keyup();
        $('#updateProfileColor').blur();
        $('#updateProfileColor').focus();
        $('#updateProfileColor').change();
        image == 'img/default-male.png' ? $('#updateProfileGender').val('m') : $('#updateProfileGender').val('f');
        /** Open the update modal */
        $('.update-profile').modal('show');
        /** Confirm update of clicked profile */
        $('#confirm_update_profile').off("click").on("click", function(event){
            event.preventDefault();
            var pid = profile.attr('id');
            var url = SLIMLOC+'/updateProfile';
            var formValues = {
                id: pid,
                name: $('#updateProfileName').val(),
                color: $('#updateProfileColor').val(),
                gender: $('#updateProfileGender').val()
            };
            $.ajax({
                url:url,
                type:'POST',
                dataType:"json",
                data: formValues,
                success:function (data) {
                    if(data.error) {
                        /** If error is returned from server, display message */
                        $('.alert-error').text(data.error.text).show();
                    }else{
                        console.log('Updated profile succesfully.');
                        $('.update-profile').modal('hide');
                        that.refresh();
                    }
                },
                error:function(data) {
                    alert('Error updating profile.');
                }
            });
        });
        /** Cancel update of clicked profile */
        $('#cancel_update_profile').off("click").on("click", function(event){
            event.preventDefault();
            $('.update-profile').modal('hide');
        });
    },

    /** Refresh profiles by resetting Collection data and retrieving profiles from database */
    refresh: function() {
        this.profiles.getProfiles();
    },

    select: function(menuItem) {
        $('.nav li').removeClass('active');
        $('.' + menuItem).addClass('active');
    }

});