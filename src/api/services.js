define(['./services/radio.js', './services/track.js'], function (radio, track) {

    var Services = {};

    $.each(radio.methods, function(key, val) {
        var hash = radio['package']+"."+key;
        Services[hash] = val;
    });

    $.each(track.methods, function(key, val) {
        var hash = track['package']+"."+key;
        Services[hash] = val;
    });

    return Services;
});
        
