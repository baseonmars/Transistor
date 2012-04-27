define(function () {

    return function(json, type) {

        var spec = jQuery.parseJSON(json);

        if (typeof spec.error !== 'undefined') {
            return error;
        }

        var np = spec.nowplaying;

        var NowPlaying = {
            artist: {
                name: np.artist['#text'],
                corrected: np.artist.corrected
            },
            albumArtist: {
                name: np.albumArtist['#text'],
                corrected: np.albumArtist.corrected
            },
            track: {
                name: np.track['#text'],
                corrected: np.track.corrected
            },
            album: {
                name: np.album['#text'],
                corrected: np.album.corrected
            },
            ignoredMessage: {
                code: np.ignoredMessage.code,
                message: np.ignoredMessage['#text']
            }
        };

        return NowPlaying;
    };
});

