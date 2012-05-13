require.config({
    paths: {
        jquery: "../lib/jquery.shim"
    }
});
define([
    'jquery',
    '../lib/class',
    '../src/playlist.js', 
    '../src/api/lfmclient.js',
    '../src/player.js',
    '../lib/jquery.url.js',
    '../lib/jquery.cookie.js'
], 
function (jQuery, Class, Playlist, API, Player) {

    /**
    * Transistor is a library for building Last.fm Radio clients
    * See http://github.com/baseonmars/Transistor and 
    * http://www.last.fm/api for details 
    * @class 
    * @author dane <dane@last.fm>
    */
    var Transistor = Class.extend(
        /** @lends Transistor# */
    {

        /**
        * @constructs
        * @param cfg Configuration object
        * @param [cfg.player] A player
        * @param [cfg.sm2] SoundManager instance, else window.soundManager used
        * @param [cfg.api] Api client to use
        * @param {String} [cfg.key] Your api key 
        * @param {String} [cfg.secret] Your api secret
        * @param {String} [cfg.session] Your api session
        * @param {String} [cfg.scrobble=true] Should tracks be scrobbled
        * and now playing notifications be sent?
        */
        init: function(cfg) {
            cfg = cfg || {}; 

            this.player      = cfg.player || new Player(cfg.sm2);
            this.api         = cfg.api || new API(cfg.key, cfg.secret, cfg.session);
            this.playlist    = cfg.playlist || new Playlist();
            this.scrobbling  = false === cfg.scrobble ? false : true;

            this.playlist.api    = this.api;
            this.player.playlist = this.playlist;
            this.station = null;

            var self = this;

            amplify.subscribe('transistorplayer:finished', this, this.onFinished);
            amplify.subscribe('transistorplayer:playing', this, this.onNowPlaying);
            amplify.subscribe('transistorplayer:scrobblepoint', this, this.onScrobblePoint);
            amplify.subscribe('transistorplayer:whileplaying', this, this.onPlayback);

            var token = jQuery.url().param('token');

            if (!this.api.session && token) {
                this.getSession(token);
            } else {
                if (jQuery.cookie('transistor'));
                this.auth();
            }
        },

        /**
        * Authenticate a user, or enter them into the web auth flow
        * @param {String} [session] The session key
        */
        auth: function(session) {

            if (session) {
                this.api.session = session;
            } else {
                var cookie = jQuery.cookie('transistor');
                if (cookie) {
                    this.api.session = cookie;
                } else {
                    this.api.authFlow();
                }
            }
        },

        /**
        * Deauthenticates the current user, clearing the transistor cookie
        */
        deauth: function () {
            jQuery.cookie('transistor', null);
            jQuery.cookie('transistorU', null);
            this.api.session = null;
        },

        /**
        * @private
        * Exchanges an auth token into a web service session
        * @param {String} token The token to exchange for a session
        */
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

                jQuery.cookie('transistor', session.key, {expires: 365});
                jQuery.cookie('transistorU', session.username, {expires: 365});

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


        /**
        * Tune the authenticated user to the given station url
        * @param {String} url The station url, including the lastfm:// protocol
        * @param {Function} [ok] Success callback
        * @param {Function} [error] Failure callback
        * @returns {Promise} The promise return by the api request, with callbacks attached
        */
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

        /**
        * Plays a new track if none is playing. Requests the next track from
        * the playlist. If the playlist is empty a request to the 
        * radio.getPlaylist service is sent. If a track is paused this method
        * resumes it's playback.
        * @param {Function} [ok] Success callback
        * @param {Function} [error] Failure callback
        * @returns {Promise} The promise return by the api request, with callbacks attached
        */
        play: function(ok, error) {

            var request = jQuery.Deferred();
            request.done(ok).fail(error);

            if (this.player.hasTrack()) {
                try {
                    this.player.play();
                    request.resolve();
                } catch(e) {
                    request.reject(e);
                }
            } else {
                request = this.next(ok, error);
            }

            return request;
        },

        /**
        * Pause the currently playing track
        */
        pause: function() {

            this.paused = true;
            this.player.pause();
        },

        /**
        * Skips the current track and starts playing the next
        * item on the playlist.
        * @param {Function} [ok] Success callback
        * @param {Function} [error] Failure callback
        * @returns {Promise} The promise return by the api request, with callbacks attached
        */
        skip: function(ok, error) {

            var oldPlaying = this.playlist.current();

            var request = this.next().done(ok).fail(error);
            if (oldPlaying) {
                amplify.publish("transistor:skipped", oldPlaying);
            }

            return request;
        },

        /**
        * Requests the next track from the playlist and starts 
        * playing it.
        * This method does not fire any amplify events
        * @param {Function} [ok] Success callback
        * @param {Function} [error] Failure callback
        * @returns {Promise} The promise return by the api request, with callbacks attached
        */
        next: function(ok, error) {

            var next = this.playlist.next();
            var request = jQuery.Deferred().done(ok).fail(error);

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

        /**
        * Love a track.
        * @param [track] The track to love, if not supplied
        * uses currently playing track
        * @param {Function} [ok] Success callback
        * @param {Function} [error] Failure callback
        */
        love: function (track, ok, error) {

            track = track || this.playlist.current();

            var request = this.api.request('track.love', {
                track: track.title,
                artist: track.artist
            }).done(ok).fail(error);

            request.done(function() {
                track.loved = true;
                amplify.publish('transistor:loved', track);
            });

            return request;
        },

        /**
        * Unlove a track.
        * @param [track] The track to unlove, if not supplied
        * uses currently playing track
        * @param {Function} [ok] Success callback
        * @param {Function} [error] Failure callback
        */
        unlove: function(track, ok, error) {

            track = track || this.playlist.current();

            var request = this.api.request('track.unlove', {
                track: track.title,
                artist: track.artist
            }).done(ok).fail(error);

            request.done(function() {
                track.loved = false;
                amplify.publish('transistor:unloved', track);
            });

            return request;
        },

        /**
        * Ban's and skip's a track 
        * @param [track] The track to ban
        * @param {Function} [ok] Success callback
        * @param {Function} [error] Failure callback
        * @returns {Promise} The promise return by the api request, with callbacks attached
        */
        ban: function (track, ok, error) {

            track = track || this.playlist.current();

            var request = this.api.request('track.ban', {
                track: track.title,
                artist: track.artist
            }).done(ok).fail(error);

            var self = this;
            request.done(function () {
                track.banned = true;
                amplify.publish('transistor:banned', track);
                self.skip();
            });

            return request;
        },

        /**
        * Scrobble a track
        * @param [track] The track to scrobble, uses currently playing
        * track if none provided.
        * @param {Function} [ok] Success callback
        * @param {Function} [error] Failure callback
        * @returns {Promise} The promise return by the api request, with callbacks attached
        */
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
                
                request = jQuery.Deferred().fail(error).reject();
            }

            return request;
        },

        /**
        * Set the player volume
        * @param {Number} vol The volume, valid ranges are 0-100
        */
        setVolume: function(vol) {
            
            this.player.setVolume(vol);
        },

        /**
        * Should the player send scrobble and now player notifications
        * @param {Boolean} scrobble true = scrobbling, false = private listening
        */
        setScrobble: function(scrobble) {

            this.scrobble = scrobble;
        },

        /**
        * Get the username of the authorised user
        * @returns {String|Boolean} Username if authed or false
        */
        getUsername: function () {

            var username = false;
            if (this.api.session) {
                username = jQuery.cookie('transistorU');
            }
            return username;
        },

        /**
        * Return the point at which a given track should be scrobbled
        * @param track The track
        * @returns {Number} The position at which the track should 
        * be scrobbled, in milliseconds
        */
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

        /**
        * @private
        * Now playing callback, call when a track starts playing to
        * send a now playing request
        * @param id The id of the player
        * @param track The now playing track
        */
        onNowPlaying: function(id, track) {

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

        /**
        * @private
        * Track finished callback, call when a track completes
        * @param id The id of the player
        * @param track The now playing track
        */
        onFinished: function(id, track) {

            if (this.player.id !== id) return;

            this.play();
        },

        /**
        * @private
        * On playback callback, call periodically to report
        * position status.
        * @param id The id of the player
        * @param track The playing track
        * @param timings The timings for the track
        * @param timings.position The position of the track in
        * milliseconds
        * @param timings.duration The duration of the track as
        * reported by the player (This may be adjusted as the track
        * is downloaded).
        */
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
