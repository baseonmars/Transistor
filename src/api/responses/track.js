define(function () {

    return function(spec, type) {

        if (type === 'json') {
            spec = jQuery.parseJSON(spec);
        }

        var track = {
            album         : spec.album,
            albumid       : spec.extension.albumid,
            application   : spec.extension.application,
            artist        : spec.creator,
            artistid      : spec.extension.artistid,
            artistpage    : spec.extension.artistpage,
            buyAlbumURL   : spec.extension.buyAlbumURL,
            buyTrackURL   : spec.extension.buyTrackURL,
            context       : spec.extension.context,
            duration      : spec.duration,
            explicit      : spec.extension.explicit,
            freeTrackURL  : spec.extension.freeTrackURL,
            identifier    : spec.identifier,
            image         : spec.image,
            location      : spec.location,
            loved         : spec.extension.loved,
            streamid      : spec.extension.streamid,
            title         : spec.title,
            trackauth     : spec.extension.trackauth,
            trackpage     : spec.extension.trackpage
        };
        return track;
    };
});
