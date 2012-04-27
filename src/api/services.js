define([
    './services/radio.js', 
    './services/track.js',
    './services/auth.js',
    './services/artist.js'
], function (radio, track, auth, artist) {

    var Services = {};

    jQuery.each(radio.methods, function(key, val) {
        var hash = radio['package']+"."+key;
        Services[hash] = val;
    });

    jQuery.each(track.methods, function(key, val) {
        var hash = track['package']+"."+key;
        Services[hash] = val;
    });

    jQuery.each(auth.methods, function(key, val) {
        var hash = auth['package']+"."+key;
        Services[hash] = val;
    });

    jQuery.each(artist.methods, function(key, val) {
        var hash = artist['package']+"."+key;
        Services[hash] = val;
    });

    return Services;
});
        
