define(function () {

    return function(spec, type) {

        if (type === 'json') {
            spec = jQuery.parseJSON(spec);
        }

        return spec.status === 'ok';
    };
});

