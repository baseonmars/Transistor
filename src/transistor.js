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

            var self = this;

            amplify.subscribe('transistorplayer:finished', this, this.onFinished);

            amplify.subscribe('transistorplayer:playing', this, this.onNowPlayling);
        },

        tune: function(url, ok, error) {

            var self = this;
            var request = this.api.request("radio.tune", {station: url});
            request.done(ok).fail(error);

            request.done(function (data) {
                self.station = data;
                amplify.publish("transistor:tuned", data);
            });

            return request;
        },

        play: function(ok, error) {

            var request = $.Deferred();
            request.done(ok).fail(error);

            if (this.player.hasTrack()) {
                try {
                    this.player.play();
                    request.resolve();
                } catch(e) {
                    request.reject(e);
                }
            } else {
                request = this.skip(ok, error);
            }

            return request;
        },

        pause: function() {

            this.paused = true;
            this.player.pause();
        },

        skip: function(ok, error) {

            var oldPlaying = this.playlist.current();

            var request = this.next().done(ok).fail(error);
            request.done(function() {
                if (oldPlaying) {
                    amplify.publish("transistor:skipped", oldPlaying);
                }
            });

            return request;
        },

        next: function(ok, error) {

            var next = this.playlist.next();
            var request = $.Deferred().done(ok).fail(error);

            if (!next) {

                request = this.api.request("radio.getPlaylist", {rtp: 1});

                var self = this;
                request.done(function(data) {
                    self.playlist.append(data.tracks);
                    self.player.play(self.playlist.next());
                });
                request.fail(error);
            } else {
                try {
                    this.player.play(next);
                } catch (e) {
                    request.reject(e);
                }
            }

            return request;
        },

        love: function (track, ok, error) {

            track = track || this.playlist.current();

            var request = this.api.request('track.love', {
                track: track.title,
                artist: track.artist
            }).done(ok).fail(error);

            request.done(function() {
                amplify.publish('transistor:loved', track);
            });

            return request;
        },

        ban: function (track, ok, error) {

            track = track || this.playlist.current();

            var request = this.api.request('track.ban', {
                track: track.title,
                artist: track.artist
            }).done(ok).fail(error);

            var self = this;
            request.done(function () {
                amplify.publish('transistor:banned', track);
                self.skip();
            });

            return request;
        },

        scrobble: function (track, ok, error) {

            track = track || this.playlist.current();
            
            var request = this.api.request('track.scrobble', {
                timestamp: track.start,
                track: track.name,
                artist: track.title,
                album: track.album,
                duration: track.duration,
                streamId: track.streamId
            }).done(ok).fail(error);

            request.done(function () {
                amplify.publish('transistor:scrobbled', track);
            });

            return request;
        },

        setVolume: function(vol) {
            
            this.player.setVolume(vol);
        },

        onNowPlayling: function (track) {

            return this.api.request('track.updateNowPlaying', {
                track: track.title,
                artist: track.artist,
                album: track.album,
                duration: Math.floor(track.duration/1000)
            });
        },

        onFinished: function (track) {

            this.play();
        }
    });

    return Transistor;
});
