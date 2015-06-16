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
        var html =  '<h2>' + profile.name + '</h2>';
        $(this.el).html(html);
        $(this.el).css({'background-color':profile.color});
        return this;
    }

});