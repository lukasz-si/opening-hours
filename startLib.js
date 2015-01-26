(function(root, factory) {

    // Set up the app appropriately for the environment. Start with AMD.
    if (typeof define === 'function' && define.amd) {
        define("openingHours", [/*'jquery'*/], function($) {
            // Export global even in AMD case in case this script is loaded with
            // others that may still expect a global openingHours.
            // root.openingHours = factory(root, $);
            return factory(root/*, $*/);
        });
    } else {
        root.openingHours = factory(root/*, (root.jQuery || root.$)*/);
    }

}(this, function(root/*, $*/) {
