// Taken from the phantom js wiki, modfied to run with the newer jasmine version

var system = require('system');

/**
 * Wait until the test condition is true or a timeout occurs. Useful for waiting
 * on a server response or for a ui change (fadeIn, etc.) to occur.
 *
 * @param testFx javascript condition that evaluates to a boolean,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param onReady what to do when testFx condition is fulfilled,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param timeOutMillis the max amount of time to wait. If not specified, 3 sec is used.
 */
function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3001, //< Default Max Timeout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 100); //< repeat check every 100ms
}


if (system.args.length !== 2) {
    console.log('Usage: run-jasmine.js URL');
    phantom.exit();
}

var page = require('webpage').create();

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
    console.log(msg);
};


page.open(system.args[1], function(status){
    if (status !== "success") {
        console.log("Unable to access network");
        phantom.exit();
    } else {
        waitFor(function(){
            return page.evaluate(function(){
                var text = document.body.querySelector('.banner .duration').innerHTML || "";
                if (!!text.match(/finished/)) {
                    return true;
                }
                return false;
            });
        }, function(){
            page.evaluate(function(){

                var results = jasmine.getEnv().currentRunner().results();
                var suites  = jasmine.getEnv().currentRunner().suites();

                console.log("Total:", results.totalCount, "Passed:", results.passedCount, "Failed:", results.failedCount);
                if (results.skipped) {
                    console.log("Some tests were skipped");
                }

                for (var i=0; i < suites.length; i++) {
                    printSuite(suites[i]);
                }

                function printSuite(suite) {
                    console.log(suite.description);
                    var specs = suite.specs();
                    for (var i=0; i < specs.length; i++) {

                        console.log("\t", specs[i].description);
                    }
                }
            });
            phantom.exit();
        });
    }
});
