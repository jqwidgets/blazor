
$(document).ready(function () {
    (function ($) { $.jqx.response = function () { this.defineInstance() }; $.jqx.response.prototype = { defineInstance: function () { this._handlers = new Array(); this.refresh(); var that = this; this.addHandler($(document), "scroll.jqxresponse", function () { that.scroll = that.getScroll() }) }, refresh: function () { this.os = this.getOS(); this.browser = this.getBrowser(); this.device = this.getDevice(); this.viewPort = this.getViewPort(); this.document = this.getDocument(); this.scroll = this.getScroll(); this.media = window.matchMedia || window.msMatchMedia || function () { return {} } }, refreshSize: function () { this.viewPort = this.getViewPort(); this.document = this.getDocument() }, addHandler: function (source, event, func, data) { switch (event) { case "mousemove": if (window.addEventListener && !data) { source[0].addEventListener("mousemove", func, false); return false } break } if (source.on) { source.on(event, func) } else { source.bind(event, func) } }, removeHandler: function (source, event, func) { if (event == undefined) { if (source.off) { source.off() } else { source.unbind() } return } if (func == undefined) { if (source.off) { source.off(event) } else { source.unbind(event) } } else { if (source.off) { source.off(event, func) } else { source.unbind(event, func) } } }, destroy: function () { this.removeHandler($(window), "resize.jqxresponse"); this.removeHandler($(document), "scroll.jqxresponse"); for (var i = 0; i < this._handlers.length; i++) { var element = this._handlers[i]; this.removeHandler($(element), "mousedown.response" + element[0].id); this.removeHandler($(element), "touchstart.response" + element[0].id); this.removeHandler($(element), "mousemove.response" + element[0].id); this.removeHandler($(element), "touchmove.response" + element[0].id); this.removeHandler($(element), "mouseup.response" + element[0].id); this.removeHandler($(element), "touchend.response" + element[0].id) } }, resize: function (resizeFuncs) { var that = this; this.removeHandler($(window), "resize.jqxresponse"); this.addHandler($(window), "resize.jqxresponse", function (event) { if (resizeFuncs) { if ($.isArray(resizeFuncs)) { for (var i = 0; i < resizeFuncs.length; i++) { resizeFuncs[i]() } } else { resizeFuncs() } } that.refreshSize() }); if (resizeFuncs == null) { this.removeHandler($(window), "resize.jqxresponse") } }, pointerDown: function (element, func) { if (element && func) { var touchDevice = $.jqx.mobile.isTouchDevice(); var that = this; var canCallFunc = true; if (touchDevice) { var touchstart = $.jqx.mobile.getTouchEventName("touchstart") + ".response" + element[0].id; if (func != null) { this.addHandler($(element), touchstart, function (event) { var position = $.jqx.position(event); var result = func(event, position, "touch"); canCallFunc = false; setTimeout(function () { canCallFunc = true }, 500); return result }) } else { this.removeHandler($(element), touchstart) } } if (func != null) { this.addHandler($(element), "mousedown.response" + element[0].id, function (event) { var position = $.jqx.position(event); if (canCallFunc) { return func(event, position, "mouse") } }) } else { this.removeHandler($(element), "mousedown.response" + element[0].id) } this._handlers.push(element) } }, pointerUp: function (element, func) { if (element) { var touchDevice = $.jqx.mobile.isTouchDevice(); var that = this; var canCallFunc = true; if (touchDevice) { var touchend = $.jqx.mobile.getTouchEventName("touchend") + ".response" + element[0].id; if (func != null) { this.addHandler($(element), touchend, function (event) { var position = $.jqx.position(event); var result = func(event, position, "touch"); canCallFunc = false; setTimeout(function () { canCallFunc = true }, 500); return result }) } else { this.removeHandler($(element), touchend) } } if (func != null) { this.addHandler($(element), "mouseup.response" + element[0].id, function (event) { var position = $.jqx.position(event); if (canCallFunc) { return func(event, position, "mouse") } }) } else { this.removeHandler($(element), "mouseup.response" + element[0].id) } this._handlers.push(element) } }, pointerMove: function (element, func) { if (element) { var touchDevice = $.jqx.mobile.isTouchDevice(); if (touchDevice) { var touchmove = $.jqx.mobile.getTouchEventName("touchmove") + ".response" + element[0].id; if (func != null) { this.addHandler($(element), touchmove, function (event) { var touches = $.jqx.mobile.getTouches(event); if (touches.length == 1) { var position = $.jqx.position(event); return func(event, position, "touch") } }) } else { this.removeHandler($(element), touchmove) } } else { if (func != null) { this.addHandler($(element), "mousemove.response" + element[0].id, function (event) { var position = $.jqx.position(event); return func(event, position, "mouse") }) } else { this.removeHandler($(element), "mousemove.response" + element[0].id) } } this._handlers.push(element) } }, isHidden: function (element) { return $.jqx.isHidden($(element)) }, inViewPort: function (element) { var viewPort = this.viewPort; if (element.getBoundingClientRect) { var r = element.getBoundingClientRect ? element.getBoundingClientRect() : {}; return r && (r.bottom >= 0 && r.top <= viewPort.height && r.right >= 0 && r.left <= viewPort.width) } return false }, getScroll: function () { var obj = { left: window.pageXOffset || document.scrollLeft, top: window.pageYOffset || document.scrollTop }; if (obj.left == undefined) { obj.left = 0 } if (obj.top == undefined) { obj.top = 0 } return obj }, getDocument: function () { return { width: $(document).width(), height: $(document).height() } }, getViewPort: function () { return { width: $(window).width(), height: $(window).height() } }, getTouch: function () { var eventName = "ontouchstart"; var supported = (eventName in window); if (supported) { return true } else { var eventName = "MSPointerDown"; var supported = (eventName in window); if (supported) { return true } } if ($.jqx.mobile.isWindowsPhone()) { return true } return false }, getDevice: function () { var osName = this.os.name; var match = window.location.search.match(/deviceType=(Tablet|Phone)/), nativeDeviceType = window.deviceType; var deviceType = ""; if (match && match[1]) { deviceType = match[1] } else { if (nativeDeviceType === "iPhone") { deviceType = "Phone" } else { if (nativeDeviceType === "iPad") { deviceType = "Tablet" } else { if (osName != "Android" && osName != "iOS" && /Windows|Linux|MacOS|Mac OS|Mac OS X/.test(osName)) { deviceType = "Desktop" } else { if (osName == "iOS" && navigator.userAgent.toLowerCase().indexOf("ipad") >= 0) { deviceType = "Tablet" } else { if (osName == "RIMTablet") { deviceType = "Tablet" } else { if (osName == "Android") { if (this.os.version && this.os.version.substring(0, 1).indexOf("3") >= 0) { deviceType = "Tablet" } else { if (this.os.version && this.os.version.substring(0, 1).indexOf("4") >= 0 && navigator.userAgent.search(/mobile/i) == -1) { deviceType = "Tablet" } else { deviceType = "Phone" } } if (navigator.userAgent.toLowerCase().indexOf("kindle fire") >= 0) { deviceType = "Tablet" } } else { deviceType = "Phone" } } } } } } } if (/Windows/.test(osName)) { if (navigator.userAgent.indexOf("Windows Phone") >= 0 || navigator.userAgent.indexOf("WPDesktop") >= 0 || navigator.userAgent.indexOf("IEMobile") >= 0 || navigator.userAgent.indexOf("ZuneWP7") >= 0) { deviceType = "Phone" } else { if (navigator.userAgent.indexOf("Touch") >= 0) { deviceType = "Tablet"; if (!this.getTouch()) { deviceType = "Desktop" } } } } return { type: deviceType, touch: this.getTouch(), width: window.screen.width, height: window.screen.height, availWidth: window.screen.availWidth, availHeight: window.screen.availHeight } }, canvas: function () { var canvasSupport = false; var canvas = document.createElement("canvas"); if (canvas && canvas.getContext && canvas.getContext("2d")) { canvasSupport = true } return canvasSupport }, vml: function () { if (this._vmlSupport == undefined) { var a = document.body.appendChild(document.createElement("div")); a.innerHTML = '<v:shape id="vml_flag1" adj="1" />'; var b = a.firstChild; b.style.behavior = "url(#default#VML)"; this._vmlSupport = b ? typeof b.adj == "object" : true; a.parentNode.removeChild(a) } return this._vmlSupport }, svg: function () { return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1") }, getBrowser: function () { var ua = navigator.userAgent.toLowerCase(); var name = ""; var match = null; var that = this; browserNames = { msie: { name: "Internet Explorer", eval: /(msie) ([\w.]+)/.exec(ua) }, webkit: { name: "Webkit", eval: /(webkit)[ \/]([\w.]+)/.exec(ua) }, chrome: { name: "Chrome", eval: /(chrome)[ \/]([\w.]+)/.exec(ua) }, safari: { name: "Safari", eval: /(safari)[ \/]([\w.]+)/.exec(ua) }, edge: { name: "Edge", eval: /(edge) ([\w.]+)/.exec(ua) }, opera: { name: "Opera", eval: /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) }, operamobile: { name: "Opera Mobile", eval: /(opera mobi)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(opera tablet)(?:.*version|)[ \/]([\w.]+)/.exec(ua) }, dolphin: { name: "Dolphin", eval: /(dolphin)[ \/]([\w.]+)/.exec(ua) }, webosbrowser: { name: "webOSBrowser", eval: /(wosbrowser)(?:.*version|)[ \/]([\w.]+)/.exec(ua) }, chromemobile: { name: "Chrome Mobile", eval: /(crmo)[ \/]([\w.]+)/.exec(ua) }, silk: { name: "Silk", eval: /(silk)[ \/]([\w.]+)/.exec(ua) }, firefox: { name: "Firefox", eval: /(firefox)[ \/]([\w.]+)/.exec(ua) }, msie11: { name: "Internet Explorer 11", eval: ua.indexOf("rv:11.0") >= 0 && ua.indexOf(".net4.0c") >= 0 }, winphone: { name: "Internet Explorer Mobile", eval: ua.indexOf("windows phone 8.1") >= 0 }, other: { name: "Other", eval: ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) } }; $.each(browserNames, function (index, value) { if (this.eval) { if (this.name == "Other") { if (!match) { match = this.eval; name = this.name } } else { if (this.name == "Internet Explorer 11") { if (!match) { match = ["", "msie", 11]; name = "Internet Explorer" } } else { if (this.name == "Internet Explorer Mobile") { if (!match) { match = ["", "msie", 11]; name = "Internet Explorer" } } else { if (name == "Chrome" && this.name == "Safari") { return true } match = this.eval; name = this.name } } } } }); if (match) { var browser = { name: name, accessName: match[1] || "", version: match[2] || "0", canvas: this.canvas(), svg: this.svg(), vml: this.vml() }; browser[match[1]] = match[1] } else { browser = { name: "Other", browser: "other", version: "" } } return browser }, getOS: function () { var match = null; var version = ""; var userAgent = navigator.userAgent; var os = "Other"; var osTypes = { ios: { name: "iOS", regex: new RegExp("(?:i(?:Pad|Phone|Pod)(?:.*)CPU(?: iPhone)? OS )([^\\s;]+)") }, android: { name: "Android", regex: new RegExp("(?:(Android |HTC_|Silk/))([^\\s;]+)") }, webos: { name: "webOS", regex: new RegExp("(?:(?:webOS|hpwOS)/)([^\\s;]+)") }, blackberry: { name: "BlackBerry", regex: new RegExp("(?:BlackBerry(?:.*)Version/)([^\\s;]+)") }, rimTablet: { name: "RIMTablet", regex: new RegExp("(?:RIM Tablet OS )([^\\s;]+)") }, chrome: { name: "Chrome OS", regex: new RegExp("CrOS") }, mac: { name: "MacOS", regex: new RegExp("mac") }, win: { name: "Windows", regex: new RegExp("win") }, linux: { name: "Linux", regex: new RegExp("linux") }, bada: { name: "Bada", regex: new RegExp("(?:Bada/)([^\\s;]+)") }, other: { name: "Other" } }; var osys = ""; var clientStrings = [{ s: "Windows 3.11", r: /Win16/ }, { s: "Windows 95", r: /(Windows 95|Win95|Windows_95)/ }, { s: "Windows ME", r: /(Win 9x 4.90|Windows ME)/ }, { s: "Windows 98", r: /(Windows 98|Win98)/ }, { s: "Windows CE", r: /Windows CE/ }, { s: "Windows 2000", r: /(Windows NT 5.0|Windows 2000)/ }, { s: "Windows XP", r: /(Windows NT 5.1|Windows XP)/ }, { s: "Windows Server 2003", r: /Windows NT 5.2/ }, { s: "Windows Vista", r: /Windows NT 6.0/ }, { s: "Windows 7", r: /(Windows 7|Windows NT 6.1)/ }, { s: "Windows 8.1", r: /(Windows 8.1|Windows NT 6.3)/ }, { s: "Windows 8", r: /(Windows 8|Windows NT 6.2)/ }, { s: "Windows 10", r: /(Windows 10|Windows NT 10)/ }, { s: "Windows NT 4.0", r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/ }, { s: "Windows ME", r: /Windows ME/ }, { s: "Android", r: /Android/ }, { s: "Open BSD", r: /OpenBSD/ }, { s: "Sun OS", r: /SunOS/ }, { s: "Linux", r: /(Linux|X11)/ }, { s: "BB10", r: /BB10/ }, { s: "MeeGo", r: /MeeGo/ }, { s: "iOS", r: /(iPhone|iPad|iPod)/ }, { s: "Mac OS X", r: /Mac OS X/ }, { s: "Mac OS", r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ }, { s: "QNX", r: /QNX/ }, { s: "UNIX", r: /UNIX/ }, { s: "BeOS", r: /BeOS/ }, { s: "OS/2", r: /OS\/2/ }, { s: "Search Bot", r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/ }]; for (var id in clientStrings) { var cs = clientStrings[id]; if (cs.r.test(userAgent)) { osys = cs.s; break } } var osVersion = ""; if (/Windows/.test(osys)) { osVersion = /Windows (.*)/.exec(osys)[1]; osys = "Windows" } if (/BB10/.test(osys)) { osVersion = "10"; osys = "BlackBerry" } switch (os) { case "Mac OS X": osVersion = /Mac OS X (10[\.\_\d]+)/.exec(userAgent)[1]; break; case "Android": osVersion = /Android ([\.\_\d]+)/.exec(userAgent)[1]; break; case "iOS": osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer); osVersion = osVersion[1] + "." + osVersion[2] + "." + (osVersion[3] | 0); break } if (osVersion != "") { version = osVersion } $.each(osTypes, function (index, value) { match = userAgent.match(this.regex) || userAgent.toLowerCase().match(this.regex); if (match) { if (!this.name.match(/Windows|Linux|MacOS/)) { if (match[1] && (match[1] == "HTC_" || match[1] == "Silk/")) { version = "2.3" } else { version = match[match.length - 1] } } os = { name: this.name, version: version, platform: navigator.platform }; return false } }); if (os && os.name == "Other") { os.name = osys } if (os && os.name != "" && osys != "") { os.name = osys } if (os && os.version == "" && osVersion != "") { os.version = osVersion } return os } } })(jqxBaseFramework);
    var opened = true;
    $("#toggleButtonLabel").click(function () {
        $("#toggleButton").trigger('click');
    });
    $("#toggleButton").click(function () {
        if (opened) {
            $("#toggleButton").parent().next().slideUp(function () {
                $(".widgets").addClass('closed');
            });
            $("#toggleButton").addClass('closed');
            opened = false;
            $("#toggleButtonLabel").html("Show Demo List");
        }
        else {
            $(".widgets").removeClass('closed');
            $("#toggleButton").parent().next().slideDown();
            $("#toggleButton").removeClass('closed');
            $("#toggleButtonLabel").html("Hide Demo List");
            opened = true;
        }
    });
    if (window.location.href.indexOf('mobiledemos') == -1) {
        initDemo(false);
    }
    else {
        initDemo(true);
    }
	if ($.jqx.browser.msie && $.jqx.browser.version < 12){
		var headerTabs = $(".title_nav .wrap li");
		headerTabs[1].style.display = "none";
		headerTabs[2].style.display = "none";	
		headerTabs[3].style.display = "none";	
	}
    if ($.jqx.browser.msie && $.jqx.browser.version < 9) {
        $(document.body).css('min-width', 1400);
        $(document.body).css('overflow-x', 'auto');
        $('html').css('overflow-x', 'auto');

        var url = "../../resources/design/css/img.css";
        $('head').append('<link rel="stylesheet" href="' + url + '" media="screen" />');
        var url = "../../resources/design/css/img_ie.css";
        $('head').append('<link rel="stylesheet" href="' + url + '" media="screen" />');
    }
});

function initthemes(initialurl) {
    if ($('#themeComboBox').length == 0) return;
    if (!$('#themeComboBox').jqxDropDownList) return;

    var loadedThemes = [0, -1. -1. -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    var themes = [
        { label: 'Light', group: 'Themes', value: 'light' },
        { label: 'Dark', group: 'Themes', value: 'dark' },
        { label: 'Arctic', group: 'Themes', value: 'arctic' },
        { label: 'Web', group: 'Themes', value: 'web' },
        { label: 'Bootstrap', group: 'Themes', value: 'bootstrap' },
        { label: 'Metro', group: 'Themes', value: 'metro' },
        { label: 'Metro Dark', group: 'Themes', value: 'metrodark' },
        { label: 'Office', group: 'Themes', value: 'office' },
        { label: 'Orange', group: 'Themes', value: 'orange' },
        { label: 'Fresh', group: 'Themes', value: 'fresh' },
        { label: 'Energy Blue', group: 'Themes', value: 'energyblue' },
        { label: 'Dark Blue', group: 'Themes', value: 'darkblue' },
        { label: 'Black', group: 'Themes', value: 'black' },
        { label: 'Shiny Black', group: 'Themes', value: 'shinyblack' },
        { label: 'Classic', group: 'Themes', value: 'classic' },
        { label: 'Summer', group: 'Themes', value: 'summer' },
        { label: 'High Contrast', group: 'Themes', value: 'highcontrast' },
        { label: 'Lightness', group: 'UI Compatible', value: 'ui-lightness' },
        { label: 'Darkness', group: 'UI Compatible', value: 'ui-darkness' },
        { label: 'Smoothness', group: 'UI Compatible', value: 'ui-smoothness' },
        { label: 'Start', group: 'UI Compatible', value: 'ui-start' },
        { label: 'Redmond', group: 'UI Compatible', value: 'ui-redmond' },
        { label: 'Sunny', group: 'UI Compatible', value: 'ui-sunny' },
        { label: 'Overcast', group: 'UI Compatible', value: 'ui-overcast' },
        { label: 'Le Frog', group: 'UI Compatible', value: 'ui-le-frog' }
    ];
    var mobilethemes = [
      { label: 'iOS', group: 'Themes', value: 'mobile' },
      { label: 'Android', group: 'Themes', value: 'android' },
      { label: 'Windows Phone', group: 'Themes', value: 'win8' },
      { label: 'Blackberry', group: 'Themes', value: 'blackberry' }
    ];
    var me = this;
    this.$head = $('head');
    if (window.location.href.indexOf('mobiledemos') != -1) {
        $('#themeComboBox').jqxDropDownList({ source: mobilethemes, theme: 'light', selectedIndex: 0, autoDropDownHeight: true, dropDownHeight: 200, width: '140px', height: '25px' });
    }
    else {
        $('#themeComboBox').jqxDropDownList({ source: themes, theme: 'light', selectedIndex: 0, dropDownHeight: 200, width: '140px', height: '25px' });
    }
    var loadedTheme = false;
    if (window.localStorage)
    {
        if (window.localStorage["Theme"])
        {
            loadedTheme = true;
            var selectedIndex = parseInt(window.localStorage["Theme"].substring(1));
            $('#themeComboBox').jqxDropDownList('selectIndex', selectedIndex);
            var loaded = loadedThemes[selectedIndex] != -1;
            loadedThemes[selectedIndex] = selectedIndex;
            var mobilethemes = [
                { label: 'iOS', group: 'Themes', value: 'mobile' },
                { label: 'Android', group: 'Themes', value: 'android' },
                { label: 'Windows Phone', group: 'Themes', value: 'win8' },
                { label: 'Blackberry', group: 'Themes', value: 'blackberry' }
            ];

            var themes = [
              { label: 'Light', group: 'Themes', value: 'light' },
              { label: 'Dark', group: 'Themes', value: 'dark' },
              { label: 'Arctic', group: 'Themes', value: 'arctic' },
              { label: 'Web', group: 'Themes', value: 'web' },
              { label: 'Bootstrap', group: 'Themes', value: 'bootstrap' },
              { label: 'Metro', group: 'Themes', value: 'metro' },
              { label: 'Metro Dark', group: 'Themes', value: 'metrodark' },
              { label: 'Office', group: 'Themes', value: 'office' },
              { label: 'Orange', group: 'Themes', value: 'orange' },
              { label: 'Fresh', group: 'Themes', value: 'fresh' },
              { label: 'Energy Blue', group: 'Themes', value: 'energyblue' },
              { label: 'Dark Blue', group: 'Themes', value: 'darkblue' },
              { label: 'Black', group: 'Themes', value: 'black' },
              { label: 'Shiny Black', group: 'Themes', value: 'shinyblack' },
              { label: 'Classic', group: 'Themes', value: 'classic' },
              { label: 'Summer', group: 'Themes', value: 'summer' },
              { label: 'High Contrast', group: 'Themes', value: 'highcontrast' },
              { label: 'Lightness', group: 'UI Compatible', value: 'ui-lightness' },
              { label: 'Darkness', group: 'UI Compatible', value: 'ui-darkness' },
              { label: 'Smoothness', group: 'UI Compatible', value: 'ui-smoothness' },
              { label: 'Start', group: 'UI Compatible', value: 'ui-start' },
              { label: 'Redmond', group: 'UI Compatible', value: 'ui-redmond' },
              { label: 'Sunny', group: 'UI Compatible', value: 'ui-sunny' },
              { label: 'Overcast', group: 'UI Compatible', value: 'ui-overcast' },
              { label: 'Le Frog', group: 'UI Compatible', value: 'ui-le-frog' }
            ];
            var selectedTheme = "";
            if (window.location.href.indexOf('mobiledemos') != -1)
            {
				if (mobilethemes[selectedIndex]) {
					selectedTheme = mobilethemes[selectedIndex].value;
				}
				else {
					selectedTheme = mobilethemes[0].value;
				}
            }
            else
            {
                selectedTheme = themes[selectedIndex].value;
            }
            var url = initialurl;
            url += selectedTheme + '.css';

            if (!loaded)
            {
                if (document.createStyleSheet != undefined)
                {
                    document.createStyleSheet(url);
                }
                else me.$head.append('<link rel="stylesheet" href="' + url + '" media="screen" />');
            }
            $.data(document.body, 'theme', selectedTheme);
        }
    }
    var hasParam = window.location.toString().indexOf('?');
    if (hasParam != -1) {
        var themestart = window.location.toString().indexOf('(');
        var themeend = window.location.toString().indexOf(')');
        var theme = window.location.toString().substring(themestart + 1, themeend);
        $.data(document.body, 'theme', theme);
        selectedTheme = theme;
        var themeIndex = 0;
        if (window.location.href.indexOf('mobiledemos') != -1) {
            $.each(mobilethemes, function (index) {
                if (this.value == theme) {
                    themeIndex = index;
                    return false;
                }
            });
        }
        else {
            $.each(themes, function (index) {
                if (this.value == theme) {
                    themeIndex = index;
                    return false;
                }
            });
        }
        $('#themeComboBox').jqxDropDownList({ selectedIndex: themeIndex });
        loadedThemes[0] = -1;
        loadedThemes[themeIndex] = 0;
    }
    else if (!loadedTheme) {
        $.data(document.body, 'theme', 'light');
    }

    $('#themeComboBox').on('select', function (event) {
        setTimeout(function () {
            var selectedIndex = event.args.index;
            var selectedTheme = '';
            var url = initialurl;

            var loaded = loadedThemes[selectedIndex] != -1;
            loadedThemes[selectedIndex] = selectedIndex;
            var mobilethemes = [
                { label: 'iOS', group: 'Themes', value: 'mobile' },
                { label: 'Android', group: 'Themes', value: 'android' },
                { label: 'Windows Phone', group: 'Themes', value: 'win8' },
                { label: 'Blackberry', group: 'Themes', value: 'blackberry' }
            ];

            var themes = [
              { label: 'Light', group: 'Themes', value: 'light' },
              { label: 'Dark', group: 'Themes', value: 'dark' },
              { label: 'Arctic', group: 'Themes', value: 'arctic' },
              { label: 'Web', group: 'Themes', value: 'web' },
              { label: 'Bootstrap', group: 'Themes', value: 'bootstrap' },
              { label: 'Metro', group: 'Themes', value: 'metro' },
              { label: 'Metro Dark', group: 'Themes', value: 'metrodark' },
              { label: 'Office', group: 'Themes', value: 'office' },
              { label: 'Orange', group: 'Themes', value: 'orange' },
              { label: 'Fresh', group: 'Themes', value: 'fresh' },
              { label: 'Energy Blue', group: 'Themes', value: 'energyblue' },
              { label: 'Dark Blue', group: 'Themes', value: 'darkblue' },
              { label: 'Black', group: 'Themes', value: 'black' },
              { label: 'Shiny Black', group: 'Themes', value: 'shinyblack' },
              { label: 'Classic', group: 'Themes', value: 'classic' },
              { label: 'Summer', group: 'Themes', value: 'summer' },
              { label: 'High Contrast', group: 'Themes', value: 'highcontrast' },
              { label: 'Lightness', group: 'UI Compatible', value: 'ui-lightness' },
              { label: 'Darkness', group: 'UI Compatible', value: 'ui-darkness' },
              { label: 'Smoothness', group: 'UI Compatible', value: 'ui-smoothness' },
              { label: 'Start', group: 'UI Compatible', value: 'ui-start' },
              { label: 'Redmond', group: 'UI Compatible', value: 'ui-redmond' },
              { label: 'Sunny', group: 'UI Compatible', value: 'ui-sunny' },
              { label: 'Overcast', group: 'UI Compatible', value: 'ui-overcast' },
              { label: 'Le Frog', group: 'UI Compatible', value: 'ui-le-frog' }
            ];

            if (window.location.href.indexOf('mobiledemos') != -1) {
                selectedTheme = mobilethemes[selectedIndex].value;
            }
            else {
                selectedTheme = themes[selectedIndex].value;
            }
            url += selectedTheme + '.css';

            if (!loaded) {
                if (document.createStyleSheet != undefined) {
                    document.createStyleSheet(url);
                }
                else me.$head.append('<link rel="stylesheet" href="' + url + '" media="screen" />');
            }
            $.data(document.body, 'theme', selectedTheme);
            if (window.localStorage)
            {
                window.localStorage["Theme"] = "T" + selectedIndex;
            }

            var startedExample = $.data(document.body, 'example');
            if (startedExample != null) {
                startDemo(startedExample);
            }
        }, 5);
    });
};

function jqxBrowser() {
    var ua = navigator.userAgent.toLowerCase();

    var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
        /(webkit)[ \/]([\w.]+)/.exec(ua) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
        /(msie) ([\w.]+)/.exec(ua) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
        [];

    var obj = {
        browser: match[1] || "",
        version: match[2] || "0"
    };
    if (ua.indexOf("rv:11.0") >= 0 && ua.indexOf(".net4.0c") >= 0) {
        obj.browser = "msie";
        obj.version = "11";
        match[1] = "msie";
    }
    if (ua.indexOf("edge") >= 0) {
        obj.browser = "msie";
        obj.version = "12";
        match[1] = "msie";
    }
    obj[match[1]] = match[1];
    return obj;
}
function initDemo(ismobile, isIndex) {
    var resize = function () {
        if ($(window).width() < 1330) {
            $(".doc_mask").css('visibility', 'hidden');
            $('.doc_menu_title').addClass('active');
            $('.doc_menu_title').parent().children('ul').css('display', 'block');
        }
        else {
            $(".doc_mask").css('visibility', 'visible');
        }

        if ($(".doc_menu").length > 0) {
            if (jqxBrowser().msie && jqxBrowser().version < 8) {
                $(".doc_content").css('padding', '5px');
                return;
            }
            var w = $(".doc_menu").offset().left;
            $(".doc_mask").css('left', $(".doc_content").offset().left + $(".doc_content").width());
            $(".doc_mask").width($(window).width() - $(".doc_content").offset().left - $(".doc_content").width());
            if (jqxBrowser().msie && jqxBrowser().version < 9) {
                $(".doc_mask").width($(document).width() - $(".doc_content").offset().left - $(".doc_content").width());
                $(".doc_mask").css('visibility', 'visible');
                return;
            }

      
            if ($(window).width() < 950) {
                $(".doc_content").css('min-height', 'auto');
            }
            if (window.location.href.toString().indexOf("jqxwindow") >= 0)
                return;

            $(".doc_content").css('min-height', 60 + $(".documentation").height());
        }
    }

    if (ismobile) {
        var isIndex = window.location.href.indexOf('jqx') == -1 && window.location.href.indexOf('php') == -1 && window.location.href.indexOf('typescript') == -1 && window.location.href.indexOf('angular2') == -1 && window.location.href.indexOf('angularjs') == -1 && window.location.href.indexOf('jquerymobile') == -1 && window.location.href.indexOf('mvc') == -1 && window.location.href.indexOf('jsp') == -1 && window.location.href.indexOf('requirejs') == -1 && window.location.href.indexOf('twitter') == -1;
        this.mobile = true;
        var path = "../../";
        if (isIndex === true) {
            var path = "../";
        }


        if (!isIndex) {
            $.ajax({
                async: false,
                url: path + "bottom.htm",
                success: function (data) {
                    $("#pageBottom").append(data);
                }
            });
            var initialurl = "http://www.jqwidgets.com/jquery-widgets-demo/jqwidgets/styles/jqx.";
            initthemes(initialurl);

            $.ajax({
                async: false,
                cache: false,
                url: path + "mobiletop.htm",
                success: function (data) {
                    $("#pageTop").append(data);
                    if ($.jqx.browser.msie && $.jqx.browser.version < 9) {
                        var images = $("img");
                        $.each(images, function (index, value) {
                            var src = this.src;
                            this.src = src.toString().substring(0, src.toString().length - 3) + "png";
                        });
                    }

                    var opened = false;
                    $("#toggleButtonLabel").click(function () {
                        $("#toggleButton").trigger('click');
                    });
                    $("#toggleButton").click(function () {
                        if (opened) {
                            $("#toggleButton").parent().next().slideUp(function () {
                                $(".widgets").addClass('closed');
                            });
                            $("#toggleButton").addClass('closed');
                            opened = false;
                            $("#toggleButtonLabel").html("Show Demo List");
                        }
                        else {
                            $(".widgets").removeClass('closed');
                            $("#toggleButton").parent().next().slideDown();
                            $("#toggleButton").removeClass('closed');
                            $("#toggleButtonLabel").html("Hide Demo List");
                            opened = true;
                        }
                    });
                
                    $(".doc_menu").find('a').mousedown(function (event) {
                        var href = event.target.href;
                        if (href && href.indexOf("#") == -1) {
                            resize();
                            $(".doc_menu").find('a').removeClass('anchorSelected');
                            $(this).addClass('anchorSelected');
                            startDemo(event.target);
                            event.preventDefault();
                            return false;
                        }
                        event.preventDefault();
                    });
                    $(".doc_menu").find('a').each(function () {
                        if (this.id == "demoLink") {
                     //       if ($(window).width() > 920) {
                                $(".doc_menu").find('a').removeClass('anchorSelected');
                                $(this).addClass('anchorSelected');
                                $(this).trigger('mousedown');
                            }
                    //    }
                    });

                    $(".doc_menu").find('a').mouseup(function (event) {
                        event.preventDefault();
                        return false;
                    });
                    $(".doc_menu").find('a').click(function (event) {
                        event.preventDefault();
                        return false;
                    });
                    var timeout;
                    $(window).resize(
                        function () {
                            if (timeout) {
                                clearTimeout(timeout);
                            }
                            timeout = setTimeout(function () {
                                resize();
                            });
                        });
                    resize();
                }
            });

        }
        document.body.style.visibility = "visible";
    }
    else {
        var isIndex = window.location.href.indexOf('jqx') == -1 && window.location.href.indexOf('typescript') == -1 && window.location.href.indexOf('angular2') == -1 && window.location.href.indexOf('angularjs') == -1 && window.location.href.indexOf('php') == -1 && window.location.href.indexOf('jquerymobile') == -1 && window.location.href.indexOf('mvc') == -1 && window.location.href.indexOf('jsp') == -1 && window.location.href.indexOf('requirejs') == -1 && window.location.href.indexOf('twitter') == -1;
        if (!isIndex) {

        }

        var loc = window.location.pathname;
        var dir = loc.substring(0, loc.lastIndexOf('/')) + "/";
        var bottom = isIndex ? dir + "bottom.htm" : "../../bottom.htm";
        var top = isIndex ? dir + "top.htm" : "../../top.htm";

        if (!isIndex) {
            var initialurl = "http://www.jqwidgets.com/jquery-widgets-demo/jqwidgets/styles/jqx.";
            initthemes(initialurl);
            $.ajax({
                async: false,
                url: top,
                success: function (data) {
                    $("#pageTop").append(data);
                    if ($.jqx.browser.msie && $.jqx.browser.version < 9) {
                        var images = $("img");
                        $.each(images, function (index, value) {
                            var src = $(this).attr('src');
                            this.src = src.toString().substring(0, src.toString().length - 3) + "png";
                        });
                    }
                    var timer;
                    var filterMenuItems = function (fromSearch) {
                        if (timer != undefined) clearTimeout(timer);
                        var filterNow = function () {
                            var searchString = $("#searchField").val();
                            var items = $(".sub_menu > a");
                            var highlight = function (item, itemText) {
                                var indx = itemText.toUpperCase().indexOf(searchString.toUpperCase());
                                if (indx == -1) {
                                    item[0].innerHTML = "<div style='display: inline;'>" + itemText + "</div>";
                                    return;
                                }
                                var start = itemText.substring(0, indx);
                                var highlight = itemText.substring(indx, indx + searchString.length);
                                var end = itemText.substring(indx + searchString.length);
                                item[0].innerHTML = "<span>" + start + "<div style='display: inline;' class='highlightText'>" + highlight + "</div>" + end + "</span>";
                            }

                            $.each(items, function () {
                                var item = $(this);
                                var itemText = $.trim(item.text());

                                var match = itemText.toUpperCase().indexOf(searchString.toUpperCase()) != -1;


                                if (!match) {
                                    var checkChildren = item.next().children().find('a');
                                    var hasMatch = false;
                                    $.each(checkChildren, function () {
                                        var childrenItem = $(this);
                                        var childText = $.trim(childrenItem.text());

                                        var childMatch = childText.toUpperCase().indexOf(searchString.toUpperCase()) != -1;
                                        childrenItem[0].innerHTML = childText;
                                        if (childMatch && searchString.length > 0) {
                                            highlight(childrenItem, childText);
                                            hasMatch = true;
                                        }
                                    });
                                    if (!hasMatch) {
                                        item.parent().hide();
                                        item.parent().removeClass('opened');
                                        highlight(item, itemText);
                                    }
                                    else {
                                        item.parent().addClass('opened');
                                        item.parent().show();
                                        highlight(item, itemText);
                                    }
                                }
                                else {
                                    item.parent().show();
                                    item.parent().removeClass('opened');
                                    var checkChildren = item.next().children().find('a');
                                    var hasMatch = false;
                                    $.each(checkChildren, function () {
                                        var childrenItem = $(this);
                                        var childText = $.trim(childrenItem.text());

                                        var childMatch = itemText.toUpperCase().indexOf(searchString.toUpperCase()) != -1;
                                        childrenItem[0].innerHTML = childText;
                                        if (childMatch && searchString.length > 0) {
                                            highlight(childrenItem, childText);
                                            hasMatch = true;
                                        }
                                    });
                                    if (hasMatch) {
                                        item.parent().addClass('opened');
                                        item.parent().show();
                                        highlight(item, itemText);
                                    }
                                    else {
                                        highlight(item, itemText);
                                    }
                                }
                            });
                            var items = $(".doc_menu > ul >  li:not(.sub_menu) a");
                            $.each(items, function () {
                                var item = $(this);
                                var itemText = $.trim(item.text());

                                var match = itemText.toUpperCase().indexOf(searchString.toUpperCase()) != -1;
                                item[0].innerHTML = itemText;
                                if (!match) {
                                    item.parent().hide();
                                    highlight(item, itemText);
                                }
                                else {
                                    item.parent().show();
                                    highlight(item, itemText);
                                }
                            });
                            resize();
                        }
                        if (fromSearch) {
                            timer = setTimeout(function () {
                                filterNow();
                            }, 500);
                        }
                        else {
                            filterNow();
                        }
                    }

                    if ($.jqx.response) {
                        var response = new $.jqx.response();
                        if (response.device.type != "Desktop") {
                            $('.doc_menu_title').addClass('active');
                            $('.doc_menu_title').parent().children('ul').css('display', 'block');
                        }
                    }

                
                    if ($("#searchField").length > 0) {
                        $("#searchField").keydown(function (event) {
                            filterMenuItems(true);                     
                        });
                        $("#searchField").on('change', function (event) {
                            filterMenuItems(true);
                        });
                        if ($("#searchField").val().length > 0) {
                            filterMenuItems(true);
                        }
                    }
                    var opened = false;
                    $("#toggleButtonLabel").click(function () {
                        $("#toggleButton").trigger('click');
                    });
                    $("#toggleButton").click(function () {
                        if (opened) {
                            $("#toggleButton").parent().next().slideUp(function () {
                                $(".widgets").addClass('closed');
                            });
                            $("#toggleButton").addClass('closed');
                            opened = false;
                            $("#toggleButtonLabel").html("Show Demo List");
                        }
                        else {
                            $(".widgets").removeClass('closed');
                            $("#toggleButton").parent().next().slideDown();
                            $("#toggleButton").removeClass('closed');
                            $("#toggleButtonLabel").html("Hide Demo List");
                            opened = true;
                        }
                    });

                    $(".doc_menu").find('a').mousedown(function (event)
                    {
                        var href = event.target.href;
                        if (href && href.indexOf("#") == -1) {
                            resize();
                            $(".doc_menu").find('a').removeClass('anchorSelected');
                            $(this).addClass('anchorSelected');
                            startDemo(event.target);
                            event.preventDefault();
                            $(document).trigger('mousedown');
                            return false;
                        }
                        else if ($(event.target).parent()[0] && $(event.target).parent()[0].href) {
                            var href = $(event.target).parent()[0].href;
                            if (href && href.indexOf("#") == -1) {
                                resize();
                                $(".doc_menu").find('a').removeClass('anchorSelected');
                                $(event.target).parent().addClass('anchorSelected');
                                startDemo($(event.target).parent()[0]);
                                event.preventDefault();
                                $(document).trigger('mousedown');
                                return false;
                            }
                        }
                        else if ($(event.target).parent().parent() && $(event.target).parent().parent()[0].href) {
                            var href = $(event.target).parent().parent()[0].href;
                            if (href && href.indexOf("#") == -1) {
                                resize();
                                $(".doc_menu").find('a').removeClass('anchorSelected');
                                $(event.target).parent().parent().addClass('anchorSelected');
                                startDemo($(event.target).parent().parent()[0]);
                                event.preventDefault();
                                $(document).trigger('mousedown');
                                return false;
                            }
                        }
                        event.preventDefault();
                    });
                    $(".doc_menu").find('a').each(function () {
                        if (this.id == "demoLink")
                        {
                            if ($.jqx.response)
                            {
                                var response = new $.jqx.response();
                                if (response.device.type != "Desktop")
                                {
                                    return;
                                }
                            }
                  //          if ($(window).width() > 920) {
                                $(".doc_menu").find('a').removeClass('anchorSelected');
                                $(this).addClass('anchorSelected');
                                $(this).trigger('mousedown');
                         //   }
                        }
                    });

                    $(".doc_menu").find('a').mouseup(function (event) {
                        event.preventDefault();
                        return false;
                    });
                    $(".doc_menu").find('a').click(function (event) {
                        event.preventDefault();
                        return false;
                    });

                    var timeout;
                    $(window).resize(
                        function () {
                            if (timeout) {
                                clearTimeout(timeout);
                            }
                            timeout = setTimeout(function () {
                                resize();
                            });
                        });
                    resize();
                }
            });
            $.ajax({
                async: false,
                url: bottom,
                success: function (data) {
                    $("#pageBottom").append(data);
                    if ($.jqx.browser.msie && $.jqx.browser.version < 9) {
                        var images = $("img");
                        $.each(images, function (index, value) {
                            var src = $(this).attr('src');
                            this.src = src.toString().substring(0, src.toString().length - 3) + "png";
                        });
                    }
                }
            });
        }
        else {
            if ($.jqx.browser.msie && $.jqx.browser.version < 9) {
                var images = $("img");
                $.each(images, function (index, value) {
                    var src = this.src;
                    this.src = src.toString().substring(0, src.toString().length - 3) + "png";
                });
            }
        }
    }
};
function closewindows() {
    var windows = $.data(document.body, 'jqxwindows-list');
    if (windows && windows.length > 0) {
        var count = windows.length;
        while (count) {
            count -= 1;
            windows[count].remove();
        }
    }
    var window = $.data(document.body, 'jqxwindow-modal');
    if (window != null && window.length && window.length > 0) {
        window.jqxWindow('closeWindow', 'close');
    }

    $.data(document.body, 'jqxwindow-modal', []);
    $.data(document.body, 'jqxwindows-list', []);
};

function getBrowser() {
    return $.jqx.browser;
};

function startDemo(target) {
    if (target == null || target.href == null) {
        if (target && target.href == null) {
            var child = $(target).children('a');
            if (child.length > 0) {
                target = child[0];
            }
        }
        else {
            return;
        }
    }

    var searchString = $("#searchField").val();
    if (searchString && searchString.length > 0) {
        $($.find('.highlightText')).removeClass('highlightText');
    }

    if ($(".doc_menu").length > 0) {
        $(".doc_content").css('min-height', 200 + $(".doc_menu").height());

    }

    var scrollTop = $(window).scrollTop();
    var hasHref = target.href;
    if (!hasHref) {
        return;
    }
    if ($(window).width() <= 920) {
        if ($.jqx.response) {
            var response = new $.jqx.response();
            if (response.device.type != "Desktop") {
                window.open(hasHref + "?light", "_blank");
                return;
            }
            else {
                $(document.body).css('min-width', 950);
                $(document.body).css('overflow-x', 'auto');
                $('html').css('overflow-x', 'auto');

            }
        }
    }

    if (getBrowser().browser == 'chrome') {
        $(".jqx-validator-hint").remove();
        $("#jqxMenu").remove();
        $("#Menu").remove();
        $("#gridmenujqxgrid").remove();
    }

    closewindows();
    $('#tabs').css('visibility', 'visible');
    $('#tabs').css('display', 'block');

    if (!this.jqxtabsinitialized) {
        $('#tabs').show();
        $('#tabs').jqxTabs({ width: 940, theme: 'jqxtabs', scrollable: false, keyboardNavigation: false, selectionTracker: false });
        this.jqxtabsinitialized = true;
        $('#tabs ').on('tabclick', function (event) {
            var tab = event.args.item;
            if (tab == 0) {
                $('.demoLink').show();
                $('#resources').show();
                if ($(".doc_menu").length > 0) {
                    $(".doc_content").css('min-height', 200 + $(".doc_menu").height());

                }
            }
            else {
                if ($(".doc_menu").length > 0) {
                    $(".doc_content").css('min-height', 200 + $(".doc_menu").height());

                }
                $(".demoLink").hide();
                $('#resources').hide();
            }
            if (tab == 1) {
                setTimeout(function () {
                    var childrenHeight = 100 + $("#tabs-2").children().height();
                    var maxHeight = Math.max(200 + $(".doc_menu").height(), childrenHeight);
                    $("#tabs-2").height(maxHeight);
                    $(".doc_content").css('min-height', maxHeight);
                });
            }
            else if (tab == 2) {
                setTimeout(function () {
                    var winHref = window.location.href.toString();
                    if ((winHref.indexOf("typescript") >= 0 || winHref.indexOf("angular2") >= 0))
                    {
                        $(".doc_content").css('min-height', 'auto');
                        var childrenHeight = 100 + $("#tabs-3").children().height();
                        var maxHeight = Math.max(200 + $(".doc_menu").height(), childrenHeight);
                        $("#tabs-3").height(maxHeight);
                        $(".doc_content").css('min-height', maxHeight);
                    }
                });
            }
            else if (tab == 3) {
                setTimeout(function () {
                    var winHref = window.location.href.toString();
                    if ((winHref.indexOf("angular2") >= 0)) {
                        $(".doc_content").css('min-height', 'auto');
                        var childrenHeight = 100 + $("#tabs-4").children().height();
                        var maxHeight = Math.max(200 + $(".doc_menu").height(), childrenHeight);
                        $("#tabs-4").height(maxHeight-10);
                        $(".doc_content").css('min-height', maxHeight);
                    }
                    else {
                        var childrenHeight = 100 + $("#tabs-4").children().height();
                        var maxHeight = Math.max(200 + $(".doc_menu").height(), childrenHeight);
                        $("#tabs-4").height(maxHeight);
                        $(".doc_content").css('min-height', maxHeight);
                    }
                });
            } else if (tab == 4) {
                setTimeout(function () {
                    $(".doc_content").css('min-height', 'auto');
                    var childrenHeight = 100 + $("#tabs-5").children().height();
                    var maxHeight = Math.max(200 + $(".doc_menu").height(), childrenHeight);
                    $("#tabs-5").height(maxHeight);
                    $(".doc_content").css('min-height', maxHeight);
                });
            }
        });
    }

    var demoUrlLeft = -20;
    var tabsResize = function () {
        if ($(window).width() < 1330) {
            $('#tabs').jqxTabs({ width: '100%' });
            $('#tabs #demourl').css('left', '-20px');
            demoUrlLeft = -20;
        }
        else {
            $('#tabs').jqxTabs({ width: 940 });
            $('#tabs #demourl').css('left', '-65px');
            demoUrlLeft = -65;
        }
        if ($(window).width() <= 920)
        {
            if ($.jqx.response)
            {
                var response = new $.jqx.response();
                if (response.device.type == "Desktop")
                {
                    $(document.body).css('min-width', 950);
                    $(document.body).css('overflow-x', 'auto');
                    $('html').css('overflow-x', 'auto');
                }
            }
        }
    }
    $(window).resize(function () {
        tabsResize();
    });
    tabsResize();

    $('#tabs').jqxTabs('select', 0);
    $("#introduction").css('display', 'none');
    $("#introduction").empty();
    $.data(document.body, 'example', target);

    var url = target.href;
    var startindex = url.toString().indexOf('demos');
    var demourl = url.toString().substring(startindex);
    window.location.hash = demourl;
    $("#themeSelector").css('visibility', 'visible');
    if (url.toString().indexOf('chart') >= 0 ||
        url.toString().indexOf('gauge') >= 0 ||
        url.toString().indexOf('twitter') >= 0) {
        $("#themeSelector").css('visibility', 'hidden');
    }
    if ($("iframe").length > 0) {
        var iframe = $("iframe");
        iframe.unload();
        iframe.remove();
        iframe.attr('src', null)
    }

    $("#innerdemoContainer").empty();
    $('#tabs-1').css({ height: 10 + 'px' });
    $('#tabs-2').css({ height: 10 + 'px' });
    $('#tabs-3').css({ height: 10 + 'px' });
    height = $('.doc_content').height();
    height = Math.max(height, $(".doc_menu").height());
    if (height < 1200) height = 1200;
    var width = 910;
    height -= parseInt(75);

    $('#tabs-1').css({ height: height + 'px', width: width + 'px' });
    $('#tabs-2').css({ height: height + 'px', width: width + 'px' });
    $('#tabs-3').css({ height: height + 'px', width: width + 'px' });

    var demoHeight = parseInt(height);
    var demoWidth = parseInt($("#demoContainer").width()) / 2;
    var loader = $("<table style='border-color: transparnet; border: none; border-collapse: collapse;'><tr><td align='center'><img src='../../images/loadingimage.gif' /></td></tr><tr><td align='center' style='padding: 10px; padding-left: 20px;'>Loading Example...</td></tr></table>");
    //   loader.css('margin-top', (demoHeight / 2 - 18) + 'px');
    loader.css('margin-left', (demoWidth - 110) + 'px');
    loader.css('margin-top', '150px');

    $("#innerdemoContainer").html(loader);

    var theme = $.data(document.body, 'theme');
    $("#innerdemoContainer").removeAttr('theme');
    var that = this;
    if (theme == undefined) theme = '';

    if (url.toString().indexOf('angular') >= 0 || url.toString().indexOf('requirejs') >= 0 || url.toString().indexOf('jquerymobile') >= 0 || url.toString().indexOf('demos/php') >= 0 || url.toString().indexOf('twitter') >= 0 || url.toString().indexOf('jsp') >= 0
        || url.toString().indexOf('knockout') >= 0) {
        if (url.toString().indexOf('angular2') == -1) {
            $('#tab3').hide();
        }
    }

    if (!that.mobile) {
        if (url.toString().indexOf('mvcexamples') >= 0 || url.toString().indexOf('aspcore') >= 0) {
            url += "/" + theme;
        }
        else {
            url += '?' + theme.toString();
        }
    }
    else {
        url += '?(' + theme.toString() + ")";
    }

    var isnonpopupdemo = url.indexOf('window') == -1;
    if (url.indexOf('jqxwindow') != -1) {
        $.jqx.theme = theme;
    }
    if (url.indexOf('typescript') != -1) {
        isnonpopupdemo = true;
    }
    if (url.indexOf('angular2') != -1) {
        isnonpopupdemo = true;
    }

    if (this.isTouchDevice && url.indexOf('chart') == -1) isnonpopupdemo = false;
    if (that.mobile) {
        isnonpopupdemo = true;
    }
    else {
        $('#tabs-1').css('margin-left', '20px');
    }

    if ($.jqx.response) {
        var response = new $.jqx.response();
        if (response.device.type != "Desktop") {
            isnonpopupdemo = true;
        }
    }

    var _url = url;
    if (url.toString().indexOf('typescript') >= 0) {
        var w = url.split('/');
		var wIndex = w.indexOf('typescript');
		w = w[wIndex].toLowerCase();
        var widgetName = url.split('/')[wIndex+1].toLowerCase();
		var name = url.split('/')[wIndex+2].toLowerCase();
        w = name.substring(0, name.indexOf(".htm")) + ".ts";
        $.ajax({
            async: false,
            url: widgetName + "/" + w,
            success: function (data) {
                var originalData = data;

                var result = formatCode(originalData);
                $('#tabs-3').html(result);
                $('#tabs-3').find('pre').css('border', 'none !important');
            },
            error: function (error) {
                var er = error;
            }
        });

        $.get(url,
            function (data) {
                var originalData = data;
                var descriptionLength = "<title id='Description'>".toString().length;
                var startIndex = data.indexOf('<title') + descriptionLength;
                var endIndex = data.indexOf('</title>');
                var description = data.substring(startIndex, endIndex);
                if (_url.toString().indexOf('typescript') >= 0) {
                    description = "";
                }

                if (!that.mobile) {
                    $('#divDescription').html('<div style="width: 800px; margin: 10px;">' + description + '</div>');
                }
                var anchor = $("<div id='demourl' style='float:right;top: -25px; left: " + demoUrlLeft + "px; position: relative; z-index:9999;'><a class='demoLink'  target='_blank' href='" + _url + "'>View in new window</a></div>");
                if (that.mobile) {
                    var linkText = "View in full screen";
                    var anchor = $("<div id='demourl' style='float:right;top: -25px; left: " + demoUrlLeft + "px; position: relative; z-index:9999;'><a class='demoLink' target='_blank' href='" + _url + "&=fullscreen'>" + linkText + "</a></div>");
                }
                $('#tabs #demourl').remove();
                $('#tabs #resources').remove();
                $('#tabs .jqx-tabs-header').append(anchor);

                //    var resources = $("<div id='resources' style='color: #444; line-height: 23px; top: 90px; text-align: left; left: 760px; margin-right: 10px; position: absolute; font-size: 13px; '><div><strong>Resources</strong></div><div><div><a class='demoLink'  target='_blank' href='http://www.jqwidgets.com/download/'>Download</a></div><a class='demoLink'  target='_blank' href='http://www.jqwidgets.com/jquery-widgets-documentation'>Documentation</a></div><div><a class='demoLink'  target='_blank' href='http://www.jqwidgets.com/community/'>Forum</a></div><div><a class='demoLink'  target='_blank' href='http://www.jqwidgets.com/jquery-widgets-documentation/documentation/releasehistory/releasehistory.htm'>Release History</a></div><div><a class='demoLink'  target='_blank' href='http://www.jqwidgets.com/jquery-widgets-documentation/documentation/roadmap/roadmap.htm'>Roadmap</a></div><div><a class='demoLink'  target='_blank' href='http://www.jqwidgets.com/license'>License</a></div>");
                //    $('#tabs .jqx-tabs-header').append(resources);
                //    $("#downloadButton").addClass('downloadButton');

                if (!isnonpopupdemo) {
                    data = data.replace(/<script.*>.*<\/script>/ig, ""); // Remove script tags
                    data = data.replace(/<\/?link.*>/ig, ""); //Remove link tags
                    data = data.replace(/<\/?html.*>/ig, ""); //Remove html tag
                    data = data.replace(/<\/?body.*>/ig, ""); //Remove body tag
                    data = data.replace(/<\/?head.*>/ig, ""); //Remove head tag
                    data = data.replace(/<\/?!doctype.*>/ig, ""); //Remove doctype
                    data = data.replace(/<title.*>.*<\/title>/ig, ""); // Remove title tags
                    data = data.replace(/..\/..\/jqwidgets\/globalization\//g, "jqwidgets/globalization/"); // fix localization path
                    $("#innerdemoContainer").removeClass();

                    var url = "../../jqwidgets/styles/jqx." + theme + '.css';
                    if (document.createStyleSheet != undefined) {
                        document.createStyleSheet(url);
                    }
                    else $(document).find('head').append('<link rel="stylesheet" href="' + url + '" media="screen" />');

                    $("#innerdemoContainer").attr('theme', theme.toString());
                    $("#innerdemoContainer").html('');
                    $("#innerdemoContainer").html('<div id="jqxInnerdemoContainer" style="position: relative; top: 10px; left: 10px; width: 900px; height: 90%;">' + data + '</div>');
                    var jqxInnerdemoContainer = $("#innerdemoContainer").find('#jqxInnerdemoContainer');
                    var jqxWidget = $("#innerdemoContainer").find('#jqxWidget');
                    jqxInnerdemoContainer.css('visibility', 'visible');
                }

                //populate tabs.

                var result = formatCode(originalData);
                $('#tabs-2').html(result);
                $('#tabs-2').find('pre').css('border', 'none !important');

            }, "html"
        );
    }
    else if (url.toString().indexOf('angular2') >= 0) {
        var w = url.toString().split('/');
        var wIndex = w.indexOf('angular2');
        var widgetName = w[wIndex+1].split('-')[1];
        var demoName = w[wIndex+1].split('-')[2].substring(0, w[wIndex+1].split('-')[2].indexOf(".htm"));
        $.ajax({
            async: false,
            url: "app" + "/" + widgetName + "/" + demoName + "/app.component.ts",
            success: function (data) {
                var originalData = data;

                var result = formatCode(originalData);
                $('#tabs-3').html(result);
                $('#tabs-3').find('pre').css('border', 'none !important');
            },
            error: function (error) {
                var er = error;
            }
        });
        $.ajax({
            async: false,
            url: "app" + "/" + widgetName + "/" + demoName + "/app.module.ts",
            success: function (data) {
                var originalData = data;

                var result = formatCode(originalData);
                $('#tabs-5').html(result);
                $('#tabs-5').find('pre').css('border', 'none !important');
            },
            error: function (error) {
                var er = error;
            }
        });
        $('#tab4').hide();
        switch(widgetName)
        {
            case "rangeselector":
            case "checkbox":
            case "radiobutton":
            case "layout":
            case "layout":
            case "datatable":
            case "docking":
            case "datatable":
            case "dockpanel":
            case "datatable":
            case "dragdrop":
            case "colorpicker":
            case "layout":
            case "dockinglayout":
            case "expander":
            case "editor":
            case "dropdownbutton":
            case "listmenu":
            case "menu":
            case "navbar":
            case "navigationbar":
            case "notification":
            case "numberinput":
            case "panel":
            case "passwordinput":
            case "popover":
            case "progressbar":
            case "rangeselector":
            case "responsivePanel":
            case "ribbon":
            case "scrollview":
            case "splitter":
            case "switchbutton":
            case "tabs":
            case "window":
            case "validator":
            case "tooltip":
                var makeCall = true;

                if (widgetName === "datatable" && demoName !== "defaultfunctionality")
                {
                    makeCall = false;
                }
                if (makeCall) {
                    $.ajax({
                        async: false,
                        url: "app" + "/" + widgetName + "/" + demoName + "/app.component.htm",
                        success: function (data) {
                            var originalData = data;
                            $('#tab4').show();

                            var result = formatCode(originalData);
                            $('#tabs-4').html(result);
                            $('#tabs-4').find('pre').css('border', 'none !important');
                        },
                        error: function (error) {
                            var er = error;
                        }
                    });
                }
                break;
        }
        var demoTitle = url;
        $.get(url,
            function (data) {
                            var originalData = data;
                            var descriptionLength = "<title id='Description'>".toString().length;
                            var startIndex = data.indexOf('<title') + descriptionLength;
                            var endIndex = data.indexOf('</title>');
                            var description = data.substring(startIndex, endIndex);
                            if (_url.toString().indexOf('angular2') >= 0) {
                                description = "";
                            }

                            if (!that.mobile) {
                                $('#divDescription').html('<div style="width: 800px; margin: 10px;">' + description + '</div>');
                            }
                            var anchor = $("<div id='demourl' style='float:right;top: -25px; left: " + demoUrlLeft + "px; position: relative; z-index:9999;'><a class='demoLink'  target='_blank' href='" + _url + "'>View in new window</a></div>");
                            if (that.mobile) {
                                var linkText = "View in full screen";
                                var anchor = $("<div id='demourl' style='float:right;top: -25px; left: " + demoUrlLeft + "px; position: relative; z-index:9999;'><a class='demoLink' target='_blank' href='" + _url + "&=fullscreen'>" + linkText + "</a></div>");
                            }
                            $('#tabs #demourl').remove();
                            $('#tabs #resources').remove();
                            $('#tabs .jqx-tabs-header').append(anchor);

                            //    var resources = $("<div id='resources' style='color: #444; line-height: 23px; top: 90px; text-align: left; left: 760px; margin-right: 10px; position: absolute; font-size: 13px; '><div><strong>Resources</strong></div><div><div><a class='demoLink'  target='_blank' href='http://www.jqwidgets.com/download/'>Download</a></div><a class='demoLink'  target='_blank' href='http://www.jqwidgets.com/jquery-widgets-documentation'>Documentation</a></div><div><a class='demoLink'  target='_blank' href='http://www.jqwidgets.com/community/'>Forum</a></div><div><a class='demoLink'  target='_blank' href='http://www.jqwidgets.com/jquery-widgets-documentation/documentation/releasehistory/releasehistory.htm'>Release History</a></div><div><a class='demoLink'  target='_blank' href='http://www.jqwidgets.com/jquery-widgets-documentation/documentation/roadmap/roadmap.htm'>Roadmap</a></div><div><a class='demoLink'  target='_blank' href='http://www.jqwidgets.com/license'>License</a></div>");
                            //    $('#tabs .jqx-tabs-header').append(resources);
                            //    $("#downloadButton").addClass('downloadButton');

                            if (!isnonpopupdemo) {
                                data = data.replace(/<script.*>.*<\/script>/ig, ""); // Remove script tags
                                data = data.replace(/<\/?link.*>/ig, ""); //Remove link tags
                                data = data.replace(/<\/?html.*>/ig, ""); //Remove html tag
                                data = data.replace(/<\/?body.*>/ig, ""); //Remove body tag
                                data = data.replace(/<\/?head.*>/ig, ""); //Remove head tag
                                data = data.replace(/<\/?!doctype.*>/ig, ""); //Remove doctype
                                data = data.replace(/<title.*>.*<\/title>/ig, ""); // Remove title tags
                                data = data.replace(/..\/..\/jqwidgets\/globalization\//g, "jqwidgets/globalization/"); // fix localization path
                                $("#innerdemoContainer").removeClass();

                                var url = "../../jqwidgets/styles/jqx." + theme + '.css';
                                if (document.createStyleSheet != undefined) {
                                    document.createStyleSheet(url);
                                }
                                else $(document).find('head').append('<link rel="stylesheet" href="' + url + '" media="screen" />');

                                $("#innerdemoContainer").attr('theme', theme.toString());
                                $("#innerdemoContainer").html('');
                                $("#innerdemoContainer").html('<div id="jqxInnerdemoContainer" style="position: relative; top: 10px; left: 10px; width: 900px; height: 90%;">' + data + '</div>');
                                var jqxInnerdemoContainer = $("#innerdemoContainer").find('#jqxInnerdemoContainer');
                                var jqxWidget = $("#innerdemoContainer").find('#jqxWidget');
                                jqxInnerdemoContainer.css('visibility', 'visible');
                            }

                            //populate tabs.

                            var result = formatCode(originalData);
                            $('#tabs-2').html(result);
                            $('#tabs-2').find('pre').css('border', 'none !important');

                        }, "html");
    }
    else
        if (url.toString().indexOf('mvcexamples') >= 0) {
            $('#tabs-4').hide();
            $('#tab4').hide();
            $('#tabs-5').hide();
            $('#tab5').hide();
            var anchor = $("<div id='demourl' style='float:right;top: -25px; left: " + demoUrlLeft + "px; position: relative; z-index:9999;'><a class='demoLink'  target='_blank' href='" + _url + "'>View in new window</a></div>");
            $('#tabs #demourl').remove();
            $('#tabs #resources').remove();
            $('#tabs .jqx-tabs-header').append(anchor);
            var w = url.split('/')[4].toLowerCase();
            $.get('Widgets/' + w + '/controller.txt', function (data) {
                var result = formatCode(data);
                result = colourKeywords("public|int|float|double|private|new|void|synchronized|if|from|select|in|base|override|return|new|string|for|byte|break|else|protected|using|var|namespace|HttpStatusCode ", result);
                $('#tabs-2').html(result);
            });
            $.get('Widgets/' + w + '/view.txt', function (data) {
                var result = formatCode(data);
                $('#tabs-3').html(result);
            });
            $("#examplePath").hide();
            switch (w) {
                case "treewithcheckboxes":
                    $('#tabs').jqxTabs('setTitleAt', 3, 'View(Tree)');
                    $('#tab4 .jqx-tabs-titleContentWrapper').css('margin-top', '0px');
                    $('#tab4 .jqx-tabs-titleWrapper').css('margin-top', '0px');
                    $('#tab4').show();
                    $.get('Widgets/' + w + '/viewtree.txt', function (data) {
                        var result = formatCode(data);
                        $('#tabs-4').html(result);
                    });
                    break;
                case "dropdownlist":
                    $('#tabs').jqxTabs('setTitleAt', 3, 'View(Store)');
                    $('#tab4 .jqx-tabs-titleContentWrapper').css('margin-top', '0px');
                    $('#tab4 .jqx-tabs-titleWrapper').css('margin-top', '0px');
                    $('#tab4').show();
                    $.get('Widgets/' + w + '/store.txt', function (data) {
                        var result = formatCode(data);
                        $('#tabs-4').html(result);
                    });
                    break;
                case "loginform":
                    $('#tabs').jqxTabs('setTitleAt', 3, 'View(Login Failed)');
                    $('#tab4 .jqx-tabs-titleContentWrapper').css('margin-top', '0px');
                    $('#tab4 .jqx-tabs-titleWrapper').css('margin-top', '0px');
                    $('#tab4').show();
                    $('#tabs').jqxTabs('setTitleAt', 4, 'View(Login)');
                    $('#tab5 .jqx-tabs-titleWrapper').css('margin-top', '0px');
                    $('#tab5 .jqx-tabs-titleContentWrapper').css('margin-top', '0px');
                    $('#tab5').show();
                    $.get('Widgets/' + w + '/viewloginfailed.txt', function (data) {
                        var result = formatCode(data);
                        $('#tabs-4').html(result);
                    });
                    $.get('Widgets/' + w + '/viewlogin.txt', function (data) {
                        var result = formatCode(data);
                        $('#tabs-5').html(result);
                    });
                    break;
                case "registrationform":
                    $('#tabs').jqxTabs('setTitleAt', 3, 'View(Register Failed)');
                    $('#tab4 .jqx-tabs-titleContentWrapper').css('margin-top', '0px');
                    $('#tab4 .jqx-tabs-titleWrapper').css('margin-top', '0px');
                    $('#tab4').show();
                    $('#tabs').jqxTabs('setTitleAt', 4, 'View(Register)');
                    $('#tab5 .jqx-tabs-titleContentWrapper').css('margin-top', '0px');
                    $('#tab5 .jqx-tabs-titleWrapper').css('margin-top', '0px');
                    $('#tab5').show();
                    $.get('Widgets/' + w + '/viewregisterfailed.txt', function (data) {
                        var result = formatCode(data);
                        $('#tabs-4').html(result);
                    });
                    $.get('Widgets/' + w + '/viewregister.txt', function (data) {
                        var result = formatCode(data);
                        $('#tabs-5').html(result);
                    });
                    break;
                case "combobox":
                case "listbox":
                    $('#tabs').jqxTabs('setTitleAt', 3, 'View(Details)');
                    $('#tab4 .jqx-tabs-titleContentWrapper').css('margin-top', '0px');
                    $('#tab4 .jqx-tabs-titleWrapper').css('margin-top', '0px');
                    $('#tab4').show();
                    $.get('Widgets/' + w + '/details.txt', function (data) {
                        var result = formatCode(data);
                        $('#tabs-4').html(result);
                    });
                    break;
            }

        }
        else
            if (url.toString().indexOf('aspcore') >= 0) {
                var anchor = $("<div id='demourl' style='float:right;top: -25px; left: " + demoUrlLeft + "px; position: relative; z-index:9999;'><a class='demoLink'  target='_blank' href='" + _url + "'>View in new window</a></div>");
                $('#tabs #demourl').remove();
                $('#tabs #resources').remove();
                $('#tabs .jqx-tabs-header').append(anchor);
                var w = url.split('/')[5];
                var view = url.split('/')[6];
                var folder = w;
                if (w.indexOf('DataTable') >= 0) {
                    folder = 'DataTable';
                }
                if (w.indexOf('Grid') >= 0) {
                    folder = 'Grid';
                }
                if (w.indexOf('TreeGrid') >= 0) {
                    folder = 'TreeGrid';
                }
                if (w.indexOf('Scheduler') >= 0) {
                    folder = 'Scheduler';
                }
                if (w.indexOf('Tree') >= 0) {
                    folder = 'Tree';
                }
                if (w.indexOf('Chart') >= 0) {
                    folder = 'Chart';
                }
                if (w.indexOf('BulletChart') >= 0) {
                    folder = 'BulletChart';
                }


                $.get('DemoViews/TagHelpers/' + folder + '/' + w + '.txt', function (data) {
                    var result = formatCode(data);
                    $('#tabs-2').html(result);
                });
                $("#examplePath").hide();



            }
            else if (url.toString().indexOf('jsp') >= 0) {
                $('#tabs-4').hide();
                $('#tab4').hide();
                $('#tabs-5').hide();
                $('#tab5').hide();
                var anchor = $("<div id='demourl' style='float:right;top: -25px; left: " + demoUrlLeft + "px; position: relative; z-index:9999;'><a class='demoLink'  target='_blank' href='" + _url + "'>View in new window</a></div>");
                $('#tabs #demourl').remove();
                $('#tabs #resources').remove();
                $('#tabs .jqx-tabs-header').append(anchor);
                var w = url.split('/')[4].toLowerCase();
                //$.get('Widgets/' + w + '/controller.txt', function (data) {
                //    var result = formatCode(data);
                //    result = colourKeywords("public|int|float|double|private|new|void|synchronized|if|from|select|in|base|override|return|new|string|for|byte|break|else|protected|using|var|namespace|HttpStatusCode ", result);
                //    $('#tabs-2').html(result);
                //});

                $("#examplePath").hide();
                $('#tabs').jqxTabs('setTitleAt', 3, 'JSP');
                $('#tab4 .jqx-tabs-titleContentWrapper').css('margin-top', '0px');
                $('#tab4 .jqx-tabs-titleWrapper').css('margin-top', '0px');
                $('#tab4').show();
                if (w.indexOf('grid-sorting') >= 0) {
                    $.get('jsp/populate-grid.txt', function (data) {
                        var result = formatCode(data);
                        $('#tabs-4').html(result);
                    });
                }
                else if (w.indexOf('datatable-sorting') >= 0) {
                    $.get('jsp/populate-datatable.txt', function (data) {
                        var result = formatCode(data);
                        $('#tabs-4').html(result);
                    });
                }
                else if (w.indexOf('tree') >= 0) {
                    $.get('jsp/select-tree-data.txt', function (data) {
                        var result = formatCode(data);
                        $('#tabs-4').html(result);
                    });
                }
                else if (w.indexOf('chart') >= 0) {
                    $.get('jsp/select-chart-data.txt', function (data) {
                        var result = formatCode(data);
                        $('#tabs-4').html(result);
                    });
                }
                else if (w.indexOf('listbox') >= 0 || w.indexOf('dropdownlist') >= 0 || w.indexOf('datatable') >= 0 || w.indexOf('combobox') >= 0 || w.indexOf('grid') >= 0) {
                    $.get('jsp/select-data-simple.txt', function (data) {
                        var result = formatCode(data);
                        $('#tabs-4').html(result);
                    });
                }
                $.get(w,
                                function (data) {
                                    var originalData = data;
                                    var descriptionLength = "<title id='Description'>".toString().length;
                                    var startIndex = data.indexOf('<title') + descriptionLength;
                                    var endIndex = data.indexOf('</title>');
                                    var description = data.substring(startIndex, endIndex);
                                    if (!that.mobile) {
                                        $('#divDescription').html('<div style="width: 800px; margin: 10px;">' + description + '</div>');
                                    }
                                    var anchor = $("<div id='demourl' style='float:right;top: -25px; left: " + demoUrlLeft + "px; position: relative; z-index:9999;'><a class='demoLink'  target='_blank' href='" + _url + "'>View in new window</a></div>");
                                    if (that.mobile) {
                                        var linkText = "View in full screen";
                                        var anchor = $("<div id='demourl' style='float:right;top: -25px; left: " + demoUrlLeft + "px; position: relative; z-index:9999;'><a class='demoLink' target='_blank' href='" + _url + "&=fullscreen'>" + linkText + "</a></div>");
                                    }
                                    $('#tabs #demourl').remove();
                                    $('#tabs #resources').remove();
                                    $('#tabs .jqx-tabs-header').append(anchor);

                                    var result = formatCode(originalData);
                                    $('#tabs-2').html(result);
                                }, "html"
                        )
            }
            else {
                $.get(url,
                                function (data) {
                                    var originalData = data;
                                    var descriptionLength = "<title id='Description'>".toString().length;
                                    var startIndex = data.indexOf('<title') + descriptionLength;
                                    var endIndex = data.indexOf('</title>');
                                    var description = data.substring(startIndex, endIndex);
									if (_url.indexOf('jqxchart') >=0 )
									{
									description = "";
									}
									
                                    if (!that.mobile) {
                                        $('#divDescription').html('<div style="width: 800px; margin: 10px;">' + description + '</div>');
                                    }
                                    var anchor = $("<div id='demourl' style='float:right;top: -25px; left: " + demoUrlLeft + "px; position: relative; z-index:9999;'><a class='demoLink'  target='_blank' href='" + _url + "'>View in new window</a></div>");
                                    if (that.mobile) {
                                        var linkText = "View in full screen";
                                        var anchor = $("<div id='demourl' style='float:right;top: -25px; left: " + demoUrlLeft + "px; position: relative; z-index:9999;'><a class='demoLink' target='_blank' href='" + _url + "&=fullscreen'>" + linkText + "</a></div>");
                                    }
                                    $('#tabs #demourl').remove();
                                    $('#tabs #resources').remove();
                                    $('#tabs .jqx-tabs-header').append(anchor);

                                    //    var resources = $("<div id='resources' style='color: #444; line-height: 23px; top: 90px; text-align: left; left: 760px; margin-right: 10px; position: absolute; font-size: 13px; '><div><strong>Resources</strong></div><div><div><a class='demoLink'  target='_blank' href='http://www.jqwidgets.com/download/'>Download</a></div><a class='demoLink'  target='_blank' href='http://www.jqwidgets.com/jquery-widgets-documentation'>Documentation</a></div><div><a class='demoLink'  target='_blank' href='http://www.jqwidgets.com/community/'>Forum</a></div><div><a class='demoLink'  target='_blank' href='http://www.jqwidgets.com/jquery-widgets-documentation/documentation/releasehistory/releasehistory.htm'>Release History</a></div><div><a class='demoLink'  target='_blank' href='http://www.jqwidgets.com/jquery-widgets-documentation/documentation/roadmap/roadmap.htm'>Roadmap</a></div><div><a class='demoLink'  target='_blank' href='http://www.jqwidgets.com/license'>License</a></div>");
                                    //    $('#tabs .jqx-tabs-header').append(resources);
                                    //    $("#downloadButton").addClass('downloadButton');

                                    if (!isnonpopupdemo) {
                                        data = data.replace(/<script.*>.*<\/script>/ig, ""); // Remove script tags
                                        data = data.replace(/<\/?link.*>/ig, ""); //Remove link tags
                                        data = data.replace(/<\/?html.*>/ig, ""); //Remove html tag
                                        data = data.replace(/<\/?body.*>/ig, ""); //Remove body tag
                                        data = data.replace(/<\/?head.*>/ig, ""); //Remove head tag
                                        data = data.replace(/<\/?!doctype.*>/ig, ""); //Remove doctype
                                        data = data.replace(/<title.*>.*<\/title>/ig, ""); // Remove title tags
                                        data = data.replace(/..\/..\/jqwidgets\/globalization\//g, "jqwidgets/globalization/"); // fix localization path
                                        $("#innerdemoContainer").removeClass();

                                        var url = "../../jqwidgets/styles/jqx." + theme + '.css';
                                        if (document.createStyleSheet != undefined) {
                                            document.createStyleSheet(url);
                                        }
                                        else $(document).find('head').append('<link rel="stylesheet" href="' + url + '" media="screen" />');

                                        $("#innerdemoContainer").attr('theme', theme.toString());
                                        $("#innerdemoContainer").html('');
                                        $("#innerdemoContainer").html('<div id="jqxInnerdemoContainer" style="position: relative; top: 10px; left: 10px; width: 900px; height: 90%;">' + data + '</div>');
                                        var jqxInnerdemoContainer = $("#innerdemoContainer").find('#jqxInnerdemoContainer');
                                        var jqxWidget = $("#innerdemoContainer").find('#jqxWidget');
                                        jqxInnerdemoContainer.css('visibility', 'visible');
                                    }

                                    //populate tabs.

                                    var result = formatCode(originalData);
                                    $('#tabs-2').html(result);
                                    $('#tabs-2').find('pre').css('border', 'none !important');
                                    var demourl = _url.toString().substring(_url.toString().indexOf('demos'));
                                    var widgetNameStartIndex = demourl.indexOf('/');
                                    var widgetNameEndIndex = demourl.toString().substring(widgetNameStartIndex + 1).indexOf('/');
                                    var widgetName = demourl.substring(widgetNameStartIndex + 1, 1 + widgetNameStartIndex + widgetNameEndIndex);
                                    if (widgetName == 'jqxbutton' && (_url.indexOf('checkbox') != -1)) {
                                        widgetName = 'jqxcheckbox';
                                    }
                                    if (widgetName == 'jqxbutton' && (_url.indexOf('radiobutton') != -1)) {
                                        widgetName = 'jqxradiobutton';
                                    }
                                    if (widgetName == 'jqxbutton' && (_url.indexOf('dropdownbutton') != -1)) {
                                        widgetName = 'jqxdropdownbutton';
                                    }
                                    if (widgetName == 'jqxpanel' && _url.indexOf('dockpanel') != -1) {
                                        widgetName = 'jqxdockpanel';
                                    }
                                    if (widgetName == 'jqxbutton' && (_url.indexOf('switch') != -1)) {
                                        widgetName = 'jqxswitchbutton';
                                    }
                                    if (widgetName == 'jqxbutton' && (_url.indexOf('group') != -1)) {
                                        widgetName = 'jqxbuttongroup';
                                    }
                                    if (widgetName == 'jqxgauge' && (_url.indexOf('linear') != -1)) {
                                        widgetName = 'jqxlineargauge';
                                    }

                                    try {
                                        if (widgetName != "php" && widgetName != "twitter" && widgetName != "angularjs" && widgetName != "angularjs-demos" && widgetName != "angular2" && widgetName != "jquerymobile" && widgetName != "aspnetmvc" && widgetName != "requirejs") {
                                            var apiURL = '../../documentation/' + widgetName + '/' + widgetName + '-api.htm';
                                            var frame = '<iframe frameborder="0" src="' + apiURL + '" id="widgetAPI" style="height: ' + parseInt(demoHeight) + 'px; border-collapse: collapse; border:none !important; overflow-y: hidden; width: 900px !important;"></iframe>';
                                            $('#tabs-3').html(frame);
                                            $('#tabs-3').css('overflow', 'hidden');
                                        }
                                    }
                                    catch (error) {
                                    }
                                }, "html"
                        )
            }
    if (isnonpopupdemo) {
        if ($.jqx.browser.msie && $.jqx.browser.version < 9) {
            try {
                var iframe = $('<iframe frameborder="0" src="' + url + '" id="jqxInnerdemoContainer" style="border-collapse: collapse; margin-top: 10px; width: 900px !important;"></iframe>');
                if (getBrowser().browser == 'chrome') {
                    iframe = $('<iframe frameborder="0" src="' + url + '" id="jqxInnerdemoContainer" style="border-collapse: collapse; margin: 0px !important; padding: 0px !important; width: 900px !important;"></iframe>');
                }

                $("#innerdemoContainer").html('');
                $("#innerdemoContainer").append(iframe);
            }
            catch (error) {
            }
        }
        else {
            var iframe = $('<iframe frameborder="0" src="' + url + '" id="jqxInnerdemoContainer" style="border-collapse: collapse; margin-top: 10px; width: 900px !important;"></iframe>');
            if (getBrowser().browser == 'chrome') {
                iframe = $('<iframe frameborder="0" src="' + url + '" id="jqxInnerdemoContainer" style="border-collapse: collapse; margin: 0px !important; padding: 0px !important; width: 900px !important;"></iframe>');
            }
            if (getBrowser().browser == 'mozilla') {
                //    iframe = $('<iframe frameborder="0" src="' + url + '" id="jqxInnerdemoContainer" style="border-collapse: collapse; margin: 0px !important; margin-top: 80px !important; padding: 0px !important; width: 900px;"></iframe>');
            }



            if (url.toString().indexOf('mvcexamples') >= 0) {
                $("#innerdemoContainer").append(iframe);
                iframe.on('load', function () {
                    loader.remove();
                });
            }
            else {
                $("#innerdemoContainer").html('');
                $("#innerdemoContainer").append(iframe);
            }

  //          if (window.history) {
                //prevents browser from storing history with each change:
//                history.pushState({}, "", url);

    //        }
        }

        if ($(".content").css('display') == 'none') {
            window.open(_url, '_self');
        }
        //     $("#tabs-1").width(730);
        //     $("#tabs-1").css('border-right', '1px solid #e4e4e4');
        //     var parentTable = $("#innerdemoContainer").parents('table:first');
        //     parentTable.css('margin-left', 'auto');
        //     parentTable.css('margin-right', 'auto');
        //     parentTable.css('margin-top', '25px');


        adjust();
        iframe.height(1040);
        if (url.toString().indexOf('demos/jqxloader') >= 0 &&url.toString().indexOf('mobiledemos/jqxloader') == -1 ) {
            iframe.height(450);
        }
    }
    return false;
};
function saveImageAs(imgOrURL) {
    if (typeof imgOrURL == 'object')
        imgOrURL = imgOrURL.src;
    window.win = open(imgOrURL);
    setTimeout('win.document.execCommand("SaveAs")', 500);
};
function adjust() {
    this.adjustFramePosition();
};

function adjustFramePosition() {
    var iframe = $('#jqxInnerdemoContainer');
    if (!iframe || iframe.length == 0)
        return;

    var offset = iframe.offset();
    var diff = parseFloat(offset.left) - parseInt(offset.left);
    if (diff != 0) {
        iframe[0].style.marginLeft = (1.0 - diff) + 'px';
    }

    var diffTop = parseFloat(offset.top) - parseInt(offset.top);
    if (diffTop != 0) {
        iframe[0].style.marginTop = (1.5 - diffTop) + 'px';
    }

};