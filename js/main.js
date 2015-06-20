/**
 *  DEFAULT variables for my personal directory hierarchy
 */
var BASEURL = '/projects/';
var PROJECT = 'myPharmAssist';
var SLIMLOC = BASEURL+PROJECT+'/api';

// Tell jQuery to watch for any 401 or 403 errors and handle them appropriately
$.ajaxSetup({
    statusCode: {
        401: function(){
            // Redirec the to the login page.
            window.location.replace(BASEURL+PROJECT+'/#login');
         
        },
        403: function() {
            // 403 -- Access denied
            window.location.replace(BASEURL+PROJECT+'/#denied');
            alert('This page cannot be accessed.');
        }
    }
});

window.Router = Backbone.Router.extend({

    routes: {
        "": "login",
        "login": "login",
        "logout": "logout",
        "home": "home",
        "pharmacy": "pharmacy",
        "profiles": "profiles",
        "profiles/:id": "prescriptions",
        "calendar": "calendar",
        "contact": "contact",
        "register":"register"
    },

    login: function() {
        $('#content').html(new LoginView().render().el);
    },

    logout: function() {
        event.preventDefault();
        $('.nav li').removeClass('active');
        var page = 'login';
        var url = SLIMLOC+'/logout';
        console.log('Logging out... ');
        $.ajax({
            url:url,
            type:'POST',
            success:function () {
                window.location.replace(BASEURL+PROJECT+'/#'+page);
                $("#logout").hide();
            }
        });
    },

    register: function() {
        $('#content').html(new RegisterView().render().el);
    },
    
    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.render().el);

        // Close the search dropdown on click anywhere in the UI
        $('body').click(function () {
            $('.dropdown').removeClass("open");
        });
    },

    home: function() {
        $('.nav li').removeClass('active');
        var page = 'home';
        var url = SLIMLOC+'/session';
        $.ajax({
            url:url,
            type:'GET',
            success:function () {
                window.location.replace(BASEURL+PROJECT+'/#'+page);
                if (!this.homeView) {
                    this.homeView = new HomeView();
                    this.homeView.render();
                }
                $("#content").html(this.homeView.el);
            }
        });
    },

    pharmacy: function () {
        this.headerView.select('pharmacy-menu');
        var page = 'pharmacy';
        var url = SLIMLOC+'/session';
        $.ajax({
            url:url,
            type:'GET',
            success:function () {
                window.location.replace(BASEURL+PROJECT+'/#'+page);
                if (!this.pharmacyView) {
                    this.pharmacyView = new PharmacyView();
                    this.pharmacyView.render();
                }
                $("#content").html(this.pharmacyView.el);
            },
            error:function () {
                window.location.replace(BASEURL+PROJECT+'/#login');
                $('.nav li').removeClass('active');
            }
        });
    },

    profiles: function () {
        this.headerView.select('prescription-menu');
        var page = 'profiles';
        var url = SLIMLOC+'/session';
        $.ajax({
            url:url,
            type:'GET',
            success:function (response) {
                window.location.replace(BASEURL+PROJECT+'/#'+page);
                if (!this.profilesView) {
                    this.profilesView = new ProfilesView();
                    this.profilesView.render();
                }
                $('#content').html(this.profilesView.el);
            },
            error:function () {
                window.location.replace(BASEURL+PROJECT+'/#login');
                $('.nav li').removeClass('active');
            }
        });
    },

    prescriptions: function(id) {
        var profile = new Profile({id: id});
        profile.fetch({
            success: function (data) {
                $('#content').html(new PrescriptionsView({model: data}).render().el);
            }
        });
    },

    calendar: function () {
        this.headerView.select('calendar-menu');
        var page = 'calendar';
        var url = SLIMLOC+'/session';
        $.ajax({
            url:url,
            type:'GET',
            success:function () {
                window.location.replace(BASEURL+PROJECT+'/#'+page);
                if (!this.calendarView) {
                    this.calendarView = new CalendarView();
                    this.calendarView.render();
                }
                $('#content').html(this.calendarView.el);
            },
            error:function () {
                window.location.replace(BASEURL+PROJECT+'/#login');
                $('.nav li').removeClass('active');
            }
        });
    },

    contact: function () {
        if (!this.contactView) {
            this.contactView = new ContactView();
            this.contactView.render();
        }
        $('#content').html(this.contactView.el);
        this.headerView.select('contact-menu');
    }

});

templates = [ "CalendarView", "ContactView", "HeaderView", "HomeView", "LoginView", 
              "PharmacyView", "ProfilesView", "PrescriptionsView", "RegisterView" ];

templateLoader.load(templates,
    function () {
        app = new Router();
        Backbone.history.start();
    });