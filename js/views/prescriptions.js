/**
 *  DEFAULT variables for my personal directory hierarchy
 */
var BASEURL = '/projects/';
var PROJECT = 'myPharmAssist';
var SLIMLOC = BASEURL+PROJECT+'/api';

window.PrescriptionsView = Backbone.View.extend({

    initialize:function () {
        console.log('Initializing Prescriptions View');
        this.profile = new ProfileDivView({model: this.model}).render().el;
        this.prescriptions = new PrescriptionCollection();
        this.prescriptionsView = new PrescriptionsDivsView({model: this.prescriptions, className: 'prescriptions'});
    },

    render:function () {
        $(this.el).html(this.template());
        /** Append this model */
        $('#profiledetail', this.el).append(this.profile);
        /** Retrieve prescriptions to display from database */
        this.prescriptions.getPrescriptions(this.model.toJSON().id);
        /** Append rendered prescriptions to template */
        $('#prescriptions', this.el).append(this.prescriptionsView.render().el);

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
        "click #insertPrescription": "insertPrescription",
        "click .delete-btn": "deleteProfile",
        "click .update-btn": "updateProfile",
        "click .deletePrescription": "deletePrescription",
        "hidden.bs.modal .modal": "resetForms"
    },

    /** Open modal to allow for prescription creation */
    insertPrescription: function() {
        event.preventDefault();
        $('.alert-error').hide();
        var url = SLIMLOC+'/insertPrescription';
        var formValues = {
            profile_id: this.model.toJSON().id,
            medication: $('#medication').val(),
            strength:   $('#strength').val(),
            quantity:   $('#quantity').val(),
            route:      $('#route').val(),
            frequency:  $('#frequency').val(),
            dispense:   $('#dispense').val(),
            refills:    $('#refills').val(),
        };
        var that = this;
        $.ajax({
            url:url,
            type:'POST',
            dataType:"json",
            data: formValues,
            success:function (data) {
                if(data.error) {
                    $('.alert-error').text(data.error.text).show();
                }else{
                    console.log('Created prescription succesfully.');
                    $('.insert-prescription').modal('hide');
                    that.refresh();
                }
            },
            error:function(data) {
                alert('Error creating prescription.');
            }
        });
    },

    /** Open modal to allow for prescription deletion */
    deletePrescription: function(event) {
        var that = this;
        /** Do not allow bubbling from button clicks */
        event.stopPropagation();
        /** Get the prescription from the parent parent div of the button clicked */
        var prescription = $(event.currentTarget).parent().parent();
        /** Open the delete modal */
        $('.delete-prescription').modal('show');
        /** Confirm deletion of clicked prescription */
        $('#confirm_delete_prescription').off("click").on("click", function(event){
            event.preventDefault();
            var pid = prescription.attr('id');
            var profile_id = this.model.toJSON().id;
            var url = SLIMLOC+'/deletePrescription';
            $.ajax({
                url:url,
                type:'POST',
                dataType:"json",
                data: {id: pid, profile_id: profile_id},
                success:function (data) {
                    if(data.error) {
                        /** If error is returned from server, display message */
                        $('.alert-error').text(data.error.text).show();
                    }else{
                        console.log('Deleted prescription succesfully.');
                        $('.delete-prescription').modal('hide');
                        that.redirect();
                    }
                },
                error:function(data) {
                    alert('Error deleting prescription.');
                }
            });
        });
        /** Cancel deletion of clicked prescription */
        $('#cancel_delete_prescription').off("click").on("click", function(event){
            event.preventDefault();
            $('.delete-prescription').modal('hide');
        });
    },

    /** Refresh prescriptions by resetting Collection data and retrieving prescriptions from database */
    refresh: function() {
        this.prescriptions.getPrescriptions(this.model.toJSON().id);
    },

    /** Reset form inputs to defaults */
    resetForms: function() {
        $(this.el).find('form')[0].reset();
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
                        that.redirect();
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
        label = profile.clone().children().remove().end().text();
        color = rgb2hex(profile.css('background-color'));
        $('#updateProfileName').val(label);
        $('#updateProfileColor').val(color);
        /** Triggering events that occur when users type so colorpicker is accurate... */
        $('#updateProfileColor').keydown();
        $('#updateProfileColor').keypress();
        $('#updateProfileColor').keyup();
        $('#updateProfileColor').blur();
        $('#updateProfileColor').focus();
        $('#updateProfileColor').change();
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
                color: $('#updateProfileColor').val()
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
                        that.refreshProfile();
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

    redirect: function() {
        window.location.replace(BASEURL+PROJECT+'/#profiles');
    },

    refreshProfile: function() {
        var profile = new Profile({id: this.model.toJSON().id});
        profile.fetch({
            success: function (data) {
                this.profile = new ProfileDivView({model: data}).render().el;
                $('#profiledetail', this.el).children().remove();
                $('#profiledetail', this.el).append(this.profile);
            }
        });
    }

});