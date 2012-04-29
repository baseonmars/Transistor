define(function () {

    return function(spec) {

        var session = spec.session;

        var Session = {
            username: session.name,
            key: session.key,
            subscriber: session.subscriber
        };

        return Session;
    };
});
