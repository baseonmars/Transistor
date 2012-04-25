Transistor - Last.fm Radio Client
=================================

Transistor is a client for Last.fm Radio that runs in the browser.

You'll need an API account with radio access to use this. 

Audio support is provided by SoundManager2, HTML5 support is experimental.

## Usage

Transistor depends on: JQuery, SoundManager2, amplify.js

var radio = new Transistor({
    key: API\_KEY,
    secret: API\_SECRET,
    session: USER\_SESSION\_KEY
});

Tune a station and start playing it

    radio.tune("lastfm://user/baseonmars/library/mix", function () {
        radio.play();
    });

Or maybe you like deffered objects?

    var request = radio.tune("lastfm://artist/DJ+SPINN")
    request.done(function () {
        radio.play();
    });

Love, Ban. These all act on the currently playing track

    radio.love();
    radio.ban();

But this'll also work:

    radio.love({
        track: "Free Swim",
        artist: "Debasser"
    });

## Licence

Copyright (C) 2012 Daniel Etherington

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
