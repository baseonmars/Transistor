define(['./track.js'], function (track) {

    return function(spec) {

        var xspf = {
            title:spec.playlist.title,
            creator:spec.playlist.creator,
            date:new Date(Date(spec.playlist.date)),
            expiry:new Date(+new Date() + (spec.playlist.link['#text']*1000)),
            tracks:[]
        };

        var trackSpec = spec.playlist.trackList.track;
        for(var x=0;x < trackSpec.length; x++) { 
            xspf.tracks.push(track(trackSpec[x]));
        }

        return xspf;
    };
});
