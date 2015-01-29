requirejs.config({
    baseUrl: '.',
    paths: {
        OpeningHours: 'libs/opening-hours.min',
        main: 'libs/main',
        jquery: 'libs/jquery.min',
        sunlight: 'libs/sunlight-min',
        "sunlight-javascript": 'libs/sunlight.javascript-min',
        "sunlight-xml": "libs/sunlight.xml-min"
    },
    shim: {
        sunlight: {
            exports: "Sunlight"
        },
        "sunlight-javascript": {
            deps: ['sunlight']
        },
        "sunlight-xml": {
            deps: ['sunlight']
        }
    }
});

// Start the main app logic.
requirejs(['main'], function () {
});