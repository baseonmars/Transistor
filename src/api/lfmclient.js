define(['./services.js'], function (Services) {

    var _baseURL = "http://ws.audioscrobbler.com/2.0/";

    var LFMAPIClient = function LFMAPIClient(apiKey, secret, session) {

        this.apiKey  = apiKey;
        this.secret  = secret;
        this.session = session;
    };

    LFMAPIClient.prototype.request = function(method, params, ok, error) {

        params = params || {};

        var xhr = $.ajax({
            type: this.typeOf(method),
            url: _baseURL,
            data: $.extend({
                method: method,
                api_key: this.apiKey,
                sk: this.session,
                format: 'json',
                api_sig: this.sign(method, params)
            }, params),
            dataFilter: this.parserFor(method)
        });

        xhr.done(ok);
        xhr.fail(error);
        return xhr.promise();
    };

    LFMAPIClient.prototype.parserFor = function(method) {
        return function (data) {
            return Services[method] && Services[method].parser(data);
        };
    };

    LFMAPIClient.prototype.typeOf = function(method) {
        return Services[method] && Services[method].method;
    };

    LFMAPIClient.prototype.sign = function(method, params) {
        var key, string,
        pairs = ["method"+method,
                "api_key"+this.apiKey,
                "sk"+this.session];

        for(key in params) {
            pairs.push(key+params[key]);
        }

        string = pairs.sort().join("") + this.secret;

        return md5(string);
    };

    return LFMAPIClient;
});
