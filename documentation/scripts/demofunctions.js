function loadDemo() {
    var navigation = $($.find('.navigation'));

    navigation.find('.navigationContent').click(function (event) {
        var target = event.target;
        var elementClicked = $(this);
        startDemo(target);

        event.preventDefault();
        event.stopPropagation();

        return false;
    });
}

function initthemes(initialurl) {
    var loadedThemes = [0, -1, -1, -1, -1];
    var themes = ['Classic', 'Energy Blue', 'Shiny Black', 'Dark Blue', 'Summer'];
    var me = this;
    this.$head = $('head');
    $('#themeComboBox').jqxDropDownList({ source: themes, theme: 'classic', selectedIndex: 0, dropDownHeight: 122, width: '120px', height: '20px' });
    $.data(document.body, 'theme', 'classic');

    $('#themeComboBox').bind('select', function (event) {
        setTimeout(function () {
            var selectedIndex = event.args.index;
            var selectedTheme = '';
            var url = initialurl;

            var loaded = loadedThemes[selectedIndex] != -1;
            loadedThemes[selectedIndex] = selectedIndex;

            switch (selectedIndex) {
                case 0:
                    url += "classic.css";
                    selectedTheme = 'classic';
                    break;
                case 1:
                    url += "energyblue.css";
                    selectedTheme = 'energyblue';
                    break;
                case 2:
                    url += "shinyblack.css";
                    selectedTheme = 'shinyblack';
                    break;
                case 3:
                    url += "darkblue.css";
                    selectedTheme = 'darkblue';
                    break;
                case 4:
                    url += "summer.css";
                    selectedTheme = 'summer';
                    break;
            }
            if (!loaded) {
                if (document.createStyleSheet != undefined) {
                    document.createStyleSheet(url);
                }
                else me.$head.append('<link rel="stylesheet" href="' + url + '" media="screen" />');
            }
            $.data(document.body, 'theme', selectedTheme);
            var startedExample = $.data(document.body, 'example');
            if (startedExample != null) {
                startDemo(startedExample);
            }
        }, 5);
    });
}
function initmenu() {
    var content = $('#demos')[0];
    var navigation = $($.find('.navigation'));
    var self = this;

    if (!$.browser.msie) {
        $('#navigationmenu').find('li').css('opacity', 0.95);
        $('#navigationmenu').find('ul').css('opacity', 0.95);
    }
    $('#navigationmenu').jqxMenu({ theme: 'demo', autoSizeMainItems: true, autoCloseOnClick: true });
    $('#navigationmenu').css('visibility', 'visible');
 }
function prepareExamplePath(url) {
    var path = '<div id="pathElement">';
    var str = '';
    var examplePath = url.toString();
    for (i = 0; i < url.toString().length; i++) {
        if (i == 0) {
            path += "<div style='float: left; width: 16px; height: 16px;' class='icon-arrow-right'></div>";
        }

        var char = examplePath.substring(i, i + 1);
        if (char == '/' || i == url.toString().length - 1) {
            if (i == url.toString().length - 1) {
                str += char;
                path += '<span style="margin-left: 2px; float: left;">' + str + '</span>';
            }
            else if (str == 'demos') {
                path += '<span style="margin-left: 2px; float: left;"><a href="#">' + str + '</a></span>';
            }
            else path += '<span style="margin-left: 2px; float: left;">' + str + '</span>';

            path += "<div style='float: left; width: 16px; height: 16px;' class='icon-arrow-right'></div>";
            str = '';
        }
        else str += char;
    }

    path += '</div>';

    $("#examplePath").html(path);
    $("#examplePath").find('a').click(function () {
        GoToWelcomePage();
    });

    $("#examplePath").css('float', 'left');
    $("#examplePath").css('margin-left', 0);
    $("#themeSelector").css('display', 'block');
    $("#themeSelector").css('float', 'right');
}

function closewindows() {
    var windows = $.data(document.body, 'jqxwindows-list');
    if (windows && windows.length > 0) {
        var count = windows.length;
        while (count) {
            count -= 1;
            windows[count].jqxWindow('closeWindow', 'close');
        }
    }
    var window = $.data(document.body, 'jqxwindow-modal');
    if (window != null && window.length && window.length > 0) {
        window.jqxWindow('closeWindow', 'close');
    }

    $.data(document.body, 'jqxwindow-modal', []);
}

