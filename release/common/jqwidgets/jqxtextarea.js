/* tslint:disable */
/* eslint-disable */
(function ($) {
    'use strict';

    $.jqx.jqxWidget('jqxTextArea', '', {});

    $.extend($.jqx._jqxTextArea.prototype, {

        defineInstance: function () {
            var that = this;
            var settings = {
                disabled: false,
                filter: that._filter,
                sort: that._sort,
                highlight: that._highlight,
                dropDownWidth: null,
                renderer: that._renderer,
                opened: false,
                $popup: document.createElement('ul'),
                source: [],
                roundedCorners: true,
                searchMode: 'default',
                placeHolder: '',
                width: null,
                height: null,
                rtl: false,
                displayMember: '',
                valueMember: '',
                popupZIndex: 1000,
                items: 8,
                minLength: 1,
                maxLength: null,
                scrollBarSize: $.jqx.utilities.scrollBarSize,
                query: '',
                hint:true,
                changeType: null,
                events: [
                // occurs when the text in the textarea is changed
                    'change',
                // occurs when an item from the pop-up is selected
                    'select',
                // occurs when the pop-up is shown
                    'open',
                // occurs when the pop-up is hidden
                    'close'
                ]
            };
            if (this === $.jqx._jqxTextArea.prototype) {
                return settings;
            }
            $.extend(true, that, settings);
            return settings;
        },

        // creates a new jqxPanel instance.
        createInstance: function () {
            var that = this;
            that._textareaWidthFix = 0;
            if ($.jqx.browser.chrome) {
                that._textareaWidthFix = 6;
            } else if ($.jqx.browser.msie) {
                that._textareaWidthFix = 3;
            }
            if (document.body.contains(that.element) === false) {
                that._notInDOM = true;
            }
            that._popupHelper = $(that.$popup);
            that.render();
            that.isInitialized = true;
        },

        render: function () {
            var that = this;

            if (that.isInitialized === true) {
                that.refresh();
                return;
            }

            if ($.jqx.utilities.scrollBarSize !== 15) {
                that.scrollBarSize = $.jqx.utilities.scrollBarSize;
            }

            var panelWrapper = document.createElement('div');
            panelWrapper.style.overflow = 'hidden';
            panelWrapper.style.width = '100%';
            panelWrapper.style.height = '100%';
            panelWrapper.style.backgroundColor = 'transparent';
            panelWrapper.style['-webkit-appearance'] = 'none';
            panelWrapper.style.outline = 'none';
            panelWrapper.style.align = 'left';
            panelWrapper.style.border = '0px';
            panelWrapper.style.padding = '0px';
            panelWrapper.style.margin = '0px';
            panelWrapper.style.left = '0px';
            panelWrapper.style.top = '0px';
            panelWrapper.style.valign = 'top';
            panelWrapper.style.position = 'relative';

            var scrollBar = document.createElement('div');
            scrollBar.style.align = 'left';
            scrollBar.style.valign = 'top';
            scrollBar.style.left = '0px';
            scrollBar.style.top = '0px';
            scrollBar.style.position = 'absolute';

            // creates the widget structure based on the type of the initialization element
            that._baseHost = that.host;

            $.jqx.utilities.resize(that._baseHost, function () {
                if (that._notInDOM) {
                    that._notInDOM = false;
                    if (that.element.nodeName.toLowerCase() === 'textarea') {
                        that.isInitialized = false;
                        that.render();
                    }
                    return;
                }
                that._ttimer = setTimeout(function () {
                    that.textarea.style.width = '';
                    that._arrange();
                }, 100);
            }, false, true);

            this.input = this.element;

            if (that.element.tagName.toLowerCase() === 'div') {
                that.element.appendChild(panelWrapper);
                var textArea = document.createElement('textarea');
                textArea.className = that.toThemeProperty('jqx-text-area-element');
                that.textarea = textArea;
                panelWrapper.appendChild(textArea);
                panelWrapper.appendChild(scrollBar);
                that.wrapper = that.element;
            } else if (that.element.tagName.toLowerCase() === 'textarea') {
                if (that._notInDOM) {
                    return;
                }
                that.textarea = that.element;
                var wrapper = document.createElement('div');
                that.element.parentNode.insertBefore(wrapper, that.element);
                wrapper.appendChild(panelWrapper);
                panelWrapper.appendChild(that.element);
                panelWrapper.appendChild(scrollBar);

                var data = that.host.data();
                that.host = $(wrapper);
                that.host.data(data);
                wrapper.style.cssText = that.element.style.cssText;
                that.element.style.cssText = '';
                that.element.className = that.toThemeProperty('jqx-text-area-element');
                that.wrapper = wrapper;
                wrapper.setAttribute('id', that.element.id);
                that.element = wrapper;
                that.textarea.setAttribute('id', that.element.id + 'TextArea');
            }

            var host = that.host;

            that._addClasses();

            if (!host.jqxButton) {
                throw new Error('jqxTextArea: Missing reference to jqxbuttons.js.');
            }
            if (!host.jqxScrollBar) {
                throw new Error('jqxTextArea: Missing reference to jqxscrollbar.js.');
            }

            if (null === that.width && that.element.style && null !== that.element.style.width) {
                that.width = that.element.style.width;
            }
            if (null === that.height && that.element.style && null !== that.element.style.height) {
                that.height = that.element.style.height;
            }

            // sets the width and height of the widget
            that._setSize();

            that.vScrollBar = $(scrollBar);
            that.vScrollBar.jqxScrollBar({
                vertical: true,
                width: 15,
                height: '100%',
                max: that.height,
                theme: that.theme
            });

            if ($.trim(that.textarea.value) === '') {
                that.textarea.value = '';
            }

            if (that.maxLength !== null) {
                that.textarea.setAttribute('maxlength', that.maxLength);
            }

       
            if ((that.source instanceof Array && that.source.length) || that.source._source || $.isFunction(that.source)) {
                that._oldsource = that.source;
                that._updateSource();
                that._addPopupClasses();
                $.jqx.aria(that, 'aria-haspopup', true);
            }

            if (that.isMaterialized()) {
                var label = $("<label></label");
                label[0].innerHTML = this.placeHolder;
                label.addClass(that.toThemeProperty('jqx-input-label'));

                var bar = $("<span></span>");
                bar.addClass(that.toThemeProperty('jqx-input-bar'));

                label.insertAfter(this.textarea);
                bar.insertAfter(this.textarea);
            
                bar.css('top', this.host.height());
                this.bar = bar;
                this.label = label;

                var that = this;

                if (that.template) {
                    that.bar.addClass(that.toThemeProperty("jqx-" + that.template));
                    that.label.addClass(that.toThemeProperty("jqx-" + that.template));
                }

            }

            that._arrange();
            that._refreshPlaceHolder();
            that._addHandlers();
        },

        refresh: function (initialRefresh) {
            if (initialRefresh !== true) {
                var that = this;
                that._setSize();
                that._arrange();
                that._removeHandlers();
                that._addHandlers();
                if (that.opened === true) {
                    that.open();
                }

                if (that.isMaterialized()) {
                    that.bar.css('top', that.host.height());
                }
            }
        },

        _arrange: function () {
            var that = this;
            var area = that.textarea;

            var height = area.scrollHeight - that._height(area);

            var scrollMax = Math.max(0, height);

            that.vScrollBar.jqxScrollBar({
                max: scrollMax,
                value: area.scrollTop
            });

            if (height < 5) {
                area.style.width = this._toPx(that._width(that.element));
                that.vScrollBar[0].style.visibility = 'hidden';
            } else {
                area.style.width = this._toPx(that._width(that.element) - that.scrollBarSize - that._textareaWidthFix);
                that.vScrollBar[0].style.visibility = 'visible';
                that._arrangeScrollbars(that.scrollBarSize);
            }
        },

        val: function (value) {
            var that = this,
                textarea = that.textarea,
                text = textarea.value,
                result;

            if (arguments.length === 0 || (typeof value === 'object' && $.isEmptyObject(value) === true)) {
                if (that.displayMember !== '' && that.valueMember !== '' && that.selectedItem) {
                    if (text === '') {
                        return '';
                    }
                    return that.selectedItem;
                }
                return text;
            }

            if (value && value.label) {
                if (that.selectedItem && value.label === that.selectedItem.label && value.value === that.selectedItem.value) {
                    return value.label;
                }
                that.selectedItem = { 'label': value.label, 'value': value.value };
                that.element.setAttribute('data-value', value.value);
                that.element.setAttribute('data-label', value.label);
                textarea.value = value.label;
                result = value.label;
            } else {
                if (text === value) {
                    return value;
                }
                textarea.value = value;
                that.element.setAttribute('data-value', value);
                that.element.setAttribute('data-label', value);
                result = value;
            }

            that._arrange();
            that._refreshPlaceHolder();
            that._raiseEvent('0'); // 'change' event
            return result;
        },

        focus: function () {
            this.textarea.focus();
        },

        // selects all text in the textarea
        selectAll: function () {
            var textbox = this.textarea;
            if (textbox[0] instanceof HTMLInputElement === false) {
                textbox = $(this.textarea)[0];
            }

            setTimeout(function () {
                if ('selectionStart' in textbox) {
                    textbox.focus();
                    textbox.setSelectionRange(0, textbox.value.length);
                } else {
                    var range = textbox.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', textbox.value.length);
                    range.moveStart('character', 0);
                    range.select();
                }
            }, 10);
        },

        _arrangeScrollbars: function (scrollSize) {
            var that = this;
            var width = that._width(that.element);
            var height = that._height(that.element);

            var vScrollBar = that.vScrollBar,
                vScrollBarElement = vScrollBar[0];
            var vscrollVisible = vScrollBarElement.style.visibility !== 'hidden';

            var borderSize = 2;
            var scrollBorderSize = 2;

            vScrollBar.jqxScrollBar({ width: scrollSize, height: parseInt(height, 10) - borderSize });
            vScrollBarElement.style.left = (width - scrollSize - borderSize - scrollBorderSize) + 'px';
            vScrollBarElement.style.top = '0px';
            var textareaWidth = that._width(that.element) - that.vScrollBar.outerWidth();
            if (that.rtl) {
                vScrollBarElement.style.left = '0px';
                var leftPadding = vscrollVisible ? (parseInt(scrollSize, 10) + 3) + 'px' : 0;
                that.textarea.style.paddingLeft = that._toPx(leftPadding);
                that.textarea.style.width = that._toPx(textareaWidth - 4);
            } else {
                if (vScrollBar.css('visibility') !== 'hidden') {
                    that.textarea.style.width = this._toPx(textareaWidth - that._textareaWidthFix);
                }
            }

            vScrollBar.jqxScrollBar('refresh');
        },

        // destroys the widget
        destroy: function () {
            var that = this;

            that._popupHelper.remove();

            that.vScrollBar.jqxScrollBar('destroy');

            that._removeHandlers();
            that.host.remove();
        },


        propertiesChangedHandler: function (object, oldValues, newValues) {
            if (newValues && newValues.width && newValues.height && Object.keys(newValues).length == 2) {
                object.element.style.width = object._toPx(object.width);
                object.element.style.height = object._toPx(object.height);
                object._arrange();
            }
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (object.isInitialized === undefined || object.isInitialized === false) {
                return;
            }

            if (object.batchUpdate && object.batchUpdate.width && object.batchUpdate.height && Object.keys(object.batchUpdate).length == 2) {
                return;
            }

            if (value !== oldvalue) {
                switch (key) {
                    case 'theme':
                        object.vScrollBar.jqxScrollBar({ theme: object.theme });
                        break;
                    case 'width':
                    case 'height':
                        object.element.style[key] = object._toPx(value);
                        object._arrange();
                        break;
                    case 'source':
                        object._oldsource = value;
                        object._updateSource();
                        break;
                    case 'displayMember':
                    case 'valueMember':
                        object.source = object._oldsource;
                        object._updateSource();
                        break;
                    case 'opened':
                        if (value === true) {
                            object.open();
                        } else {
                            object.close();
                        }
                        break;
                    case 'maxLength':
                        object.textarea.setAttribute('maxlength', value);
                        break;
                    case 'placeHolder':
                        object.textarea.setAttribute('placeholder', value);

                        if ($.jqx.browser.msie && $.jqx.browser.version < 10 && object.textarea.value === oldvalue) {
                            object.textarea.value = value;
                        }
                        break;
                    case 'scrollBarSize':
                        object._arrange();
                        break;
                    case 'dropDownWidth':
                        object.$popup.style.width = object._toPx(value);
                        break;
                    case 'roundedCorners':
                        if (value === true) {
                            object.element.className += ' ' + object.toThemeProperty('jqx-rc-all');
                            object.$popup.className += ' ' + object.toThemeProperty('jqx-rc-all');
                        } else {
                            object.host.removeClass(object.toThemeProperty('jqx-rc-all'));
                            object._popupHelper.removeClass(object.toThemeProperty('jqx-rc-all'));
                        }
                        break;
                    case 'disabled':
                        object.vScrollBar.jqxScrollBar({ disabled: value });

                        if (value === true) {
                            object.element.className += ' ' + object.toThemeProperty('jqx-fill-state-disabled');
                            object.textarea.setAttribute('disabled', 'disabled');
                        } else {
                            object.host.removeClass(object.toThemeProperty('jqx-fill-state-disabled'));
                            object.textarea.removeAttribute('disabled');
                        }
                        $.jqx.aria(object, 'aria-disabled', value);
                        break;
                    case 'rtl':
                        if (value === true) {
                            object.textarea.className += ' ' + object.toThemeProperty('jqx-text-area-element-rtl');
                        } else {
                            $(object.textarea).removeClass(object.toThemeProperty('jqx-text-area-element-rtl'));
                        }
                        object._arrange();
                        break;
                    default:
                        object.refresh();
                        break;
                }
            }
        },

        // raises an event
        _raiseEvent: function (id, arg) {
            var that = this;

            if (arg === undefined) {
                arg = { owner: null };
            }

            var evt = that.events[id];
            arg.owner = that;

            var event = new $.Event(evt);
            event.owner = that;
            if (id == 0) {
                arg.type = this.changeType;
                this.changeType = null;
            }
            event.args = arg;
            if (event.preventDefault) {
                event.preventDefault();
            }

            var element;
            if (evt === 'change' || that._baseHost[0].tagName.toLowerCase() === 'div') {
                element = that.host;
            } else {
                element = that._baseHost;
            }

            var result = element.trigger(event);
            return result;
        },

        // adds event handlers
        _addHandlers: function () {
            var that = this,
            id = that.element.id,
            host = that.host,
            area = that.textarea;

            var wheelEventName = $.jqx.browser.mozilla ? 'wheel' : 'mousewheel';
            that.addHandler(host, wheelEventName + '.jqxTextArea' + id, function (event) {
                that.wheel(event, that);
            });
            that.addHandler(host, 'mouseenter.jqxTextArea' + id, function () {
                that.focused = true;
            });
            that.addHandler(host, 'mouseleave.jqxTextArea' + id, function () {
                that.focused = false;
            });
            that.addHandler(host, 'focus.jqxTextArea' + id, function () {
                that.focused = true;
            });
            that.addHandler(host, 'blur.jqxTextArea' + id, function () {
                that.focused = false;
            });

            // wrapper
            that.addHandler(that.wrapper, 'scroll.jqxTextArea' + id, function () {
                if (that.wrapper.scrollTop !== 0) {
                    that.wrapper.scrollTop = 0;
                }

                if (that.wrapper.scrollLeft !== 0) {
                    that.wrapper.scrollLeft = 0;
                }
            });

            // textarea
            that.addHandler(area, 'change.jqxTextArea' + id, function (event) {
                event.stopPropagation();
                event.preventDefault();
                that._arrange();
                that._refreshPlaceHolder();
                that._raiseEvent('0'); // 'change' event
            });
            that.addHandler(area, 'select.jqxTextArea' + id, function (event) {
                event.stopPropagation();
                event.preventDefault();
            });
            that.addHandler(area, 'scroll.jqxTextArea' + id, function () {
                var scrollMax = Math.max(0, area.scrollHeight - that._height(area));
                that.vScrollBar.jqxScrollBar({
                    max: scrollMax,
                    value: area.scrollTop
                });
            });
            that.addHandler(area, 'focus.jqxTextArea' + id, function () {
                that.element.className += ' ' + that.toThemeProperty('jqx-fill-state-focus');

                if ($.jqx.browser.msie && $.jqx.browser.version < 10 && area.value === that.placeHolder) {
                    area.value = '';
                }
            });
            that.addHandler(area, 'blur.jqxTextArea' + id, function () {
                that.host.removeClass(that.toThemeProperty('jqx-fill-state-focus'));

                if ($.jqx.browser.msie && $.jqx.browser.version < 10) {
                    var currentValue = that.textarea.value;
                    if (currentValue === '') {
                        that.textarea.value = that.placeHolder;
                    } else if (that.maxLength !== null && currentValue.length > that.maxLength) {
                        that.textarea.value = currentValue.substr(0, that.maxLength);
                    }
                }
            });
            that.addHandler(area, 'keydown.jqxTextArea' + id, function (event) {
                that._suppressKeyPressRepeat = ~$.inArray(event.keyCode, [40, 38, 9, 13, 27]);
                that.changeType = 'keyboard';
                that._move(event);
            });
            that.addHandler(area, 'keypress.jqxTextArea' + id, function (event) {
                if (that.maxLength !== null && $.jqx.browser.msie && $.jqx.browser.version < 10 && area.value.length > that.maxLength) {
                    return false;
                }

                if (that._suppressKeyPressRepeat) {
                    return;
                }
                that._move(event);
            });
            that.addHandler(area, 'keyup.jqxTextArea' + id, function (event) {
                switch (event.keyCode) {
                    case 40: // down arrow
                    case 38: // up arrow
                    case 16: // shift
                    case 17: // ctrl
                    case 18: // alt
                        break;
                    case 9: // tab
                    case 13: // enter
                        if (!that.opened) {
                            return;
                        }
                        that._select();
                        break;
                    case 27: // escape
                        if (!that.opened) {
                            return;
                        }
                        that.close();
                        break;
                    default:
                        if (that.timer) {
                            clearTimeout(that.timer);
                        }
                        that.timer = setTimeout(function () {
                            that._suggest();
                        }, 300);
                }

                event.preventDefault();
                that._arrange();
            });

            // scrollbar
            that.addHandler(that.vScrollBar, 'valueChanged.jqxTextArea' + id, function (event) {
                area.scrollTop = event.currentValue;
            });

            // pop-up
            that.addHandler(that.$popup, 'mousedown.jqxTextArea' + id, function (event) {
                event.stopPropagation();
                event.preventDefault();
                that.changeType = 'mouse';
                that._select();
            });
        },

        _refreshPlaceHolder: function () {
            var that = this;

            if (!that.isMaterialized() || !that.hint) {
                if ('placeholder' in this.textarea && !($.jqx.browser.msie && $.jqx.browser.version < 9)) {
                    that.textarea.setAttribute('placeHolder', that.placeHolder);
                } else {
                    if (that.textarea.value === '') {
                        that.textarea.value = that.placeHolder;
                    }
                }
            }

            if (that.hint) {
                if (that.textarea.value !== "") {
                    that.element.setAttribute("hint", true);
                }
                else {
                    that.element.removeAttribute("hint");
                }

                if (that.label) {
                    that.label.innerHTML = that.placeHolder;
                }
            }
        },


        // removes event handlers
        _removeHandlers: function () {
            var that = this,
            id = that.element.id,
            host = that.host,
            area = that.textarea;

            $.jqx.utilities.resize(that._baseHost, null, true);
            that.removeHandler(host, 'mousewheel.jqxTextArea' + id);
            that.removeHandler(host, 'mouseenter.jqxTextArea' + id);
            that.removeHandler(host, 'mouseleave.jqxTextArea' + id);
            that.removeHandler(host, 'focus.jqxTextArea' + id);
            that.removeHandler(host, 'blur.jqxTextArea' + id);

            that.removeHandler(that.wrapper, 'scroll.jqxTextArea' + id);

            that.removeHandler(area, 'change.jqxTextArea' + id);
            that.removeHandler(area, 'select.jqxTextArea' + id);
            that.removeHandler(area, 'scroll.jqxTextArea' + id);
            that.removeHandler(area, 'focus.jqxTextArea' + id);
            that.removeHandler(area, 'blur.jqxTextArea' + id);
            that.removeHandler(area, 'keydown.jqxTextArea' + id);
            that.removeHandler(area, 'keypress.jqxTextArea' + id);
            that.removeHandler(area, 'keyup.jqxTextArea' + id);

            that.removeHandler(that.vScrollBar, 'valueChanged.jqxTextArea' + id);

            that.removeHandler(that.$popup, 'mousedown.jqxTextArea' + id);
        },

        _itemHandler: function (e) {
            $(this._find('jqx-fill-state-pressed', this._popupHelper)).removeClass(this.toThemeProperty('jqx-fill-state-pressed'));
            e.currentTarget.className += ' ' + this.toThemeProperty('jqx-fill-state-pressed');
        },

        // performs mouse wheel.
        wheel: function (event, that) {
            var delta = 0;
            // fix for IE8 and IE7
            if (event.originalEvent && $.jqx.browser.msie && event.originalEvent.wheelDelta) {
                delta = event.originalEvent.wheelDelta / 120;
            }

            if (!event) /* For IE. */ {
                event = window.event;
            }
            if (event.wheelDelta) { /* IE/Opera. */
                delta = event.wheelDelta / 120;
            } else if (event.detail) { /** Mozilla case. */
                delta = -event.detail / 3;
            } else if (event.originalEvent.wheelDelta) {
                delta = event.originalEvent.wheelDelta / 120;
            } else if (event.originalEvent.detail) {
                delta = -event.originalEvent.detail / 3;
            } else if (event.originalEvent.deltaY) { /* Firefox */
                delta = -event.originalEvent.deltaY / 3;
            }

            if (delta) {
                var result = that._handleDelta(delta);

                if (!result) {
                    if (event.preventDefault) {
                        event.preventDefault();
                    }
                }

                if (!result) {
                    return result;
                } else {
                    return false;
                }
            }

            if (event.preventDefault) {
                event.preventDefault();
            }

            event.returnValue = false;
        },

        _handleDelta: function (delta) {
            var that = this,
                inst = that.vScrollBar.jqxScrollBar('getInstance');

            if (that.focused) {
                var oldvalue = inst.value;
                if (delta < 0) {
                    that.scrollDown();
                } else {
                    that.scrollUp();
                }

                var newvalue = inst.value;
                if (oldvalue !== newvalue) {
                    return false;
                }
            }

            return true;
        },

        // scrolls down.
        scrollDown: function () {
            var that = this;

            if (that.vScrollBar.css('visibility') === 'hidden') {
                return false;
            }

            var inst = that.vScrollBar.jqxScrollBar('getInstance');

            var newPosition = Math.min(inst.value + inst.largestep, inst.max);
            inst.setPosition(newPosition);
            that._arrange();

            return true;
        },

        // scrolls up.
        scrollUp: function () {
            var that = this;

            if (that.vScrollBar.css('visibility') === 'hidden') {
                return false;
            }

            var inst = that.vScrollBar.jqxScrollBar('getInstance');

            var newPosition = Math.max(inst.value - inst.largestep, inst.min);
            inst.setPosition(newPosition);
            that._arrange();

            return true;
        },

        // sets the width and height of the widget
        _setSize: function () {
            var that = this;
            that.element.style.width = that._toPx(that.width);
            that.element.style.height = that._toPx(that.height);
        },

        // adds necessary classes to the widget
        _addClasses: function () {
            var that = this,
                classToApply = 'jqx-panel jqx-widget jqx-widget-content jqx-text-area';

            that.textarea.className += ' ' + that.toThemeProperty('jqx-widget jqx-widget-content');

            if (that.roundedCorners === true) {
                classToApply += ' jqx-rc-all';
            }

            if (that.disabled === true) {
                classToApply += ' jqx-fill-state-disabled';
                that.textarea.setAttribute('disabled', 'disabled');
                $.jqx.aria(that, 'aria-disabled', true);
            } else {
                $.jqx.aria(that, 'aria-disabled', false);
            }

            if (that.rtl === true) {
                that.textarea.className += ' ' + that.toThemeProperty('jqx-text-area-element-rtl');
            }

            that.element.className += ' ' + that.toThemeProperty(classToApply);
        },

        // adds necessary classes to the pop-up
        _addPopupClasses: function () {
            var that = this,
                classToApply = 'jqx-popup jqx-input-popup jqx-menu jqx-menu-vertical jqx-menu-dropdown jqx-widget jqx-widget-content';

            if ($.jqx.browser.msie) {
                classToApply += ' jqx-noshadow';
            }
            if (that.roundedCorners) {
                classToApply += ' jqx-rc-all';
            }
            that.$popup.className += ' ' + that.toThemeProperty(classToApply);
        },

        _updateSource: function () {
            var that = this;

            var mapItem = function (item) {
                if (item === undefined) {
                    return null;
                }

                if (typeof item === 'string' || item instanceof String) {
                    return { label: item, value: item };
                }

                if (typeof item !== 'string' && item instanceof String === false) {
                    var label = '';
                    var value = '';

                    if (that.displayMember !== '' && that.displayMember !== undefined) {
                        if (item[that.displayMember]) {
                            label = item[that.displayMember];
                        }
                    }

                    if (that.valueMember !== '' && that.valueMember !== undefined) {
                        value = item[that.valueMember];
                    }

                    if (label === '') {
                        label = item.label;
                    }
                    if (value === '') {
                        value = item.value;
                    }

                    return { label: label, value: value };
                }

                return item;
            };

            var mapItems = function (source) {
                var items = [];
                for (var i = 0; i < source.length; i++) {
                    items[i] = mapItem(source[i]);
                }
                return items;
            };

            if (this.source && this.source._source) {
                this.adapter = this.source;
                if (this.adapter._source.localdata != null) {
                    this.adapter.unbindBindingUpdate(this.element.id);
                    this.adapter.bindBindingUpdate(this.element.id, function () {
                        that.source = mapItems(that.adapter.records);
                    });
                }
                else {
                    var postdata = {};
                    if (this.adapter._options.data) {
                        $.extend(that.adapter._options.data, postdata);
                    }
                    else {
                        if (this.source._source.data) {
                            $.extend(postdata, this.source._source.data);
                        }
                        this.adapter._options.data = postdata;
                    }
                    this.adapter.unbindDownloadComplete(this.element.id);
                    this.adapter.bindDownloadComplete(this.element.id, function () {
                        that.source = mapItems(that.adapter.records);
                    });
                }
                this.source.dataBind();
                return;
            }

            if (!$.isFunction(this.source)) {
                this.source = mapItems(this.source);
            }
        },

        // shows the pop-up
        open: function () {
            if ($.jqx.isHidden(this.host)) {
                return;
            }

            var position = $.extend({}, this.host.coord(true), {
                height: this.element.offsetHeight
            });

            if (this.$popup.parentNode !== document.body) {
                var popupId = this.element.id + '_popup';
                this.$popup.id = popupId;
                $.jqx.aria(this, 'aria-owns', popupId);
                document.body.appendChild(this.$popup);
            }

            this.$popup.style.position = 'absolute';
            this.$popup.style.zIndex = this.popupZIndex;
            this.$popup.style.top = this._toPx(position.top + position.height);
            this.$popup.style.left = this._toPx(position.left);
            this.$popup.style.display = 'block';

            var height = 0;
            var children = this._popupHelper.children();
            $.each(children, function () {
                height += $(this).outerHeight() + 1;
            });
            this.$popup.style.height = this._toPx(height);

            this.opened = true;
            this._raiseEvent('2', { popup: this.$popup }); // 'open' event
            $.jqx.aria(this, 'aria-expanded', true);
            return this;

        },

        // hides the pop-up
        close: function () {
            this.$popup.style.display = 'none';
            this.opened = false;
            this._raiseEvent('3', { popup: this.$popup }); // 'close' event
            $.jqx.aria(this, 'aria-expanded', false);
            return this;
        },

        _suggest: function () {
            var that = this,
                items;

            that.query = that.textarea.value;

            if (!that.query || that.query.length < that.minLength) {
                return that.opened ? that.close() : that;
            }

            if ($.isFunction(that.source)) {
                items = that.source(that.query, $.proxy(that._load, this));
            } else {
                items = that.source;
            }

            if (items) {
                return that._load(items);
            }

            return that;
        },

        _load: function (items) {
            var that = this;

            items = $.grep(items, function (item) {
                return that.filter(item);
            });

            items = that.sort(items);

            if (!items.length) {
                if (that.opened) {
                    return that.close();
                } else {
                    return that;
                }
            }

            return that._render(items.slice(0, that.items)).open();
        },

        _filter: function (item) {
            var that = this;
            var value = that.query;
            var itemValue = item;
            if (item.label !== undefined) {
                itemValue = item.label;
            } else if (that.displayMember) {
                itemValue = item[that.displayMember];
            }

            switch (that.searchMode) {
                case 'none':
                    break;
                case 'contains':
                    return $.jqx.string.contains(itemValue, value);
                case 'equals':
                    return $.jqx.string.equals(itemValue, value);
                case 'equalsignorecase':
                    return $.jqx.string.equalsIgnoreCase(itemValue, value);
                case 'startswith':
                    return $.jqx.string.startsWith(itemValue, value);
                case 'startswithignorecase':
                    return $.jqx.string.startsWithIgnoreCase(itemValue, value);
                case 'endswith':
                    return $.jqx.string.endsWith(itemValue, value);
                case 'endswithignorecase':
                    return $.jqx.string.endsWithIgnoreCase(itemValue, value);
                default:
                    return $.jqx.string.containsIgnoreCase(itemValue, value);
            }
        },

        _sort: function (items) {
            var that = this,
                bw = [],
                cs = [],
                cis = [];

            for (var i = 0; i < items.length; i++) {
                var item = items[i];

                var itemValue = item;
                if (item.label) {
                    itemValue = item.label;
                } else if (that.displayMember) {
                    itemValue = item[that.displayMember];
                }

                if (itemValue.toString().toLowerCase().indexOf(that.query.toString().toLowerCase()) === 0) {
                    bw.push(item);
                } else if (itemValue.toString().indexOf(that.query) >= 0) {
                    cs.push(item);
                } else if (itemValue.toString().toLowerCase().indexOf(that.query.toString().toLowerCase()) >= 0) {
                    cis.push(item);
                }
            }

            return bw.concat(cs, cis);
        },

        _render: function (originalItems) {
            var that = this,
               popupChildren = that._popupHelper.children();

            if (popupChildren.length > 0) {
                for (var j = 0; j < popupChildren.length; j++) {
                    $(popupChildren[j]).remove();
                }
            }

            var mapItem = function (item, index) {
                var itemValue = item,
                    i = document.createElement('li'),
                    a = document.createElement('a'),
                    dataName, dataValue;
                a.setAttribute('href', '#');
                i.appendChild(a);
                if (item.value !== undefined && item.value !== null) {
                    if (item.label !== undefined && item.label !== null) {
                        dataName = item.label;
                        dataValue = item.value;
                    } else {
                        dataName = item.value;
                        dataValue = item.value;
                    }
                } else if (item.label !== undefined && item.label !== null) {
                    dataName = item.label;
                    dataValue = item.label;
                } else if (that.displayMember !== undefined && that.displayMember !== '') {
                    dataName = item[that.displayMember];
                    dataValue = item[that.valueMember];
                } else {
                    dataName = item;
                    dataValue = item;
                }
                i.setAttribute('data-value', dataValue);
                i.setAttribute('data-name', dataName);

                if (item.label) {
                    itemValue = item.label;
                }
                else if (that.displayMember) {
                    itemValue = item[that.displayMember];
                }

                a.innerHTML = that.highlight(itemValue);
                var plusClass = '';
                if (that.rtl) {
                    plusClass = ' jqx-rtl';
                }
                if (index === 0) {
                    plusClass += ' jqx-fill-state-pressed';
                }
                i.className = that.toThemeProperty('jqx-item jqx-menu-item jqx-rc-all' + plusClass);
                that.$popup.appendChild(i);

                that.addHandler(i, 'mouseenter', function (event) { that._itemHandler(event); });
            };

            var mapItems = function (source) {
                for (var i = 0; i < source.length; i++) {
                    mapItem(source[i], i);
                }
            };

            mapItems(originalItems);

            if (!this.dropDownWidth) {
                this.$popup.style.width = that._toPx(that.element.offsetWidth - 6);
            } else {
                this.$popup.style.width = that._toPx(that.dropDownWidth);
            }

            return this;

        },

        _highlight: function (item) {
            var query = this.query;
            query = query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

            var regex = new RegExp('(' + query + ')', 'ig');
            return item.replace(regex, function ($1, match) {
                return '<b>' + match + '</b>';
            });
        },

        // selects an item from the pop-up
        _select: function () {
            var selectedItem = this._find('jqx-fill-state-pressed', this._popupHelper);
            var val = selectedItem.getAttribute('data-value');
            var label = selectedItem.getAttribute('data-name');
            this.textarea.value = this.renderer(label, this.textarea.value);
            this.selectedItem = { 'label': label, 'value': val };
            this.element.setAttribute('data-value', val);
            this.element.setAttribute('data-label', label);
            this._raiseEvent('1', { 'item': { 'label': label, 'value': val } }); // 'select' event
            this._arrange();
            this.textarea.scrollTop = this.textarea.scrollHeight; // scrolls to the bottom
            this._raiseEvent('0'); // 'change' event
            return this.close();
        },

        _renderer: function (item) {
            return item;
        },

        _move: function (e) {
            var that = this;

            if (!that.opened) {
                return;
            }

            switch (e.keyCode) {
                case 9: // tab
                case 13: // enter
                case 27: // escape
                    e.preventDefault();
                    break;
                case 38: // up arrow
                    if (!e.shiftKey) {
                        e.preventDefault();
                        that._prev();
                    }
                    break;
                case 40: // down arrow
                    if (!e.shiftKey) {
                        e.preventDefault();
                        that._next();
                    }
                    break;
            }

            e.stopPropagation();
        },

        _next: function () {
            var active = this._find('jqx-fill-state-pressed', this._popupHelper),
              next = active.nextSibling;
            $(active).removeClass(this.toThemeProperty('jqx-fill-state-pressed'));
            if (!next) {
                next = this.$popup.firstChild;
            }

            next.className += ' ' + this.toThemeProperty('jqx-fill-state-pressed');
        },

        _prev: function () {
            var active = this._find('jqx-fill-state-pressed', this._popupHelper),
              prev = active.previousSibling;
            $(active).removeClass(this.toThemeProperty('jqx-fill-state-pressed'));
            if (!prev) {
                prev = this.$popup.lastChild;
            }

            prev.className += ' ' + this.toThemeProperty('jqx-fill-state-pressed');
        },

        _toPx: function (value) {
            if (typeof value === 'number') {
                return value + 'px';
            } else {
                return value;
            }
        },

        _find: function (className, parentElement) {
            var children = parentElement.children();
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (child.className.indexOf(className) !== -1) {
                    return child;
                }
            }
        },

        // a replacement of jQuery's .width()
        _width: function (element) {
            var elementHelper = $(element),
                borderLeft = elementHelper.css('border-left-width'),
                borderRight = elementHelper.css('border-right-width'),
                paddingLeft = parseInt(elementHelper.css('padding-left'), 10),
                paddingRight = parseInt(elementHelper.css('padding-right'), 10);

            if (borderLeft.indexOf('px') === -1) {
                borderLeft = 1;
            } else {
                borderLeft = parseInt(borderLeft, 10);
            }
            if (borderRight.indexOf('px') === -1) {
                borderRight = 1;
            } else {
                borderRight = parseInt(borderRight, 10);
            }
            var width = element.offsetWidth - (borderLeft + borderRight + paddingLeft + paddingRight);
            if (width > 0) {
                return width;
            } else {
                return '';
            }
        },

        // a replacement of jQuery's .height()
        _height: function (element) {
            var elementHelper = $(element),
                borderTop = elementHelper.css('border-top-width'),
                borderBottom = elementHelper.css('border-bottom-width'),
                paddingTop = parseInt(elementHelper.css('padding-top'), 10),
                paddingBottom = parseInt(elementHelper.css('padding-bottom'), 10);

            if (borderTop.indexOf('px') === -1) {
                borderTop = 1;
            } else {
                borderTop = parseInt(borderTop, 10);
            }
            if (borderBottom.indexOf('px') === -1) {
                borderBottom = 1;
            } else {
                borderBottom = parseInt(borderBottom, 10);
            }
            var height = element.offsetHeight - (borderTop + borderBottom + paddingTop + paddingBottom);
            if (height > 0) {
                return height;
            } else {
                return '';
            }
        }
    });
})(jqxBaseFramework); //ignore jslint
