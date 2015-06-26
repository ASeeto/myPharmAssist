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
        "mouseenter": "showButtons",
        "mouseleave": "hideButtons"
    },

    render:function () {

        /** Default Pictures */
        m = 'img/default-male.png';
        f = 'img/default-female.png';

        /** Get profile details from model */
        var profile = this.model.toJSON();
        id     = profile.id;
        img    = profile.img ? profile.img : (profile.gender == 'm' ? m : f);
        name   = profile.name;
        color  = profile.color;

        /** Create buttons for Profile Div */
        var buttons = $('<div class="profile-buttons"></div>')
        var delete_button = $('<button type="button" class="delete-btn btn profile-button btn-danger" ' + 
                              ' data-toggle="modal" data-target=".delete-profile">Delete</button>');
        var update_button = $('<button type="button" class="update-btn btn profile-button btn-warning" ' + 
                              ' data-toggle="modal" data-target=".update-profile">Edit</button>');
        $(buttons).append(delete_button);
        $(buttons).append(update_button);

        /** Create content for Profile Div */
        var image = $('<div class="pic"><img src="'+img+'"></div>');
        var text = $('<div class="text">'+name+'</div>');

        /** Get profile details from model */

        /** Append all */
        $(this.el).append(buttons);
        $(this.el).append(image);
        $(this.el).append(text);

        /** Return Profile */
        $(this.el).attr('id', id);
        $(this.el).css({'background-color':profile.color});
        return this;

    },

    /** Show this profile's buttons */
    showButtons: function() {
        $('.profile-button', this.el).show();
    },

    /** Hide this profile's buttons */
    hideButtons: function() {
        $('.profile-button', this.el).hide();
    }
});