function startDemo(target) {
    if (target == null || target.href == null)
        return;

    var scrollTop = $(window).scrollTop();
    var hasHref = target.href;
    if (!hasHref)
        return;

    closewindows();
    $('#tabs').css('visibility', 'visible');

    if (!this.jqxtabsinitialized) {
        $('#tabs').css('height', '100%');
        $('#tabs').jqxTabs({ keyboardNavigation: false, selectionTracker: false });
        this.jqxtabsinitialized = true;
    }

    $('#tabs').jqxTabs('select', 0);
    $("#divWelcome").css('display', 'none');
    $("#divWelcome").empty();
    $.data(document.body, 'example', target);

    var url = target.href;
    var startindex = url.toString().indexOf('demos');
    var demourl = url.toString().substring(startindex);
    window.location.hash = demourl;
    prepareExamplePath(demourl);

    if ($("iframe").length > 0) {
        var iframe = $("iframe");
        iframe.unload();
        iframe.remove();    
    }

    $("#innerDemoContent").empty();

    height = $('#demoContent').height();
    var width = 710;
    height -= parseInt(40);

    $('#tabs-1').css({ height: height + 'px', width: width + 'px' });
    $('#tabs-2').css({ height: height + 'px', width: width + 'px' });
    $('#tabs-3').css({ height: height + 'px', width: width + 'px' });

    var demoHeight = parseInt(height);
    var demoWidth = parseInt($("#demoContent").width()) / 2;
    var loader = $("<img src='images/loader.gif' />");
    loader.css('margin-top', (demoHeight / 2 - 18) + 'px');
    loader.css('margin-left', (demoWidth - 18) + 'px');
    $("#innerDemoContent").html(loader);

    var theme = $.data(document.body, 'theme');
    $("#innerDemoContent").removeAttr('theme');
    if (theme == undefined) theme = '';
    url += '?' + theme.toString();

    var isnonpopupdemo = url.indexOf('window') == -1 && url.indexOf('menu') == -1 && url.indexOf('datetimeinput') == -1 && url.indexOf('dropdownlist') == -1 && url.indexOf('combobox') == -1;
    if (isnonpopupdemo) {        
        var iframe = $('<iframe frameborder="0" src="' + url + '" id="jqxInnerDemoContent" style="border-collapse: collapse; margin-top: 10px; margin-left: 10px; width: 700px;"></iframe>');
        $("#innerDemoContent").html('');
        $("#innerDemoContent").append(iframe);
   
        iframe.height(900);
    }

    $.get(url,
                    function (data) {
                        var originalData = data;
                        var descriptionLength = "<title id='Description'>".toString().length;
                        var startIndex = data.indexOf('<title') + descriptionLength;
                        var endIndex = data.indexOf('</title>');
                        var description = data.substring(startIndex, endIndex);

                        $('#divDescription').html('<div style="margin: 10px;">' + description + '</div>');
                        var anchor = $("<div id='demourl' style='color: #444; position: absolute; font-size: 13px; font-family: Arial, Helvetica, Sans-Serif; top: 25%; left: 570px; margin-right: 10px;'><a style='color: #535353;' target='_blank' href='" + url + "'>Open in new window</a></div>");
                        $('#tabs #demourl').remove();
                        $('#tabs .jqx-tabs-header').append(anchor);

                        if (!isnonpopupdemo) {
                            data = data.replace(/<script.*>.*<\/script>/ig, ""); // Remove script tags
                            data = data.replace(/<\/?link.*>/ig, ""); //Remove link tags
                            data = data.replace(/<\/?html.*>/ig, ""); //Remove html tag
                            data = data.replace(/<\/?body.*>/ig, ""); //Remove body tag
                            data = data.replace(/<\/?head.*>/ig, ""); //Remove head tag
                            data = data.replace(/<\/?!doctype.*>/ig, ""); //Remove doctype
                            data = data.replace(/<title.*>.*<\/title>/ig, ""); // Remove title tags
                            data = data.replace(/..\/..\/images\//g, "images/"); // fix image path
                            data = data.replace(/..\/..\/jqwidgets\/globalization\//g, "jqwidgets/globalization/"); // fix localization path
                            $("#innerDemoContent").removeClass();
                            $("#innerDemoContent").attr('theme', theme.toString());
                            $("#innerDemoContent").html('');
                            $("#innerDemoContent").html('<div id="jqxInnerDemoContent" style="position: relative; top: 10px; left: 10px; width: 700px; height: 90%;">' + data + '</div>');
                            var jqxInnerDemoContent = $("#innerDemoContent").find('#jqxInnerDemoContent');
                            var jqxWidget = $("#innerDemoContent").find('#jqxWidget');
                            jqxInnerDemoContent.css('visibility', 'visible');
                        }

                        //populate tabs.

                        var result = formatCode(originalData);
                        $('#tabs-2').html(result);
                        var demourl = url.toString().substring(url.toString().indexOf('demos'));
                        var widgetNameStartIndex = demourl.indexOf('/');
                        var widgetNameEndIndex = demourl.toString().substring(widgetNameStartIndex + 1).indexOf('/');
                        var widgetName = demourl.substring(widgetNameStartIndex + 1, 1 + widgetNameStartIndex + widgetNameEndIndex);
                        if (widgetName == 'jqxbutton' && (url.indexOf('checkbox') != -1 || url.indexOf('radiobutton') != -1)) {
                            widgetName = 'jqxcheckbox';
                        }
                   
                        var apiURL = window.location.protocol + "//" + window.location.host + '/documentation/' + widgetName + '/' + widgetName + '-api.htm';
                        $.ajax({
                            dataType: 'html',
                            url: apiURL,
                            type: 'GET',
                            success: function (api) {
                                api = api.replace(/<script.*>.*<\/script>/ig, ""); // Remove script tags
                                api = api.replace(/<\/?link.*>/ig, ""); //Remove link tags
                                api = api.replace(/<\/?html.*>/ig, ""); //Remove html tag
                                api = api.replace(/<\/?body.*>/ig, ""); //Remove body tag
                                api = api.replace(/<\/?head.*>/ig, ""); //Remove head tag
                                api = api.replace(/<\/?!doctype.*>/ig, ""); //Remove doctype
                                api = api.replace(/<title.*>.*<\/title>/ig, ""); // Remove title tags                   
                                $('#tabs-3').html('<div style="width: 90%; margin-left: 10px; margin-top: 10px; margin-right: 10px;">' + api + '</div>')
                            }
                        });
                    }, "html"
            )
    return false;
}  