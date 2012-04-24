define(['./responses/xspf.js',
    './responses/track.js',
'./responses/station.js'],
function (XSPF,
    Track,
    Station) {

    return {
        XSPF: XSPF,
        Track: Track,
        Station: Station
    };

});
