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
    'require', "soundmanager", "jquery", "amplify"], function (Player, require) {

        window.soundManager = new SoundManager();
        window.soundManager.url = '../lib/';
        window.soundManager.beginDelayedInit();

    describe("A Player", function () {

        beforeEach(function () {
            window.soundManager.reboot();
        });

        it("should throw an error if soundmanager isn't loaded", function () {

            var oldSm = window.soundManager;
            delete window.soundManager;
            expect(function () { new Player(); }).toThrow();
            window.soundManager = oldSm;
        });

        it("should use window.soundManager", function () {

            var ready = false, player = new Player();
            amplify.subscribe("transistorplayer:ready", function () {
                ready = true;
            });
            waitsFor(function () { return ready;}, "player", 200);
            runs(function () {
                expect(player.device).toBe(window.soundManager);
            });

        });

        it("should emit a ready event when sound manager loads", function () {

            var ready = false, player, playerid;
            amplify.subscribe("transistorplayer:ready", function (playerid) {
                ready = true;
                id = playerid;

            });
            player = new Player(window.soundManager);
            waitsFor(function () { return ready; }, "player", 200);
            runs(function () {
                expect(player.device.enabled).toBe(true);
                expect(id).toBe(player.id);
            });
        });
    });
});
