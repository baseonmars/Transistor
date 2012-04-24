define(['../lib/soundmanager2-nodebug.js'], function () {

    var Player = Class.extend({
        init: function() {
            soundManager.url = "http://danyo.co.uk/transistor/src/";
            soundManager.onready($.proxy(this.onSMReady, this));            
            soundManager.ontimeout(function(){
                amplify.publish('transistorplayer:error', {type: "timeout"});
            });
            soundManager.allowScriptAccess = 'always';
            this.playlist = null;
        },
        play: function (track) {
            console.log('playling', track);

            var mySound = soundManager.createSound({
                id: track.streamid,
                url: track.location,
                onload: function () {
                }
            });
                    mySound.play();

        },
        onSMReady: function () {
            this.ready = true;
            amplify.publish('transistorplayer:ready');
        },
        smSetup: function () {
        }
    });

    return Player;

});
