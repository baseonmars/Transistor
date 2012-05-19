window.SM2_DEFER = true;
require.config({
    paths: {
        jquery: "../lib/jquery.min",
        amplify: "../lib/amplify.min",
        soundmanager: "./lib/sm2-fake",
        depend: "../lib/depend"
    }
});
define([
    '../src/player', 
    'require', "soundmanager", "depend!amplify[jquery]"], function (Player, require) {

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
                expect(id).toBe(player.id);
            });
        });

        describe("when asked to play a track", function () {

            var location, player, track, startVolume;
            beforeEach(function () {
                location = "http://play.last.fm/astreamid";
                player = new Player(window.soundManager);
                startVolume = player.volume;
                track  = {location: location};
            });

            it("should play a track", function () {

                spyOn(player.device, 'createSound');
                player.play(track);
                expect(player.device.createSound).toHaveBeenCalled();
                expect(deviceArgs(player)[0].url).toBe(location);
            });

            it("should resume a track", function () {
                player.audio = {
                    resume: jasmine.createSpy()
                };
                spyOn(player, 'hasTrack').andReturn(true);
                player.play();
                expect(player.audio.resume).toHaveBeenCalled();
            });

            it("should pause a track", function () {

                player.audio = {pause: jasmine.createSpy()};
                player.pause();
                expect(player.audio.pause).toHaveBeenCalled();
            });

            it("should set volume", function () {
                var lowVolume = 10, midVolume = 50;

                player.setVolume(lowVolume);
                expect(player.volume).toBe(lowVolume);
                player.setVolume(midVolume);
                expect(player.volume).toBe(midVolume);
            });

            it("should set volume of new track", function () {

                spyOn(player.device, 'createSound');
                player.setVolume(10);
                player.play(track);
                expect(deviceArgs(player)[0].volume).toBe(10);
            });
        });
    });

    function deviceArgs(player) {
        return player.device.createSound.mostRecentCall.args;
    }
});
