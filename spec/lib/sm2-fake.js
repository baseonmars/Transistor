define(['jquery'], function (jQuery) {

    function SoundManager() { }

    SoundManager.prototype.onready = function (callback) {
        setTimeout(function () {
            callback();
        });
    };

    SoundManager.prototype.enabled = true;

    SoundManager.prototype.beginDelayedInit = function () {};
    SoundManager.prototype.reboot = function () {};

    // SM2 expects these to exist, so reproduce
    window.soundManager = new SoundManager();
    window.SoundManager = SoundManager;

    return SoundManager;
});
