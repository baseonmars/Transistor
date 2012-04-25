define(function () {

    return function(spec, type) {

        if (type === 'json') {
            spec = $.parseJSON(spec);
        }

        return spec.status === 'ok';
    };
});

