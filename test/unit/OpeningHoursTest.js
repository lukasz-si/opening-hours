/**
 * Created by meep_sitl on 26/01/15.
 */
define([
    "js/OpeningHours",
    "jquery"
], function (OpeningHours, $) {

    describe("OpeningHours", function () {
        var $openingHoursContainer,
            $openingHoursContainerSunday,
            $openingHoursContainer2;

        $("body").append("<div id='opening-hours'></div><div id='opening-hours-sunday'><div id='opening-hours2'></div>");
        $openingHoursContainer = $("#opening-hours");
        $openingHoursContainerSunday = $("#opening-hours-sunday");
        $openingHoursContainer2 = $("#opening-hours2");

        it("js/OpeningHours should be a constructor", function () {
            expect(typeof OpeningHours).toBe("function");
        });

        describe("first day of the week is Monday", function () {
            var title = "title",
                closedMsg = "closedMsg",
                cellWidth = 41,
                cellHeight = 31,
                sunday = "Sunday",
                cssStyle = "my-styles",
                options = {
                    title: title,
                    closedMsg: closedMsg,
                    days: [
                        {name: "Mo", hours: "10:00 - 18:00"},
                        {name: "Tu", hours: "10:00 - 18:00"},
                        {name: "We", hours: "10:00 - 18:00"},
                        {name: "Th", hours: "10:00 - 18:00"},
                        {name: "Fr", hours: "10:00 - 18:00"},
                        {name: "Sa", hours: "10:00 - 18:00"},
                        {name: sunday, hours: null}
                    ],
                    cellWidth: cellWidth + "px",
                    cellHeight: cellHeight + "px",
                    selectedDay: 0,
                    firstDaySunday: false,
                    cssStyle: cssStyle
                },
                openingHours;

            openingHours = new OpeningHours("#opening-hours", options);

            it("openingHours variable should be an object", function () {
                expect(typeof openingHours).toBe("object");
            });

            it("checks if the title is correct", function () {
                expect($openingHoursContainer.find(".title").text()).toMatch(title);
            });

            /** on Sunday should be closed */
            it("checks if the closedMsg is correct", function () {
                expect($openingHoursContainer.find(".hours").text()).toMatch(closedMsg);
            });

            it("checks cell width", function () {
                expect($openingHoursContainer.find(".day").width()).toBe(cellWidth);
            });

            it("checks cell height", function () {
                expect($openingHoursContainer.find(".day").height()).toBe(cellHeight);
            });

            it("checks if Sunday is selected", function () {
                expect($openingHoursContainer.find(".day-wrapper.selected .day").text()).toBe(sunday);
            });

            it("checks if Sunday is at the end of chain", function () {
                expect($openingHoursContainer.find(".day-wrapper").last().find(".day").text()).toBe(sunday);
            });

            it("checks if additional style is set", function () {
                expect($openingHoursContainer.find(".opening-hours").hasClass(cssStyle)).toBe(true);
            });

            it("selects Monday", function () {
                var $selected, dayOfWeek;

                openingHours.selectDay(1);

                $selected = $openingHoursContainer.find(".day-wrapper.selected");
                dayOfWeek = $selected.data("day").id;

                expect(dayOfWeek).toBe(1);
            });
        });

        describe("first day of the week is Sunday", function () {
            var title = "title Sunday",
                closedMsg = "closedMsg Sunday",
                cellWidth = 51,
                cellHeight = 21,
                sunday = "Sunday2",
                cssStyle = "my-styles2",
                options = {
                    title: title,
                    closedMsg: closedMsg,
                    days: [
                        {name: sunday, hours: null},
                        {name: "Mo", hours: "10:00 - 18:00"},
                        {name: "Tu", hours: "10:00 - 18:00"},
                        {name: "We", hours: "10:00 - 18:00"},
                        {name: "Th", hours: "10:00 - 18:00"},
                        {name: "Fr", hours: "10:00 - 18:00"},
                        {name: "Sa", hours: "10:00 - 18:00"}
                    ],
                    cellWidth: cellWidth + "px",
                    cellHeight: cellHeight + "px",
                    selectedDay: null,
                    firstDaySunday: true,
                    cssStyle: cssStyle
                },
                openingHours;

            openingHours = new OpeningHours("#opening-hours-sunday", options);

            it("openingHours variable should be an object", function () {
                expect(typeof openingHours).toBe("object");
            });

            it("checks if the title is correct", function () {
                expect($openingHoursContainerSunday.find(".title").text()).toMatch(title);
            });

            it("checks cell width", function () {
                expect($openingHoursContainerSunday.find(".day").width()).toBe(cellWidth);
            });

            it("checks cell height", function () {
                expect($openingHoursContainerSunday.find(".day").height()).toBe(cellHeight);
            });

            it("checks if Sunday is the first one", function () {
                expect($openingHoursContainerSunday.find(".day-wrapper").first().find(".day").text()).toBe(sunday);
            });

            it("checks if additional style is set", function () {
                expect($openingHoursContainerSunday.find(".opening-hours").hasClass(cssStyle)).toBe(true);
            });

            it("checks if current day is selected", function () {
                var $selected = $openingHoursContainerSunday.find(".day-wrapper.selected"),
                    dayOfWeek = $selected.data("day").id;

                expect(dayOfWeek).toBe(new Date().getDay());
            });
        });

        describe("validation", function () {
            it("wrong number of days in the 'options' object", function () {
                expect(function () {
                    new OpeningHours("#opening-hours2",
                        {
                            days: [
                                {name: "Mo", hours: "10:00 - 18:00"},
                                {name: "Tu", hours: "10:00 - 18:00"},
                                {name: "We", hours: "10:00 - 18:00"},
                                {name: "Th", hours: "10:00 - 18:00"},
                                {name: "Fr", hours: "10:00 - 18:00"},
                                {name: "Sa", hours: "10:00 - 18:00"}
                            ]
                        })
                }).toThrow();

                /** OpeningHours element shouldn't be created */
                expect($openingHoursContainer2.find(".opening-hours").size()).toBe(0);
            });
        });
    });


});