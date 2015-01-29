# opening-hours library

This JavaScript library can be useful to show opening hours. It is very easy to use and configure.

![Example](/images/example.png)

[See demo](http://lukasz-si.github.io/opening-hours/)

# Getting Started

In order to use the library just copy js and css files from `/dist` folder:
 * `/dist/opening-hours.js` or `/dist/opening-hours.min.js`
 * `/dist/opening-hours.css`

If you are using `bower`, run this command:

```
$ bower install opening-hours
```

Or add `opening-hours` to your apps `bower.json`:

```json
  "dependencies": {
    "opening-hours": "latest"
  }
```

## Dependencies

Requires jQuery library.

## Usage

#### AMD users (e.g. require.js library)

The library detects if AMD is used and defines new module called `OpeningHours`. Below is an example how to use it.

```javascript
define(["OpeningHours"], function (OpeningHours) {
    "use strict";

    var openingHours = new OpeningHours("#opening-hours-container", {});
});
```

Please check `/examples/amd`.

#### Using OpeningHours constructor directly

If AMD is not available then `OpeningHours` constructor is assigned to `window` element.

```html
<script>

    var openingHours = new OpeningHours("#opening-hours", {});

</script>
```

Please check `/examples/global/`.

# Settings

The following are default settings which might be override:

```javascript
var options = {
    title: "Opening hours",                      /** the title */
    closedMsg: "Closed",                         /** the message is shown when "hours" property is null */
    days: [                                      /** describes all days of a week */
        {name: "Mo", hours: "10:00 - 18:00"},    /** "name" points a name of a day */
        {name: "Tu", hours: "10:00 - 18:00"},
        {name: "We", hours: "10:00 - 18:00"},
        {name: "Th", hours: "10:00 - 18:00"},
        {name: "Fr", hours: "10:00 - 18:00"},
        {name: "Sa", hours: null},               /** if "hours" is null then "closedMsg" is shown */
        {name: "Su", hours: null}
    ],
    cellWidth: "35px",                           /** cell width */
    cellHeight: "30px",                          /** cell height */
    selectedDay: null,                           /** indicates which day should be selected on start, Sunday is 0, Monday is 1, etc. */
    firstDaySunday: false,                       /** indicates if the first day of a week is Sunday */
    cssStyle: ""                                 /** adds user custom css selector just to easily override default styles */
};
```

# Examples

[Pizzeria Planetarium](http://pizzeriaplanetarium.pl)

