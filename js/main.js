// Tell jQuery to watch for any 401 or 403 errors and handle them appropriately
$.ajaxSetup({
    statusCode: {
        401: function(){
            // Redirect to the login page.
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
        "about": "about"
    },

    header: function() {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.render().el);
        this.switchcsstext();
        if ($('body').hasClass('calendar') && 
            !$('.calendar-menu').hasClass('active')){ 
            $('body').removeClass('calendar');
        }
        $('body').css({'background-image':'none'});
    },

    /** Correct #switchcss text based on current style sheet */
    switchcsstext: function(){
        style = $('#current_style').attr('href');
        if(style == 'css/dark.css'){
            $('#switchcss a').text('Light Side');
        }
        else{
            $('#switchcss a').text('Dark Side');
        }
    },

    login: function() {
        if (this.headerView) { this.headerView.remove(); }
        $('body').css({'background-image':'url(img/bg-signin.jpg)'});
        $('#content').html(new LoginView({className:'signin col-md-6 col-md-offset-3'}).render().el);
    },

    logout: function() {
        event.preventDefault();
        $('.nav li').removeClass('active');
        var page = 'login';
        var url = SLIMLOC+'/logout';
        var el = this;
        console.log('Logging out... ');
        $.ajax({
            url:url,
            type:'POST',
            success:function () {
                if (el.headerView) { el.headerView.remove(); }
                $('body').css({'background-image':'url(img/bg-signin.jpg)'});
                window.location.replace(BASEURL+PROJECT+'/#'+page);
                $("#logout").hide();
            }
        });
    },

    initialize: function () {
        // Close the search dropdown on click anywhere in the UI
        $('body').click(function () {
            $('.dropdown').removeClass("open");
        });
    },

    home: function() {
        $('.nav li').removeClass('active');
        var page = 'home';
        var url = SLIMLOC+'/session';
        var el = this;
        $.ajax({
            url:url,
            type:'GET',
            success:function () {
                window.location.replace(BASEURL+PROJECT+'/#'+page);
                el.header();
                if (!this.homeView) {
                    this.homeView = new HomeView();
                    this.homeView.render();
                }
                $("#content").html(this.homeView.el);
            }
        });
    },

    pharmacy: function () {
        var page = 'pharmacy';
        var url = SLIMLOC+'/session';
        var el = this;
        $.ajax({
            url:url,
            type:'GET',
            success:function () {
                window.location.replace(BASEURL+PROJECT+'/#'+page);
                el.header();
                if (!this.pharmacyView) {
                    el.headerView.select('pharmacy-menu');
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
        var page = 'profiles';
        var url = SLIMLOC+'/session';
        var el = this;
        $.ajax({
            url:url,
            type:'GET',
            success:function (response) {
                window.location.replace(BASEURL+PROJECT+'/#'+page);
                el.header();
                if (!this.profilesView) {
                    el.headerView.select('profiles-menu');
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
        var el = this;
        profile.fetch({
            success: function (data) {
                el.header();
                el.headerView.select('profiles-menu');
                $('#content').html(new PrescriptionsView({model: data}).render().el);
            }
        });
    },

    calendar: function () {
        var page = 'calendar';
        var url = SLIMLOC+'/session';
        var el = this;
        $.ajax({
            url:url,
            type:'GET',
            success:function () {
                window.location.replace(BASEURL+PROJECT+'/#'+page);
                el.header();
                if (!this.calendarView) {
                    el.headerView.select('calendar-menu');
                    $('body').addClass('calendar');
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

    about: function () {
        this.header();
        this.headerView.select('about-menu');
        if (!this.aboutView) {
            this.aboutView = new AboutView();
            this.aboutView.render();
        }
        $('#content').html(this.aboutView.el);
    }

});

templates = [ "AboutView", "CalendarView", "HeaderView", "HomeView", "LoginView", 
              "PharmacyView", "ProfilesView", "PrescriptionsView" ];

templateLoader.load(templates,
    function () {
        app = new Router();
        Backbone.history.start();
    });