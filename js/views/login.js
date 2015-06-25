window.LoginView = Backbone.View.extend({

    initialize:function () {
        console.log('Initializing Login View');
    },

    events: {
        "click #loginButton": "login",
        "click #registerButton": "register"
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    },

    login:function (event) {
        event.preventDefault(); // Don't let this button submit the form
        $('.alert-error').hide(); // Hide any errors on a new submit
        var url = SLIMLOC+'/login';
        console.log('Logging in... ');
        var formValues = {
            email: $('#inputEmail').val(),
            password: $('#inputPassword').val()
        };

        $.ajax({
            url:url,
            type:'POST',
            dataType:"json",
            data: formValues,
            success:function (data) {
                console.log(["Login request details: ", data]);
               
                if(data.error) {  // If there is an error, show the error messages
                    $('.alert-error').text(data.error.text).show();
                }
                else { // If not, send them back to the home page
                    $("#logout").show();
                    window.location.replace(BASEURL+PROJECT+'/#home');
                }
            }
        });
    },

    register:function (event) {
        event.preventDefault(); // Don't let this button submit the form
        $('.alert-error').hide(); // Hide any errors on a new submit
        var url = SLIMLOC+'/register';
        console.log('Registering... ');
        var formValues = {
            email: $('#inputEmail').val(),
            password: $('#inputPassword').val()
        };

        $.ajax({
            url:url,
            type:'POST',
            dataType:"json",
            data: formValues,
            success:function (data) {
                console.log(["Registration details: ", data]);
               
                if(data.error) {  // If there is an error, show the error messages
                    $('.alert-error').text(data.error.text).show();
                }
                else { // If not, send them back to the home page
                    $("#logout").show();
                    window.location.replace(BASEURL+PROJECT+'/#home');
                }
            }
        });
    }
});