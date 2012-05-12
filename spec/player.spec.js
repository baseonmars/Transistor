window.SM2_DEFER = true;
require.config({
    paths: {
        jquery: "../lib/jquery.min",
        amplify: "../lib/amplify.min",
        soundmanager: "../lib/soundmanager2"
    }
});
define([
    '../src/player',
    'require', "soundmanager", "jquery"], function (Player, require) {

        window.soundManager = new SoundManager();
        window.soundManager.url = '../lib/';
        window.soundManager.beginDelayedInit();

    describe("A Player", function () {

        it("should have it's own soundManager", function () {

            var player = new Player();
            expect(player.device).not.toBe(window.soundManager);
            expect(window.soundManager).toBeTruthy();
        });

        it("should throw an error if soundmanager isn't loaded", function () {

            var oldSMObj = window.soundmanager;
            var oldSMCla = window.SoundManager;
            window.soundmanager = window.SoundManager = null;
            expect(function () { 
                new Player();
            }).toThrow(new Error("SoundManager 2 is required"));
            window.soundmanager = oldSMObj;
            window.SoundManager = oldSMCla;
        });

        it("should emit a ready event when sound manager loads", function () {

            var ready = false, player;
            runs(function () {
                require(["amplify"], function () { 
                    amplify.subscribe("transistorplayer:ready", function () {
                        ready = true;
                    });
                    player = new Player('../lib/');
                    waitsFor(function () { return ready; }, "player", 200);
                });
            });
        });
    });
});
