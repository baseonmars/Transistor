require(['player.spec', 'playlist.spec', './api/services.spec'], function () {
    (function() {

      var jasmineEnv = jasmine.getEnv();
      jasmineEnv.updateInterval = 1000;

      var htmlReporter = new jasmine.HtmlReporter();
      var phantomReporter = new jasmine.PhantomJSReporter();

      jasmineEnv.addReporter(htmlReporter);
      jasmineEnv.addReporter(phantomReporter);

      jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
      };

      var currentWindowOnload = window.onload;

      window.onload = function() {
        if (currentWindowOnload) {
          currentWindowOnload();
        }
        execJasmine();
      };

      function execJasmine() {
        jasmineEnv.execute();
      }

    })();
});
