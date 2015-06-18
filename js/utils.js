/** The Template Loader. Used to asynchronously load templates located in separate .html files */
window.templateLoader = {

    load: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            if (window[view]) {
                deferreds.push($.get('tpl/' + view + '.html', function(data) {
                    window[view].prototype.template = _.template(data);
                }, 'html'));
            } else {
                alert(view + " not found");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    }

};

/** Convert the given rgb value to its hex code equivalent */
function rgb2hex(rgb){
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "#" +
          ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
          ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
          ("0" + parseInt(rgb[3],10).toString(16)).slice(-2);
}