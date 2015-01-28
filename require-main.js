requirejs.config({
    baseUrl: '.',
    paths: {
        OpeningHours: 'libs/opening-hours.min',
        main: 'libs/main',
        jquery: 'libs/jquery.min'
    }
});

// Start the main app logic.
requirejs(['main'], function () {
});