/**
 * Created by meep_sitl on 28.08.14.
 */
define(["OpeningHours", "jquery"], function (OpeningHours, $) {
    "use strict";

    var openingHours = new OpeningHours("#opening-hours", {
        title: "Opening hours",
        closedMsg: "Closed",
        days: [
            {name: "Mo", hours: "10:00 - 18:00"},
            {name: "Tu", hours: "10:00 - 18:00"},
            {name: "We", hours: "10:00 - 18:00"},
            {name: "Th", hours: "10:00 - 18:00"},
            {name: "Fr", hours: "10:00 - 18:00"},
            {name: "Sa", hours: "10:00 - 18:00"},
            {name: "Su", hours: null}
        ],
        cellWidth: "30px",
        cellHeight: "25px",
        selectedDay: null,
        firstDaySunday: false,
        cssStyle: "my-styles"
    });

    console.log("OpeningHours loaded (dev)");
});