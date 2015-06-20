/** Default location is Boston, MA */
var loc = new google.maps.LatLng(42.3601, -71.0589);

/** Variables to be set by search helper functions */
var map;
var service;

/** Initializes google map infowindow for markers */
var infowindow = new google.maps.InfoWindow();

/** Initializes Google Maps API geocoder */
var geocoder = new google.maps.Geocoder();

/** Initialize map creation and pharmacy search */
function initialize(location) {
    $('#map-canvas').css({'background-color':'#fff'});
    $('#map-canvas').html('Loading...');
    createMap(location);
    pharmacySearch(location);
}

/** Enable autocomplete and create listener for place change */
function autosuggest() {
    /** Variables for Autocomplete */
    var input = document.getElementById('searchTextField');
    var options = {componentRestrictions: {country: 'US'}};
    var autocomplete = new google.maps.places.Autocomplete(input, options);

    /** Creates listener for when place changes */
    google.maps.event.addListener(autocomplete, 'place_changed', function (){
        /** Initialize variable to store formatted input address */
        address = autocomplete.getPlace().formatted_address;
        /** Convert given address to geocode */
        geocoder.geocode({address: address}, function(results, status){
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
    });
}

/** Pins the given location with a blue marker */
function pin(location) {
    var inputloc = new google.maps.Marker({
        clickable: false,
        icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
        new google.maps.Size(22, 22),
        new google.maps.Point(0, 18),
        new google.maps.Point(11, 11)),
        shadow: null,
        zIndex: 999,
        map: map
    });
    inputloc.setPosition(location);
}

/** Create Map */
function createMap(location) {
    /** Create map with given location as center */
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: location,
        zoom: 14
    });
    /** Initialize service search */
    service = new google.maps.places.PlacesService(map);
}

/** Search for Pharmacies near given location */
function pharmacySearch(location) {
    /** Specify service search options */
    var request = {
        location: location,
        radius: 3000,
        types: ['pharmacy']
    };
    /** Execute service search. Use callback function to iterate through results */
    service.nearbySearch(request, callback);
}

/** Create markers using result set from pharmacySearch() */
function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

/** Create a red marker for given place */
function createMarker(place) {
    /** Determine location and generate marker */
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    /** Add listener for this marker to open location's infowindow */
    google.maps.event.addListener(marker, 'click', function () {

        /** Default content until details are retrieved */
        infowindow.setContent('Retrieving Details...');

        /** Update all content for location's infowindow */
        service.getDetails(place, function(details, status) {

            /** Store information in variables */
            company = details.name;
            address = details.formatted_address;
            website = '<a href="' + details.website + '" target="_blank">Link</a>';
            contact = details.formatted_phone_number;

            /** Set HTML string for infowindow content */
            html =  '<table class="details col-md-12">' +
                        '<tbody>' +
                            '<tr><td><b>Company:</b></td><td>' + company + '</td></tr>' +
                            '<tr><td><b>Address:</b></td><td>' + address + '</td></tr>' +
                            '<tr><td><b>Website:</b></td><td>' + website + '</td></tr>' +
                            '<tr><td><b>Contact:</b></td><td>' + contact + '</td></tr>' +
                        '</tbody>' +
                    '</table>';

            /** Update infowindow content */
            infowindow.setContent(html);
            $('.pharmacy.col-md-3').html('<h2>Details</h2>'+html);

        });

        /** Open marker's infowindow */
        infowindow.open(map, this);
    });
}