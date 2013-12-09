/*
Author: Andrew Keym
Description:
This file manages all the deal jacket list events
*/

/*global $, window: false */

// namespace and methods
var dj_list = {
    // set up event listeners on load
    init : function () {
        "use strict";
        var cb_status = {};

        $("#manage-hide").click(function() {
            // POST hide-form from manage actions
            $("#hide-form").submit();
        });

        $("[rel='tooltip']").tooltip();

        // disable clickable links on IE
        $('ul.button-nav > li.disabled > a').click(function () { return false; });

        // dealjacket popover
        $('[rel=popover]').popover({
            html: true,
            trigger: 'manual',
            placement: 'top',
            content: function () {
                return $("#" + $(this).attr("data-dj-id")).html();
            }
        }).on("click", function () {
            if (cb_status.popover_visible) {
                // close current popover
                $('.dealjacket-popover a[data-dj-id=' + $('.popover.top .dealjacket-summary').attr("data-dj-id") + ']').popover('hide');
                // if we're not trying to open the same popover show the new popover
                if ($(this).attr("data-dj-id") !== $('.popover.top .dealjacket-summary').attr("data-dj-id")) {
                    $(this).popover('show');
                }
            } else {
                $(this).popover('show');
            }
            cb_status.popover_visible = true;
        });

        // close the popover when x is clicked
        $("body").on("click", ".popover .close", function () {
            $('[rel=popover]').popover('hide');
            cb_status.popover_visible = false;
        });

        $('[data-alert-url]').on('mouseover', function () {
            var $this = $(this),
                alerts = "";
            $.get($this.data('alertUrl'), function(data) {
                if (data.result) {
                    $.each(data.result, function (i, alert) {
                        alerts += alert + "<br>";
                    });
                    $this.tooltip({title: alerts, trigger: 'manual' }).tooltip('show');
                }
            });
        }).on('mouseout', function () {
            $(this).tooltip('hide');
        });
    }
};

dj_list.init();