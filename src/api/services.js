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

    function defineService(module) {
        jQuery.each(module.methods, function(key, val) {
            var hash = module['package']+"."+key;
            Services[hash] = val;
        });
    }

    return Services;
});
        
