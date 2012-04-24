define(['./services/radio.js'], function (radio) {

    var Services = {};

    $.each(radio.methods, function(key, val) {
        var hash = radio['package']+"."+key;
        Services[hash] = val;
    });

    return Services;
});
        
