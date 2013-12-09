/*global $, document */
var utils = {
    format_date: function (d, time) {
        "use strict";

        d = new Date(d * 1000);
        var day = d.getDate(),
            month = d.getMonth(),
            year = d.getFullYear();

        month += 1;
        var formatted_date = month + "/" + day + "/" + year;
        // pass time as true, for adding time in date
        if (time) {
            var hours = d.getHours(),
                minutes = d.getMinutes(),
                ampm,
                strtime;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            ampm = hours >= 12 ? 'p.m.' : 'a.m.';
            hours = hours % 12;
            hours = hours || 12;
            strtime = hours + ':' + minutes + ' ' + ampm;
            formatted_date = formatted_date + " " + strtime;
        }
        return formatted_date;
    },

    initial_caps: function (str) {
        "use strict";

        var words = str.toLowerCase().split(' '),
            formatted_string = '';

        $.each(words, function (i, string) {
            formatted_string += string.charAt(0).toUpperCase() + string.slice(1);
            if (i !== words.length - 1) {
                formatted_string += ' ';
            }
        });

        return formatted_string;
    }
};
