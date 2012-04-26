define([
    '../src/playlist.js', 
    '../src/api/lfmclient.js',
    '../src/player.js'
], function (Playlist, API, Player) {

    var Transistor = Class.extend({

        init: function(cfg) {
            cfg = cfg || {}; 

            this.player      = cfg.player || new Player(cfg.swfUrl || 'lib');
            this.api         = cfg.api || new API(cfg.key, cfg.secret, cfg.session);
            this.playlist    = cfg.playlist || new Playlist();
            this.scrobbling  = false === cfg.scrobble ? false : true;

            this.playlist.api    = this.api;
            this.player.playlist = this.playlist;
            this.station = null;

            var self = this;

            amplify.subscribe('transistorplayer:finished', this, this.onFinished);
            amplify.subscribe('transistorplayer:playing', this, this.onNowPlayling);
            amplify.subscribe('transistorplayer:scrobblepoint', this, this.onScrobblePoint);
            amplify.subscribe('transistorplayer:whileplayling', this, this.onPlayback);

            var token = $.url().param('token');

            if (!this.api.session && token) {
                this.getSession(token);
            } 
        },

        /**
        * Authenticate a user, or enter them into the web auth flow
        * @param string session The session key
        */
        auth: function(session) {

            if (session) {
                this.api.session = session;
            } else {
                var cookie = $.cookie('transistor');
                if (cookie) {
                    this.api.session = cookie;
                } else {
                    this.api.authFlow();
                }
            }
        },

        deauth: function () {
            $.cookie('transistor', null);
            this.api.session = null;
        },

        getSession: function (token) {

            var response = this.api.request('auth.getSession', {
                token: token
            });

            var auth = this.api.request('auth.getSession', {
                token: token
            });

            var self = this;
            auth.done(function (session) {

                self.api.session = session.key;

                $.cookie('transistor', session.key, {expires: 365});

                amplify.publish('transistor:authorised', session);

                // clean up the url
                if (window.history && window.history.pushState) {
                    window.history.pushState(null, window.document.title, window.location.pathname);
                }
            });

            auth.fail(function (data) {
                console.log('Auth failed', data);
            });

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
            if (oldPlaying) {
                amplify.publish("transistor:skipped", oldPlaying);
            }

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
                    request.resolve();
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

            var request;
            if (this.scrobbling) {
                track = track || this.playlist.current();

                request = this.api.request("track.scrobble", {
                    "artist"    : track.artist,
                    "track"     : track.title,
                    "timestamp" : track.start,
                    "album"     : track.album,
                    "duration"  : Math.floor(track.duration/1000),
                    "chosenByUser": track.chosenByUser ? 1 : 0
                }).done(ok).fail(error);

                request.done(function () {
                    amplify.publish('transistor:scrobbled', track);
                });
            } else {
                
                request = $.Deferred().fail(error).reject();
            }

            return request;
        },

        setVolume: function(vol) {
            
            this.player.setVolume(vol);
        },

        setScrobble: function(scrobble) {

            this.scrobble = scrobble;
        },

        scrobblePoint: function(track) {

            var minScrobble = 30000, maxScrobble = 240000;
            var duration = track.duration;
            var scrobblePoint, midPoint;

            if (duration >= minScrobble) {
                midPoint = Math.floor(duration / 2);
                if (midPoint >= maxScrobble) {
                    scrobblePoint = maxScrobble;
                } else {
                    scrobblePoint = midPoint;
                }
            } else {
                scrobblePoint = false;
            }
            return scrobblePoint;
        },

        onNowPlayling: function(id, track) {

            if (this.player.id !== id) return;

            track.start = Math.floor((new Date()).getTime() / 1000);
            track.scrobblePoint = this.scrobblePoint(track);

            var request;
            if (this.scrobbling) {
                this.api.request('track.updateNowPlaying', {
                    'track'    : track.title,
                    'artist'   : track.artist,
                    'album'    : track.album,
                    'duration' : Math.floor(track.duration/1000)
                });
            }
        },

        onFinished: function(id, track) {

            if (this.player.id !== id) return;

            this.play();
        },

        onPlayback: function(id, track, timings) {

            if (this.player.id !== id) return;

            if (!track.scrobbled && 
                track.scrobblePoint && 
                timings.position >= track.scrobblePoint) {
                track.scrobbled = true;
                this.scrobble(track);
            }
        }

    });

    return Transistor;
});
