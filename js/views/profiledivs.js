/**
 *  DEFAULT variables for my personal directory hierarchy
 */
var BASEURL = '/projects/';
var PROJECT = 'myPharmAssist';
var SLIMLOC = BASEURL+PROJECT+'/api';

window.ProfileDivsView = Backbone.View.extend({

    tagName:'div',

    className:'profiles',

    initialize:function () {
        var self = this;
        this.model.bind("reset", this.render, this);
        this.model.bind("add", function (profile) {
            $(self.el).append(new ProfileDivView({model:profile}).render().el);
        });
    },

    render:function () {
        $(this.el).empty();
        _.each(this.model.models, function (profile) {
            $(this.el).append(new ProfileDivView({model:profile}).render().el);
        }, this);
        return this;
    }
});

window.ProfileDivView = Backbone.View.extend({

    tagName:"div",

    className:'profile col-md-4',

    initialize:function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    events: {
        "click": "getDetails",
        "mouseenter": "showButtons",
        "mouseleave": "hideButtons",
        "click .delete-btn": "deleteProfile",
        "click .update-btn": "updateProfile"
    },

    render:function () {
        var profile = this.model.toJSON();
        var delete_button = $('<button type="button" class="delete-btn btn profile-button btn-danger" ' + 
                              ' data-toggle="modal" data-target=".delete-profile">Delete</button>');
        var update_button = $('<button type="button" class="update-btn btn profile-button btn-warning" ' + 
                              ' data-toggle="modal" data-target=".update-profile">Edit</button>');
        var buttons = $('<div class="profile-buttons"></div>')
        $(buttons).append(delete_button);
        $(buttons).append(update_button);
        $(this.el).attr('id', profile.id);
        $(this.el).html(profile.name);
        $(this.el).css({'background-color':profile.color});
        $(this.el).append(buttons);
        return this;
    },

    getDetails: function(event) {
        // if(!$(event.currentTarget).is(':button')){
        //     var profile = $(this.el);
        //     var pid = profile.attr('id');
        //     window.location.replace(BASEURL+PROJECT+'/#profiles/'+pid);
        // }
    },

    showButtons: function() {
        $('.profile-button', this.el).show();
    },

    hideButtons: function() {
        $('.profile-button', this.el).fadeOut('fast');
    },

    deleteProfile: function(event) {
        $(this.el).off("click"), this.getDetails(event);
        var profile = $(this.el);
        $('#confirm_delete').off("click").on("click", function(event){
            event.preventDefault();
            var pid = profile.attr('id');
            var url = SLIMLOC+'/deleteProfile';
            $.ajax({
                url:url,
                type:'POST',
                dataType:"json",
                data: {id: pid},
                success:function (data) {
                    if(data.error) {  // If there is an error, show the error messages
                        $('.alert-error').text(data.error.text).show();
                    }else{
                        console.log('Deleted profile succesfully.');
                        $('.delete-profile').modal('hide');
                        // $('.modal-backdrop').remove();
                    }
                },
                error:function(data) {
                    alert('Error deleting profile.');
                }
            });
        });
        $('#cancel_delete').off("click").on("click", function(event){
            event.preventDefault();
            $('.delete-profile').modal('hide');
        });
    },

    updateProfile: function(event) {
        var profile = $(this.el);
        $('#confirm_update').off("click").on("click", function(event){
            event.preventDefault();
            $('#confirm_update').off();
            var pid = profile.attr('id');
            var url = SLIMLOC+'/updateProfile';
            var formValues = {
                id: pid,
                name: $('#updateName').val(),
                color: $('#updateColor').val()
            };
            console.log(formValues);
            $.ajax({
                url:url,
                type:'POST',
                dataType:"json",
                data: formValues,
                success:function (data) {
                    if(data.error) {  // If there is an error, show the error messages
                        $('.alert-error').text(data.error.text).show();
                    }else{
                        console.log('Updated profile succesfully.');
                        $('.update-profile').modal('hide');
                        // $('.modal-backdrop').remove();
                    }
                },
                error:function(data) {
                    alert('Error updating profile.');
                }
            });
        });
        $('#cancel_update').off("click").on("click", function(event){
            event.preventDefault();
            $('.update-profile').modal('hide');
        });
    }
});