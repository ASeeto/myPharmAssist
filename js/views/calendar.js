window.CalendarView = Backbone.View.extend({

    initialize:function () {
        console.log('Initializing Calendar View');
        var calendar;
    },

    render:function () {
        $(this.el).html(this.template());
        $(this.el).append('');
        $(this.el).append('<div id="calendar"></div><p> &nbsp; </p><p> &nbsp; </p>');
        /** Execute function after render completes */
        setTimeout(function() {
            /** Requires calendar div to have been rendered. */
            calendar = $("#calendar").calendar(
                {
                    tmpl_path: BASEURL+PROJECT+"/tmpls/",
                    events_source: SLIMLOC + '/getEvents',
                    onAfterViewLoad: function(view) {
                        $('.page-header h3').text(this.getTitle());
                        $('.btn-group button').removeClass('active');
                        $('button[data-calendar-view="' + view + '"]').addClass('active');
                    },
                });
            /** Requires form to have been rendered. */
            $('.pick-color').colorpicker({align:'left'});
            $('#datetime-start').datetimepicker();
            $('#datetime-end').datetimepicker();
        }, 0);
        return this;
    },

    events: {
        "click #insertEvent": "insertEvent",
        "click .calendar-nav": "calendarNav",
        "click .calendar-view": "calendarView",
        "dp.change #datetime-start": "adjustEndDatetime",
        "dp.change #datetime-end": "adjustStartDatetime"
        // "contextmenu .cal-cell": "showOptions",
        // "click": "hideOptions",
    },

    refresh: function(event){
        // https://github.com/Serhioromano/bootstrap-calendar/issues/384
        calendar.view();
    },

    adjustEndDatetime: function(event){
        $('#datetime-end').data("DateTimePicker").minDate(event.date);
    },

    adjustStartDatetime: function(event){
        $('#datetime-start').data("DateTimePicker").maxDate(event.date);
    },
    
    insertEvent: function(event){
        $('.modal-content .alert-error').hide();
        $('.popup-alert.alert-success').hide();
        event.preventDefault();
        var formValues = {
            title: $('#insertEventTitle').val(),
            // class: $('#insertEventColor').val(),
            type: $('#insertEventType').val(),
            url  : 'http://www.alexseeto.com',
            start: $('#insertEventStart').val(),
            end  : $('#insertEventEnd').val()
        };
        console.log(formValues);
        $('.insert-event').modal('hide');
        var that = this;
        $.ajax({
            url: SLIMLOC+'/insertEvent',
            type: 'POST',
            dataType: 'json',
            data: formValues,
            success: function(data){
                if(data.error) {
                    $('.modal-content .alert-error').text(data.error.text).show();
                }else{
                    that.refresh();
                    $('.insert-prescription').modal('hide');
                    $('.popup-alert.alert-success').text('Created event succesfully.').show();
                    $('.popup-alert.alert-success').fadeOut(1600, "linear");
                    console.log('Created event succesfully.');
                }
            },
            error:function(data) {
                $('.popup-alert.alert-error').text('Error creating event.').show();
            }
        });
    },
    
    // showOptions: function(event){
    //     event.preventDefault();
    //     var div  =  event.currentTarget;
    //     var dateString = $('span',$(div))
    //                      .attr('data-cal-date')
    //                      .replace(/-/g,'');
    //     var year  = dateString.substring(0,4);
    //     var month = dateString.substring(4,6);
    //     var day   = dateString.substring(6,8);
    //     var date  = String(new Date(year, month-1, day));
    //     date  = date.substring(0, date.indexOf(':')-3);
    //     if($('#calendarOptions').is(':hidden')){
    //         $('#calendarOptions').toggle();
    //     }
    //     $('#option-title').text(date);
    //     $('#calendarOptions').css({
    //         top: event.pageY,
    //         left: event.pageX
    //     });
    // },
    
    // hideOptions: function(event){
    //     $("#calendarOptions").hide();
    // },

    calendarNav: function(event){
        var btn = $(event.currentTarget);
        calendar.navigate(btn.data('calendar-nav'));
    },

    calendarView: function(event){
        var btn = $(event.currentTarget);
        calendar.view(btn.data('calendar-view'));
    },
    
    select: function(menuItem) {
        $('.nav li').removeClass('active');
        $('.' + menuItem).addClass('active');
    }

});