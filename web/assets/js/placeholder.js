/* =========================================================
 * placeholder.js v1.0.0
 * Andrew Keym
 * This plugin adds placeholder text for IE9
 *
 * ========================================================= */

(function ($) {


    "use strict"; // jshint ;_;

    /*global $, window: false, document: false, location: false */

    /* Placeholder CLASS DEFINITION
    * ==================== */

    var Placeholder = function (element, options) {
        this.element = $(element);
        this.options = this.element.data();
    };

    Placeholder.prototype = {

        constructor: Placeholder,

        show: function () {
            if (this.element.val() === "") {
                this.element.val(this.element.attr("placeholder"));
                this.element.addClass("placeholder");
            }
        },

        hide: function () {
            if (this.element.hasClass("placeholder")) {
                this.element.removeClass("placeholder").val("");
            }
        },

        add: function () {
            this.element.on("focus.placeholder", function () {
                $(this).placeholder('hide');
            });

            this.element.on("blur.placeholder", function () {
                $(this).placeholder('show');
            });

            this.element.placeholder('show');
        },

        remove: function () {
            this.element.removeClass("placeholder");
            if (this.element.val() === this.element.attr("placeholder")) {
                this.element.val("");
            }
            this.element.unbind(".placeholder");
        }

    };


    /* Placeholder PLUGIN DEFINITION
    * ===================== */

    $.fn.placeholder = function (option) {
        var supported = !!("placeholder" in document.createElement( "input" ));
        return supported ? this : this.each(function () {
            var $this = $(this),
                data = $this.data('placeholder');
            if (!data) {
                $this.data('placeholder', (data = new Placeholder(this)));
            }
            if (typeof option === 'string') {
                data[option]();
            }
        });
    };

    $.fn.placeholder.Constructor = Placeholder;


    /* Placeholder events
     * ============ */
    $(function () {
        $('input:text[placeholder], textarea[placeholder]').placeholder('add');

        // Prevent placeholder values from submitting
        $("form").submit(function () {
        	
             $('input:text[placeholder], textarea[placeholder]').placeholder('remove');
        });
    });
}(window.jQuery));