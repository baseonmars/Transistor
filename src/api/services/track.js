define([
    '../responses/ok', 
    '../responses/nowPlaying'
], function (ok, nowPlaying) {

    var Track = {
        "package": 'track',
        methods: {
            love: {
                auth: true,
                method: 'POST',
                parser: function (data) { 
                   return ok(data);
                }
            },
            ban: {
                auth: true,
                method: 'POST',
                parser: function (data) { 
                   return ok(data);
                }
            },
            unlove: {
                auth: true,
                method: 'POST',
                parser: function (data) {
                    return ok(data, type);
                }
            },
            updateNowPlaying: {
                auth: true,
                method: 'POST',
                parser: function (data) { 
                   return nowPlaying(data);
                }
            },
            scrobble: {
                auth: true,
                method: 'POST',
                parser: function (data) {
                    return data;
                }
            }
        }
    };

    return Track;
});
