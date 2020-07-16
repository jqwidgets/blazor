/* tslint:disable */
/* eslint-disable */
(function ($) {
    'use strict';

    $.jqx.jqxWidget('jqxFormattedInput', '', {});

    $.extend($.jqx._jqxFormattedInput.prototype, {
        defineInstance: function () {
            var settings = {
                // public properties
                width: null,
                height: null,
                radix: 10, // possible values: 2, 8, 10, 16, "binary", "octal", "decimal", "hexadecimal"
                decimalNotation: 'default', // possible values: "default", "exponential"
                value: '0',
                min: '-9223372036854775808', // can be set in binary, octal, decimal or hexadecimal numeral system (has to correspond to the radix property)
                max: '9223372036854775807', // can be set in binary, octal, decimal or hexadecimal numeral system (has to correspond to the radix property)
                upperCase: false,
                spinButtons: true,
                spinButtonsStep: 1, // decimal value
                dropDown: false,
                dropDownWidth: null,
                popupZIndex: 20000,
                placeHolder: '',
                roundedCorners: true,
                disabled: false,
                rtl: false,
                changeType: null,
                template: '',
                hint: true,
                // internal properties
                _opened: false,
                $popup: $('<ul></ul>'),
                item: '<li><a href="#"></a></li>',

                // events
                events: ['open', 'close', 'change', 'radixChange']
            };
            if (this === $.jqx._jqxFormattedInput.prototype) {
                return settings;
            }
            $.extend(true, this, settings);
            return settings;
        },

        createInstance: function () {
            var that = this;

            // enables 64-bit number support
            that._Long();

            that._regex = { 2: new RegExp(/([0-1])/), 8: new RegExp(/([0-7])/), 10: new RegExp(/([0-9\-])/), 16: new RegExp(/([0-9]|[a-f])/i) };

            that.render();
        },

        render: function () {
            var that = this;

            // sets the internal numeric radix based on the radix property
            that._radixNumber = that._getRadix(that.radix);

            if (that.value !== '') {
                // representation of the input value as a 64-bit number
                that._number = new that.longObj.math.Long.fromString((that.value).toString(), that._radixNumber);
            }



            if (this.element instanceof HTMLInputElement) {
                var group = $("<div></div>");
                group.addClass(that.toThemeProperty('jqx-input-group'));
                this.host.after(group);
                var input = this.element;
                var data = this.host.data();

                group.append(input);
                group[0].id = this.element.id;
                this.element.removeAttribute('id');
                this.element.setAttribute("hint", true);
                group[0].style = this.element.style;
                that.input = that.element;
                if (!(this.input instanceof HTMLInputElement)) {
                    this.input = this.host.find('input');
                    if (this.input.length > 0) {
                        this.input = this.input[0];
                    }
                    $(this.input).addClass(this.toThemeProperty("jqx-input-widget"));
                }
                this.element.style = '';
            }

            if (that.baseHost) {
                that.host = that.baseHost;
                that.element = that.host[0]; //.find("input")
            }

            if (this.element.nodeName.toLowerCase() === 'div') {
                this.baseHost = this.element;
                var input = this.host.find('input');
                var hasTextInput = false;
                $.each(input, function () {
                    var type = this.type;
                    if (type === null || type === 'text' || type === 'textarea') {
                        input = $(this);
                        hasTextInput = true;
                        return false;
                    }
                });
                if (!hasTextInput) {
                    throw new Error('jqxFormattedInput: Missing Text Input in the Input Group');
                }

                if (input.length > 0) {
                    this.baseHost = $(this.element);
                    var data = this.host.data();
                    this.host = input;
                    this.element = input[0];
                    this.host.data(data);
                    this.baseHost.addClass(this.toThemeProperty('jqx-widget'));
                    this.baseHost.addClass(this.toThemeProperty('jqx-rc-all'));
                    this.baseHost.addClass(this.toThemeProperty('jqx-input-group'));
                    this.baseHost.addClass(this.toThemeProperty('jqx-formattedinput'));
                    var children = this.baseHost.children();
                    $.each(children, function (index) {
                        $(this).addClass(that.toThemeProperty('jqx-input-group-addon'));
                        $(this).removeClass(that.toThemeProperty('jqx-rc-all'));
                        if (index === 0) {
                            $(this).addClass(that.toThemeProperty('jqx-rc-l'));
                        }
                        if (index === children.length - 1) {
                            $(this).addClass(that.toThemeProperty('jqx-rc-r'));
                        }
                        if (this !== that.element) {
                            $(this).addClass(that.toThemeProperty('jqx-fill-state-normal'));
                        }
                        if (this.nodeName.toLowerCase() === 'div') {

                            that.appendSpinButtons = function (child) {
                                that._spinButtonsContainer = $(child);
                                that._spinButtonsContainer.addClass(that.toThemeProperty('jqx-formatted-input-spin-buttons-container'));
                                // spin buttons
                                var spinButtonString = '<div class="' + that.toThemeProperty('jqx-fill-state-normal jqx-formatted-input-spin-button') + '"><div class="' + that.toThemeProperty('jqx-input-icon') + '"></div></div>';
                                that._upbutton = $(spinButtonString);
                                that._spinButtonsContainer.append(that._upbutton);
                                that._downbutton = $(spinButtonString);
                                that._spinButtonsContainer.append(that._downbutton);
                                // arrows
                                that._upArrow = that._upbutton.find('div');
                                that._upArrow.addClass(that.toThemeProperty('jqx-icon-arrow-up'));
                                that._downArrow = that._downbutton.find('div');
                                that._downArrow.addClass(that.toThemeProperty('jqx-icon-arrow-down'));
                                if (that.template) {
                                    that._upbutton.addClass(that.toThemeProperty('jqx-' + that.template));
                                    that._downbutton.addClass(that.toThemeProperty('jqx-' + that.template));
                                }
                                that._spinButtonsStepLong = new that.longObj.math.Long.fromNumber(that.spinButtonsStep);
                            };

                            var appendAddon = function (child) {
                                that._addon = $(child);
                                that._addon.addClass(that.toThemeProperty('jqx-formatted-input-addon'));
                                if (!that._arrow) {
                                    that._arrow = $('<div class="' + that.toThemeProperty('jqx-icon') + ' ' + that.toThemeProperty('jqx-icon-arrow-down') + '"></div>');
                                    that._arrow.appendTo(that._addon);
                                }
                                if (that.template) {
                                    that._addon.addClass(that.toThemeProperty('jqx-' + that.template));
                                }
                            };

                            if (that.rtl === false) {
                                if (!that._spinButtonsContainer && that.spinButtons === true) { // spin buttons
                                    that.appendSpinButtons(this);
                                } else if (!that._addon && that.dropDown === true && ((index === 2) || (index === 1 && that.spinButtons === false))) { // dropdown arrow
                                    appendAddon(this);
                                }
                            } else {
                                if (!that._addon && that.dropDown === true) { // dropdown arrow
                                    appendAddon(this);
                                    if (that.spinButtons === true) {
                                        that._addon.addClass(that.toThemeProperty('jqx-formatted-input-addon-rtl'));
                                    }
                                } else if (!that._spinButtonsContainer && that.spinButtons === true && ((index === 1) || (index === 0 && that.dropDown === false))) { // spin buttons
                                    that.appendSpinButtons(this);
                                    that._spinButtonsContainer.addClass(that.toThemeProperty('jqx-formatted-input-spin-buttons-container-rtl'));
                                    if (that.dropDown === true) {
                                        that._addon.addClass(that.toThemeProperty('jqx-formatted-input-addon-rtl'));
                                    }
                                }
                            }
                        }
                    });
                }
            }

            that._inputAndAddon = that.host;
            if (that.baseHost) {
                if (that._spinButtonsContainer) {
                    that._inputAndAddon = that._inputAndAddon.add(that._spinButtonsContainer);
                }
                if (that._addon) {
                    that._inputAndAddon = that._inputAndAddon.add(that._addon);
                }
            }

            that.removeHandlers();
            this.addHandlers();
            if (this.rtl) {
                this.host.addClass(this.toThemeProperty('jqx-rtl'));
            }
            this.host.attr('role', 'textbox');
            $.jqx.aria(this, 'aria-autocomplete', 'both');
            $.jqx.aria(this, 'aria-disabled', this.disabled);
            $.jqx.aria(this, 'aria-readonly', false);
            $.jqx.aria(this, 'aria-multiline', false);
            $.jqx.aria(this, 'aria-haspopup', true);

            if (that.value !== '' && that.value !== null) {
                if (that.upperCase === true) {
                    that.host.addClass(that.toThemeProperty('jqx-formatted-input-upper-case'));
                } else {
                    that.host.addClass(that.toThemeProperty('jqx-formatted-input-lower-case'));
                }

                if (that._radixNumber === 10 && that.decimalNotation === 'exponential') {
                    that.element.value = that._getDecimalNotation('exponential');
                } else {
                    that.element.value = that.value;
                }
            } else {
                if (that._spinButtonsContainer) {
                    that._spinButtonsContainer.addClass(that.toThemeProperty('jqx-fill-state-disabled'));
                }
            }

            if (that._radixNumber !== 10 && that.min.toString() === '-9223372036854775808') {
                that._minLong = new that.longObj.math.Long.fromNumber(that.min);
            } else {
                that._setMinMax('min');
            }
            if (that._radixNumber !== 10 && that.max.toString() === '9223372036854775807') {
                that._maxLong = new that.longObj.math.Long.fromNumber(that.max);
            } else {
                that._setMinMax('max');
            }

            this._addBarAndLabel((this.baseHost && $(this.baseHost.children()[this.baseHost.children.length - 1])) || this.host);
            if (that.isMaterialized()) {
                setTimeout(function () {

                    if (that.hint) {
                        that.label[0].innerHTML = that.placeHolder;
                    }

                    if (!that.baseHost) {
                        if (that.element.value.length === 0) {
                            that.element.removeAttribute('hint');
                        }
                        else {
                            that.element.setAttribute('hint', true);
                        }

                        that.bar.css('top', '');

                        return;
                    }

                    if (that.element.value.length === 0) {
                        that.baseHost[0].removeAttribute('hint');
                    }
                    else {
                        that.baseHost[0].setAttribute('hint', true);
                    }
                });
            }
        },

        _refreshClasses: function (add) {
            var func = add ? 'addClass' : 'removeClass';
            this.host[func](this.toThemeProperty('jqx-widget-content'));
            this.host[func](this.toThemeProperty('jqx-input'));
            this.host[func](this.toThemeProperty('jqx-formatted-input'));
            this.host[func](this.toThemeProperty('jqx-widget'));
            this.$popup[func](this.toThemeProperty('jqx-popup'));
            if ($.jqx.browser.msie) {
                this.$popup[func](this.toThemeProperty('jqx-noshadow'));
            }
            this.$popup[func](this.toThemeProperty('jqx-input-popup'));
            this.$popup[func](this.toThemeProperty('jqx-menu'));
            this.$popup[func](this.toThemeProperty('jqx-menu-vertical'));
            this.$popup[func](this.toThemeProperty('jqx-menu-dropdown'));
            this.$popup[func](this.toThemeProperty('jqx-widget'));
            this.$popup[func](this.toThemeProperty('jqx-widget-content'));
            if (this.roundedCorners) {
                this.host[func](this.toThemeProperty('jqx-rc-all'));
                this.$popup[func](this.toThemeProperty('jqx-rc-all'));
                if (this.baseHost) {
                    this.baseHost[func](this.toThemeProperty('jqx-rc-all'));
                    if (this.rtl === false) {
                        this.host[func](this.toThemeProperty('jqx-rc-l'));
                        if (this._addon) {
                            this._addon[func](this.toThemeProperty('jqx-rc-r'));
                        }
                    } else {
                        this.host[func](this.toThemeProperty('jqx-rc-r'));
                        if (this._addon) {
                            this._addon[func](this.toThemeProperty('jqx-rc-l'));
                        }
                    }
                }
            } else {
                this.host.removeClass(this.toThemeProperty('jqx-rc-all'));
                this.$popup.removeClass(this.toThemeProperty('jqx-rc-all'));
                if (this.baseHost) {
                    this.baseHost.removeClass(this.toThemeProperty('jqx-rc-all'));
                    if (this.rtl === false) {
                        this.host.removeClass(this.toThemeProperty('jqx-rc-l'));
                        if (this.dropDown) {
                            this._addon.removeClass(this.toThemeProperty('jqx-rc-r'));
                        } else if (this.spinButtons) {
                            this._spinButtonsContainer.removeClass(this.toThemeProperty('jqx-rc-r'));
                        }
                    } else {
                        this.host.removeClass(this.toThemeProperty('jqx-rc-r'));
                        if (this.dropDown) {
                            this._addon.removeClass(this.toThemeProperty('jqx-rc-l'));
                        } else if (this.spinButtons) {
                            this._spinButtonsContainer.removeClass(this.toThemeProperty('jqx-rc-l'));
                        }
                    }
                }
            }
            if (this.disabled) {
                this.host[func](this.toThemeProperty('jqx-fill-state-disabled'));
                if (this.baseHost) {
                    if (this._spinButtonsContainer) {
                        this._spinButtonsContainer[func](this.toThemeProperty('jqx-fill-state-disabled'));
                    }
                    if (this._addon) {
                        this._addon[func](this.toThemeProperty('jqx-fill-state-disabled'));
                    }
                }
            } else {
                this.host.removeClass(this.toThemeProperty('jqx-fill-state-disabled'));
                if (this.baseHost && this.value !== '' && this.value !== null) {
                    if (this._spinButtonsContainer) {
                        this._spinButtonsContainer.removeClass(this.toThemeProperty('jqx-fill-state-disabled'));
                    }
                    if (this._addon) {
                        this._addon.removeClass(this.toThemeProperty('jqx-fill-state-disabled'));
                    }
                }
            }
        },

        selectAll: function () {
            var textbox = this.host;
            setTimeout(function () {
                if ('selectionStart' in textbox[0]) {
                    textbox[0].focus();
                    textbox[0].setSelectionRange(0, textbox[0].value.length);
                }
                else {
                    var range = textbox[0].createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', textbox[0].value.length);
                    range.moveStart('character', 0);
                    range.select();
                }
            }, 10);
        },

        selectLast: function () {
            var textbox = this.host;
            this.selectStart(textbox[0].value.length);
        },

        selectFirst: function () {
            this.selectStart(0);
        },

        selectStart: function (index) {
            var textbox = this.host;
            setTimeout(function () {
                if ('selectionStart' in textbox[0]) {
                    textbox[0].focus();
                    textbox[0].setSelectionRange(index, index);
                }
                else {
                    var range = textbox[0].createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', index);
                    range.moveStart('character', index);
                    range.select();
                }
            }, 10);
        },

        focus: function () {
            try {
                this.host.focus();
                var that = this;
                setTimeout(function () {
                    that.host.focus();
                }, 25);

            }
            catch (error) {
            }
        },

        refresh: function () {
            var that = this;

            this._refreshClasses(false);
            this._refreshClasses(true);

            if (!this.baseHost) {
                if (this.width) {
                    this.host.width(this.width);
                }
                if (this.height) {
                    this.host.height(this.height);
                }
            }
            else {
                if (this.width) {
                    this.baseHost.width(this.width);
                }
                if (this.height) {
                    this.baseHost.height(this.height);
                    var totalWidth = 0;
                    var height = this.baseHost.height() - 2;
                    if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                        this.baseHost.css('display', 'inline-block');
                    }
                    $.each(this.baseHost.children(), function () {
                        if (this.className.indexOf('jqx-input-bar') >= 0) {
                            return true;
                        }
                        if (this.className.indexOf('jqx-input-label') >= 0) {
                            return true;
                        }

                        $(this).css('height', '100%');
                        if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                            $(this).css('height', height + 'px');
                        }
                        if (this !== that.element) {
                            totalWidth += $(this).outerWidth();
                        }
                    });
                    var pixel = (typeof that.width === 'string' && that.width.charAt(that.width.length - 1) === '%') ? 1 : 0;
                    this.host.css('width', this.baseHost.width() - totalWidth - pixel + 'px');
                    if ($.jqx.browser.msie && $.jqx.browser.version < 9) { // Internet Explorer 7 and 8
                        if (that._spinButtonsContainer) {
                            if (that.rtl === false || that.rtl === true && that._addon) {
                                that._spinButtonsContainer.css('border-left-width', '0');
                            }
                        }

                        if (that._addon) {
                            if (that.rtl === false) {
                                that._addon.css('border-left-width', '0');
                            } else {
                                if (!that._spinButtonsContainer) {
                                    that._addon.css('border-right-width', '0');
                                }
                            }
                        }

                        var heightFix = 0;
                        if ($.jqx.browser.version < 8) { // Internet Explorer 7 only
                            var widthFix = 0;
                            var borderSum = parseInt(that.host.css('border-left-width'), 10) + parseInt(that.host.css('border-right-width'), 10);
                            var paddingSum = parseInt(that.host.css('padding-left'), 10) + parseInt(that.host.css('padding-right'), 10);

                            if (that._spinButtonsContainer) {
                                borderSum += parseInt(that._spinButtonsContainer.css('border-left-width'), 10) + parseInt(that._spinButtonsContainer.css('border-right-width'), 10);
                                paddingSum += parseInt(that._spinButtonsContainer.css('padding-left'), 10) + parseInt(that._spinButtonsContainer.css('padding-right'), 10);
                                if (!that._addon) {
                                    widthFix = 2;
                                }
                            }

                            if (that._addon) {
                                borderSum += parseInt(that._addon.css('border-left-width'), 10) + parseInt(that._addon.css('border-right-width'), 10);
                                paddingSum += parseInt(that._addon.css('padding-left'), 10) + parseInt(that._addon.css('padding-right'), 10);
                                if (!that._spinButtonsContainer) {
                                    widthFix = 2;
                                }
                            }

                            that.host.width(that.host.width() - (paddingSum + borderSum) - widthFix);
                            heightFix = 6;
                        }
                        that.host.height(that.baseHost.height() - (parseInt(that.host.css('border-top-width'), 10) + parseInt(that.host.css('border-bottom-width'), 10) + parseInt(that.host.css('padding-top'), 10) + parseInt(that.host.css('padding-bottom'), 10) + heightFix));
                        var newHeight = that.host.height() + 'px';
                        that.host.css('min-height', newHeight);
                        that.host.css('line-height', newHeight);
                    }
                }

                if (that.baseHost && that.bar) {
                    that.bar.css('top', 1 + that.host.outerHeight());
                }
            }

            this.host.attr('disabled', this.disabled);

            if (!this.host.attr('placeholder')) {
                this._refreshPlaceHolder();
            }
        },

        _refreshPlaceHolder: function () {
            var that = this;

            if (this.isMaterialized() && this.hint) {
                this.label[0].innerHTML = this.placeHolder;
                return;
            }

            if ('placeholder' in this.element) {
                this.host.attr('placeHolder', this.placeHolder);
            }
            else {
                var that = this;
                if (this.element.value === '') {
                    this.element.value = this.placeHolder;

                    this.host.focus(function () {
                        if (that.element.value === that.placeHolder) {
                            that.element.value = '';
                        }
                    });

                    this.host.blur(function () {
                        if (that.element.value === '' || that.element.value === that.placeHolder) {
                            that.element.value = that.placeHolder;
                        }
                    });
                }
            }
        },

        destroy: function () {
            this.removeHandlers();
            if (this.baseHost) {
                $.jqx.utilities.resize(this.baseHost, null, true);
                this.baseHost.remove();
            } else {
                $.jqx.utilities.resize(this.host, null, true);
                this.host.remove();
            }
            if (this.$popup) {
                this.$popup.remove();
            }
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (key === 'placeHolder') {
                object._refreshPlaceHolder();
                return;
            }

            if (key == 'template') {
                if (object.template) {
                    object._upbutton.removeClass(object.toThemeProperty('jqx-' + oldvalue));
                    object._downbutton.removeClass(object.toThemeProperty('jqx-' + oldvalue));
                    object._addon.removeClass(object.toThemeProperty('jqx-' + oldvalue));
                    object._upbutton.addClass(object.toThemeProperty('jqx-' + object.template));
                    object._downbutton.addClass(object.toThemeProperty('jqx-' + object.template));
                    object._addon.addClass(object.toThemeProperty('jqx-' + object.template));
                }
            }

            if (key === 'theme') {
                $.jqx.utilities.setTheme(oldvalue, value, object.host);
                return;
            }

            if (key === 'disabled') {
                $.jqx.aria(object, 'aria-disabled', object.disabled);
            }

            if (key === 'value' && oldvalue.toString().toUpperCase() !== value.toString().toUpperCase()) {
                object.val(value);
                return;
            }

            if (oldvalue !== value && key === 'radix') {
                object._changeRadix(value);
                return;
            }

            if (oldvalue !== value && key === 'decimalNotation' && object._radixNumber === 10) {
                if (value === 'exponential') {
                    object.element.value = object._getDecimalNotation('exponential');
                } else {
                    object.element.value = object._number.toString(10);
                }
            }

            if (oldvalue !== value && (key === 'min' || key === 'max')) {
                object._setMinMax(key);
                object._validateValue(object.value, true);
                object.value = object.element.value;
                return;
            }

            if (oldvalue !== value && (key === 'upperCase') && object.element.value !== '') {
                if (value === true) {
                    object.host.removeClass(object.toThemeProperty('jqx-formatted-input-lower-case'));
                    object.host.addClass(object.toThemeProperty('jqx-formatted-input-upper-case'));
                } else {
                    object.host.removeClass(object.toThemeProperty('jqx-formatted-input-upper-case'));
                    object.host.addClass(object.toThemeProperty('jqx-formatted-input-lower-case'));
                }
                return;
            }

            function showOrHideAddon(addon, value) {
                var inputWidth = object.host.width();
                var addonWidth = addon.outerWidth();
                if (value === false) {
                    object.host.width(inputWidth + addonWidth);
                    addon.hide();
                    if (object.rtl === true) {
                        if (object.spinButtons === true) {
                            object._spinButtonsContainer.addClass(object.toThemeProperty('jqx-formatted-input-spin-buttons-container-rtl-border'));
                        }
                        if (object.dropDown === true) {
                            object._addon.removeClass(object.toThemeProperty('jqx-formatted-input-addon-rtl'));
                        }
                    }
                } else {
                    object.host.width(inputWidth - addonWidth);
                    addon.show();
                    if (object.rtl === true && object.spinButtons === true && object.dropDown === true) {
                        object._spinButtonsContainer.removeClass(object.toThemeProperty('jqx-formatted-input-spin-buttons-container-rtl-border'));
                        object._addon.addClass(object.toThemeProperty('jqx-formatted-input-addon-rtl'));
                    }
                }
            }

            function appendAddon(addon, value) {
                if (value === true) {
                    var newAddon = $('<div></div>');
                    if (object.baseHost) { // the initialization element is a div
                        var currentAddon = object.baseHost.children('div');
                        if ((object.rtl === false && addon === 'spinButtons') || (object.rtl === true && addon === 'dropDown')) {
                            currentAddon.before(newAddon);
                        } else {
                            currentAddon.after(newAddon);
                        }
                        object.render();
                        object.host.width(object.host.width() - newAddon.outerWidth());

                    } else { // the initialization element is an input
                        var id = object.element.id;
                        object.host.removeAttr('id');
                        object.host.wrap('<div id="' + id + '" style="display: inline-block;"></div>');
                        var wrapper = $('#' + id);
                        if (object.rtl === false) {
                            wrapper.append(newAddon);
                        } else {
                            wrapper.prepend(newAddon);
                        }
                        var hostData = object.host.data();
                        hostData.jqxFormattedInput.host = wrapper;
                        hostData.jqxFormattedInput.element = wrapper[0];
                        object.baseHost = wrapper;
                        object.baseHost.data(hostData);
                        object.render();
                        object.refresh();
                    }
                }
            }

            if (key === 'spinButtons') {
                if (oldvalue !== value) {
                    if (object._spinButtonsContainer) { // spin buttons are present in the DOM
                        showOrHideAddon(object._spinButtonsContainer, value);
                    } else { // spin buttons are not present in the DOM
                        appendAddon('spinButtons', value);
                    }
                    return;
                } else {
                    return;
                }
            }

            if (oldvalue !== value && key === 'spinButtonsStep') {
                object._spinButtonsStepLong = new object.longObj.math.Long.fromNumber(value);
            }

            if (key === 'dropDown') {
                if (oldvalue !== value) {
                    if (object._addon) { // dropdown button is present in the DOM
                        showOrHideAddon(object._addon, value);
                    } else { // dropdown button is not present in the DOM
                        appendAddon('dropDown', value);
                    }
                    return;
                } else {
                    return;
                }
            }

            object.refresh();
        },

        select: function (event, ui, radix) {
            var that = this;

            if (!radix) {
                radix = that.$popup.find('.jqx-fill-state-pressed').attr('data-value');
            }

            that._changeRadix(parseInt(radix, 10));
            that._setMaxLength(true);
            that.close();
        },

        val: function (value) {
            var that = this;

            if ((value || value === '') && !(typeof value === 'object' && $.isEmptyObject(value) === true) && value !== 'binary' && value !== 'octal' && value !== 'decimal' && value !== 'exponential' && value !== 'scientific' && value !== 'engineering' && value !== 'hexadecimal') {
                value = value.toString();
                if (value.toUpperCase() !== that.element.value.toString().toUpperCase()) {
                    var oldValue = that.element.value;
                    if (that.upperCase === true) {
                        value = value.toUpperCase();
                    }
                    var arrayValue = value.split('');
                    for (var i = 0; i < arrayValue.length; i++) {
                        // validates the input value
                        if (!that._regex['' + that._radixNumber + ''].test(arrayValue[i])) {
                            return;
                        }
                    }
                    var newValue = that._validateValue(value, true);
                    that._raiseEvent('2', { 'value': newValue, 'oldValue': oldValue, 'radix': that._radixNumber }); // change event
                    that.value = newValue;
                    return newValue;
                } else {
                    return value;
                }
            } else {
                if (value && !(typeof value === 'object' && $.isEmptyObject(value) === true)) {
                    if (value === 'exponential' || value === 'scientific' || value === 'engineering') {
                        return that._getDecimalNotation(value);
                    } else {
                        var radix = that._getRadix(value);
                        return that._number.toString(radix);
                    }
                } else {
                    return that.element.value;
                }
            }
        },

        // changes the radix (numeral system)
        _changeRadix: function (radix) {
            var that = this;

            var newRadix = that._getRadix(radix);
            var newValue = that.value !== '' ? that._number.toString(newRadix) : '';
            var oldRadix = that.radix;
            var oldValue = that.value;

            that.radix = radix;
            that._radixNumber = newRadix;

            that.element.value = newValue;
            that.value = newValue;

            this._raiseEvent('3', { 'radix': radix, 'oldRadix': oldRadix, 'value': newValue, 'oldValue': oldValue }); // radixChange event
        },

        _raiseEvent: function (id, arg) {
            if (arg === undefined) {
                arg = { owner: null };
            }

            var evt = this.events[id];
            arg.owner = this;

            var event = new $.Event(evt);
            event.owner = this;
            if (id == 2) {
                arg.type = this.changeType;
                this.changeType = null;
            }
            event.args = arg;
            if (event.preventDefault) {
                event.preventDefault();
            }

            var result;
            if (this.baseHost) {
                result = this.baseHost.trigger(event);
            } else {
                result = this.host.trigger(event);
            }
            return result;
        },

        open: function () {
            var that = this;

            that._setPopupOptions();
            that._render(that._popupOptions);

            if ($.jqx.isHidden(this.host)) {
                return;
            }

            var position;
            if (that.baseHost) {
                position = $.extend({}, that.baseHost.coord(true), {
                    height: that.baseHost[0].offsetHeight
                });
            } else {
                position = $.extend({}, that.host.coord(true), {
                    height: that.host[0].offsetHeight
                });
            }

            if (this.$popup.parent().length === 0) {
                var popupId = this.element.id + '_' + 'popup';
                this.$popup[0].id = popupId;
                $.jqx.aria(this, 'aria-owns', popupId);
            }

            this.$popup
            .appendTo($(document.body))
            .css({ position: 'absolute', zIndex: this.popupZIndex, top: position.top + position.height, left: position.left })
            .show();
            var height = 0;
            var children = this.$popup.children();
            $.each(children, function () {
                height += $(this).outerHeight(true) - 1;
            });
            this.$popup.height(height);

            this._opened = true;
            if (that.baseHost) {
                that._addon.addClass(that.toThemeProperty('jqx-fill-state-pressed jqx-combobox-arrow-selected'));
                that._arrow.addClass(that.toThemeProperty('jqx-icon-arrow-down-selected'));
            }
            this._raiseEvent('0', { popup: this.$popup }); // open event
            $.jqx.aria(this, 'aria-expanded', true);
            return this;
        },

        close: function () {
            var that = this;

            this.$popup.hide();
            this._opened = false;
            if (that.baseHost) {
                that._addon.removeClass(that.toThemeProperty('jqx-fill-state-pressed jqx-combobox-arrow-selected'));
                that._arrow.removeClass(that.toThemeProperty('jqx-icon-arrow-down-selected'));
            }
            this._raiseEvent('1', { popup: this.$popup }); // close event
            $.jqx.aria(this, 'aria-expanded', false);
            return this;
        },

        _render: function (items) {
            var that = this;

            items = $(items).map(function (i, item) {
                var itemValue = item;
                var currentRadix;
                switch (i) {
                    case 0:
                        currentRadix = 2;
                        break;
                    case 1:
                        currentRadix = 8;
                        break;
                    case 2:
                        currentRadix = 10;
                        break;
                    case 3:
                        currentRadix = 16;
                        break;
                }
                i = $(that.item).attr('data-value', currentRadix);
                i.find('a').html(itemValue).attr('data-value', currentRadix);

                var rtlClass = '';
                if (that.rtl) {
                    rtlClass = ' ' + that.toThemeProperty('jqx-rtl') + ' ' + that.toThemeProperty('jqx-formatted-input-item-rtl');
                }
                i[0].className = that.toThemeProperty('jqx-item') + ' ' + that.toThemeProperty('jqx-menu-item') + ' ' + that.toThemeProperty('jqx-formatted-input-item') + ' ' + that.toThemeProperty('jqx-rc-all') + rtlClass;
                return i[0];
            });

            var selectedIndex;

            switch (that._radixNumber) {
                case 2:
                    selectedIndex = 0;
                    break;
                case 8:
                    selectedIndex = 1;
                    break;
                case 10:
                    selectedIndex = 2;
                    break;
                case 16:
                    selectedIndex = 3;
                    break;
            }

            // adds a pressed effect to the selected numeral system option
            items.eq(selectedIndex).addClass(this.toThemeProperty('jqx-fill-state-pressed'));
            this.$popup.html(items);
            if (!this.dropDownWidth) {
                if (that.baseHost) {
                    var pixel = (typeof that.width === 'string' && that.width.charAt(that.width.length - 1) === '%') ? 1 : 0;
                    this.$popup.width(this.baseHost.outerWidth() - 6 - pixel);
                } else {
                    this.$popup.width(this.host.outerWidth() - 6);
                }
            }
            else {
                this.$popup.width(this.dropDownWidth);
            }

            return this;
        },

        next: function () {
            var active = this.$popup.find('.jqx-fill-state-pressed').removeClass(this.toThemeProperty('jqx-fill-state-pressed')),
                next = active.next();

            if (!next.length) {
                next = $(this.$popup.find('li')[0]);
            }

            next.addClass(this.toThemeProperty('jqx-fill-state-pressed'));
        },

        prev: function () {
            var active = this.$popup.find('.jqx-fill-state-pressed').removeClass(this.toThemeProperty('jqx-fill-state-pressed')),
                prev = active.prev();

            if (!prev.length) {
                prev = this.$popup.find('li').last();
            }

            prev.addClass(this.toThemeProperty('jqx-fill-state-pressed'));
        },

        addHandlers: function () {
            var that = this;

            this.addHandler(this.host, 'focus', $.proxy(this.onFocus, this));
            this.addHandler(this.host, 'blur', $.proxy(this.onBlur, this));
            this.addHandler(this.host, 'keypress', $.proxy(this.keypress, this));
            this.addHandler(this.host, 'keyup', $.proxy(this.keyup, this));
            this.addHandler(this.host, 'keydown', $.proxy(this.keydown, this));
            this.addHandler(this.$popup, 'mousedown', $.proxy(this.click, this));
            if (this.host.on) {
                this.$popup.on('mouseenter', 'li', $.proxy(this.mouseenter, this));
            }
            else {
                this.$popup.bind('mouseenter', 'li', $.proxy(this.mouseenter, this));
            }
            this.addHandler(this.host, 'change', function (e) {
                e.stopPropagation();
                e.preventDefault();
            });

            if (that.baseHost) {
                var id = that.baseHost.attr('id');

                // spin buttons handlers
                if (that._spinButtonsContainer) {
                    var buttons = that._upbutton.add(that._downbutton);

                    that.addHandler(that._upbutton, 'mousedown.jqxFormattedInputSpinButtonUp' + id, function () {
                        if (!that.disabled && that.value !== '' && that.value !== null) {
                            that._upbutton.addClass(that.toThemeProperty('jqx-fill-state-pressed'));
                            that.changeType = 'mouse';
                            that._incrementOrDecrement('add');
                        }
                    });

                    that.addHandler(that._upbutton, 'mouseup.jqxFormattedInputSpinButtonUp' + id, function () {
                        if (!that.disabled && that.value !== '' && that.value !== null) {
                            that._upbutton.removeClass(that.toThemeProperty('jqx-fill-state-pressed'));
                        }
                    });

                    that.addHandler(that._downbutton, 'mousedown.jqxFormattedInputSpinButtonDown' + id, function () {
                        if (!that.disabled && that.value !== '' && that.value !== null) {
                            that.changeType = 'mouse';
                            that._downbutton.addClass(that.toThemeProperty('jqx-fill-state-pressed'));
                            that._incrementOrDecrement('subtract');
                        }
                    });

                    that.addHandler(that._downbutton, 'mouseup.jqxFormattedInputSpinButtonDown' + id, function () {
                        if (!that.disabled && that.value !== '' && that.value !== null) {
                            that._downbutton.removeClass(that.toThemeProperty('jqx-fill-state-pressed'));
                        }
                    });

                    that.addHandler(buttons, 'mouseenter.jqxFormattedInputSpinButtons' + id, function (e) {
                        if (!that.disabled && that.value !== '' && that.value !== null) {
                            var target = $(e.target);
                            if (target.hasClass('jqx-icon-arrow-up') || target.children().hasClass('jqx-icon-arrow-up')) {
                                that._upbutton.addClass(that.toThemeProperty('jqx-fill-state-hover'));
                                that._upArrow.addClass(that.toThemeProperty('jqx-icon-arrow-up-hover'));
                            } else {
                                that._downbutton.addClass(that.toThemeProperty('jqx-fill-state-hover'));
                                that._downArrow.addClass(that.toThemeProperty('jqx-icon-arrow-down-hover'));
                            }
                        }
                    });
                    that.addHandler(buttons, 'mouseleave.jqxFormattedInputSpinButtons' + id, function (e) {
                        if (!that.disabled && that.value !== '' && that.value !== null) {
                            var target = $(e.target);
                            if (target.hasClass('jqx-icon-arrow-up') || target.children().hasClass('jqx-icon-arrow-up')) {
                                that._upbutton.removeClass(that.toThemeProperty('jqx-fill-state-hover'));
                                that._upArrow.removeClass(that.toThemeProperty('jqx-icon-arrow-up-hover'));
                            } else {
                                that._downbutton.removeClass(that.toThemeProperty('jqx-fill-state-hover'));
                                that._downArrow.removeClass(that.toThemeProperty('jqx-icon-arrow-down-hover'));
                            }
                        }
                    });

                    that.addHandler($('body'), 'mouseup.jqxFormattedInputSpinButtons' + id, function () {
                        that._upbutton.add(that._downbutton).removeClass(that.toThemeProperty('jqx-fill-state-pressed'));
                    });
                }

                // dropdown arrow handlers
                if (that._addon) {
                    that.addHandler(that._addon, 'click.jqxFormattedInputAddon' + id, function () {
                        if (!that.disabled) {
                            if (that._opened) {
                                that.close();
                            } else {
                                that.open();
                            }
                        }
                    });
                    that.addHandler(that._addon, 'mouseenter.jqxFormattedInputAddon' + id, function () {
                        if (!that.disabled && that.value !== '' && that.value !== null) {
                            that._addon.addClass(that.toThemeProperty('jqx-fill-state-hover jqx-combobox-arrow-hover'));
                            that._arrow.addClass(that.toThemeProperty('jqx-icon-arrow-down-hover'));
                        }
                    });
                    that.addHandler(that._addon, 'mouseleave.jqxFormattedInputAddon' + id, function () {
                        if (!that.disabled && that.value !== '' && that.value !== null) {
                            that._addon.removeClass(that.toThemeProperty('jqx-fill-state-hover jqx-combobox-arrow-hover'));
                            that._arrow.removeClass(that.toThemeProperty('jqx-icon-arrow-down-hover'));
                        }
                    });
                    that.addHandler(that._addon.add(that._arrow), 'blur.jqxFormattedInputAddon' + id, function () {
                        if (that._opened && !that.disabled) {
                            that.close();
                        }
                    });
                }

                // fluid size support
                $.jqx.utilities.resize(that.baseHost, function () {
                    if (that._opened === true) {
                        that.close();
                    }

                    var addonsWidth = 0;
                    if (that._spinButtonsContainer) {
                        addonsWidth += that._spinButtonsContainer.outerWidth();
                    }
                    if (that._addon) {
                        addonsWidth += that._addon.outerWidth();
                    }
                    that.host.css('width', that.baseHost.width() - addonsWidth - 1);
                });
            }
        },

        removeHandlers: function () {
            var that = this;

            this.removeHandler(this.host, 'focus', $.proxy(this.onFocus, this));
            this.removeHandler(this.host, 'blur', $.proxy(this.onBlur, this));
            this.removeHandler(this.host, 'keypress', $.proxy(this.keypress, this));
            this.removeHandler(this.host, 'keyup', $.proxy(this.keyup, this));
            this.removeHandler(this.host, 'keydown', $.proxy(this.keydown, this));
            this.removeHandler(this.$popup, 'mousedown', $.proxy(this.click, this));
            if (this.host.off) {
                this.$popup.off('mouseenter', 'li', $.proxy(this.mouseenter, this));
            }
            else {
                this.$popup.unbind('mouseenter', 'li', $.proxy(this.mouseenter, this));
            }
            if (that.baseHost) {
                var id = that.baseHost.attr('id');

                if (that._spinButtonsContainer) {
                    var buttons = that._upbutton.add(that._downbutton);

                    that.removeHandler(that._upbutton, 'mousedown.jqxFormattedInputSpinButtonUp' + id);
                    that.removeHandler(that._upbutton, 'mouseup.jqxFormattedInputSpinButtonUp' + id);
                    that.removeHandler(that._downbutton, 'mousedown.jqxFormattedInputSpinButtonDown' + id);
                    that.removeHandler(that._downbutton, 'mouseup.jqxFormattedInputSpinButtonDown' + id);
                    that.removeHandler(buttons, 'mouseenter.jqxFormattedInputSpinButtons' + id);
                    that.removeHandler(buttons, 'mouseleave.jqxFormattedInputSpinButtons' + id);
                    that.removeHandler($('body'), 'mouseup.jqxFormattedInputSpinButtons' + id);
                }

                if (that._addon) {
                    that.removeHandler(that._addon, 'click.jqxFormattedInputAddon' + id);
                    that.removeHandler(that._addon, 'mouseenter.jqxFormattedInputAddon' + id);
                    that.removeHandler(that._addon, 'mouseleave.jqxFormattedInputAddon' + id);
                    that.removeHandler(that._addon.add(that._arrow), 'blur.jqxFormattedInputAddon' + id);
                }
            }
        },

        move: function (e) {
            if (!this._opened) {
                return;
            }

            switch (e.keyCode) {
                case 9: // tab
                case 13: // enter
                case 27: // escape
                    e.preventDefault();
                    break;

                case 38: // up arrow
                    e.preventDefault();
                    this.prev();
                    break;

                case 40: // down arrow
                    e.preventDefault();
                    this.next();
                    break;
            }

            e.stopPropagation();
        },

        keydown: function (e) {
            var that = this;
            that.changeType = 'keyboard';
            this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40, 38, 9, 13, 27]);
            this.move(e);

            var keyCode = !e.charCode ? e.which : e.charCode,
                key = String.fromCharCode(keyCode);

            if (keyCode >= 96 && keyCode <= 105) { // for numeric keypad keys
                key = keyCode - 96;
                keyCode = keyCode - 48;
            }

            if (e.altKey === true) {
                if (keyCode === 40) { // Alt + Down arrow
                    if (that._addon) {
                        this.open();
                    }
                    return;
                } else if (keyCode === 38) { // Alt + Up arrow
                    if (that._addon) {
                        this.close();
                    }
                    return;
                }
            }

            if (e.ctrlKey === true) {
                if (keyCode === 67) { // Ctrl + C (Copy)
                    return;
                } else if (keyCode === 65) { // Ctrl + A (Select All)
                    that.selectAll();
                    return;
                }
            }

            // validates the entered character
            var specialCharacters = [8, 9, 13, 37, 38, 39, 40, 46, 88]; // backspace, tab, enter, left arrow, top arrow, right arrow, bottom arrow, delete, x

            var rInput = that._regex['' + that._radixNumber + ''];
            if (specialCharacters.indexOf(keyCode) === -1 && (!rInput.test(key) && !rInput.test(e['key']) && !rInput.test(e['char']))) {
                e.preventDefault();
                return false;
            } else {
                var selectionStart = that.host[0].selectionStart;
                var selectionLength = that.host[0].selectionEnd - selectionStart;

                var position = this._getCaretPosition(this.host[0]);
                var oldValue = this.element.value;
                var newValue = oldValue.split('');
                if (keyCode === 8) { // backspace
                    if (selectionLength > 0) {
                        newValue.splice(selectionStart, selectionLength);
                    } else {
                        newValue.splice(position - 1, 1);
                    }
                } else if (keyCode === 46) { // delete
                    if (selectionLength > 0) {
                        newValue.splice(selectionStart, selectionLength);
                    } else {
                        newValue.splice(position, 1);
                    }
                } else if (keyCode === 88) {
                    if (e.ctrlKey === true) { // Ctrl + X (Cut)
                        if (selectionLength > 0) {
                            newValue.splice(selectionStart, selectionLength);
                        }
                    } else {
                        e.preventDefault();
                    }
                } else if (keyCode === 189) { // minus
                    if (newValue[0] === '-') {
                        newValue.splice(0, 1);
                        that._minus = false;
                    } else {
                        newValue.splice(0, 0, '-');
                        that._minus = true;
                    }
                    e.preventDefault();
                } else {
                    var newCharacter = specialCharacters.indexOf(keyCode) === -1 ? key : '';
                    if (selectionLength > 0) {
                        newValue.splice(selectionStart, selectionLength);
                        newValue.splice(selectionStart, 0, newCharacter);
                    } else {
                        newValue.splice(position, 0, newCharacter);
                    }
                }
                newValue = newValue.join('');
                if (newValue !== oldValue) {
                    var isValid = that._validateValue(newValue, false);
                    if (isValid === false) {
                        that._inputAndAddon.addClass(that.toThemeProperty('jqx-input-invalid'));
                    } else {
                        that._inputAndAddon.removeClass(that.toThemeProperty('jqx-input-invalid'));
                    }
                }
            }
        },

        keypress: function (e) {
            var that = this;

            if (that.suppressKeyPressRepeat) {
                return;
            }
            that.move(e);
        },

        keyup: function (e) {
            var that = this;

            switch (e.keyCode) {
                case 40: // down arrow
                case 38: // up arrow
                case 16: // shift
                case 17: // ctrl
                case 18: // alt
                    break;

                case 9: // tab
                case 13: // enter
                    if (this._opened) {
                        this.select(e, this);
                    } else {
                        that._change();
                    }
                    break;

                case 27: // escape
                    if (!this._opened) {
                        return;
                    }
                    this.close();
                    break;

                case 189: // minus
                    if (that._radixNumber === 10) {
                        if (that._minus === true) {
                            that.element.value = '-' + that.element.value;
                        } else {
                            that.element.value = that.element.value.slice(1);
                        }
                    }
                    break;
            }

            e.stopPropagation();
            e.preventDefault();

            if (that.element.value !== '') {
                if (that.upperCase) {
                    that.host.addClass(that.toThemeProperty('jqx-formatted-input-upper-case'));
                } else {
                    that.host.addClass(that.toThemeProperty('jqx-formatted-input-lower-case'));
                }
                if (that._spinButtonsContainer) {
                    that._spinButtonsContainer.removeClass(that.toThemeProperty('jqx-fill-state-disabled'));
                }
            } else {
                that.host.removeClass(that.toThemeProperty('jqx-formatted-input-upper-case jqx-formatted-input-lower-case'));
                if (that._spinButtonsContainer) {
                    that._spinButtonsContainer.addClass(that.toThemeProperty('jqx-fill-state-disabled'));
                }
            }

            if (that.isMaterialized() && that.hint) {
                setTimeout(function () {
                    that.label[0].innerHTML = that.placeHolder;
                    if (that.baseHost) {
                        if (that.element.value.length === 0) {
                            that.baseHost[0].removeAttribute('hint');
                        }
                        else {
                            that.baseHost[0].setAttribute('hint', true);
                        }
                    }
                });
            }
        },

        _getCaretPosition: function (input) {
            var CaretPos = 0;
            if (document.selection) {
                input.focus();
                var Sel = document.selection.createRange();
                Sel.moveStart('character', -input.value.length);
                CaretPos = Sel.text.length;
            }
            else if (input.selectionStart || input.selectionStart === '0') {
                CaretPos = input.selectionStart;
            }
            return (CaretPos);
        },

        onBlur: function () {
            var that = this;
            if (that._opened) {
                that.close();
            }
            that._setMaxLength();
            that._inputAndAddon.removeClass(that.toThemeProperty('jqx-fill-state-focus'));
            that._change();
            if (that._radixNumber === 10 && that.decimalNotation === 'exponential') {
                that.element.value = that._getDecimalNotation('exponential');
            }
            that._refreshPlaceHolder();
        },

        onFocus: function () {
            var that = this;
            that._setMaxLength(true);
            that._inputAndAddon.addClass(that.toThemeProperty('jqx-fill-state-focus'));
            if (that._radixNumber === 10 && that.decimalNotation === 'exponential') {
                that.element.value = that._number.toString(10);
            }
        },

        click: function (e) {
            e.stopPropagation();
            e.preventDefault();
            var radix = $(e.target).attr('data-value');
            this.select(e, this, radix);
        },

        mouseenter: function (e) {
            this.$popup.find('.jqx-fill-state-pressed').removeClass(this.toThemeProperty('jqx-fill-state-pressed'));
            $(e.currentTarget).addClass(this.toThemeProperty('jqx-fill-state-pressed'));
        },

        // change event handler
        _change: function () {
            var that = this;

            var oldValue = that.value;
            var newValue = that._validateValue(that.element.value, true);
            that._inputAndAddon.removeClass(that.toThemeProperty('jqx-input-invalid'));
            if (newValue.toUpperCase() !== oldValue.toString().toUpperCase()) {
                that._raiseEvent('2', { 'value': newValue, 'oldValue': oldValue, 'radix': that._radixNumber }); // change event
                that.value = newValue;
            }
        },

        // gets the internal numeric radix based on the radix property
        _getRadix: function (radix) {
            switch (radix) {
                case 10:
                case 'decimal':
                    return 10;
                case 2:
                case 'binary':
                    return 2;
                case 8:
                case 'octal':
                    return 8;
                case 16:
                case 'hexadecimal':
                    return 16;
            }
        },

        // sets the pop-up list radix options
        _setPopupOptions: function () {
            var that = this;

            that._popupOptions = new Array();

            if (that.value !== '') {
                that._popupOptions.push(that._number.toString(2) + ' <em>(BIN)</em>');
                that._popupOptions.push(that._number.toString(8) + ' <em>(OCT)</em>');
                that._popupOptions.push(that._number.toString(10) + ' <em>(DEC)</em>');
                that._popupOptions.push(that._number.toString(16) + ' <em>(HEX)</em>');
            } else {
                that._popupOptions.push('BIN');
                that._popupOptions.push('OCT');
                that._popupOptions.push('DEC');
                that._popupOptions.push('HEX');
            }
        },

        // validates the current value
        _validateValue: function (value, set) {
            var that = this;
            if (value !== '') {
                var numberToValidate = new that.longObj.math.Long.fromString((value).toString(), that._radixNumber);

                if (numberToValidate.lessThan(that._minLong)) {
                    if (set) {
                        that._number = that._minLong;
                        var min = that._minLong.toString(that._radixNumber);
                        if (that._radixNumber === 16 && that.upperCase === true) {
                            min = min.toUpperCase();
                        }
                        that.element.value = min;
                        return min;
                    } else {
                        return false;
                    }
                } else if (numberToValidate.greaterThan(that._maxLong)) {
                    if (set) {
                        that._number = that._maxLong;
                        var max = that._maxLong.toString(that._radixNumber);
                        if (that._radixNumber === 16 && that.upperCase === true) {
                            max = max.toUpperCase();
                        }
                        that.element.value = max;
                        return max;
                    } else {
                        return false;
                    }
                } else {
                    if (set) {
                        that._number = numberToValidate;
                        that.element.value = value;
                        return value;
                    } else {
                        return true;
                    }
                }
            } else {
                if (set) {
                    that.element.value = '';
                    return value;
                } else {
                    return true;
                }
            }
        },

        // returns the decimal equivalent of a negative binary, octal or hexadecimal number
        _getNegativeDecimal: function (value, radix) {
            var negativeBinary = value;

            if (radix === 8) {
                var threeBits = new Array();
                for (var i = 0; i < 11; i++) {
                    var threeBit = parseInt(value.charAt(i), 8).toString(2);
                    while (threeBit.length !== 3) {
                        threeBit = '0' + threeBit;
                    }

                    threeBits.push(threeBit);
                }
                negativeBinary = threeBits.join('');
                if (negativeBinary.charAt(0) === '0') {
                    negativeBinary = negativeBinary.slice(1);
                }

            } else if (radix === 16) {
                var bytes = new Array();
                for (var j = 0; j < 8; j++) {
                    var currentByte = parseInt(value.charAt(j), 16).toString(2);
                    while (currentByte.length !== 4) {
                        currentByte = '0' + currentByte;
                    }

                    bytes.push(currentByte);
                }
                negativeBinary = bytes.join('');
            }

            var negativeDecimal = '';
            for (var k = 0; k < negativeBinary.length; k++) {
                var currentDigit = negativeBinary.charAt(k) === '1' ? '0' : '1';
                negativeDecimal += currentDigit;
            }
            negativeDecimal = (parseInt(negativeDecimal, 2) + 1) * -1;
            return negativeDecimal;
        },

        // sets the input's max length based on the radix
        _setMaxLength: function (focus) {
            var that = this;
            var max;

            if (focus === true) {
                switch (that._radixNumber) {
                    case 2:
                        max = 64;
                        break;
                    case 8:
                        max = 22;
                        break;
                    case 10:
                        max = 20;
                        break;
                    case 16:
                        max = 16;
                        break;
                }
            } else {
                max = 524288; // default value
            }

            that.host.attr('maxlength', max);
        },

        // sets or updates the internal representations of the min and max properties
        _setMinMax: function (key) {
            var that = this;
            that['_' + key + 'Long'] = new that.longObj.math.Long.fromString((that[key]).toString(), that._radixNumber);
        },

        // returns a decimal value in a specific notation
        _getDecimalNotation: function (outputNotation) {
            var that = this;

            var value = that._number.toString(10);

            function defaultToExponential(defaultValue) {
                if (defaultValue === '0') {
                    return parseInt(defaultValue, 10).toExponential();
                }

                var sign;

                if (defaultValue.charAt(0) === '-') {
                    sign = '-';
                    defaultValue = defaultValue.slice(1, defaultValue.length);
                } else {
                    sign = '';
                }

                var power = defaultValue.length - 1;

                while (defaultValue.charAt(defaultValue.length - 1) === '0') {
                    defaultValue = defaultValue.slice(0, defaultValue.length - 1);
                }

                var decimal = defaultValue.slice(1, defaultValue.length);
                if (decimal !== '') {
                    decimal = '.' + decimal;
                }

                return sign + '' + defaultValue.charAt(0) + decimal + 'e+' + power;
            }

            function exponentialToScientific(exponentialValue) {
                var indexOfE = exponentialValue.indexOf('e');
                var power = exponentialValue.slice(indexOfE + 1);
                var scientificValue = exponentialValue.slice(0, indexOfE + 1);
                scientificValue = scientificValue.replace('e', '×10');
                scientificValue += that._toSuperScript(power);
                scientificValue = scientificValue.replace('+', '');

                return scientificValue;
            }

            function exponentialToEngineering(exponentialValue) {
                var indexOfE = exponentialValue.indexOf('e');
                var power = exponentialValue.slice(indexOfE + 1);
                var coefficient = exponentialValue.slice(0, indexOfE);
                var remainderPower = parseInt(power, 10) % 3;
                coefficient = coefficient * Math.pow(10, remainderPower);
                var floatFix = exponentialValue.slice(0, indexOfE).length - remainderPower - 2;
                if (floatFix >= 0) {
                    coefficient = coefficient.toFixed(floatFix);
                }
                var engineeringValue = coefficient + '×10' + that._toSuperScript((parseInt(power, 10) - remainderPower).toString());

                return engineeringValue;
            }

            var exponentialValue = defaultToExponential(value);
            if (outputNotation === 'scientific') {
                return exponentialToScientific(exponentialValue);
            } else if (outputNotation === 'engineering') {
                return exponentialToEngineering(exponentialValue);
            } else {
                return exponentialValue;
            }
        },

        // converts a number to superscript
        _toSuperScript: function (value, supToNormal) {
            var chars = '-0123456789';
            var sup = '⁻⁰¹²³⁴⁵⁶⁷⁸⁹';
            var result = '';

            for (var i = 0; i < value.length; i++) {
                if (supToNormal === true) {
                    var m = sup.indexOf(value.charAt(i));
                    result += (m !== -1 ? chars[m] : value[i]);
                } else {
                    var n = chars.indexOf(value.charAt(i));
                    result += (n !== -1 ? sup[n] : value[i]);
                }
            }
            return result;
        },

        // increments or decrements the number in the input
        _incrementOrDecrement: function (func) {
            var that = this;

            if (that._number.toString(that._radixNumber) !== that.element.value) {
                that._number = new that.longObj.math.Long.fromString(that.element.value, that._radixNumber);
            }
            that._number = that._number[func](that._spinButtonsStepLong);
            that.element.value = that._number.toString(that._radixNumber);
            that._change();
        },

        // converts a positive binary to a 64-bit negative binary, octal or hexadecimal using two's complement
        _negativeBinary: function (result, radix) {
            var reversedResult = '';
            result = result.slice(1, result.length); // removes the minus
            while (result.length < 64) {
                result = '0' + result;
            }

            for (var i = 0; i < result.length; i++) {
                var reversedDigit = result.charAt(i) === '1' ? '0' : '1';
                reversedResult += reversedDigit;
            }

            var plusOne = true;
            var finalResult = '';

            for (var j = reversedResult.length - 1; j >= 0; j--) {
                var currentDigit = reversedResult.charAt(j);
                var newDigit;

                if (currentDigit === '0') {
                    if (plusOne === true) {
                        newDigit = '1';
                        plusOne = false;
                    } else {
                        newDigit = '0';
                    }
                } else {
                    if (plusOne === true) {
                        newDigit = '0';
                    } else {
                        newDigit = '1';
                    }
                }
                finalResult = newDigit + '' + finalResult;
            }

            switch (radix) {
                case 2:
                    return finalResult;
                case 8:
                    finalResult = '00' + finalResult;
                    var octResult = '';
                    for (var k = 22; k >= 1; k--) {
                        var currentOct = finalResult[k * 3 - 3] + '' + finalResult[k * 3 - 2] + '' + finalResult[k * 3 - 1];
                        octResult = parseInt(currentOct, 2).toString(8) + '' + octResult;
                    }
                    return octResult;
                case 16:
                    var hexResult = '';
                    for (var l = 16; l >= 1; l--) {
                        var currentHex = finalResult[l * 4 - 4] + '' + finalResult[l * 4 - 3] + '' + finalResult[l * 4 - 2] + '' + finalResult[l * 4 - 1];
                        hexResult = parseInt(currentHex, 2).toString(16) + '' + hexResult;
                    }
                    return hexResult;
            }
        },

        // enables 64-bit number support
        _Long: function () {
            var that = this;

            that.longObj = new Object();
            var longObj = that.longObj;
            longObj.math = new Object();
            longObj.math.Long = new Object();

            longObj.math.Long = function (low, high) {
                this.lowBits = low | 0;
                this.highBits = high | 0;
            };

            longObj.math.Long.IntCache = {};

            longObj.math.Long.fromInt = function (value) {
                if (-128 <= value && value < 128) {
                    var cachedObj = longObj.math.Long.IntCache[value];
                    if (cachedObj) {
                        return cachedObj;
                    }
                }

                var obj = new longObj.math.Long(value | 0, value < 0 ? -1 : 0);
                if (-128 <= value && value < 128) {
                    longObj.math.Long.IntCache[value] = obj;
                }
                return obj;
            };

            longObj.math.Long.fromNumber = function (value) {
                if (isNaN(value) || !isFinite(value)) {
                    return longObj.math.Long.ZERO;
                } else if (value <= -longObj.math.Long.TWO_PWR_63_DBL_) {
                    return longObj.math.Long.MIN_VALUE;
                } else if (value + 1 >= longObj.math.Long.TWO_PWR_63_DBL_) {
                    return longObj.math.Long.MAX_VALUE;
                } else if (value < 0) {
                    return longObj.math.Long.fromNumber(-value).negate();
                } else {
                    return new longObj.math.Long(
        (value % longObj.math.Long.TWO_PWR_32_DBL_) | 0,
        (value / longObj.math.Long.TWO_PWR_32_DBL_) | 0);
                }
            };

            longObj.math.Long.fromBits = function (lowBits, highBits) {
                return new longObj.math.Long(lowBits, highBits);
            };

            longObj.math.Long.fromString = function (str, optRadix) {
                if (str.length === 0) {
                    throw new Error('number format error: empty string');
                }

                var radix = optRadix || 10;
                if (radix < 2 || 36 < radix) {
                    throw new Error('radix out of range: ' + radix);
                }

                if (str.charAt(0) === '-') {
                    return longObj.math.Long.fromString(str.substring(1), radix).negate();
                } else if (str.indexOf('-') >= 0) {
                    throw new Error('number format error: interior "-" character: ' + str);
                }

                var radixToPower = longObj.math.Long.fromNumber(Math.pow(radix, 8));

                var result = longObj.math.Long.ZERO;
                for (var i = 0; i < str.length; i += 8) {
                    var size = Math.min(8, str.length - i);
                    var value = parseInt(str.substring(i, i + size), radix);
                    if (size < 8) {
                        var power = longObj.math.Long.fromNumber(Math.pow(radix, size));
                        result = result.multiply(power).add(longObj.math.Long.fromNumber(value));
                    } else {
                        result = result.multiply(radixToPower);
                        result = result.add(longObj.math.Long.fromNumber(value));
                    }
                }
                return result;
            };

            longObj.math.Long.TWO_PWR_16_DBL_ = 1 << 16;
            longObj.math.Long.TWO_PWR_24_DBL_ = 1 << 24;
            longObj.math.Long.TWO_PWR_32_DBL_ =
    longObj.math.Long.TWO_PWR_16_DBL_ * longObj.math.Long.TWO_PWR_16_DBL_;
            longObj.math.Long.TWO_PWR_31_DBL_ =
    longObj.math.Long.TWO_PWR_32_DBL_ / 2;
            longObj.math.Long.TWO_PWR_48_DBL_ =
    longObj.math.Long.TWO_PWR_32_DBL_ * longObj.math.Long.TWO_PWR_16_DBL_;
            longObj.math.Long.TWO_PWR_64_DBL_ =
    longObj.math.Long.TWO_PWR_32_DBL_ * longObj.math.Long.TWO_PWR_32_DBL_;
            longObj.math.Long.TWO_PWR_63_DBL_ =
    longObj.math.Long.TWO_PWR_64_DBL_ / 2;
            longObj.math.Long.ZERO = longObj.math.Long.fromInt(0);
            longObj.math.Long.ONE = longObj.math.Long.fromInt(1);
            longObj.math.Long.NEG_ONE = longObj.math.Long.fromInt(-1);
            longObj.math.Long.MAX_VALUE =
    longObj.math.Long.fromBits(0xFFFFFFFF | 0, 0x7FFFFFFF | 0);
            longObj.math.Long.MIN_VALUE = longObj.math.Long.fromBits(0, 0x80000000 | 0);
            longObj.math.Long.TWO_PWR_24_ = longObj.math.Long.fromInt(1 << 24);

            longObj.math.Long.prototype.toInt = function () {
                return this.lowBits;
            };

            longObj.math.Long.prototype.toNumber = function () {
                return this.highBits * longObj.math.Long.TWO_PWR_32_DBL_ +
         this.getLowBitsUnsigned();
            };

            longObj.math.Long.prototype.toString = function (optRadix) {
                var radix = optRadix || 10;
                if (radix < 2 || 36 < radix) {
                    throw new Error('radix out of range: ' + radix);
                }

                if (this.isZero()) {
                    return '0';
                }

                var rem, result;

                if (this.isNegative()) {
                    if (this.equals(longObj.math.Long.MIN_VALUE)) {
                        var radixLong = longObj.math.Long.fromNumber(radix);
                        var div = this.div(radixLong);
                        rem = div.multiply(radixLong).subtract(this);
                        return div.toString(radix) + rem.toInt().toString(radix);
                    } else {
                        switch (radix) {
                            case 2:
                            case 8:
                            case 16:
                                result = '-' + this.negate().toString(2);
                                return that._negativeBinary(result, radix);
                            default:
                                result = '-' + this.negate().toString(radix);
                                return result;
                        }
                    }
                }

                var radixToPower = longObj.math.Long.fromNumber(Math.pow(radix, 6));

                rem = this;
                result = '';
                while (true) {
                    var remDiv = rem.div(radixToPower);
                    var intval = rem.subtract(remDiv.multiply(radixToPower)).toInt();
                    var digits = intval.toString(radix);

                    rem = remDiv;
                    if (rem.isZero()) {
                        return digits + result;
                    } else {
                        while (digits.length < 6) {
                            digits = '0' + digits;
                        }
                        result = '' + digits + result;
                    }
                }
            };


            longObj.math.Long.prototype.getHighBits = function () {
                return this.highBits;
            };

            longObj.math.Long.prototype.getLowBits = function () {
                return this.lowBits;
            };

            longObj.math.Long.prototype.getLowBitsUnsigned = function () {
                return (this.lowBits >= 0) ?
      this.lowBits : longObj.math.Long.TWO_PWR_32_DBL_ + this.lowBits;
            };

            longObj.math.Long.prototype.getNumBitsAbs = function () {
                if (this.isNegative()) {
                    if (this.equals(longObj.math.Long.MIN_VALUE)) {
                        return 64;
                    } else {
                        return this.negate().getNumBitsAbs();
                    }
                } else {
                    var val = this.highBits !== 0 ? this.highBits : this.lowBits;
                    for (var bit = 31; bit > 0; bit--) {
                        if ((val & (1 << bit)) !== 0) {
                            break;
                        }
                    }
                    return this.highBits !== 0 ? bit + 33 : bit + 1;
                }
            };

            longObj.math.Long.prototype.isZero = function () {
                return this.highBits === 0 && this.lowBits === 0;
            };

            longObj.math.Long.prototype.isNegative = function () {
                return this.highBits < 0;
            };

            longObj.math.Long.prototype.isOdd = function () {
                return (this.lowBits & 1) === 1;
            };

            longObj.math.Long.prototype.equals = function (other) {
                return (this.highBits === other.highBits) && (this.lowBits === other.lowBits);
            };

            longObj.math.Long.prototype.notEquals = function (other) {
                return (this.highBits !== other.highBits) || (this.lowBits !== other.lowBits);
            };

            longObj.math.Long.prototype.lessThan = function (other) {
                return this.compare(other) < 0;
            };

            longObj.math.Long.prototype.lessThanOrEqual = function (other) {
                return this.compare(other) <= 0;
            };

            longObj.math.Long.prototype.greaterThan = function (other) {
                return this.compare(other) > 0;
            };

            longObj.math.Long.prototype.greaterThanOrEqual = function (other) {
                return this.compare(other) >= 0;
            };

            longObj.math.Long.prototype.compare = function (other) {
                if (this.equals(other)) {
                    return 0;
                }

                var thisNeg = this.isNegative();
                var otherNeg = other.isNegative();
                if (thisNeg && !otherNeg) {
                    return -1;
                }
                if (!thisNeg && otherNeg) {
                    return 1;
                }

                if (this.subtract(other).isNegative()) {
                    return -1;
                } else {
                    return 1;
                }
            };


            longObj.math.Long.prototype.negate = function () {
                if (this.equals(longObj.math.Long.MIN_VALUE)) {
                    return longObj.math.Long.MIN_VALUE;
                } else {
                    return this.not().add(longObj.math.Long.ONE);
                }
            };

            longObj.math.Long.prototype.add = function (other) {
                var a48 = this.highBits >>> 16;
                var a32 = this.highBits & 0xFFFF;
                var a16 = this.lowBits >>> 16;
                var a00 = this.lowBits & 0xFFFF;

                var b48 = other.highBits >>> 16;
                var b32 = other.highBits & 0xFFFF;
                var b16 = other.lowBits >>> 16;
                var b00 = other.lowBits & 0xFFFF;

                var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
                c00 += a00 + b00;
                c16 += c00 >>> 16;
                c00 &= 0xFFFF;
                c16 += a16 + b16;
                c32 += c16 >>> 16;
                c16 &= 0xFFFF;
                c32 += a32 + b32;
                c48 += c32 >>> 16;
                c32 &= 0xFFFF;
                c48 += a48 + b48;
                c48 &= 0xFFFF;
                return longObj.math.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
            };

            longObj.math.Long.prototype.subtract = function (other) {
                return this.add(other.negate());
            };

            longObj.math.Long.prototype.multiply = function (other) {
                if (this.isZero()) {
                    return longObj.math.Long.ZERO;
                } else if (other.isZero()) {
                    return longObj.math.Long.ZERO;
                }

                if (this.equals(longObj.math.Long.MIN_VALUE)) {
                    return other.isOdd() ? longObj.math.Long.MIN_VALUE : longObj.math.Long.ZERO;
                } else if (other.equals(longObj.math.Long.MIN_VALUE)) {
                    return this.isOdd() ? longObj.math.Long.MIN_VALUE : longObj.math.Long.ZERO;
                }

                if (this.isNegative()) {
                    if (other.isNegative()) {
                        return this.negate().multiply(other.negate());
                    } else {
                        return this.negate().multiply(other).negate();
                    }
                } else if (other.isNegative()) {
                    return this.multiply(other.negate()).negate();
                }

                if (this.lessThan(longObj.math.Long.TWO_PWR_24_) &&
      other.lessThan(longObj.math.Long.TWO_PWR_24_)) {
                    return longObj.math.Long.fromNumber(this.toNumber() * other.toNumber());
                }

                var a48 = this.highBits >>> 16;
                var a32 = this.highBits & 0xFFFF;
                var a16 = this.lowBits >>> 16;
                var a00 = this.lowBits & 0xFFFF;

                var b48 = other.highBits >>> 16;
                var b32 = other.highBits & 0xFFFF;
                var b16 = other.lowBits >>> 16;
                var b00 = other.lowBits & 0xFFFF;

                var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
                c00 += a00 * b00;
                c16 += c00 >>> 16;
                c00 &= 0xFFFF;
                c16 += a16 * b00;
                c32 += c16 >>> 16;
                c16 &= 0xFFFF;
                c16 += a00 * b16;
                c32 += c16 >>> 16;
                c16 &= 0xFFFF;
                c32 += a32 * b00;
                c48 += c32 >>> 16;
                c32 &= 0xFFFF;
                c32 += a16 * b16;
                c48 += c32 >>> 16;
                c32 &= 0xFFFF;
                c32 += a00 * b32;
                c48 += c32 >>> 16;
                c32 &= 0xFFFF;
                c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
                c48 &= 0xFFFF;
                return longObj.math.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
            };

            longObj.math.Long.prototype.div = function (other) {
                if (other.isZero()) {
                    throw new Error('division by zero');
                } else if (this.isZero()) {
                    return longObj.math.Long.ZERO;
                }

                var approx, rem;

                if (this.equals(longObj.math.Long.MIN_VALUE)) {
                    if (other.equals(longObj.math.Long.ONE) ||
        other.equals(longObj.math.Long.NEG_ONE)) {
                        return longObj.math.Long.MIN_VALUE;
                    } else if (other.equals(longObj.math.Long.MIN_VALUE)) {
                        return longObj.math.Long.ONE;
                    } else {
                        var halfThis = this.shiftRight(1);
                        approx = halfThis.div(other).shiftLeft(1);
                        if (approx.equals(longObj.math.Long.ZERO)) {
                            return other.isNegative() ? longObj.math.Long.ONE : longObj.math.Long.NEG_ONE;
                        } else {
                            rem = this.subtract(other.multiply(approx));
                            var result = approx.add(rem.div(other));
                            return result;
                        }
                    }
                } else if (other.equals(longObj.math.Long.MIN_VALUE)) {
                    return longObj.math.Long.ZERO;
                }

                if (this.isNegative()) {
                    if (other.isNegative()) {
                        return this.negate().div(other.negate());
                    } else {
                        return this.negate().div(other).negate();
                    }
                } else if (other.isNegative()) {
                    return this.div(other.negate()).negate();
                }

                var res = longObj.math.Long.ZERO;
                rem = this;
                while (rem.greaterThanOrEqual(other)) {
                    approx = Math.max(1, Math.floor(rem.toNumber() / other.toNumber()));

                    var log2 = Math.ceil(Math.log(approx) / Math.LN2);
                    var delta = (log2 <= 48) ? 1 : Math.pow(2, log2 - 48);

                    var approxRes = longObj.math.Long.fromNumber(approx);
                    var approxRem = approxRes.multiply(other);
                    while (approxRem.isNegative() || approxRem.greaterThan(rem)) {
                        approx -= delta;
                        approxRes = longObj.math.Long.fromNumber(approx);
                        approxRem = approxRes.multiply(other);
                    }

                    if (approxRes.isZero()) {
                        approxRes = longObj.math.Long.ONE;
                    }

                    res = res.add(approxRes);
                    rem = rem.subtract(approxRem);
                }
                return res;
            };

            longObj.math.Long.prototype.modulo = function (other) {
                return this.subtract(this.div(other).multiply(other));
            };

            longObj.math.Long.prototype.not = function () {
                return longObj.math.Long.fromBits(~this.lowBits, ~this.highBits);
            };

            longObj.math.Long.prototype.and = function (other) {
                return longObj.math.Long.fromBits(this.lowBits & other.lowBits,
                                 this.highBits & other.highBits);
            };

            longObj.math.Long.prototype.or = function (other) {
                return longObj.math.Long.fromBits(this.lowBits | other.lowBits,
                                 this.highBits | other.highBits);
            };

            longObj.math.Long.prototype.xor = function (other) {
                return longObj.math.Long.fromBits(this.lowBits ^ other.lowBits,
                                 this.highBits ^ other.highBits);
            };

            longObj.math.Long.prototype.shiftLeft = function (numBits) {
                numBits &= 63;
                if (numBits === 0) {
                    return this;
                } else {
                    var low = this.lowBits;
                    if (numBits < 32) {
                        var high = this.highBits;
                        return longObj.math.Long.fromBits(
          low << numBits,
          (high << numBits) | (low >>> (32 - numBits)));
                    } else {
                        return longObj.math.Long.fromBits(0, low << (numBits - 32));
                    }
                }
            };

            longObj.math.Long.prototype.shiftRight = function (numBits) {
                numBits &= 63;
                if (numBits === 0) {
                    return this;
                } else {
                    var high = this.highBits;
                    if (numBits < 32) {
                        var low = this.lowBits;
                        return longObj.math.Long.fromBits(
          (low >>> numBits) | (high << (32 - numBits)),
          high >> numBits);
                    } else {
                        return longObj.math.Long.fromBits(
          high >> (numBits - 32),
          high >= 0 ? 0 : -1);
                    }
                }
            };

            longObj.math.Long.prototype.shiftRightUnsigned = function (numBits) {
                numBits &= 63;
                if (numBits === 0) {
                    return this;
                } else {
                    var high = this.highBits;
                    if (numBits < 32) {
                        var low = this.lowBits;
                        return longObj.math.Long.fromBits(
          (low >>> numBits) | (high << (32 - numBits)),
          high >>> numBits);
                    } else if (numBits === 32) {
                        return longObj.math.Long.fromBits(high, 0);
                    } else {
                        return longObj.math.Long.fromBits(high >>> (numBits - 32), 0);
                    }
                }
            };
        }
    });
})(jqxBaseFramework); //ignore jslint
