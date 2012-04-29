define(['../responses/xspf.js'], function (xspf) {

    Radio = {
        "package": 'radio',
        methods: {
            getPlaylist: {
                auth: true,
                method: 'GET',
                parser: function (data) { 
                   return xspf(data);
                }
            },
            tune: {
                auth: true,
                method: 'POST',
                parser: function (data) { 
                    return data;
                } 
            }
        }
    };

    return Radio;
});
