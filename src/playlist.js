define(function (require) {

    var Class = require('../lib/class');
    
    var Playlist = Class.extend({
        
        init: function () {

            this.reset();
        },
        _extract: function(tracks, cursor) {
            var track;
            if (this.cursor < tracks.length) {
                track = tracks[this.cursor];
                this.exhausted = false;
            } else {
                track = false;
                this.exhausted = true;
            }
            return track;
        },
        current: function () {
            return this.exhausted ? false : this.tracks[this.cursor];
        },
        append: function (tracks) {
            this.tracks = this.tracks.concat(tracks || []);
            this.length = this.tracks.length;
        },
        getTracks: function () {
            return this.tracks;
        },
        reset: function () {

            this.cursor = 0;
            this.exhausted = true;
            // TODO reset shouldn't create a new object for tracks
            this.tracks = [];
            this.length = 0;
        },
        next: function () {
            var track;
            if (this.exhausted) {
                track = this._extract(this.tracks, this.cursor);
            } else {
                this.cursor++;
                track = this._extract(this.tracks, this.cursor);
            }
            return track;
        }
    });

    return Playlist;
});
