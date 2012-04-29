define(function () {

    var Artist = {
        "package": 'artist',
        methods: {
            getInfo:  {
                auth: false,
                method: 'GET',
                parser: function (data) {
                    return data;
                }
            }
        }
    };

    return Artist;
});
