define(['../lib/class'], function (Class) {

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
        init: function(sm2) {
            this.id = getId();
            this.playlist = null;
            this.volume = 100;
            this.setupDevice(sm2 ? sm2 : window.soundManager, this.onSMReady);
        },

        play: function (track) {

            if (track) {
                if (this.audio && this.audio.playState === 1) {
                    this.audio.unload();
                }
                var self = this;
                var audio = self.device.createSound({
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
                self.device.setVolume(this.audio.sID, vol);
            }
        },
        onSMReady: function () {
            amplify.publish('transistorplayer:ready', this.id);
        },
        hasTrack: function () {
            return this.audio && this.audio.playState === 1;
        },
        setupDevice: function (sm2, callback) {

            var self = this;
            sm2.onready(function () {
                self.device = sm2;
                callback.call(self);
            });
        }
    });

    return Player;
});
