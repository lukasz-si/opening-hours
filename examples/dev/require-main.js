requirejs.config({
    baseUrl: '../../src',
    paths: {
        OpeningHours: 'js/OpeningHours',
        main: '../examples/dev/main',
        jquery: '../bower_components/jquery/dist/jquery'
    }
});

// Start the main app logic.
requirejs(['main'], function () {
});