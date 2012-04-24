window.SM2_DEFER = true;
define(['../lib/soundmanager2.js'],function () {

    var Player = Class.extend({
        init: function() {
            window.soundManager = new SoundManager('/transistor/lib'); // Flash expects window.soundManager.
            soundManager.beginDelayedInit();
            this.playlist = null;
        },

        play: function (track) {
            console.log('playling', track);

            var self = this;
            var mySound = soundManager.createSound({
                id: "track" + track.streamid,
                url: track.location,
                autoLoad: true,
                autoPlay: true,
                onload: function () {
                    console.log('onload', arguments);
                    mySound.play();
                }
            });

        },
        onSMReady: function () {
            this.ready = _soundManagerReady;
            amplify.publish('transistorplayer:ready');
        },
        smSetup: function () {
        }
    });

    return Player;

});
