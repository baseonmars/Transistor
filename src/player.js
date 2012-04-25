window.SM2_DEFER = true;
define(['../lib/soundmanager2-nodebug-jsmin.js'],function () {

    // Give each player a unique ID number
    var _id = 0;
    var getId = function () {
        return ++_id;
    };

    /**
    * A single track player compatible with Transistor and Last.fm
    * Emits events through amplify.js message bus
    */
    var Player = Class.extend({
        init: function() {
            this.id = getId();
            window.soundManager = new SoundManager('/transistor/lib'); // Flash expects window.soundManager.
            soundManager.beginDelayedInit();
            this.playlist = null;
        },

        play: function (track) {

            if (track) {
                if (this.audio && this.audio.playState === 1) {
                    this.audio.unload();
                }
                var self = this;
                var audio = soundManager.createSound({
                    id: "track" + track.streamid,
                    url: track.location,
                    autoLoad: true,
                    autoPlay: true,
                    multishop: false,
                    onfinish: function () {
                        amplify.publish('transistorplayer:finished', track);
                    },
                    onstop: function () {
                        amplify.publish('transistorplayer:stopped', track);
                    },
                    onpause: function () {
                        amplify.publish('transistorplayer:paused', track);
                    },
                    onresume: function () {
                        amplify.publish('transistorplayer:resumed', track);
                    },
                    onplay: function () {
                        amplify.publish('transistorplayer:playing', track);
                    },
                    onsuspend: function () {
                        amplify.publish('transistorplayer:suspended', track);
                    }
                });
                this.audio = audio;
            } else if (this.hasTrack()) {
                this.audio.resume();
            }
        },
        pause: function () {
            this.audio.pause();
        },
        setVolume: function (vol) {
            if (this.audio) {
                soundManager.setVolume(this.audio.sid, vol);
            }
        },
        onSMReady: function () {
            this.ready = _soundManagerReady;
            amplify.publish('transistorplayer:ready');
        },
        hasTrack: function () {
            return this.audio && this.audio.playState === 1;
        }

    });

    return Player;

});
