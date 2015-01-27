/**
 * Created by meep_sitl on 26/01/15.
 */
define([
    "jquery"
], function ($) {
    "use strict";

    var mainTemplate = "<div class='opening-hours'><div class='title'></div><div class='days'></div><div class='hours'></div></div>",
        dayTemplate = "<div class='day-wrapper'><div class='day'></div><div class='arrow-down'></div></div>",
        OpeningHours;


    OpeningHours = function (element, options) {

        var $daysContainer, $days, that = this, selectedDay;

        this.options = $.extend({}, OpeningHours.DEFAULT_OPTIONS, options);
        this.validateOptions(this.options);

        this.$el = $(element);
        this.$el.html(mainTemplate);
        $daysContainer = this.$el.find(".days");
        this.$hoursContainer = this.$el.find(".hours");
        this.$el.find(".title").text(this.options.title);

        /** creating days */
        $.each(this.options.days, function (index, value) {
            var $day = $(dayTemplate);

            if (!that.options.firstDaySunday) {
                index = (index === 6) ? 0 : ++index;
            }

            value.id = index;

            $day
                .data("day", value)
                .find(".day")
                .text(value.name || "-")
                .css({width: that.options.cellWidth, height: that.options.cellHeight});

            if (value.hours === null) {
                $day.addClass("closed");
            }

            $daysContainer.append($day);
        });

        $days = $daysContainer.find(".day-wrapper");

        /** if "selectedDay" is not a number then current day is taken into account */
        if (this.options.selectedDay === null || isNaN(this.options.selectedDay)) {
            this.selectDay(new Date().getDay());
        } else {
            selectedDay = this.options.selectedDay >= 0 && this.options.selectedDay <= 6 ? this.options.selectedDay : 0;
            this.selectDay(selectedDay);
        }

        /** adding user's css selector */
        if (this.options.cssStyle) {
            this.$el.find(".opening-hours").addClass(this.options.cssStyle);
        }

        /** on click listener */
        $days.click(function () {
            var $this = $(this),
                index;

            if ($this.hasClass("selected")) {
                return false;
            }

            index = $this.data("day").id;
            if (isNaN(index)) {
                index = 0;
            }
            that.selectDay(index);

            return false;
        });
    };

    OpeningHours.prototype.selectDay = function (day) {
        var hours, $days, that = this;

        $days = this.$el.find(".day-wrapper").removeClass("selected");

        $days.each(function () {
            var $this = $(this),
                data = $this.data("day"),
                index = data.id;

            if (index === day) {
                $this.addClass("selected");
                hours = data.hours;
                if (hours === null || hours === undefined) {
                    hours = that.options.closedMsg;
                }
                that.$hoursContainer.text(hours);

                return false;
            }

            return true;
        });
    };

    OpeningHours.prototype.validateOptions = function (options) {
        if (!$.isPlainObject(options)) {
            this._throwError('"options" is not an object');
        }
        if (options.days.length !== 7) {
            this._throwError('number of days must be equal 7')
        }
    };

    OpeningHours.prototype._throwError = function (msg) {
        throw Error(msg);
    };

    OpeningHours.DEFAULT_OPTIONS = {
        title: "Opening hours",
        closedMsg: "Closed",
        days: [
            {name: "Mo", hours: "10:00 - 18:00"},
            {name: "Tu", hours: "10:00 - 18:00"},
            {name: "We", hours: "10:00 - 18:00"},
            {name: "Th", hours: "10:00 - 18:00"},
            {name: "Fr", hours: "10:00 - 18:00"},
            {name: "Sa", hours: null},
            {name: "Su", hours: null}
        ],
        cellWidth: "30px",
        cellHeight: "25px",
        selectedDay: null,
        firstDaySunday: false,
        cssStyle: ""
    };

    return OpeningHours;
});