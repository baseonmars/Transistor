Transistor - Last.fm Radio Client
=================================

This is very much in an alpha stage. The auth implementation is not fit for anything other than local testing as exposing your secret on a public website is a terrible idea. We plan to implement OAuth2 client flow for Last.fm soon.

Transistor is a client for Last.fm Radio that runs in the browser.

You'll need an API account with radio access to use this. 

Audio support is provided by SoundManager2, HTML5 support is experimental.

## Usage

Transistor depends on: JQuery, SoundManager2, amplify.js, these are currently included in the package but are
liable to change.

You'll need to load these first, you'll find the libraries at 
http://amplifyjs.com/, http://www.jquery.com, http://www.schillmania.com/projects/soundmanager2/

You'll need to put one of soundmanagers flash 8 swf's in the same dir as transistor.

Authenticate (obtaining a session is left as an exercise to the reader. 

    var radio = new Transistor({
        key: API_KEY,
        secret: API_SECRET
    });

Or 

    var radio = new Transistor({
        key: API_KEY,
        secret: API_SECRET
    });
    
    radio.auth() // will redirect user to www.last.fm/api/auth, storing result in cookie

Sessions are stored as a cookie. After the initial authorisation sessions are automatically
restored on instantiation.

Tune a station and start playing it

    radio.tune("lastfm://user/baseonmars/library/mix", function () {
        radio.play();
    });

Or maybe you like deferred objects?

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
