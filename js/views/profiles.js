window.ProfilesView = Backbone.View.extend({

    tagName:'div',

    className:'profiles',

    initialize:function () {
        var self = this;
        this.model.bind("reset", this.render, this);
        this.model.bind("add", function (profile) {
            $(self.el).append(new ProfileView({model:profile}).render().el);
        });
    },

    render:function () {
        $(this.el).empty();
        _.each(this.model.models, function (profile) {
            $(this.el).append(new ProfileView({model:profile}).render().el);
        }, this);
        return this;
    }
});

window.ProfileView = Backbone.View.extend({

    tagName:"div",

    className:'profile col-md-4',

    initialize:function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render:function () {
        var profile = this.model.toJSON();
        var delete_button = $('<button type="button" class="btn profile-button btn-danger"  data-toggle="modal" data-target=".delete-profile">-</button>');
        var update_button = $('<button type="button" class="btn profile-button btn-warning" data-toggle="modal" data-target=".update-profile">Edit</button>');
        var buttons = $('<div class="profile-buttons"></div>')
        $(buttons).append(delete_button);
        $(buttons).append(update_button);
        $(this.el).attr('id', profile.id);
        $(this.el).css({'background-color':profile.color});
        $(this.el).html(profile.name);
        $(this.el).append(buttons);
        return this;
    }

});