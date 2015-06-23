/**
 *  DEFAULT variables for my personal directory hierarchy
 */
var BASEURL = '/projects/';
var PROJECT = 'myPharmAssist';
var SLIMLOC = BASEURL+PROJECT+'/api';

window.PharmacyView = Backbone.View.extend({

    initialize:function () {
        console.log('Initializing Pharmacy View');
        this.getPharmacy();
    },

    render:function () {
        $(this.el).html(this.template());
        /** Execute function after render completes */
        setTimeout(function() {
            /** Requires map div to have been rendered. */
            // initialize(loc);
            /** Requires search text input to have been rendered. */
        }, 0);
        return this;
    },

    events: {
        "click #savePharmacy": "savePharmacy"
    },

    /** Returns address if user has pharmacy details saved */
    getPharmacy: function(event){
        $.ajax({
            url: SLIMLOC+'/getPharmacy',
            type: 'GET',
            data: 'json',
            success: function(data){
                if(data !='false'){
                    data = jQuery.parseJSON(data);
                    $('#searchTextField').val(data.address);
                    /** Convert given address to geocode */
                    geocoder.geocode({address: data.address}, function(results, status){
                        if (status == google.maps.GeocoderStatus.OK){
                            /** Get first result */
                            var locData = results[0].geometry.location;
                            /** Set new geocode based off of location input */
                            var lat = String(locData.lat());
                            var lng = String(locData.lng());
                            /** Set new location */
                            loc = new google.maps.LatLng(lat, lng);
                            /** Perform new search with given location */
                            initialize(loc);
                            /** Pins the given location with a blue marker */
                            pin(loc);
                        }
                    });
                    /** Store information in variables */
                    company = data.company;
                    address = data.address;
                    website = '<a href="' + data.website + '" target="_blank">Link</a>';
                    contact = data.contact;
                    /** Set HTML string for infowindow content */
                    html =  '<table class="details col-md-12">' +
                                '<tbody>' +
                                    '<tr><td><b>Company:</b></td><td><span id="company">' + company + '</span></td></tr>' +
                                    '<tr><td><b>Address:</b></td><td><span id="address">' + address + '</span></td></tr>' +
                                    '<tr><td><b>Website:</b></td><td><span id="website">' + website + '</span></td></tr>' +
                                    '<tr><td><b>Contact:</b></td><td><span id="contact">' + contact + '</span></td></tr>' +
                                '</tbody>' +
                            '</table>';
                    $('#pharmacyDetails').html(
                        '<h2>Details</h2><p> &nbsp; </p>' + html +
                        '<p> &nbsp; </p>' +
                        '<button id="savePharmacy" class="btn btn-success">Save as My Pharmacy</button>'
                    );
                    autosuggest();
                }else{
                    /** Default location is Boston, MA */
                    var loc = new google.maps.LatLng(42.3601, -71.0589);
                    initialize(loc);
                    autosuggest();
                }
            }
        });
    },

    /** If user has pharmacy saved we update it, otherwise we insert */
    savePharmacy: function(event){
        var that = this;
        $.ajax({
            url: SLIMLOC+'/getPharmacy',
            type: 'GET',
            success: function(data){
                if(data != 'false'){
                    that.updatePharmacy();
                }else{
                    that.insertPharmacy();
                }
            }
        });
    },

    updatePharmacy: function(event){
        var pharmacyDetails = {
            company: $('#company').text(),
            address: $('#address').text(),
            website: $('#website a').attr('href'),
            contact: $('#contact').text()
        }
        $.ajax({
            url: SLIMLOC+'/updatePharmacy',
            type: 'POST',
            dataType: 'json',
            data: pharmacyDetails,
            success: function(data){
                $('.popup-alert.alert-success').text('Updated user pharmacy succesfully.').show();
                $('.popup-alert.alert-success').fadeOut(2000, "linear");
                console.log('Updated user pharmacy succesfully.');
            },
            error: function(data){
                $('.popup-alert.alert-error').text('Error updating user pharmacy.').show();
            }
        });
    },

    insertPharmacy: function(event){
        var pharmacyDetails = {
            company: $('#company').text(),
            address: $('#address').text(),
            website: $('#website a').attr('href'),
            contact: $('#contact').text()
        }
        $.ajax({
            url: SLIMLOC+'/insertPharmacy',
            type: 'POST',
            dataType: 'json',
            data: pharmacyDetails,
            success: function(data){
                $('.popup-alert.alert-success').text('Saved pharmacy succesfully.').show();
                $('.popup-alert.alert-success').fadeOut(2000, "linear");
                console.log('Saved pharmacy successfully.');
            },
            error: function(data){
                $('.popup-alert.alert-error').text('Error saving pharmacy.').show();
            }
        });
    },

    deletePharmacy: function(event){
        return;
    },

    select: function(menuItem) {
        $('.nav li').removeClass('active');
        $('.' + menuItem).addClass('active');
    }

});