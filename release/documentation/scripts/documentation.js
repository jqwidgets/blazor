try {
    $(document).ready(function () {
        $(".documentation-option-type-click").click(function (event) {
            $(event.target).parents('tr').next().find(".property-content").toggle();
        });
        if (navigator.userAgent.indexOf('MSIE 7.0') >= 0 || navigator.userAgent.indexOf('MSIE 8.0') >= 0) {
            $("em").hide();
            $("em").next().hide();
        }

        if ($("#properties").length > 0) {
            if (document.title.indexOf("jQuery Response") != -1 || document.title.indexOf("Integration with Knockout") != -1)
                return;

            var bootstrapUrl = "../../jqwidgets/styles/jqx.bootstrap.css";

            if (document.createStyleSheet != undefined) {
                document.createStyleSheet(bootstrapUrl);
            }
            else {
                var link = $('<link rel="stylesheet" href="' + bootstrapUrl + '" media="screen" />');
                $(document).find('head').append(link);
            }

            var addInput = function (element) {
                var input = $("<input style='padding-left: 2px; margin-top: 10px; outline:none; border-width: 1px; height: 25px; width: 250px;' class='jqx-widget jqx-widget-bootstrap jqx-rc-all jqx-input jqx-input-bootstrap' placeholder='I am searching for'/>");
                input.insertBefore(element);
                if (navigator.userAgent.indexOf('MSIE 7.0') >= 0 || navigator.userAgent.indexOf('MSIE 8.0') >= 0 || navigator.userAgent.indexOf('MSIE 9.0') >= 0) {
                    $("<label>I am searching for</label><br/>").insertBefore(input);
                    input.css('line-height', '25px');
                }
                if ($("#properties2").length > 0) input.css('margin-left', '5px');
                var timer = null;
                input.focus(function () {
                    input.addClass('jqx-fill-state-focus jqx-fill-state-focus-bootstrap');
                });
                input.blur(function () {
                    input.removeClass('jqx-fill-state-focus jqx-fill-state-focus-bootstrap');
                });

                input.keydown(function (event) {
                    if (timer != undefined) clearTimeout(timer);
                    timer = setTimeout(function () {
                        var searchString = input.val();
                        var items = $(".documentation-option-type-click");
                        $.each(items, function () {
                            var item = $(this);
                            var itemText = $.trim(item.text());
                            var match = itemText.toUpperCase().indexOf(searchString.toUpperCase()) != -1;
                            if (!match) {
                                item.parent().hide();
                                item.parent().next().hide();
                            }
                            else {
                                item.parent().show();
                                item.parent().next().show();
                            }
                            var height = $(".navigation").height() - 10;
                            $("#demoContainer").css('min-height', height + 'px');
                        });

                    }, 500);
                });
            }
            addInput($("#properties"));
            if ($("#properties2").length > 0) {
                addInput($("#properties2"));
            }
            if ($("#properties3").length > 0) {
                addInput($("#properties3"));
            }
            if ($("#properties4").length > 0) {
                addInput($("#properties4"));
            }
            if ($("#properties5").length > 0) {
                addInput($("#properties5"));
            }
        }
    });
}
catch (error) {
    var er = error;
}