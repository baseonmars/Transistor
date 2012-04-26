define(function () {

    return function(json, type) {

        var spec = $.parseJSON(json);

        if (typeof spec.error !== 'undefined') {
            return error;
        }

        var session = spec.session;

        var Session = {
            username: session.name,
            key: session.key,
            subscriber: session.subscriber
        };

        return Session;
    };
});
