define(['../responses/ok.js', '../responses/nowPlaying.js'], function (ok, nowPlaying) {

    var Track = {
        "package": 'track',
        methods: {
            love: {
                auth: true,
                method: 'POST',
                parser: function (data, type) { 
                   return JSON.stringify(ok(data, type));
                }
            },
            ban: {
                auth: true,
                method: 'POST',
                parser: function (data, type) { 
                   return JSON.stringify(ok(data, type));
                }
            },
            unlove: {
                auth: true,
                method: 'POST',
                parser: function (data, type) {
                    return JSON.stringify(ok(data, type));
                }
            },
            updateNowPlaying: {
                auth: true,
                method: 'POST',
                parser: function (data, type) { 
                   return JSON.stringify(nowPlaying(data, type));
                }
            },
            scrobble: {
                auth: true,
                method: 'POST',
                parser: function (data, type) {
                    return data;
                }
            }
        }
    };

    return Track;
});
