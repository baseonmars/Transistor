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
                    //console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
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



page.open(system.args[1], function(status){
    if (status !== "success") {
        console.log("Unable to access network");
        phantom.exit();
    } else {

        // Set PhantpmJS to true so Reporter can
        // tell whether to output or not
        page.evaluate(function () {
            window.PhantomJS = true;
        });
        
        page.onConsoleMessage = function (msg) { 

            var red   = '\u001b[31m',
                green = '\u001b[32m',    
                reset = '\u001b[0m';

            var fs = require("fs"); 
            if (msg === "PhantomJSReporter failed spec") {
                fs.write("/dev/stdout", red + "." + reset, "w");
            } else if (msg === "PhantomJSReporter passed spec") {
                fs.write("/dev/stdout", green + "." + reset, "w");
            } else {
                console.log(msg);
            }
        };

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

                var red   = '\u001b[31m',
                    blue  = '\u001b[34m',
                    green = '\u001b[32m',    
                    white = '\u001b[35m',
                    reset = '\u001b[0m',
                    bold  = '\u001b[1m';

                console.log("\n");

                logSummary(results);

                if (results.skipped) {
                    // TODO: read docs on how this should work
                    console.log(red + "Some tests were skipped" + reset);
                }

                var messages = [];
                for (var i=0; i < suites.length; i++) {
                    logSuite(suites[i], messages);
                }

                if (messages.length > 0) console.log("\n", "Error messages", "\n");

                for (i = 0; i < messages.length; i++) {
                    console.log(red + messages[i] + "\n\n" + reset);
                }

                logSummary(results);

                function logSuite(suite, messages) {

                    console.log("\n", bold + suite.description + reset, "\n");

                    var specs = suite.specs();
                    for (var i=0; i < specs.length; i++) {
                        var results = specs[i].results();
                        var color = results.passed() ? green : red;
                        console.log("  ", color + specs[i].description + reset);
                        if (!results.passed()) {
                            messages.push(suite.description + " " + 
                                specs[i].description + "\n" +
                                results.getItems()[0].message);
                        }
                    }
                    console.log("");
                }
                function logSummary(results) {
                    console.log(
                        bold + "Total:", results.totalCount, 
                        green + "Passed:", results.passedCount, 
                        red + "Failed:", results.failedCount + reset
                    );
                }

            });
            phantom.exit();
        });
    }
});
