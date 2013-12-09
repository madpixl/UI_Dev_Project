(function ($) {

    "use strict"; // jshint ;_;

    /*global $, window: false, location: false */

    /* FilterSort CLASS DEFINITION
    * ==================== */

    var FilterSort = function (element, options) {
        this.element = $(element);
        this.options = this.element.data();
        this.window = window;
        this.location = location;
    };

    FilterSort.prototype = {

        constructor: FilterSort,

        filter: function () {
            var params = this.buildParams();
            this.redirect(params);
        },

        keywordSearch: function () {
            var params;
            if ($('[data-list="keyword"]').val() !== "") {
                params = this.buildParams(true);
                this.redirect(params);
            }
        },

        sortParams: function () {
            // need to split the sort value into field and order properties
            // assumes the inputs value is like field|asc
            var sort_params;

            if ($('[data-list="sort"]').length > 0) {
                sort_params = $('[data-list="sort"]').val().split("|");
                return "?sort_by=" + sort_params[0] + "&sort_order=" + sort_params[1];
            } else {
                return "?";
            }
        },

        removeParams: function (query_string, params, isarray) {
            var new_query_string = query_string,
                params_list = isarray ? params : params.split(',');
            isarray = typeof isarray === 'undefined' ? false : true;
            $.each(params_list, function (key, value) {
                var pattern = new RegExp("(" + value + "=)[^&]*.", "g");
                new_query_string = new_query_string.replace(pattern, "");
            });
            return new_query_string;
        },

        buildParams: function (keyword_search) {
            var existing_params = this.removeParams(this.location.search, "sort_by,sort_order,page"),
                params = this.sortParams(), // add sort params first since they will always be there
                remove_params = [];

            // remove ? or & character at the front
            existing_params = existing_params.substring(1);

            $('[data-list="filter"],[data-list="keyword"]').each(function () {
                var $name = $(this).attr('name');
                // remove existing param if it exists
                if (existing_params.match($name) !== null) {
                    remove_params.push($name);
                }

                if ($(this).is(':checkbox') || $(this).is(':radio')) {
                    if ($(this).is(':checked')) {
                        params = params + "&" + $(this).attr('name') + "=" + $(this).val();
                    }
                } else {
                    if ($(this).val() !== "" && $(this).val() !== $(this).attr('placeholder')) {
                        params = params + "&" + $(this).attr('name') + "=" + $(this).val();
                    }
                }
            });

            if (remove_params.length !== 0) {
                existing_params = this.removeParams(existing_params, remove_params, true);
            }

            params = params.replace(/&&/g, "&");
            params = params.replace(/\?&/g, "?");

            if (existing_params !== "") {
                params = params + "&" + existing_params;
            }

            return params;
        },

        redirect: function (query) {
            this.window.location.href = location.protocol + "//" + location.host + location.pathname + query;
        }
    };

    /* FilterSort PLUGIN DEFINITION
    * ===================== */

    $.fn.filtersort = function (option) {
        var data;

        this.each(function () {
            var $this = $(this);
            data = $this.data('filtersort');
            if (!data) {
                $this.data('filtersort', (data = new FilterSort(this)));
            }
        });

        if (option === "init") {
            return true;
        } else {
            return this.each(function () {
                if (typeof option === 'string') { data[option](); }
            });
        }
    };

    $.fn.filtersort.Constructor = FilterSort;


    /* FilterSort DATA-API
     * ============ */

    $(function () {
        $('body').on('change.filtersort.data-api', '[data-list="filter"], [data-list="sort"]', function (e) {
            e.preventDefault();
            $(this).filtersort('filter');
        });

        $('body').on('click.filtersort.data-api', '[data-list="keyword-search-btn"]', function (e) {
            e.preventDefault();
            $(this).filtersort('keywordSearch');
        });

        $('body').on('keypress.filtersort.data-api', '[data-list="keyword"]', function (e) {
            if (e.which === 13) { //enter key
                $(this).filtersort('keywordSearch');
            }
        });
    });
}(window.jQuery));
