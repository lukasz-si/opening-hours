requirejs.config({
    baseUrl: '.',
    paths: {
        OpeningHours: '../../dist/opening-hours',
        main: 'main',
        jquery: '../libs/jquery.min'
    }
});

// Start the main app logic.
requirejs(['main'], function () {
});