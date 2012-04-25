define(function () {

    return function(spec, type) {

        if (type === 'json') {
            spec = $.parseJSON(spec);
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
                title: np.track['#text'],
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

