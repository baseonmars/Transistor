define([
    'jquery',
    './services/radio', 
    './services/track',
    './services/auth',
    './services/artist'
], function (jQuery, radio, track, auth, artist) {

    var Services = {};

    defineService(radio);
    defineService(auth);
    defineService(track);
    defineService(artist);

    function defineService(pkg) {
        jQuery.each(pkg.methods, function(key, val) {
            var hash = pkg['package']+"."+key;
            Services[hash] = val;
        });
    }

    return Services;
});
        
