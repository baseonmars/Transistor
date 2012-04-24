define([
    'order!http://code.jquery.com/jquery-1.7.2.min.js', 
    'order!../lib/class.js',
    'order!../lib/amplify.min.js',
    'order!./transistor.js',
    '../lib/md5.js',
    '../lib/json2.js'
],
function($, Class, Amplify, Transistor) {
    window.Transistor = Transistor;
});
