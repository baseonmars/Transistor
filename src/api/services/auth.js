define(['../responses/session.js'], function(session) {

    var Auth = {
        "package": 'auth',
        methods: {
            getSession: {
                auth: 'auth',
                method: 'GET',
                parser: function (data, type) {
                    return JSON.stringify(session(data, type));
                }
            }
        }
    };

    return Auth;
});
