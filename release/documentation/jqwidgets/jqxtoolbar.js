/* tslint:disable */
/* eslint-disable */
(function ($) {
    'use strict';

    $.jqx.jqxWidget('jqxToolBar', '', {});

    $.extend($.jqx._jqxToolBar.prototype, {
        defineInstance: function () {
            var settings = {
                // properties
                width: '100%',
                minWidth: null,
                maxWidth: null,
                height: 35,
                tools: '', // possible values: a string representing a list of space-separated element types: button, toggleButton, dropdownlist, combobox, input, custom, | (separator)
                initTools: null, // callback function
                minimizeWidth: 200,
                disabled: false,
                rtl: false,

                // events
                events: ['open', 'close']
            };
            if (this === $.jqx._jqxToolBar.prototype) {
                return settings;
            }
            $.extend(true, this, settings);
            return settings;
        },

        createInstance: function () {
            var that = this;

            if (that.host.css('display') === 'none' || document.body.contains(that.element) === false) {
                that._initiallyHidden = true;
            }
            that._toolToWidgetMapping = { button: 'jqxButton', toggleButton: 'jqxToggleButton', dropdownlist: 'jqxDropDownList', combobox: 'jqxComboBox', input: 'jqxInput' };
            that._toolChanges = [];
            that.render();
        },

        // renders the widget
        render: function () {
            var that = this, initialization = true;

            that.element.innerHTML = '';
            if (that.element.className.length > 0) {
                that._removeClass(that.element, that.toThemeProperty('jqx-widget jqx-fill-state-normal jqx-rc-all jqx-toolbar jqx-fill-state-disabled'));
            }

            // sets the width and height of the widget
            that._setSize();

            // destroys all tools (only if render is called after initialization)
            that._destroyTools(false);

            // removes the minimize button and pop-up (only if render is called after initialization)
            if (that._toolWidgets) {
                initialization = false;

                $(that._minimizeButton).remove();
                $(that._minimizePopup).remove();
            }

            // appends the minimize button and pop-up
            that._appendMinimizeButton();

            // adds the necessary classes for the widget
            that._addClasses();

            if (!that._initiallyHidden) {
                // initializes the tools in the toolbar
                that._createTools();
            }

            if (that.disabled === true) {
                that.element.className += ' ' + that.toThemeProperty('jqx-fill-state-disabled');
                that._disableTools(true);
            }

            if (!that._initiallyHidden) {
                // minimizes some of the tools if necessary
                that._minimize();
            }

            // removes event handlers
            that._removeHandlers();

            // adds event handlers
            that._addHandlers();

            // restores changes (only if render is called after initialization)
            if (initialization === false && that._toolChanges.length > 0) {
                that._restoreChanges();
            }
        },

        // refreshes the widget
        refresh: function (initialRefresh) {
            if (initialRefresh !== true) {
                this.render();
            }
        },

        // returns an array of all tools
        getTools: function () {
            return this._toolWidgets;
        },

        // destroys the widget
        destroy: function () {
            var that = this;

            that._removeHandlers();
            that._destroyTools();
            that.host.remove();
        },

        // destroys all tools
        _destroyTools: function (logChanges) {
            var that = this;

            if (logChanges !== false) {
                logChanges = true;
            }

            if (that._toolWidgets) {
                for (var i = that._toolWidgets.length - 1; i >= 0; i--) {
                    that._destroyTool(i, logChanges, true);
                }
            }
        },

        // destroys a tool - private method
        _destroyTool: function (index, logChanges, suppressMinimize) {
            var that = this;
            index = parseInt(index, 10);
            var toolToDestroy = that._toolWidgets[index];
            if (toolToDestroy) {
                var type = toolToDestroy.type,
                    tool = toolToDestroy.tool,
                    menuTool = toolToDestroy.menuTool;

                if (type !== 'custom') {
                    tool[that._toolToWidgetMapping[type]]('destroy');
                    if (menuTool) {
                        menuTool[that._toolToWidgetMapping[type]]('destroy');
                    }
                } else {
                    tool.remove();
                    if (menuTool) {
                        menuTool.remove();
                    }
                }

                if (toolToDestroy.menuSeparator) {
                    $(toolToDestroy.menuSeparator).remove();
                }

                that._toolWidgets.splice(index, 1);

                if (that._checkType(type)) {
                    that._refreshButtonGroups();
                }

                if (suppressMinimize !== true) {
                    that._minimize();
                }

                if (logChanges !== false) {
                    that._toolChanges.push({ action: 'destroyTool', index: index });
                }
            }
        },

        // destroys a tool - public method
        destroyTool: function (index) {
            this._destroyTool(index, true);
        },

        // adds a new tool after the existing ones
        addTool: function (type, position, separator, initCallback) {
            var that = this, index, prevTool, prev, next;

            if (position === 'first') {
                index = 0;
            } else { // position is 'last'
                index = that._toolWidgets.length;
            }

            if (that._toolWidgets[index - 1]) {
                prevTool = that._toolWidgets[index - 1].tool;
                if (that._toolWidgets[index - 1].separatorAfterWidget) {
                    prev = '|';
                } else {
                    prev = that._toolWidgets[index - 1].type;
                }
            }

            if (separator === true) {
                next = '|';
            } else if (that._toolWidgets[index + 1]) {
                next = that._toolWidgets[index + 1].type;
            }

            var newToolObject = that._initializeTool(index, type, prevTool, prev, next, initCallback, false);

            if (position === 'first') {
                that._toolWidgets.splice(0, 0, newToolObject);
            } else {
                that._toolWidgets.push(newToolObject);
            }

            that._removeHandlers();
            that._addHandlers();

            if (that._checkType(type)) {
                that._refreshButtonGroups();
            }

            if (position !== 'first' && that._minimizedTools > 0) {
                that._minimizeTool(true);
            } else {
                that._minimize();
            }

            that._toolChanges.push({ action: 'addTool', type: type, position: position, separator: separator, initCallback: initCallback });
        },

        // disables or enables all tools
        _disableTools: function (disable) {
            var that = this;

            for (var i = 0; i < that._toolWidgets.length; i++) {
                that.disableTool(i, disable);
            }
        },

        // disables or enables a tool
        disableTool: function (index, disable) {
            var that = this;

            index = parseInt(index, 10);

            var currentTool = that._toolWidgets[index];
            if (currentTool) {
                var type = currentTool.type;
                if (type !== 'custom') {
                    currentTool.tool[that._toolToWidgetMapping[type]]({ disabled: disable });
                    currentTool.menuTool[that._toolToWidgetMapping[type]]({ disabled: disable });
                }
                that._toolChanges.push({ action: 'disableTool', index: index, disable: disable });
            }
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (key !== 'initTools') {
                if (value !== oldvalue) {
                    switch (key) {
                        case 'theme':
                            if (oldvalue !== '') {
                                object._removeClass(object.element, object.toThemeProperty('jqx-widget-' + oldvalue + ' jqx-fill-state-normal-' + oldvalue + ' jqx-rc-all-' + oldvalue + ' jqx-toolbar-' + oldvalue));
                                object._removeClass(object._minimizePopup, 'jqx-popup-' + oldvalue + ' jqx-fill-state-normal-' + oldvalue + ' jqx-rc-b-' + oldvalue + ' jqx-toolbar-minimized-popup-' + oldvalue);
                            }

                            object._addClasses();
                            object._minimizePopup.className += ' ' + object.toThemeProperty('jqx-popup jqx-fill-state-normal jqx-rc-b jqx-toolbar-minimized-popup');

                            for (var i = 0; i < object._toolWidgets.length; i++) {
                                var currentToolTheme = object._toolWidgets[i];
                                if (currentToolTheme.type !== 'custom') {
                                    if (currentToolTheme.menuTool) {
                                        if (currentToolTheme.menuSeparator) {
                                            if (oldvalue !== '') {
                                                object._removeClass(currentToolTheme.menuSeparator, 'jqx-fill-state-pressed-' + oldvalue + ' jqx-toolbar-minimized-popup-separator-' + oldvalue);
                                            }
                                            currentToolTheme.menuSeparator.className += ' jqx-fill-state-pressed-' + value + ' jqx-toolbar-minimized-popup-separator-' + value;
                                        }
                                        currentToolTheme.menuTool[object._toolToWidgetMapping[object._toolWidgets[i].type]]({ theme: value });
                                    }
                                    currentToolTheme.tool[object._toolToWidgetMapping[object._toolWidgets[i].type]]({ theme: value });
                                }
                            }
                            $.jqx.utilities.setTheme(oldvalue, value, object.host);
                            break;
                        case 'width':
                            object.element.style.width = object._toPx(value);
                            object._minimize();
                            break;
                        case 'minWidth':
                            object.element.style.minWidth = object._toPx(value);
                            object._minimize();
                            break;
                        case 'maxWidth':
                            object.element.style.maxWidth = object._toPx(value);
                            object._minimize();
                            break;
                        case 'height':
                            var intValue,
                                fluidHeight = false;
                            object.element.style.height = object._toPx(value);
                            if (typeof value === 'string' && value.indexOf('%') !== -1) {
                                if (typeof oldvalue === 'string' && oldvalue.indexOf('%') !== -1) {
                                    object.host.trigger('resize');
                                    return;
                                }
                                fluidHeight = true;
                            } else {
                                intValue = parseInt(value, 10);
                                intValue -= object._getComputedStyle(object.element, 'paddingTop') +
                                    object._getComputedStyle(object.element, 'paddingBottom') +
                                    object._getComputedStyle(object.element, 'borderTopWidth') +
                                    object._getComputedStyle(object.element, 'borderBottomWidth');
                            }
                            for (var j = 0; j < object._toolWidgets.length; j++) {
                                var currentToolHeight = object._toolWidgets[j];
                                var type = currentToolHeight.type;
                                if (type === 'button' || type === 'toggleButton' || type === 'repeatButton' || type === 'linkButton') {
                                    currentToolHeight.tool[0].style.height = fluidHeight ? '100%' : object._toPx(intValue);
                                    if (currentToolHeight.menuTool) {
                                        currentToolHeight.menuTool[0].style.height = fluidHeight ? '100%' : object._toPx(intValue);
                                    }
                                } else if (type === 'dropdownlist' || type === 'combobox' || type === 'input') {
                                    currentToolHeight.tool[object._toolToWidgetMapping[type]]({ height: fluidHeight ? '100%' : intValue - 2 });
                                    if (currentToolHeight.menuTool) {
                                        currentToolHeight.menuTool[object._toolToWidgetMapping[type]]({ height: fluidHeight ? '100%' : intValue - 2 });
                                    }
                                }
                            }
                            break;
                        case 'tools': // 'initTools' has to be changed before changing 'tools'
                            object._removeHandlers();
                            object._destroyTools();
                            object._createTools();
                            object._addHandlers();
                            object._minimize();
                            break;
                        case 'minimizeWidth':
                            if (object._isOpen === true) {
                                var newLeft = object._getComputedStyle(object._minimizePopup, 'left') - (value - oldvalue);
                                object._minimizePopup.style.width = object._toPx(value);
                                object._minimizePopup.style.left = object._toPx(newLeft);
                            } else {
                                object._minimizePopup.style.width = object._toPx(value);
                            }
                            break;
                        case 'rtl':
                            object.render();
                            break;
                        case 'disabled':
                            if (value === true) {
                                object.element.className += ' ' + object.toThemeProperty('jqx-fill-state-disabled');
                                object._disableTools(true);
                            } else {
                                object._removeClass(object.element, object.toThemeProperty('jqx-fill-state-disabled'));
                                object._disableTools(false);
                            }
                            break;
                    }
                }
            }
        },

        // raises an event
        _raiseEvent: function (id, arg) {
            if (arg === undefined) {
                arg = { owner: null };
            }

            var evt = this.events[id];
            arg.owner = this;

            var event = new $.Event(evt);
            event.owner = this;
            event.args = arg;
            if (event.preventDefault) {
                event.preventDefault();
            }

            var result = this.host.trigger(event);
            return result;
        },

        // adds the necessary classes for the widget
        _addClasses: function () {
            var that = this,
                classToAdd = 'jqx-widget jqx-fill-state-normal jqx-rc-all jqx-toolbar';

            if (that.rtl === true) {
                classToAdd += ' jqx-toolbar-rtl';
            }

            that.element.className += ' ' + that.toThemeProperty(classToAdd);
        },

        _checkType: function (type) {
            if (type === 'button' || type === 'toggleButton' || type === 'repeatButton' || type === 'linkButton') {
                return true;
            }
            return false;
        },

        // refreshes the CSS of button groups
        _refreshButtonGroups: function () {
            var that = this;

            function styleButton(toolObject, inner, all, l, r, borderLeftWidth) {
                var tool = toolObject.tool[0],
                    menuTool = toolObject.menuTool[0],
                    classesToModify = { add: '', remove: '' };

                classesToModify[inner] += ' jqx-toolbar-tool-inner-button';
                classesToModify[all] += ' jqx-rc-all';
                classesToModify[l] += ' jqx-rc-l';
                classesToModify[r] += ' jqx-rc-r';

                if (classesToModify.add !== '') {
                    tool.className += ' ' + that.toThemeProperty($.trim(classesToModify.add));
                    if (menuTool) {
                        menuTool.className += ' ' + that.toThemeProperty($.trim(classesToModify.add));
                    }
                }
                if (classesToModify.remove !== '') {
                    that._removeClass(tool, that.toThemeProperty($.trim(classesToModify.remove)));
                    if (menuTool) {
                        that._removeClass(menuTool, that.toThemeProperty($.trim(classesToModify.remove)));
                    }
                }
                tool.style.borderLeftWidth = borderLeftWidth + 'px';
                if (menuTool) {
                    menuTool.style.borderLeftWidth = borderLeftWidth + 'px';
                }
            }

            //$.each(that._toolWidgets, function (index, toolObject) {
            for (var index = 0; index < that._toolWidgets.length; index++) {
                var toolObject = that._toolWidgets[index];

                if (that._checkType(toolObject.type)) {
                    var prev, next,
                        tool = toolObject.tool,
                        menuTool = toolObject.menuTool;

                    if (index > 0) {
                        if (that._toolWidgets[index - 1].separatorAfterWidget) {
                            prev = '|';
                        } else {
                            prev = that._toolWidgets[index - 1];
                        }
                    }

                    if (toolObject.separatorAfterWidget) {
                        next = '|';
                    } else if (index < that._toolWidgets.length - 1) {
                        next = that._toolWidgets[index + 1];
                    }

                    var prevButton = prev && that._checkType(prev.type);
                    var nextButton = toolObject.separatorAfterWidget === false && next && that._checkType(next.type);

                    if (!prevButton && !nextButton) { // single button
                        styleButton(toolObject, 'remove', 'add', 'remove', 'remove', 1);
                    } else if (!prevButton && nextButton) { // left button
                        styleButton(toolObject, 'remove', 'remove', 'add', 'remove', 1);
                    } else if (prevButton && nextButton) { // middle button
                        styleButton(toolObject, 'add', 'remove', 'remove', 'remove', 0);
                    } else if (prevButton && !nextButton) { // right button
                        styleButton(toolObject, 'remove', 'remove', 'remove', 'add', 0);
                    }

                    var rtl = that.rtl ? 'rtl' : 'ltr';

                    if (!nextButton) {
                        if (toolObject.separatorAfterWidget) {
                            that._removeClass(tool[0], that.toThemeProperty('jqx-toolbar-tool-no-separator-' + rtl));
                            tool[0].className += ' ' + that.toThemeProperty('jqx-toolbar-tool-separator-' + rtl);
                            if (menuTool) {
                                that._removeClass(menuTool[0], that.toThemeProperty('jqx-toolbar-tool-no-separator-' + rtl));
                                menuTool[0].className += ' ' + that.toThemeProperty('jqx-toolbar-tool-separator-' + rtl);
                            }
                        } else {
                            that._removeClass(tool[0], that.toThemeProperty('jqx-toolbar-tool-separator-' + rtl));
                            tool[0].className += ' ' + that.toThemeProperty('jqx-toolbar-tool-no-separator-' + rtl);
                            if (menuTool) {
                                that._removeClass(menuTool[0], that.toThemeProperty('jqx-toolbar-tool-separator-' + rtl));
                                menuTool[0].className += ' ' + that.toThemeProperty('jqx-toolbar-tool-no-separator-' + rtl);
                            }
                        }
                    } else {
                        that._removeClass(tool[0], that.toThemeProperty('jqx-toolbar-tool-separator-' + rtl));
                        that._removeClass(tool[0], that.toThemeProperty('jqx-toolbar-tool-no-separator-' + rtl));
                        if (menuTool) {
                            that._removeClass(menuTool[0], that.toThemeProperty('jqx-toolbar-tool-separator-' + rtl));
                            that._removeClass(menuTool[0], that.toThemeProperty('jqx-toolbar-tool-no-separator-' + rtl));
                        }
                    }
                }
            }
        },

        // adds event handlers
        _addHandlers: function () {
            var that = this;
            var id = that.element.id;

            $.jqx.utilities.resize(that.host, function () {
                if (that._initiallyHidden) {
                    that._createTools();
                    that._minimize();
                    that._initiallyHidden = false;
                    return;
                }
                if (that._isOpen === true) {
                    that._minimizePopup.style.display = 'none';
                    that._isOpen = false;
                    that._raiseEvent('1'); // close event
                }
                that._minimize();
            });

            that.addHandler(document, 'click.jqxToolbar' + id, function () {
                if (that._isOpen === true) {
                    that._openMinimizePopup();
                }
            });
            that.addHandler(that._minimizeButton, 'click.jqxToolbar' + id, function (event) {
                event.stopPropagation();
                that._openMinimizePopup();
            });
            that.addHandler($('.jqx-popup'), 'click.jqxToolbar' + id, function (event) {
                if (event.target.className.indexOf('jqx-window-content') === -1) {
                    event.stopPropagation();
                }
            });
        },

        // removes event handlers
        _removeHandlers: function () {
            var that = this;
            var id = that.element.id;

            that.removeHandler(document, 'click.jqxToolbar' + id);
            that.removeHandler(that._minimizeButton, 'click.jqxToolbar' + id);
            that.removeHandler($('.jqx-popup'), 'click.jqxToolbar' + id);
        },

        // sets the width and height of the widget
        _setSize: function () {
            var that = this,
                elementStyle = that.element.style;

            elementStyle.width = that._toPx(that.width);
            elementStyle.height = that._toPx(that.height);

            if (that.minWidth) {
                elementStyle.minWidth = that._toPx(that.minWidth);
            }

            if (that.maxWidth) {
                elementStyle.maxWidth = that._toPx(that.maxWidth);
            }
        },

        // initializes the tools in the toolbar
        _createTools: function () {
            var that = this;

            var toolsWithSeparators = that.tools.split(' ');

            var tools = $.trim(that.tools.replace(/\|/g, ''));
            tools = tools.replace(/\s+/g, ' ');
            tools = tools.split(' ');

            // a global array of all tool widget instances
            that._toolWidgets = [];

            var indexCorrection = 0;

            for (var index = 0; index < tools.length; index++) {
                if (tools[index] !== toolsWithSeparators[index + indexCorrection]) {
                    indexCorrection++;
                }

                var currentIndex = index + indexCorrection;

                var prevTool;
                if (that._toolWidgets[index - 1]) {
                    prevTool = that._toolWidgets[index - 1].tool;
                }

                var currentType = toolsWithSeparators[currentIndex];
                var prev = toolsWithSeparators[currentIndex - 1];
                var next = toolsWithSeparators[currentIndex + 1];

                var initCallback = that.initTools;
                if (currentType === '') {
                    return true;
                }

                var toolObject = that._initializeTool(index, currentType, prevTool, prev, next, initCallback, true);

                that._toolWidgets.push(toolObject);
            }

            that._minimizePopup.style.display = 'none';
            that._minimizePopup.style.visibility = 'visible';
        },

        // initializes a tool
        _initializeTool: function (index, type, prevTool, prev, next, initCallback, initialization) {
            var that = this, tool, menuTool;

            var initializationResults = that._initializeWidget(type, tool, menuTool, prevTool);
            tool = initializationResults.tool;
            menuTool = initializationResults.menuTool;
            var toolElement = tool[0],
                toolClass = 'jqx-toolbar-tool',
                menuToolElement = menuTool[0],
                menuToolClass,
                minimizable = true;

            if (that.rtl === true) {
                toolClass += ' jqx-toolbar-tool-rtl';
            }

            if (that.initTools) {
                var settings;
                if (initialization === true) {
                    settings = that.initTools(type, index, tool, false);
                } else {
                    settings = initCallback(type, tool, false);
                }
                if (!settings || (settings.minimizable !== false && settings.menuTool !== false)) {
                    if (initialization === true) {
                        that.initTools(type, index, menuTool, true);
                    } else {
                        initCallback(type, menuTool, true);
                    }
                    if (menuTool) {
                        menuToolClass = 'jqx-toolbar-tool-minimized';
                    }
                } else {
                    if (type !== 'custom') {
                        menuTool[that._toolToWidgetMapping[type]]('destroy');
                    } else {
                        menuTool.remove();
                    }
                    if (settings.minimizable === false) {
                        minimizable = false;
                    }
                    menuTool = false;
                }
            }

            var separatorAfter = false;

            if (menuTool) {
                menuToolElement.style.display = 'none';
            }

            var minimizedSeparator;

            var rtl = that.rtl ? 'rtl' : 'ltr';
            var buttons = ['button', 'toggleButton', 'repeatButton', 'linkButton'];
            var buttonType = {
                'button': 'jqxButton',
                'toggleButton': 'jqxToggleButton',
                'repeatButton': 'jqxRepeatButton',
                'linkButton': 'jqxRepeatButton'
            };

            // separators
            if (next === '|') {
                separatorAfter = true;
                toolClass += ' jqx-toolbar-tool-separator-' + rtl;
                if (menuTool) {
                    menuToolClass += ' jqx-toolbar-tool-separator-' + rtl;
                }
                if (menuTool) {
                    minimizedSeparator = document.createElement('div');
                    minimizedSeparator.className = that.toThemeProperty('jqx-fill-state-pressed jqx-toolbar-minimized-popup-separator');
                    that._minimizePopup.appendChild(minimizedSeparator);
                }
            } else if (buttons.indexOf(type) === -1 || (buttons.indexOf(type) !== -1 && buttons.indexOf(next) === -1)) {
                toolClass += ' jqx-toolbar-tool-no-separator-' + rtl;
                if (menuTool) {
                    menuToolClass += ' jqx-toolbar-tool-no-separator-' + rtl;
                }
            }

            // buttons
            if (buttons.indexOf(prev) === -1 && buttons.indexOf(type) !== -1 && buttons.indexOf(next) !== -1) {

                if (that.rtl === false) {
                    tool[buttonType[type]]({ roundedCorners: 'left' });
                    if (menuTool) {
                        menuTool[buttonType[type]]({ roundedCorners: 'left' });
                    }
                } else {
                    tool[buttonType[type]]({ roundedCorners: 'left' });
                    toolElement.style.borderLeftWidth = '0px';
                    if (menuTool) {
                        menuTool[buttonType[type]]({ roundedCorners: 'left' });
                        menuToolElement.style.borderLeftWidth = '0px';
                    }
                }
            } else if (buttons.indexOf(prev) !== -1 && buttons.indexOf(type) !== -1 && buttons.indexOf(next) !== -1) {
                toolClass += ' jqx-toolbar-tool-inner-button';
                toolElement.style.borderLeftWidth = '0px';
                if (menuTool) {
                    menuToolClass += ' jqx-toolbar-tool-inner-button';
                    menuToolElement.style.borderLeftWidth = '0px';
                }
            } else if (buttons.indexOf(prev) !== -1 && buttons.indexOf(type) !== -1 && buttons.indexOf(next) === -1) {
                if (that.rtl === false) {
                    tool[buttonType[type]]({ roundedCorners: 'right' });
                    toolElement.style.borderLeftWidth = '0px';
                    if (menuTool) {
                        menuTool[buttonType[type]]({ roundedCorners: 'right' });
                        menuToolElement.style.borderLeftWidth = '0px';
                    }
                } else {
                    tool[buttonType[type]]({ roundedCorners: 'left' });
                    if (menuTool) {
                        menuTool[buttonType[type]]({ roundedCorners: 'left' });
                    }
                }
            }

            toolElement.className += ' ' + that.toThemeProperty(toolClass);
            if (menuTool) {
                menuToolElement.className += ' ' + that.toThemeProperty(menuToolClass);
            }

            var toolObject = {
                type: type,
                tool: tool,
                separatorAfterWidget: separatorAfter,
                minimizable: minimizable,
                minimized: false,
                menuTool: menuTool,
                menuSeparator: minimizedSeparator
            };

            return toolObject;
        },

        // initializes a widget tool
        _initializeWidget: function (type, tool, menuTool, prevTool) {
            var that = this,
                widgetSettings,
                widgetName = that._toolToWidgetMapping[type],
                height,
                fluidHeight = false;

            if (typeof that.height === 'string' && that.height.indexOf('%') !== -1) {
                fluidHeight = true;
            } else {
                var hostCurrentStyle = window.getComputedStyle ? window.getComputedStyle(that.element) : that.element.currentStyle;
                height = that.element.offsetHeight - (
                    parseInt(hostCurrentStyle.paddingTop, 10) +
                    parseInt(hostCurrentStyle.paddingBottom, 10) +
                    parseInt(hostCurrentStyle.borderTopWidth, 10) +
                    parseInt(hostCurrentStyle.borderBottomWidth, 10));
            }

            function appendTool() {
                var tools = that.host.children(),
                    menuTools = $(that._minimizePopup).children();
                if (prevTool || tools.length === 1 && menuTools.length === 0) {
                    that.element.appendChild(tool);
                    that._minimizePopup.appendChild(menuTool);
                } else {
                    that.element.insertBefore(tool, tools[1]);
                    that._minimizePopup.insertBefore(menuTool, menuTools[0]);
                }
            }

            if (type !== 'custom' && that.host[widgetName] === undefined) {
                var missingWidget = that._toolToWidgetMapping[type].toLowerCase();
                throw new Error('jqxToolBar: Missing reference to ' + missingWidget + '.js');
            }

            switch (type) {
                case 'button':
                case 'toggleButton':
                    tool = document.createElement('button');
                    menuTool = document.createElement('button');
                    widgetSettings = { theme: that.theme, height: fluidHeight ? '100%' : height, disabled: that.disabled, rtl: that.rtl };
                    break;
                case 'dropdownlist':
                case 'combobox':
                    tool = document.createElement('div');
                    menuTool = document.createElement('div');
                    widgetSettings = { theme: that.theme, autoDropDownHeight: true, height: fluidHeight ? '100%' : height - 2, disabled: that.disabled, rtl: that.rtl };
                    break;
                case 'input':
                    tool = document.createElement('input');
                    tool.setAttribute('type', 'text');
                    menuTool = document.createElement('input');
                    menuTool.setAttribute('type', 'text');
                    widgetSettings = { theme: that.theme, height: fluidHeight ? '100%' : height - 2, disabled: that.disabled, rtl: that.rtl };
                    break;
                case 'custom':
                    tool = document.createElement('div');
                    menuTool = document.createElement('div');
                    break;
            }

            appendTool();
            tool = $(tool);
            menuTool = $(menuTool);
            if (type !== 'custom') {
                tool[widgetName](widgetSettings);
                menuTool[widgetName](widgetSettings);
            }

            return { tool: tool, menuTool: menuTool };
        },

        // appends the minimize button
        _appendMinimizeButton: function () {
            var that = this;
            that._minimizedTools = 0;
            var minimizeButton = document.createElement('div'),
                minimizeButtonClass = 'jqx-menu-minimized-button jqx-toolbar-minimized-button';

            var minimizePopup = document.createElement('div'),
                minimizePopupClass = 'jqx-popup jqx-fill-state-normal jqx-rc-b jqx-toolbar-minimized-popup';
            minimizePopup.setAttribute('id', that.element.id + 'Popup');

            if (that.rtl === true) {
                minimizeButtonClass += ' jqx-toolbar-minimized-button-rtl';
                minimizePopupClass += ' jqx-toolbar-minimized-popup-rtl';
            }

            minimizeButton.className = that.toThemeProperty(minimizeButtonClass);
            minimizePopup.className = that.toThemeProperty(minimizePopupClass);

            that.element.appendChild(minimizeButton);
            document.body.appendChild(minimizePopup);

            that._isOpen = false;
            minimizePopup.style.width = that._toPx(that.minimizeWidth);

            that._minimizeButton = minimizeButton;
            that._minimizePopup = minimizePopup;
        },

        // opens the minimize pop-up
        _openMinimizePopup: function () {
            var that = this;

            if (that._isOpen === false) {
                var hostOffset = that.host.offset();
                var left = hostOffset.left;
                if (that.rtl === false) {
                    left += that.element.offsetWidth - parseInt(that.minimizeWidth, 10) - (that._getComputedStyle(that._minimizePopup, 'paddingLeft') + that._getComputedStyle(that._minimizePopup, 'paddingRight') + that._getComputedStyle(that._minimizePopup, 'borderLeftWidth') + that._getComputedStyle(that._minimizePopup, 'borderRightWidth'));
                }
                var top = hostOffset.top + that.element.offsetHeight - 1;
                that._minimizePopup.style.left = left + 'px';
                that._minimizePopup.style.top = top + 'px';
                $(that._minimizePopup).slideDown('fast', function () {
                    that._isOpen = true;
                    that._raiseEvent('0'); // open event
                });
            } else {
                $(that._minimizePopup).slideUp('fast');
                that._isOpen = false;
                that._raiseEvent('1'); // close event
            }
        },

        // minimizes some of the tools if necessary
        _minimize: function () {
            var that = this, minimizeButtonWidth = 0;

            function getHiddenOffsetWidth(element) {
                var clone = element.cloneNode(true),
                    offsetWidth;

                clone.style.visibility = 'hidden';
                clone.style.display = 'block';
                clone.style.position = 'absolute';
                document.body.appendChild(clone);
                offsetWidth = clone.offsetWidth + that._getComputedStyle(clone, 'marginLeft') + that._getComputedStyle(clone, 'marginRight');
                $(clone).remove();

                return offsetWidth;
            }

            if (that._minimizedTools > 0) {
                minimizeButtonWidth = that._minimizeButton.offsetWidth + that._getComputedStyle(that._minimizeButton, 'marginLeft');
            }

            var toolbarWidth = that.element.offsetWidth - that._getComputedStyle(that.element, 'paddingLeft') - that._getComputedStyle(that.element, 'paddingRight') - minimizeButtonWidth - 10;

            if (toolbarWidth < 0) {
                return;
            }
            var toolsTotalWidth = 0;
            var lastMinimizedWidth;

            for (var i = 0; i < that._toolWidgets.length; i++) {
                var tool = that._toolWidgets[i].tool;
                if (that._toolWidgets[i].minimized === false) {
                    var currentToolWidth = tool[0].offsetWidth + that._getComputedStyle(tool[0], 'marginLeft') + that._getComputedStyle(tool[0], 'marginRight');
                    toolsTotalWidth += currentToolWidth;
                } else if (lastMinimizedWidth === undefined) {
                    lastMinimizedWidth = getHiddenOffsetWidth(tool[0]);
                }
            }

            if (toolsTotalWidth > toolbarWidth) {
                that._minimizeTool(true);
                that._minimize();
            } else if (lastMinimizedWidth !== undefined && (toolsTotalWidth + lastMinimizedWidth) < toolbarWidth) {
                that._minimizeTool(false);
                that._minimize();
            }
        },

        // minimizes or restores a tool
        _minimizeTool: function (minimize) {
            var that = this, currentTool, value;

            if (minimize === true) { // minimize
                for (var i = that._toolWidgets.length - 1; i >= 0; i--) {
                    currentTool = that._toolWidgets[i];

                    if (currentTool.minimizable === false) {
                        continue;
                    }

                    if (currentTool.minimized === false) {
                        value = that._getToolValue(currentTool.tool, currentTool.type);
                        currentTool.tool[0].style.display = 'none';
                        if (currentTool.menuTool) {
                            currentTool.menuTool[0].style.display = 'block';
                            that._setToolValue(value, currentTool.menuTool, currentTool.type);
                        }
                        if (currentTool.menuSeparator) {
                            currentTool.menuSeparator.style.display = 'block';
                        }
                        that._toolWidgets[i].minimized = true;
                        that._minimizedTools++;
                        if (that._minimizedTools === 1) {
                            that._minimizeButton.style.display = 'block';
                        }
                        break;
                    }
                }
            } else { // restore
                for (var j = 0; j < that._toolWidgets.length; j++) {
                    currentTool = that._toolWidgets[j];
                    if (currentTool.minimized === true) {
                        if (currentTool.menuTool) {
                            value = that._getToolValue(currentTool.menuTool, currentTool.type);
                            currentTool.menuTool[0].style.display = 'none';
                        }
                        if (currentTool.menuSeparator) {
                            currentTool.menuSeparator.style.display = 'none';
                        }
                        currentTool.tool.show();
                        if (currentTool.menuTool) {
                            that._setToolValue(value, currentTool.tool, currentTool.type);
                        }
                        that._toolWidgets[j].minimized = false;
                        that._minimizedTools--;
                        if (that._minimizedTools === 0) {
                            that._minimizeButton.style.display = 'none';
                        }
                        break;
                    }
                }
            }
        },

        // gets the value of a tool
        _getToolValue: function (tool, type) {
            var value;

            switch (type) {
                case 'button':
                case 'custom':
                    value = undefined;
                    break;
                case 'toggleButton':
                    var toggled = tool[0].className.indexOf('jqx-fill-state-pressed') !== -1;
                    value = { text: tool[0].innerHTML, toggled: toggled };
                    break;
                case 'dropdownlist':
                case 'combobox':
                    var constructorName = this._toolToWidgetMapping[type];
                    if (!tool[constructorName]('checkboxes')) {
                        value = tool[constructorName]('getSelectedIndex');
                    } else {
                        value = tool[constructorName]('val');
                    }
                    break;
                case 'input':
                    value = tool.val();
                    break;
            }

            return value;
        },

        // sets the value of a tool
        _setToolValue: function (value, tool, type) {
            if (value !== undefined) {
                switch (type) {
                    case 'button':
                    case 'custom':
                        break;
                    case 'toggleButton':
                        tool[0].innerHTML = value.text;
                        var toggled = tool[0].className.indexOf('jqx-fill-state-pressed') !== -1;
                        if (toggled !== value.toggled) {
                            tool.jqxToggleButton('toggle');
                        }
                        break;
                    case 'dropdownlist':
                    case 'combobox':
                        var constructorName = this._toolToWidgetMapping[type];
                        if (!tool[constructorName]('checkboxes')) {
                            value = tool[constructorName]('selectIndex', value);
                        } else {
                            tool[constructorName]('uncheckAll');
                            if (value === '') {
                                return;
                            }
                            var valuesArray = value.split(',');
                            for (var i = 0; i < valuesArray.length; i++) {
                                tool[constructorName]('checkItem', valuesArray[i]);
                            }
                        }
                        break;
                    case 'input':
                        tool.val(value);
                        break;
                }
            }
        },

        // restores changes made to the tools
        _restoreChanges: function () {
            var that = this;

            $.each(that._toolChanges, function (index, change) {
                if (change.action === 'addTool') {
                    that.addTool(change.type, change.position, change.separator, change.initCallback);
                } else if (change.action === 'destroyTool') {
                    that._destroyTool(change.index);
                } else if (change.action === 'disableTool') {
                    that.disableTool(change.index, change.disable);
                }
            });
        },

        // a replacement of jQuery's .removeClass()
        _removeClass: function (element, classToRemove) {
            $(element).removeClass(classToRemove);
        },

        _toPx: function (value) {
            if (typeof value === 'number') {
                return value + 'px';
            } else {
                return value;
            }
        },

        _getComputedStyle: function (element, prop) {
            var computedStyle;
            if (window.getComputedStyle) {
                computedStyle = window.getComputedStyle(element);
            } else if (element.currentStyle) {
                computedStyle = element.currentStyle;
            }
            if (typeof computedStyle[prop] === 'string' && computedStyle[prop].indexOf('px') === -1) {
                return 0;
            }
            return parseInt(computedStyle[prop], 10);
        }
    });
})(jqxBaseFramework); //ignore jslint
