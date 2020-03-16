/* tslint:disable */
/* eslint-disable */
(function () {
    var resizeHandlers = [];
    var updateSize = function () {
        var handlers = resizeHandlers;

        for (var i = 0; i < handlers.length; i++) {
            var handler = handlers[i];

            var dirty = false;

            if (handler.element.offsetWidth !== handler.width) {
                dirty = true;
            }

            if (handler.element.offsetHeight !== handler.height) {
                dirty = true;
            }

            if (dirty) {
                handler.width = handler.element.offsetWidth;
                handler.height = handler.element.offsetHeight;

                handler.callback();
            }
        }
    }
    var interval = setInterval(function () {
        updateSize();
    }, 100);

    window.addResizeHandler = function (element, resizeCallback) {
        resizeHandlers.push({ element: element, width: element.offsetWidth, height: element.offsetHeight, callback: resizeCallback });

        return;
        /*
        var container = document.createElement('div');
        container.className = 'jqx-resize-trigger-container';
        container.innerHTML =
            '<div class="jqx-resize-trigger-container">' +
                '<div class="jqx-resize-trigger"></div>' +
            '</div>' +
            '<div class="jqx-resize-trigger-container">' +
                '<div class="jqx-resize-trigger-shrink"></div>' +
            '</div>';

        var widget = element.widget.data().jqxWidget;
        if (widget.autoheight || widget.height === null || widget.height === "auto") {
            container.style.height = "0.1px";
            container.style.top = "-1px";
        }

        element.appendChild(container);
        element.resizeTrigger = container;

        var expand = container.childNodes[0];
        var expandChild = expand.childNodes[0];
        var shrink = container.childNodes[1];
        var reset = function () {
            expandChild.style.width = '100000px';
            expandChild.style.height = '100000px';

            expand.scrollLeft = 100000;
            expand.scrollTop = 100000;

            shrink.scrollLeft = 100000;
            shrink.scrollTop = 100000;
        };

        var dirty, requestAnimationFrameId, newWidth, newHeight;

        var lastWidth = element.offsetWidth;
        var lastHeight = element.offsetHeight;

        reset();

        element.resizeHandler = function () {
            newWidth = element.offsetWidth;
            newHeight = element.offsetHeight;
            dirty = newWidth !== lastWidth || newHeight !== lastHeight;

            if (dirty && !requestAnimationFrameId) {
                requestAnimationFrameId = requestAnimationFrame(function () {
                    requestAnimationFrameId = 0;

                    if (!dirty) {
                        return;
                    }

                    lastWidth = newWidth;
                    lastHeight = newHeight;

                    expand.removeEventListener('scroll', element.resizeHandler);
                    shrink.removeEventListener('scroll', element.resizeHandler);

                    resizeCallback();

                    setTimeout(function () {
                        expand.addEventListener('scroll', element.resizeHandler);
                        shrink.addEventListener('scroll', element.resizeHandler);
                    }, 100);
                });
            }

            reset();
        };
        expand.addEventListener('scroll', element.resizeHandler);
        shrink.addEventListener('scroll', element.resizeHandler);
        */
    }

    window.removeResizeHandler = function (element) {
        var handlers = resizeHandlers;
        var index = -1;
        for (var i = 0; i < handlers.length; i++) {
            if (handlers[i].element === element) {
                index = i;
            }
        }

        if (index >= 0) {
            resizeHandlers.splice(index, 1);
        }

        return;
        /*
        var container = element.resizeTrigger;

        var expand = container.childNodes[0];
        var shrink = container.childNodes[1];

        expand.removeEventListener('scroll', element.resizeHandler);
        shrink.removeEventListener('scroll', element.resizeHandler);

        container.parentNode.removeChild(container);
        element.resizeHandler = null;
        element.resizeTrigger = null;
        */
    }
})();
(function ($) {
    'use strict';
    if (!$.jqx.elements) {
        $.jqx.elements = new Array();
    }
    $.extend($.event.special,
       {
           "close": { noBubble: false },
           "open": { noBubble: false }
       });

    window.JQXElements = {
        settings: {}
    };
    // jqxCalendar
    $.jqx.elements.push(
    {
        name: "jqxCalendar",
        template: "<div></div>",
        attributeSync: true,
        properties:
        {
            disabled:
            {
                attributeSync: false
            },
            width:
            {
                type: "length"
            },
            height:
            {
                type: "length"
            },
            min: { type: "date" },
            max: { type: "date" },
            value: { type: "date" }
        }
    });
    // jqxButton
    $.jqx.elements.push(
    {
        name: "jqxButton",
        template: "<div></div>"
    });
    // jqxButtonGroup
    $.jqx.elements.push(
    {
        name: "jqxButtonGroup",
        template: "<div></div>"
    });
    // jqxBulletChart
    $.jqx.elements.push(
    {
        name: "jqxBulletChart",
        template: "<div></div>"
    });
    // jqxRadioButton
    $.jqx.elements.push(
        {
            name: "jqxRadioButton",
            template: "<div></div>"
        });
    // jqxCheckBox
    $.jqx.elements.push(
        {
            name: "jqxCheckBox",
            template: "<div></div>"
        });

    // jqxRepeatButton
    $.jqx.elements.push(
    {
        name: "jqxRepeatButton",
        template: "<button></button>"
    });
    // jqxSwitchButton
    $.jqx.elements.push(
        {
            name: "jqxSwitchButton",
            template: "<div></div>"
        });
    // jqxRepeatButton
    $.jqx.elements.push(
        {
            name: "jqxLinkButton",
            template: "<a></a>"
        });
    // jqxToggleButton
    $.jqx.elements.push(
    {
        name: "jqxToggleButton",
        template: "<button></button>"
    });
    // jqxBarGauge
    $.jqx.elements.push(
    {
        name: "jqxBarGauge",
        template: "<div></div>"
    });
    // jqxChart
    $.jqx.elements.push(
    {
        name: "jqxChart",
        template: "<div></div>",
        properties:
        {
            source:
            {
                attributeSync: false
            }
        }
    });
    // jqxColorPicker
    $.jqx.elements.push(
    {
        name: "jqxColorPicker",
        template: "<div></div>"
    });
    // jqxComboBox
    $.jqx.elements.push(
    {
        name: "jqxComboBox",
        template: "<div></div>",
        properties:
        {
            source:
            {
                attributeSync: false
            }
        }
    });
    // jqxComplexInput
    $.jqx.elements.push(
    {
        name: "jqxComplexInput",
        template: "<div><input/><div></div></div>",
    });
    // jqxDraw
    $.jqx.elements.push(
    {
        name: "jqxDraw",
        template: "<div></div>"
    });

    // jqxDataTable
    $.jqx.elements.push(
    {
        name: "jqxDataTable",
        template: "<div></div>",
        properties:
        {
            source:
            {
                attributeSync: false
            }
        }
    });
    // jqxDateTimeInput
    $.jqx.elements.push(
    {
        name: "jqxDateTimeInput",
        template: "<div></div>"
    });
    // jqxDocking
    $.jqx.elements.push(
    {
        name: "jqxDocking",
        template: "<div></div>"
    });
    // jqxDockPanel
    $.jqx.elements.push(
    {
        name: "jqxDockPanel",
        template: "<div></div>"
    });
    // jqxDragDrop
    $.jqx.elements.push(
    {
        name: "jqxDragDrop",
        template: "<div></div>"
    });
    // jqxDropDownList
    $.jqx.elements.push(
    {
        name: "jqxDropDownList",
        template: "<div></div>",
        properties:
        {
            source:
            {
                attributeSync: false
            }
        }
    });
    // jqxDropDownButton
    $.jqx.elements.push(
    {
        name: "jqxDropDownButton",
        template: "<div></div>"
    });
    // jqxEditor
    $.jqx.elements.push(
    {
        name: "jqxEditor",
        template: "<div></div>"
    });
    // jqxExpander
    $.jqx.elements.push(
    {
        name: "jqxExpander",
        template: "<div></div>"
    });
    // jqxFileUpload
    $.jqx.elements.push(
    {
        name: "jqxFileUpload",
        template: "<div></div>"
    });
    // jqxFormattedInput
    $.jqx.elements.push(
    {
        name: "jqxFormattedInput",
        template: "<div><input/><div></div></div>",
    });
    // jqxGauge
    $.jqx.elements.push(
    {
        name: "jqxGauge",
        template: "<div></div>",
        propertyMap: {
            "style": "backgroundStyle"
        }
    });
    // jqxLinearGauge
    $.jqx.elements.push(
    {
        name: "jqxLinearGauge",
        template: "<div></div>",
        propertyMap: {
            "style": "backgroundStyle"
        }
    });
    // jqxGrid
    $.jqx.elements.push(
    {
        name: "jqxGrid",
        template: "<div></div>",
        properties:
        {
            source:
            {
                attributeSync: false
            }
        }
    });
    // jqxPivotGrid
    $.jqx.elements.push(
    {
        name: "jqxPivotGrid",
        template: "<div></div>",
        properties:
        {
            source:
            {
                attributeSync: false
            }
        }
    });
    // jqxPivotDesigner
    $.jqx.elements.push(
    {
            name: "jqxPivotDesigner",
            template: "<div></div>",
            properties:
            {
                source:
                {
                    attributeSync: false
                }
            }
    });
    // jqxInput
    $.jqx.elements.push(
    {
        name: "jqxInput",
        template: "<input/>",
        properties:
        {
            source:
            {
                attributeSync: false
            }
        }
    });
    // jqxKanban
    $.jqx.elements.push(
    {
        name: "jqxKanban",
        template: "<div></div>",
        properties:
        {
            source:
            {
                attributeSync: false
            }
        }
    });
    // jqxKnob
    $.jqx.elements.push(
    {
        name: "jqxKnob",
        template: "<div></div>"
    });
    // jqxLayout
    $.jqx.elements.push(
    {
        name: "jqxLayout",
        template: "<div></div>"
    });
    // jqxDockingLayout
    $.jqx.elements.push(
    {
        name: "jqxDockingLayout",
        template: "<div></div>"
    });

    // jqxListbox
    $.jqx.elements.push(
    {
        name: "jqxListBox",
        template: "<div></div>",
        properties:
        {
            source:
            {
                attributeSync: false
            }
        }
    });
    // jqxListMenu
    $.jqx.elements.push(
    {
        name: "jqxListMenu",
        template: "<div></div>",
        properties:
        {
            source:
            {
                attributeSync: false
            }
        }
    });
    // jqxLoader
    $.jqx.elements.push(
    {
        name: "jqxLoader",
        template: "<div></div>"
    });
    // jqxMaskedInput
    $.jqx.elements.push(
    {
        name: "jqxMaskedInput",
        template: "<input/>",
    });
    // jqxMenu
    $.jqx.elements.push(
    {
        name: "jqxMenu",
        template: "<div></div>",
        properties:
        {
            source:
            {
                attributeSync: false
            }
        }
    });
    // jqxNavBar
    $.jqx.elements.push(
    {
        name: "jqxNavBar",
        template: "<div></div>"
    });
    // jqxNavigationBar
    $.jqx.elements.push(
    {
        name: "jqxNavigationBar",
        template: "<div></div>"
    });
    // jqxNotification
    $.jqx.elements.push(
    {
        name: "jqxNotification",
        template: "<div></div>",
        properties:
        {
            appendContainer:
            {
                type: 'string'
            }
        }
    });
    // jqxNumberInput
    $.jqx.elements.push(
    {
        name: "jqxNumberInput",
        template: "<div></div>"
    });
    // jqxPanel
    $.jqx.elements.push(
    {
        name: "jqxPanel",
        template: "<div></div>"
    });
    // jqxPasswordInput
    $.jqx.elements.push(
    {
        name: "jqxPasswordInput",
        template: "<input type='password'/>"
    });
    // jqxPopover
    $.jqx.elements.push(
    {
        name: "jqxPopover",
        template: "<div></div>",
        properties: {
            title:
            {
                type: "string"
            },
            arrowOffsetValue:
            {
                type: "number"
            },
            offset:
            {
                type: "json"
            },
            selector:
            {
                type: "string"
            },
            initContent:
            {
                type: "object"
            }
        }
    });
    // jqxProgressBar
    $.jqx.elements.push(
    {
        name: "jqxProgressBar",
        template: "<div></div>"
    });
    // jqxRangeSelector
    $.jqx.elements.push(
    {
        name: "jqxRangeSelector",
        template: "<div></div>"
    });
    // jqxRating
    $.jqx.elements.push(
    {
        name: "jqxRating",
        tagName: "jqx-rating",
        template: "<div></div>"
    });
    // jqxResponsivePanel
    $.jqx.elements.push(
    {
        name: "jqxResponsivePanel",
        template: "<div></div>"
    });
    // jqxRibbon
    $.jqx.elements.push(
    {
        name: "jqxRibbon",
        template: "<div></div>"
    });
    // jqxScheduler
    $.jqx.elements.push(
    {
        name: "jqxScheduler",
        template: "<div></div>",
        properties:
        {
            source:
            {
                attributeSync: false
            }
        }
    });
    // jqxSlider
    $.jqx.elements.push(
    {
        name: "jqxSlider",
        template: "<div></div>"
    });
    // jqxScrollBar
    $.jqx.elements.push(
    {
        name: "jqxScrollBar",
        template: "<div></div>"
    });
    // jqxScrollView
    $.jqx.elements.push(
    {
        name: "jqxScrollView",
        template: "<div></div>"
    });
    // jqxSortable
    $.jqx.elements.push(
    {
        name: "jqxSortable",
        template: "<div></div>",
        propertyMap: {
            "appendTo": "addTo"
        }
    });
    // jqxSplitter
    $.jqx.elements.push(
    {
        name: "jqxSplitter",
        template: "<div></div>",
        properties:
        {
            panels:
            {
                type: "array"
            }
        }
    });
    // jqxTabs
    $.jqx.elements.push(
    {
        name: "jqxTabs",
        template: "<div></div>"
    });
    // jqxTagCloud
    $.jqx.elements.push(
    {
        name: "jqxTagCloud",
        template: "<div></div>"
    });
    // jqxTextArea
    $.jqx.elements.push(
    {
        name: "jqxTextArea",
        template: "<div></div>"
    });
    // jqxToolBar
    $.jqx.elements.push(
    {
        name: "jqxToolBar",
        template: "<div></div>"
    });
    // jqxTooltip
    $.jqx.elements.push(
    {
        name: "jqxTooltip",
        tagName: "jqx-tool-tip",
        template: "<div></div>"
    });
    // jqxTree
    $.jqx.elements.push(
    {
        name: "jqxTree",
        template: "<div></div>",
        properties:
        {
            source:
            {
                attributeSync: false
            }
        }
    });
    // jqxTreeGrid
    $.jqx.elements.push(
    {
        name: "jqxTreeGrid",
        template: "<div></div>",
        properties:
        {
            source:
            {
                attributeSync: false
            }
        }
    });
    // jqxTreeMap
    $.jqx.elements.push(
    {
        name: "jqxTreeMap",
        template: "<div></div>",
        properties:
        {
            source:
            {
                attributeSync: false
            }
        }
    });
    // jqxValidator
    $.jqx.elements.push(
    {
        name: "jqxValidator",
        template: "<div></div>"
    });
    // jqxWindow
    $.jqx.elements.push(
    {
        name: "jqxWindow",
        template: "<div></div>"
    });

    if (document['registerElement']) {
        if (!Object.is) {
            Object.is = function (x, y) {
                // SameValue algorithm
                if (x === y) { // Steps 1-5, 7-10
                    // Steps 6.b-6.e: +0 != -0
                    return x !== 0 || 1 / x === 1 / y;
                } else {
                    // Step 6.a: NaN == NaN
                    return x !== x && y !== y;
                }
            };
        }
        $(document).ready(function () {
            $.each($.jqx.elements, function () {
                var name = this.name;
                var metaInfo = this;
                if (!metaInfo.tagName) {
                    metaInfo.tagName = metaInfo.name.split(/(?=[A-Z])/).join('-').toLowerCase();
                }
                var proto = Object.create(HTMLElement.prototype);
                proto.name = name;
                proto.instances = new Array();
                var propertyToAttributeConfig = {};
                var attributeTable = (function () {
                    var attrs = {},
                        addAttributeConfig = function (tagName, attributeName, attributeConfig) {
                            if (attrs[tagName] === undefined) {
                                attrs[tagName] = {};
                            }

                            attrs[tagName][attributeName] = attributeConfig;
                        },

                        getAttributeConfig = function (tagName, attributeName) {
                            if (attrs[tagName] === undefined || attrs[tagName][attributeName] === undefined) {
                                return undefined;
                            } else {
                                return attrs[tagName][attributeName];
                            }
                        },

                        getAttributeList = function (tagName) {
                            return attrs[tagName];
                        };

                    return {
                        addAttributeConfig: addAttributeConfig,
                        getAttributeConfig: getAttributeConfig,
                        getAttributeList: getAttributeList
                    };
                }());

                if (!$.jqx["_" + name]) {
                    return true;
                }
                var properties = $.jqx["_" + name].prototype.defineInstance();

                if (name == "jqxDockingLayout") {
                    properties = $.extend(properties, $.jqx["_jqxLayout"].prototype.defineInstance());
                }
                if (name == "jqxToggleButton" || name == "jqxRepeatButton" || name == "jqxLinkButton") {
                    properties = $.extend(properties, $.jqx["_jqxButton"].prototype.defineInstance());
                }
                if (name == "jqxTreeGrid") {
                    properties = $.extend(properties, $.jqx["_jqxDataTable"].prototype.defineInstance());
                }

                proto.initElement = function () {
                    var that = this;
                    if (!properties) {
                        console.log(name + " is undefined");
                        return;
                    }
                    $.each(properties, function (propertyName, defaultValue) {
                        var privatePropertyName = "_" + propertyName;
                        that[privatePropertyName] = defaultValue;
                    });
                }

                if (!properties) {
                    console.log(name + " is undefined");
                    return;
                }

                $.each(properties, function (propertyName, defaultValue) {
                    if (!metaInfo.properties) metaInfo.properties = [];

                    if (propertyName.indexOf("_") >= 0) {
                        return true;
                    }

                    var metaPropertyInfo = metaInfo.properties[propertyName];
                    var attributeName = propertyName.split(/(?=[A-Z])/).join('-').toLowerCase();
                    var defaultValueType = typeof defaultValue;
                    var attributeSync = (metaPropertyInfo && metaPropertyInfo.attributeSync) || metaInfo.attributeSync;
                    if (!metaPropertyInfo && metaInfo.attributeSync === undefined) {
                        attributeSync = true;
                    }

                    var privatePropertyName = "_" + propertyName;

                    if (propertyName === "width" || propertyName === "height") {
                        defaultValueType = "length";
                    }

                    if (metaPropertyInfo && metaPropertyInfo.type) {
                        defaultValueType = metaPropertyInfo.type;
                    }

                    var attributeConfig = {
                        defaultValue: defaultValue,
                        type: defaultValueType,
                        propertyName: propertyName,
                        attributeSync: attributeSync
                    };

                    attributeTable.addAttributeConfig(metaInfo.tagName, attributeName, Object.freeze(attributeConfig));
                    propertyToAttributeConfig[propertyName] = attributeName;

                    var updatePropertyAction = function (value) {
                        var that = this;
                        this[privatePropertyName] = value;
                        if (this.widget) {
                            if (metaInfo.propertyMap && metaInfo.propertyMap[propertyName]) {
                                propertyName = metaInfo.propertyMap[propertyName];
                            }

                            var newValue = {};
                            newValue[propertyName] = value;
                            this.widget[name](newValue);
                            var attrName = propertyToAttributeConfig[propertyName];
                            var attrConfig = attributeTable.getAttributeConfig(metaInfo.tagName, attrName);
                            if (attrConfig.attributeSync) {
                                that.isUpdatingAttribute = true;
                                that.setAttributeTyped(attrName, attrConfig, value);
                                that.isUpdatingAttribute = false;
                            }
                            that.propertyUpdated(propertyName, value);
                        }
                        else {
                            this.initialSettings[propertyName] = value;
                        }
                    }

                    if (metaInfo.propertyMap && metaInfo.propertyMap[propertyName]) {
                        propertyName = metaInfo.propertyMap[propertyName];
                    }

                    Object.defineProperty(proto, propertyName, {
                        configurable: false,
                        enumerable: true,
                        get: function () {
                            return this[privatePropertyName];
                        },
                        set: function (value) {
                            updatePropertyAction.call(this, value);
                        }
                    });
                });

                proto.getAttributeTyped = function (attributeName, propertyInfo) {
                    return this.attributeStringToTypedValue(attributeName, propertyInfo, this.getAttribute(attributeName));
                };
                proto.setAttributeTyped = function (attributeName, propertyInfo, value) {
                    var str, currVal;

                    // Get the attribute in case user is using this standalone (so corresponding property may not exist)
                    currVal = this.getAttributeTyped(attributeName, propertyInfo);

                    str = this.typedValueToAttributeString(value);

                    if (str === undefined) {
                        this.removeAttribute(attributeName);
                    } else {
                        this.setAttribute(attributeName, str);
                    }
                }
                proto.typedValueToAttributeString = function (value) {
                    var type = typeof value;

                    if (type === 'boolean') {
                        if (value) {
                            return '';
                        } else {
                            return undefined;
                        }
                    } else if (type === 'number') {
                        if (Object.is(value, -0)) {
                            return '-0';
                        } else {
                            return value.toString();
                        }
                    } else if (type === 'string' || type === 'length') {
                        return value;
                    } else if (type === 'object') {
                        return JSON.stringify(value, function (k, v) {
                            if (typeof v === 'number') {
                                if (isFinite(v) === false) {
                                    return v.toString();
                                } else if (Object.is(v, -0)) {
                                    return '-0';
                                }
                            }

                            return v;
                        });
                    }
                }
                proto.attributeStringToTypedValue = function (attributeName, propertyInfo, str) {
                    if (propertyInfo.type === 'boolean') {
                        if (str === '' || str === attributeName || str === 'true') {
                            return true;
                        } else {
                            return false;
                        }
                    } else if (propertyInfo.type === 'number') {
                        if (str === null || str === undefined) {
                            return undefined;
                        } else {
                            return parseFloat(str);
                        }
                    } else if (propertyInfo.type === 'string') {
                        if (str === null || str === undefined) {
                            return undefined;
                        } else {
                            return str;
                        }
                    }
                    else if (propertyInfo.type === "length") {
                        if (str === null) return null;
                        if (str !== null && str.indexOf("px") >= 0) {
                            return parseFloat(str);
                        } if (str !== null && str.indexOf("%") >= 0) {
                            return str;
                        }
                        if (!isNaN(parseFloat(str))) {
                            return parseFloat(str);
                        }
                        return str;
                    }
                    else if (propertyInfo.type === "json" || propertyInfo.type === "array") {
                        return JSON.parse(str.replace(/'/g, '"'));
                    }
                    else if (propertyInfo.type === "object") {
                        return window.JQXElements.settings[str] || window[str];
                    }

                    return undefined;
                }


                proto.createdCallback = function () {
                    var that = this;

                    that.isReady = false;
                    that.initialSettings = {};
                    that.initElement();
                }

                proto.setup = function () {
                    var that = this;
                    if (that.isReady) {
                        return;
                    }

                   that.isReady = true;

                    var that = this;
                    var width = null;
                    var height = null;
                    var container, helper, attributes;
                    var events = [];
                    var canUpdateContainerSize = true;
                    var attrList = attributeTable.getAttributeList(metaInfo.tagName);
                    var settings = that.settings || {};
                    var defaultSettings = that.initialSettings;
                    var template = metaInfo.template;
                    for (var currAttrName in attrList) {
                        if (attrList.hasOwnProperty(currAttrName) && that.hasAttribute(currAttrName)) {
                            var currAttrConfig = attrList[currAttrName];
                            var currAttrValue = that.getAttributeTyped(currAttrName, currAttrConfig);
                            var currPropValue;

                            if (currAttrValue === undefined) {
                                currPropValue = currAttrConfig.defaultValue;
                            } else {
                                currPropValue = currAttrValue;
                            }

                            settings[currAttrConfig.propertyName] = currPropValue;
                        }
                    }
                    attributes = that.attributes;
                    for (var currAttrName in attributes) {
                        var attr = attributes[currAttrName];
                        if (attr && attr.name) {
                            if (attr.name.indexOf("on-") >= 0) {
                                var attrValue = attr.value;
                                var value = "";
                                if (attrValue.indexOf("(") >= 0) {
                                    value = attrValue.substring(0, attrValue.indexOf("("));
                                }
                                events.push({ name: attr.name.substring(3), handler: value });
                            }
                            else if (attr.name.substring(0, 2) === 'on') {
                                var attrValue = attr.value;
                                var value = "";
                                if (attrValue.indexOf("(") >= 0) {
                                    value = attrValue.substring(0, attrValue.indexOf("("));
                                }
                                events.push({ name: attr.name.substring(2), handler: value });
                            }
                            else if (attr.name.indexOf('(') >= 0) {
                                var attrValue = attr.value;
                                var value = "";
                                if (attrValue.indexOf("(") >= 0) {
                                    value = attrValue.substring(0, attrValue.indexOf("("));
                                }
                                var eventName = attr.name.replace('(', '').replace(')', '');

                                events.push({ name: eventName, handler: value });
                            }
                        }
                    }
                    var nodeElement = function (template) {
                        var fragment = document.createDocumentFragment();
                        var div = document.createElement("div");
                        fragment.appendChild(div);
                        var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi;
                        var rtagName = /<([\w:]+)/;
                        template = template.replace(rxhtmlTag, "<$1></$2>");
                        var tag = (rtagName.exec(template) || ["", ""])[1].toLowerCase();
                        var wrap = [0, "", ""];
                        var depth = wrap[0];
                        div.innerHTML = wrap[1] + template + wrap[2];
                        while (depth--) {
                            div = div.lastChild;
                        }

                        template = div.childNodes;
                        div.parentNode.removeChild(div);
                        nodeElement = template[0];
                        return nodeElement;
                    }(template);

                    container = nodeElement;


                    var createInstance = function (defaultSettings) {
                        var isPlugin = false;
                        if (name === "jqxDragDrop"|| name === "jqxPopover" || name === "jqxResponsivePanel" || name === "jqxLoader" || name === 'jqxWindow' || name === "jqxSortable" || name === "jqxDraw" || name === "jqxValidator") {
                            isPlugin = true;
                            that.style.overflow = "visible";
                        }
                        if (name === "jqxExpander" || name === "jqxRibbon" || name === "jqxBulletChart" || name === "jqxComboBox") {
						     that.style.overflow = "visible";	
						}
                        if (!isPlugin) {
                            while (that.childNodes.length) {
                                container.appendChild(that.firstChild);
                            }

                            that.appendChild(container);
                        } else {
                            container = that;
                        }

                        if (name === "jqxScrollBar" || name === "jqxNotification") {
                            that.style.overflow = "visible";
                            that.style.borderLeftWidth = '0px';
                            that.style.borderRightWidth = '0px';
                            that.style.borderTopWidth = '0px';
                            that.style.borderBottomWidth = '0px';
                        }

					
                        $.extend(settings, defaultSettings);

                        var nameLowerCase = name.toLowerCase();
                        if (template.indexOf("button") >= 0 || template.indexOf("input") == 1 || template.indexOf("textarea") >= 0 || nameLowerCase.indexOf('button') >= 0 || nameLowerCase.indexOf('checkbox') >= 0 || nameLowerCase.indexOf('radio') >= 0) {
                            that.style.display = "inline-block";
                        }
                        else {
                            that.style.display = "block";
                        }

                        var updateContainerSize = function (propertyName, value) {
                            if (!canUpdateContainerSize || isPlugin) {
                                return;
                            }

                            if (typeof value === "string" && value.indexOf("%") >= 0) {
                                that.style[propertyName] = value;
                            }
                            else if (typeof value === "string" && value.indexOf("px") >= 0) {
                                that.style[propertyName] = 2 + parseFloat(value) + "px";
                            }
                            else if (value === "auto") {
                                that.style[propertyName] = value;
                            }
                            else if (value) {
                                that.style[propertyName] = 2+value + "px";
                            }
                            else if (that.style[propertyName]) {
                                that.style[propertyName] = null;
                            }
                        }

                        if (settings.width) {
                            updateContainerSize("width", settings.width);
                        }
                        if (settings.height) {
                            updateContainerSize("height", settings.height);
                        }

                        helper = new jqxBaseFramework(that);
                        helper.data(that, "jqxWidget", { element: that });

                        width = helper.width();
                        height = helper.height();

					
						
                        var sizeOffset = 2;
                      
                        if (name === "jqxPivotDesigner"  || name === "jqxPivotGrid" || name === "jqxChart" || name === "jqxMenu" || name === "jqxToolBar") {
                            container.style.width = container.style.height = "100%"
                        }
                        else if (!isPlugin) {
                            if (width && !settings.width && that.style.width !== "auto") {

                                if (name === "jqxButton" || name === "jqxCheckBox" || name === "jqxToggleButton" || name === "jqxRadioButton" || name === "jqxRepeatButton" || name === "jqxLinkButton") {
                                    width += 30;
                                }

                                settings.width = width - sizeOffset;
                            }
                            if (height && !settings.height && that.style.height !== "auto" && height !== that.firstChild.offsetHeight) {
                                settings.height = height - sizeOffset;
                            }
                        }

                        var metaData = {};
                        var methods = {};
                        var ownMethods = Object.getOwnPropertyNames($.jqx["_" + name].prototype);

                        if (name == "jqxDockingLayout") {
                            methods = $.extend(methods, Object.keys($.jqx["_jqxLayout"].prototype));
                            metaData = $.extend(metaData, $.jqx["_jqxLayout"].prototype);
                        }
                        if (name == "jqxToggleButton" || name == "jqxRepeatButton" || name == "jqxLinkButton") {
                            methods = $.extend(methods, Object.keys($.jqx["_jqxButton"].prototype));
                            metaData = $.extend(metaData, $.jqx["_jqxButton"].prototype);
                        }
                        if (name == "jqxTreeGrid") {
                            methods = $.extend(methods, Object.keys($.jqx["_jqxDataTable"].prototype));
                            metaData = $.extend(metaData, $.jqx["_jqxDataTable"].prototype);
                        }

                        metaData = $.extend(metaData, $.jqx["_" + name].prototype);
                        methods = $.extend(methods, Object.getOwnPropertyNames(metaData));

                        for (var obj in methods) {
                            var methodName = methods[obj];
                            if (methodName.indexOf("_") >= 0) {
                                continue;
                            }
                            if (methodName === "base" || methodName === "baseType") {
                                continue;
                            }
                            if (methodName === "onmousemove" || methodName === "resize" || methodName === "scrollWidth" || methodName === "scrollHeight" || methodName === "constructor" || methodName === "createInstance" || methodName === "defineInstance") {
                                continue;
                            }

                            if (typeof metaData[methodName] !== "function") {
                                continue;
                            }

                            var invokeMethod = function (method, methodName) {
                                var args = Array.prototype.slice.call(arguments, 2);
                                var methodContext = that;

                                var elementMethod = function () {
                                    if (methodContext._isUpdating) {
                                        return;
                                    }

                                    if ($.event.triggered) {
                                        return;
                                    }

                                    if (!methodContext.widget) {
										methodContext._isUpdating = true;
                                        var methodArguments = arguments;
                                        
                                        var result = method.apply($(container).data().jqxWidget, args.concat(Array.prototype.slice.call(methodArguments)));

                                        methodContext._isUpdating = false;

                                        return result;
                                     //   return $.jqx.invoke($(container).data, args.concat(methodName, Array.prototype.slice.call(methodArguments)));

										//methodContext.timer = setInterval(function () {
                                        //    if (methodContext.widget) {
                                        //        clearInterval(methodContext.timer);
                                        //        method.apply(methodContext.widget.data().jqxWidget, args.concat(Array.prototype.slice.call(methodArguments)));
                                        //        methodContext._isUpdating = false;
                                        //    }
										//}, 50);

                                       // return;
                                    }

                                    if (-1 === ownMethods.indexOf(methodName)) {
                                        var result = method.apply(methodContext.widget.data().jqxWidget.base, args.concat(Array.prototype.slice.call(arguments)));
                                    }
                                    else {
                                        var result = method.apply(methodContext.widget.data().jqxWidget, args.concat(Array.prototype.slice.call(arguments)));
                                    }

                                    methodContext._isUpdating = false;

                                    return result;
                                };

                                return elementMethod;
                            }

                            that[methodName] = invokeMethod(metaData[methodName], methodName);
                        }

                        var widget = that.widget = $(container)[name](settings);
                        if (settings.ready) {
                            that._isUpdating = false;
                            if (!widget.data().jqxWidget._loading) {
                                if (!widget.data().jqxWidget.isInitialized) {
                                    settings.ready();
                                }
                            }
                            else {
                                var interval = setInterval(function () {
                                    if (!widget.data().jqxWidget._loading) {
                                        if (!widget.data().jqxWidget.isInitialized) {
                                            settings.ready();
                                        }
                                        clearInterval(interval);
                                    }
                                }, 100);
                            }
                        }
                        if (name === "jqxMaskedInput" || name === "jqxPasswordInput" || name === "jqxButtonGroup" || name === "jqxButton" || name === "jqxToggleButton" || name === "jqxRepeatButton") {
                            that.firstChild.style.boxSizing = "border-box";
                        }

                        that.propertyUpdated = function (propertyName, value) {
                            if (propertyName === "width" || propertyName === "height") {
                                updateContainerSize(propertyName, value);
                            }
                        }
                        if (!isPlugin) {
                            var widgetInstance = widget.data().jqxWidget;

                            !widgetInstance.base ? widgetInstance.host.addClass('jqx-element-container') : widgetInstance.base.host.addClass('jqx-element-container');

						if (settings.multiSelect) {
						    that.style.height = "auto";
						}
						
                            helper.addClass('jqx-widget jqx-element');
                         //   if (name === "jqxCheckBox" || name === "jqxButtonGroup" || name === "jqxBulletChart" || name === "jqxRangeSelector" || name == "jqxPopover" || name === "jqxRadioButton" || name === "jqxChart" || name === "jqxTooltip" || name === "jqxGauge" || name == "jqxLinearGauge" || name == "jqxExpander" || name == "jqxNavigationBar") {
                                helper.addClass('jqx-element-no-border');
                         //   }
                            if (name === "jqxRangeSelector" || name == "jqxButtonGroup") {
                                helper.css('overflow', 'visible');
                            }
                        }

                        for (var i = 0; i < events.length; i++) {
                            var eventObj = events[i];
                            widget.on(eventObj.name, function (event) {
                                if (!event.args) {
                                    event.args = {};
                                }

                                if (window.JQXElements.settings[eventObj.handler] && event.args) {
                                    window.JQXElements.settings[eventObj.handler].apply(that, [event]);
                                }
                                else if (window[eventObj.handler] && event.args) {
                                    window[eventObj.handler].apply(that, [event]);
                                }
                            });
                        }

                        var updateWidgetSize = function () {
                            if (isPlugin) {
                                return;
                            }

                            canUpdateContainerSize = false;
                       
                            width = helper.width();
                            height = helper.height();
                            var sizeOffset = 0;

                            if (name === "jqxChart" || name === "jqxPivotGrid" || name === "jqxPivotDesigner" || name === "jqxDraw") {
                                widget[0].style.width = "100%";
                                widget[0].style.height = "100%";
                            }
                            else {
                                var leftPadding = parseInt(widget.css('padding-left'));
                                var rightPadding = parseInt(widget.css('padding-right'));
                                var topPadding = parseInt(widget.css('padding-top'));
                                var bottomPadding = parseInt(widget.css('padding-bottom'));
                                var computedStyle = that.firstChild ? window.getComputedStyle(that.firstChild) : null;
                                var canUpdate = true;

                                if (!computedStyle) {
                                    return;
                                }

                                sizeOffset = 0;

                                if (computedStyle && computedStyle.boxSizing !== 'border-box') {
                                    sizeOffset = 2;
                                }

                                if (that.autoheight || that.height === null || that.height === "auto" || that.multiSelect) {
                                    canUpdate = false;
                                }

                                if (name === "jqxBarGauge") {
                                    sizeOffset = 0;
                                }


                                widget[name]({ width: width - sizeOffset });

                                if (canUpdate) {
                                    widget[name]({ height: height - sizeOffset });
                                }
                            }
                            canUpdateContainerSize = true;
                        }

                        if (!isPlugin) {
                            addResizeHandler(that, function () {
                                updateWidgetSize();
                            });                       
                        }
                    }

                    // used for getting a javascript object for the initialization process.
                    if (that.hasAttribute("settings")) {
                        var settingsName = that.getAttribute("settings");
                        defaultSettings = window.JQXElements.settings[settingsName] || window[settingsName];
						
						if (defaultSettings) {
							$.each(defaultSettings, function (propertyName, propertyValue) {
								that["_" + propertyName] = propertyValue;
							});
						}
                    }

                    if (that.hasAttribute('delayed-create')) {
                        that.isCreated = false;
                        that.createElement = function () {
                            if (that.isCreated) {
                                return;
                            }

                            if (that.hasAttribute("settings")) {
                                createInstance(defaultSettings);
                            }
                            else {
                                createInstance(that.settings);
                            }
                            that.isCreated = true;;
                        }
                    }
                    else {
                        createInstance(defaultSettings);
                    }
                }

                var addListener = proto.addEventListener;
                var removeListener = proto.addEventListener;

                proto.addEventListener = function (eventName, handler) {
                    var that = this;

                    if (that.widget && that.widget.on) {
                        if (name === "jqxDragDrop" || name === "jqxPopover" || name === "jqxResponsivePanel" || name === "jqxLoader" || name === 'jqxWindow' || name === "jqxSortable" || name === "jqxDraw" || name === "jqxValidator") {
                            JQXLite(that.parentNode).on(eventName, handler);
                        }
                        else {
                            that.widget.on(eventName, handler);
                        }
                    }
                    else {
                        addListener.apply(this, [eventName, handler]);
                    }
                }

                proto.removeEventListener = function (eventName, handler) {
                    var that = this;

                    if (that.widget && that.widget.off) {
                        if (name === "jqxDragDrop" || name === "jqxPopover" || name === "jqxResponsivePanel" || name === "jqxLoader" || name === 'jqxWindow' || name === "jqxSortable" || name === "jqxDraw" || name === "jqxValidator") {
                            JQXLite(that.parentNode).off(eventName, handler);
                        }
                        else {
                            that.widget.off(eventName, handler);
                        }
                    } else {
                        removeListener.apply(this, [eventName, handler]);
                    }
                }


                proto.attachedCallback = function () {
                    var that = this;

                    that.setup();
                }

                proto.attributeChangedCallback = function (attrName, oldVal, newVal) {
                    var that = this;
                    var attrConfig = attributeTable.getAttributeConfig(metaInfo.tagName, attrName);

                    if (!that.isUpdatingAttribute && attrConfig) {
                        var currAttrValue = that.getAttributeTyped(attrName, attrConfig);
                        var currPropValue;

                        if (currAttrValue === undefined) {
							if (currAttrConfig) {
								currPropValue = currAttrConfig.defaultValue;
							}
							else {
								return;
							}
						} else {
                            currPropValue = currAttrValue;
                        }

                        that[currAttrConfig.propertyName] = currPropValue;
                    }
                }

                var tagHelpersCheck = function () {
                    var elements = document.querySelectorAll(metaInfo.tagName);

                    for (var i = 0; i < elements.length; i++) {
                        if (elements[i].hasAttribute('tagHelper')) {
                            return true;
                        }
                    }

                    return false;
                }

                if (tagHelpersCheck()) {
                    return;
                }

                var element = document['registerElement'](metaInfo.tagName,
                {
                    prototype: proto
                });

                return element;
            });
        });
    }
})(jqxBaseFramework);
