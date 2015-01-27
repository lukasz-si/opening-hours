/**
 * Created by meep_sitl on 28.08.14.
 */
define(["OpeningHours", "jquery"], function (OpeningHours, $) {
    "use strict";


    var openingHours = new OpeningHours("#opening-hours", {});

    console.log("OpeningHours loaded (AMD)");
});