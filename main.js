require(['./lib/transistor.js'], function () {
    setTimeout(function () {
        window.radio = new Transistor({
            key: "XXX", 
            secret: "XXX",
            session: "XXX"
        }, 0);
    });
});
