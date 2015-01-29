/**
 * Created by meep_sitl on 28.08.14.
 */
define(["OpeningHours", "sunlight", "jquery", "sunlight-xml", "sunlight-javascript"], function (OpeningHours, Sunlight, $) {
    "use strict";

    var options = {};

    Sunlight.highlightAll();

    new OpeningHours("#opening-hours", options);

    options = {
        title: "Opening hours",
        closedMsg: "Closed",
        days: [
            {name: "Su", hours: null},
            {name: "Mo", hours: "09:00 - 19:00"},
            {name: "Tu", hours: "10:00 - 20:00"},
            {name: "We", hours: "11:00 - 21:00"},
            {name: "Th", hours: "10:30 - 18:30"},
            {name: "Fr", hours: "08:00 - 15:30"},
            {name: "Sa", hours: null}
        ],
        cellWidth: "35px",
        cellHeight: "30px",
        selectedDay: 1,
        firstDaySunday: true,
        cssStyle: ""
    };
    new OpeningHours("#opening-hours2", options);

    console.log("OpeningHours loaded (AMD)");
});
