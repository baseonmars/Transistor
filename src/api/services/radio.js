define(['../responses/xspf.js'], function (xspf) {

    Radio = {
        "package": 'radio',
        methods: {
            getPlaylist: {
                auth: true,
                method: 'GET',
                parser: function (data, type) { 
                    return JSON.stringify(xspf(data));
                }
            },
            tune: {
                auth: true,
                method: 'POST',
                parser: function (data, type) { 
                    return data;
                } 
            }
        }
    };

    return Radio;
});
