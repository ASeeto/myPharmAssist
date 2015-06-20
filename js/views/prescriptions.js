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
        "click .delete-btn": "deleteProfile",
        "click .update-btn": "updateProfile",
        "click #insertPrescription": "insertPrescription",
        "click .duplicatePrescription": "duplicatePrescription",
        "click .resetPrescription": "resetPrescription",
        "click .deletePrescription": "deletePrescription",
        "click .updatePrescription": "updatePrescription",
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
            refills:    $('#refills').val()
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

    /** Duplicate a prescription */
    duplicatePrescription: function(event) {
        $('.alert-error').hide();
        var that = this;
        /** Get the prescription from the parent parent div of the button clicked */
        var prescription = $(event.currentTarget).parent().parent();
        /** Get input data from row */
        prescription_id = prescription.attr('id');
        profile_id      = this.model.toJSON().id;
        var url = SLIMLOC+'/prescriptions/'+profile_id+'/'+prescription_id;
        $.ajax({
            url:url,
            type:'GET',
            dataType:"json",
            success:function (data) {
                /** Insert new prescription using retrieved input data */
                var prescriptions = that;
                var url = SLIMLOC+'/insertPrescription';
                var formValues = {
                    profile_id: prescriptions.model.toJSON().id,
                    medication: data[0].medication,
                    strength:   data[0].strength,
                    quantity:   data[0].quantity,
                    route:      data[0].route,
                    frequency:  data[0].frequency,
                    dispense:   data[0].dispense,
                    refills:    data[0].refills
                };
                $.ajax({
                    url:url,
                    type:'POST',
                    dataType:"json",
                    data: formValues,
                    success:function (data) {
                        if(data.error) {
                            $('.alert-error').text(data.error.text).show();
                        }else{
                            prescriptions.refresh();
                            $('.alert-success').text('Duplicated prescription succesfully.').show();
                            $('.alert-success').fadeOut(1600, "linear");
                            console.log('Duplicated prescription succesfully.');
                        }
                    },
                    error:function(data) {
                        alert('Error duplicating prescription.');
                    }
                });
            },
            error:function(data) {
                alert('Error in duplicating prescription.');
            }
        });
    },

    /** Revert prescription to its original saved form */
    resetPrescription: function(event) {
        $('.alert-error').hide();
        /** Get the prescription from the parent parent div of the button clicked */
        var prescription = $(event.currentTarget).parent().parent();
        /** Get input data from row */
        prescription_id = prescription.attr('id');
        profile_id      = this.model.toJSON().id;
        var url = SLIMLOC+'/prescriptions/'+profile_id+'/'+prescription_id;
        $.ajax({
            url:url,
            type:'GET',
            dataType:"json",
            success:function (data) {
                $('td:nth-child(1) input', prescription).val(data[0].medication);
                $('td:nth-child(2) input', prescription).val(data[0].strength);
                $('td:nth-child(3) select', prescription).val(data[0].quantity);
                $('td:nth-child(4) select', prescription).val(data[0].route);
                $('td:nth-child(5) select', prescription).val(data[0].frequency);
                $('td:nth-child(6) input', prescription).val(data[0].dispense);
                $('td:nth-child(7) input', prescription).val(data[0].refills);
                $('.alert-success').text('Reset prescription succesfully.').show();
                $('.alert-success').fadeOut(1600, "linear");
                console.log('Reset prescription succesfully.');
            },
            error:function(data) {
                alert('Error in resetting to saved prescription data.');
            }
        });
    },

    /** Open modal to allow for prescription deletion */
    deletePrescription: function(event) {
        var that = this;
        $('.alert-error').hide();
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
            var profile_id = that.model.toJSON().id;
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
                        that.refresh();
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

    /** Commit updates to prescription */
    updatePrescription: function(event) {
        $('.alert-error').hide();
        /** Get the prescription from the parent parent div of the button clicked */
        var prescription = $(event.currentTarget).parent().parent();
        /** Get input data from row */
        formValues = {
            prescription_id : prescription.attr('id'),
            profile_id      : this.model.toJSON().id,
            medication      : $('td:nth-child(1) input'  , prescription).val(),
            strength        : $('td:nth-child(2) input'  , prescription).val(),
            quantity        : $('td:nth-child(3) select' , prescription).val(),
            route           : $('td:nth-child(4) select' , prescription).val(),
            frequency       : $('td:nth-child(5) select' , prescription).val(),
            dispense        : $('td:nth-child(6) input'  , prescription).val(),
            refills         : $('td:nth-child(7) input'  , prescription).val()
        }
        var url = SLIMLOC+'/updatePrescription';
        $.ajax({
            url:url,
            type:'POST',
            dataType:"json",
            data: formValues,
            success:function (data) {
                if(data.error) {
                    /** If error is returned from server, display message */
                    $('.alert-error').text(formValues.medication + ' did not save properly. ' + data.error.text).show();
                }else{
                    $('.alert-success').text('Updated prescription succesfully.').show();
                    $('.alert-success').fadeOut(1600, "linear");
                    console.log('Updated prescription succesfully.');
                }
            },
            error:function(data) {
                alert('Error updating prescription.');
            }
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