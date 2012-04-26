require(['./lib/transistor-0.2.js'], function () {
    setTimeout(function () {
        window.radio = new Transistor({
            key: "XXX", 
            secret: "XXX",
            session: "XXX"
        }, 0);
    });
});
