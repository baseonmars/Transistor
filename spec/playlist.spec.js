define(['../src/playlist', 'require', 'jquery'], function(Playlist, require, jQuery) {

    describe("A Playlist", function () {

        var playlist, tracks;
        beforeEach(function () {

            tracks = [track(), track(), track()];
            playlist = new Playlist();
        });

        it("should append tracks", function () {


            playlist.append(tracks);
            var playlistTracks = playlist.getTracks();
            expect(playlistTracks.length).toBe(tracks.length);
            jQuery.each(tracks, function(index, track) {
                expect(tracks[index]).toBe(playlistTracks[index]);
            });
        });

        it("should not start with a current track", function () {
            expect(playlist.current()).toBe(false);
        });

        describe("with tracks", function () {

            beforeEach(function () {
                playlist.append(tracks);
            });

            it("should reset it's tracks", function () {
                playlist.reset();
                expect(playlist.getTracks().length).toBe(0);
                expect(playlist.current()).toBe(false);
            });

            it("should return the next track", function () {
                var next = playlist.next();
                expect(next).toBe(tracks[0]);
                next = playlist.next();
                expect(next).toBe(tracks[1]);
            });

            it("should return the current track", function () {
                playlist.next();
                expect(playlist.current()).toBe(tracks[0]);
                playlist.next();
                expect(playlist.current()).toBe(tracks[1]);
            });

            it("should return false when it runs out of tracks", function () {

                for (var i=0; i == tracks.length; i++) {
                    tracks.next();
                }
                expect(playlist.current()).toBe(false);
            });
        });

    });

    function track() {
        return {};
    }
});
