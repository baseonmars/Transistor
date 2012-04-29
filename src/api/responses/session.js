define(function () {

    return function(spec) {

        if (spec.hasOwnProperty('error')) {
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
