requirejs.config({
    baseUrl: '.',
    paths: {
        OpeningHours: '../../dist/opening-hours',
        main: 'main',
        jquery: '../../bower_components/jquery/dist/jquery'
    }
});

// Start the main app logic.
requirejs(['main'], function () {
});