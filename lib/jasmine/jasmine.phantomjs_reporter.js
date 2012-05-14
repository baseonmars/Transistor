/**
* A Jasmine reporter for use with the test script provided
* with Transistor.
*
* Copyright Dan Etherington <dan@baseonmars.co.uk> 2012
*
* Licenced under the MIT Licence - See the README.md
*/
(function () {
    if(!jasmine) {
        throw "Jasmine BDD required in global namespace";
    }

    var PhantomJSReporter = jasmine.Reporter;
   
    PhantomJSReporter.prototype.reportRunnerStarting = function (runner) {
        if (typeof PhantomJS === "undefined") {
            console.log("PhantomJS not detected, PhantomJSReporter disabled logging.");
        }
    };

    PhantomJSReporter.prototype.reportSpecStarting = function(Spec) {
    };

    PhantomJSReporter.prototype.reportSpecResults = function (spec) {
        if (typeof PhantomJS === "undefined") return;
        var tests = spec.results().getItems();
        for (var i=0; i<tests.length; i++) {
            if (tests[i].passed()) {
                console.log("PhantomJSReporter passed spec");
            } else {
                console.log("PhantomJSReporter failed spec");
            }

        }
    };

    PhantomJSReporter.prototype.reportSuiteResults = function(Spec) {
    };

    jasmine.PhantomJSReporter = PhantomJSReporter;

}());
