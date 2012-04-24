define(['../responses/xspf.js'], function (xspf) {

    Radio = {
        "package": 'radio',
        methods: {
            getPlaylist: {
                auth: true,
                method: 'GET',
                parser: function (data, type) { 
                   var string = xspf(data);
                   string = JSON.stringify(string);
                   return string;
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
