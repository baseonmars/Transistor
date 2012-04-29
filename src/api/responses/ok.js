define(function () {

    return function(spec) {

        if (spec.hasOwnProperty('error')) {
            return error;
        }

        return spec.status === 'ok';
    };
});

