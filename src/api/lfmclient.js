define([
    './services',
    '../../lib/md5.js'
], function (Services, md5) {


    var LFMAPIClient = function LFMAPIClient(apiKey, secret, session) {

        this.apiKey  = apiKey;
        this.secret  = secret;
        this.session = session;
        this.baseUrl = "http://ws.audioscrobbler.com/2.0/";
        this.authUrl = "http://www.last.fm/api/auth";
    };

    LFMAPIClient.prototype.request = function(method, params, ok, error) {

        params = params || {};

        var xhr = jQuery.ajax({
            type: this.typeOf(method),
            url: this.baseUrl,
            data: this.getParams(method, params)
        });

        return xhr.promise().
        pipe(this.parserFor(method)).
        done(ok).
        fail(error);
    };


    LFMAPIClient.prototype.authFlow = function () {

        window.location.assign([
            this.authUrl, "?api_key=", this.apiKey, 
        "&cb=", encodeURIComponent(location.href)].join(''));
    };

    LFMAPIClient.prototype.parserFor = function(method) {

        return function (data, status, xhr) {

            var result;
            if (data.hasOwnProperty('error')) {
                result = jQuery.Deferred().rejectWith(data.error);
            } else {
                result = Services[method] && Services[method].parser(data);
            }
            return result;
        };
    };

    LFMAPIClient.prototype.error = function(data) {

    };

    LFMAPIClient.prototype.typeOf = function(method) {
        return Services[method] && Services[method].method;
    };

    LFMAPIClient.prototype.authType = function(method) {
        return Services[method] && Services[method].auth;
    };

    LFMAPIClient.prototype.getParams = function(method, params) {

        var data = jQuery.extend({
            method: method,
            api_key: this.apiKey,
            format: 'json',
            sk: this.session,
            api_sig: this.sign(method, params)
        }, params);

        // hacky
        switch(this.authType(method)) {
        case 'auth':
            delete data.sk;
            break;
        case false:
            delete data.sk;
            delete data.api_sig;
            break;
        default:
            break;
        }

        return data;
    };

    LFMAPIClient.prototype.sign = function(method, params) {
        var key, string,
        pairs = ["method"+method, "api_key"+this.apiKey];

        if (this.authType(method) === true) {
            pairs.push("sk"+this.session);
        }

        for(key in params) {
            pairs.push(key+params[key]);
        }

        string = pairs.sort().join("") + this.secret;

        return md5(string);
    };

    return LFMAPIClient;
});
