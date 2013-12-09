/*
Author: Andrew Keym
Description:
The code below is for the base template (header & footer) of the site.
It sets up the namespace "baseTemplate" and initializes the following events:
- The click event for the popover for Dealer switch
*/

/*global $, window: false */

// namespace and methods
var base = {
    // set up event listeners on load
    init : function () {
        "use strict";

        // Popover for the Dealertrack/User switch functionality
        $('#switch_trig').popover({
            html : true,
            trigger: 'click',
            placement: 'bottom',
            template: '<div class="popover popover-dealer-switch"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>',
            // takes content from the div with the "switch" ID
            content: function () {
                return $('#switch').html();
            }
        }).click(function () {
            $(this).focus();
        });

		// Popover for the Settings functionality
		$('#settings_trig').popover({
            html : true,
            trigger: 'click',
            placement: 'bottom',
            template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>',
            // takes content from the div with the "switch" ID
            content: function () {
                return $('#settings').html();
            }
        })

        // detect tablet orientation change
        $(window).bind('orientationchange', function (e) {
            $('meta[name="viewport"]').attr('content', 'width=device-width, maximum-scale=1.0, initial-scale=1.0');
        });

        $(window).bind("touchstart", function (event) {
            $('meta[name="viewport"]').attr('content', 'width=device-width, minimum-scale=0.25, maximum-scale=1.6');
        });
    }
};

// run init method
base.init();