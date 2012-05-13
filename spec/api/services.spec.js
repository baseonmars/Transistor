require.config({
    paths: {
        jquery: "../lib/jquery.min"
    }
});
define([
    '../../src/api/services',
    '../../src/api/services/radio',
    '../../src/api/services/auth',
    '../../src/api/services/track',
    '../../src/api/services/artist'
], function (Services, radio, auth, track, artist) {

    describe("The services package", function () {

        it("should have a radio package", function () {
            checkMethods(radio);
        });
        it("should have an auth package", function () {
            checkMethods(auth);
        });
        it("should have a track package", function () {
            checkMethods(track);
        });
        it("should have an artist package", function () {
            checkMethods(artist);
        });

        function checkMethods(pkg) {

            for(var method in pkg.methods) {
                    expect(Services[pkg['package'] + '.'+method]).toBeTruthy();
            }

        }

    });
});
