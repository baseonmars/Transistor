window.SM2_DEFER = true;
define(function () {

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
        init: function(swfUrl) {
            this.id = getId();
            window.soundManager = new SoundManager(swfUrl); // Flash expects window.soundManager.
            soundManager.beginDelayedInit();
            this.playlist = null;
            this.volume = 100;
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
                    volume: this.volume,
                    onfinish: function () {
                        amplify.publish('transistorplayer:finished', self.id, track);
                    },
                    onstop: function () {
                        amplify.publish('transistorplayer:stopped', self.id, track);
                    },
                    onpause: function () {
                        amplify.publish('transistorplayer:paused', self.id, track);
                    },
                    onresume: function () {
                        amplify.publish('transistorplayer:resumed', self.id, track);
                    },
                    onplay: function () {
                        amplify.publish('transistorplayer:playing', self.id, track);
                    },
                    onsuspend: function () {
                        amplify.publish('transistorplayer:suspended', self.id, track);
                    },
                    whileplaying: function () {
                        amplify.publish('transistorplayer:whileplaying', self.id, track, {
                            position: this.position,
                            duration: this.duration
                        });
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
            this.volume = vol;
            if (this.audio) {
                soundManager.setVolume(this.audio.sID, vol);
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
