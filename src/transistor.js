define([
    '../src/playlist.js', 
    '../src/api/lfmclient.js',
    '../src/player.js'
], function (Playlist, API, Player) {

    var Transistor = Class.extend({

        init: function(cfg) {
            cfg = cfg || {}; 

            this.player      = cfg.player || new Player();
            this.api         = cfg.api || new API(cfg.key, cfg.secret, cfg.session);
            this.playlist    = cfg.playlist || new Playlist();

            this.playlist.api    = this.api;
            this.player.playlist = this.playlist;
            this.station = null;
        },

        tune: function(url, ok, error) {

            var self = this;
            var request = this.api.post("radio.tune", {station: url});

            request.fail(error);
            request.done(function (data) {
                self.station = data;
            });
            return request;
        },

        play: function(ok, error) {

            var next = this.playlist.next();

            if ( !next ) {
                var request = this.api.get("radio.getPlaylist");
                var self = this;

                request.fail(error);
                request.done(function(data) {
                    console.log(data);
                    self.playlist.append(data.tracks);
                    self.player.play(self.playlist.next());
                });
            } else {
                this.player.play(next);
            }
        },

        pause: function() {
            this.paused = true;
            this.player.pause();
        },

        skip: function() {
            this.player.skip();
        },

        stopNext: function() {

        },

        love: function () {
            this.api.post('track.love', {
                track: this.current().name,
                artist: this.current().artist
            });
        },

        ban: function () {
            this.api.post('track.ban', {
                track: this.current().name,
                artist: this.current().artist
            });
        },

        scrobble: function () {
            this.api.post('track.scrobble', {
                timestamp: this.current().start,
                track: this.current().name,
                artist: this.current().artist,
                album: this.current().album,
                duration: this.current().duration,
                streamId: this.current().streamId
            });
        }
    });

    return Transistor;
});
