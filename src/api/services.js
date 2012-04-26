define([
    './services/radio.js', 
    './services/track.js',
    './services/auth.js'
], function (radio, track, auth) {

    var Services = {};

    $.each(radio.methods, function(key, val) {
        var hash = radio['package']+"."+key;
        Services[hash] = val;
    });

    $.each(track.methods, function(key, val) {
        var hash = track['package']+"."+key;
        Services[hash] = val;
    });

    $.each(auth.methods, function(key, val) {
        var hash = auth['package']+"."+key;
        Services[hash] = val;
    });

    return Services;
});
        
