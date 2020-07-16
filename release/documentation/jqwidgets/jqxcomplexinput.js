/* tslint:disable */
/* eslint-disable */
(function ($) {
    'use strict';

    $.jqx.jqxWidget('jqxComplexInput', '', {});

    $.extend($.jqx._jqxComplexInput.prototype, {
        defineInstance: function () {
            var settings = {
                // properties
                width: null,
                height: null,
                decimalNotation: 'default', // possible values: 'default', 'exponential', 'scientific', 'engineering'
                value: '',
                spinButtons: false,
                spinButtonsStep: 1, // integer value
                placeHolder: '',
                roundedCorners: true,
                disabled: false,
                rtl: false,
                changeType: null,
                hint:true,
                template: "",
                // events
                events: ['change']
            };
            if (this === $.jqx._jqxComplexInput.prototype) {
                return settings;
            }
            $.extend(true, this, settings);
            return settings;
        },

        createInstance: function () {
            var that = this;

            that._firefox = $.jqx.browser.browser === 'mozilla';
            that._currentNumber = {}; // stores the current number (on the change event) and its real and imaginary parts
            that._allowedCharacters = new RegExp(/([\+\-\.0-9i])/i);
            that.render();
        },

        // renders the widget
        render: function () {
            var that = this;

            if (that.isMaterialized()) {
                var label = $("<label></label");

                if (this.hint) {
                    label[0].innerHTML = this.placeHolder;
                }

                label.addClass(that.toThemeProperty('jqx-input-label'));

                var bar = $("<span></span>");
                bar.addClass(that.toThemeProperty('jqx-input-bar'));

                if (that.element.nodeName.toUpperCase() === 'INPUT') {
                    var group = $("<div></div>");
                    group.addClass(that.toThemeProperty('jqx-input-group jqx-complex-input-group'));
                    this.host.after(group);
                    var input = this.element;
                    var data = this.host.data();

                    group.append(input);
                    group.append(label);
                    group.append(bar);
                }
                else {
                    this.host.append(label);
                    this.host.append(bar);
                    this.host.addClass(that.toThemeProperty('jqx-input-group jqx-complex-input-group'));
                    bar.css('top', 6+this.element.offsetHeight);
                }

                that.bar = bar;
                that.label = label;
            }

            if (that.element.nodeName.toUpperCase() === 'DIV') {
                that.baseHost = that.host;
                var data = that.host.data();
                that.host = that.baseHost.children('input');
                that.element = that.host[0];
                that.host.data(data);
            }

       

            if (that.spinButtons === true) {
                if (!that.baseHost) {
                    throw new Error('jqxComplexInput: Invalid HTML structure. Please initialize the complex input from a div with an input and another div inside.');
                }
                // appends spin buttons
                that._appendSpinButtons();
            }

            // adds the necessary classes for the widget
            that._addClasses();

            // set the width and height of the widget
            that._setSize();

            // removes event handlers
            that._removeHandlers();

            // adds event handlers
            that._addHandlers();

            if (that.decimalNotation === 'exponential' && that.value.toLowerCase().indexOf('e') !== -1) {
                var decimalNotation = that._exponentialToDecimal(that.value);
                var real = decimalNotation.realPart;
                var imaginary = decimalNotation.imaginaryPart;
                var sign = imaginary < 0 ? '-' : '+';
                var value = real + ' ' + sign + ' ' + Math.abs(imaginary) + 'i';
                that._currentNumber = { value: value, realPart: real, imaginaryPart: imaginary };
            } else {
                that._currentNumber = { value: that.value, realPart: that._getReal(that.value), imaginaryPart: that._getImaginary(that.value) };
            }

            if (that.decimalNotation === 'default') {
                that.element.value = that.value;
            } else {
                that._setNotation();
            }

            // sets the input's placeholder
            that._refreshPlaceHolder();
        },

        // refreshes the widget
        refresh: function (initialRefresh) {
            if (initialRefresh !== true) {
                this.render();
            }
        },

        // destroys the widget
        destroy: function () {
            var that = this;

            that._removeHandlers();
            that.host.destroy();
        },

        // gets or sets the complex number
        val: function (value) {
            var that = this;

            if (typeof value === 'string' || typeof value === 'object' && $.isEmptyObject(value) === false) {
                var real, imaginary;

                if (typeof value === 'string') {
                    value = value.toLowerCase();
                    if (value.indexOf('e') === -1) {
                        real = that._getReal(value);
                        imaginary = that._getImaginary(value);
                    } else {
                        var decimalNotation = that._exponentialToDecimal(value);
                        real = decimalNotation.realPart * 1;
                        imaginary = decimalNotation.imaginaryPart * 1;
                    }
                } else if (typeof value === 'object' && $.isEmptyObject(value) === false) {
                    real = value.real;
                    imaginary = value.imaginary;
                }

                var sign = imaginary >= 0 ? '+' : '-';
                var newValue = real + ' ' + sign + ' ' + Math.abs(imaginary) + 'i';
                if (newValue !== that._currentNumber.value) {
                    that.element.value = newValue;
                    that._onChange(that.value);
                    if (that.decimalNotation !== 'default') {
                        that._setNotation();
                    }
                }
            } else {
                return that.element.value;
            }
        },

        getReal: function () {
            return this._currentNumber.realPart;
        },

        // gets the real part of the complex number
        _getReal: function (value) {
            if (!value || (typeof value === 'object' && $.isEmptyObject(value) === true)) {
                value = this.element.value;
            }

            var realPart = $.trim(value), minus = '';

            if ((value.match(/i/g) || []).length === 0) {
                return parseFloat(realPart);
            }

            if (value.charAt(0) === '+') {
                realPart = realPart.slice(1, value.length);
            } else if (value.charAt(0) === '-') {
                realPart = realPart.slice(1, value.length);
                minus = '-';
            }

            function slice(index) {
                realPart = realPart.slice(0, index);
                realPart = $.trim(realPart);
                return parseFloat(minus + '' + realPart);
            }

            var plusIndex = realPart.indexOf('+');
            if (plusIndex !== -1) {
                return slice(plusIndex);
            }
            var minusIndex = realPart.indexOf('-');
            if (minusIndex !== -1) {
                return slice(minusIndex);
            }
            return 0;
        },

        getImaginary: function () {
            return this._currentNumber.imaginaryPart;
        },

        // gets the imaginary part of the complex number
        _getImaginary: function (value) {
            if (!value || (typeof value === 'object' && $.isEmptyObject(value) === true)) {
                value = this.element.value;
            }

            if ((value.match(/i/g) || []).length === 0) {
                return 0;
            }

            var imaginaryPart = $.trim(value), minus = '';

            if (imaginaryPart.charAt(0) === '-' || imaginaryPart.charAt(0) === '+') {
                minus = imaginaryPart.charAt(0) === '-' ? '-' : '+';
                imaginaryPart = $.trim(imaginaryPart.slice(1, value.length));
            }

            function slice(index, sign) {
                imaginaryPart = imaginaryPart.slice(index + 1, imaginaryPart.indexOf('i'));
                imaginaryPart = $.trim(imaginaryPart);
                if (imaginaryPart === '') {
                    imaginaryPart = 1;
                }
                return parseFloat(sign + '' + imaginaryPart);
            }

            var plusIndex = imaginaryPart.indexOf('+');
            if (plusIndex !== -1) {
                return slice(plusIndex, '+');
            }
            var minusIndex = imaginaryPart.indexOf('-');
            if (minusIndex !== -1) {
                return slice(minusIndex, '-');
            }
            imaginaryPart = minus + '' + imaginaryPart.slice(0, imaginaryPart.indexOf('i'));
            if (imaginaryPart === '' || imaginaryPart === '+') {
                return 1;
            } else if (imaginaryPart === '-') {
                return -1;
            } else {
                return parseFloat(imaginaryPart);
            }
        },

        // gets the real or imaginary part in a specific notation
        getDecimalNotation: function (value, outputNotation) {
            var that = this;

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

            if (value === 'real') {
                value = that._currentNumber.realPart;
            } else if (value === 'imaginary') {
                value = that._currentNumber.imaginaryPart;
            }

            var exponentialValue = value.toExponential();
            if (outputNotation === 'scientific') {
                return exponentialToScientific(exponentialValue);
            } else if (outputNotation === 'engineering') {
                return exponentialToEngineering(exponentialValue);
            } else {
                return exponentialValue;
            }
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (value !== oldvalue) {
                switch (key) {
                    case "template":
                        if (object.template) {
                            object._upbutton.removeClass(that.toThemeProperty("jqx-" + oldvalue))
                            object._downbutton.removeClass(that.toThemeProperty("jqx-" + oldvalue))
                            object._upbutton.addClass(that.toThemeProperty("jqx-" + object.template))
                            object._downbutton.addClass(that.toThemeProperty("jqx-" + object.template))
                        }
                        break;
                    case 'width':
                    case 'height':
                        object._setSize();
                        break;
                    case 'decimalNotation':
                        if (value === 'default') {
                            object.element.value = object._currentNumber.value;
                        } else {
                            object._setNotation();
                        }
                        break;
                    case 'value':
                        object.element.value = value;
                        object._onChange(oldvalue);
                        break;
                    case 'spinButtons':
                        var applyRC = function () {
                            object.host.removeClass(object.toThemeProperty('jqx-rc-all'));
                            if (object.rtl === false) {
                                object.host.addClass(object.toThemeProperty('jqx-rc-l'));
                                object._spinButtonsContainer.addClass(object.toThemeProperty('jqx-rc-r'));
                            } else {
                                object.host.addClass(object.toThemeProperty('jqx-rc-r'));
                                object._spinButtonsContainer.addClass(object.toThemeProperty('jqx-rc-l'));
                            }
                        };

                        if (object._spinButtonsContainer) { // spin buttons are present in the DOM
                            var hostWidth = object.host.width();
                            var spinButtonsWidth = object._spinButtonsContainer.outerWidth();
                            if (value === false) {
                                object.host.width(hostWidth + spinButtonsWidth);
                                object._spinButtonsContainer.hide();
                                object.host.addClass(object.toThemeProperty('jqx-rc-all'));
                            } else {
                                object.host.width(hostWidth - spinButtonsWidth);
                                object._spinButtonsContainer.show();
                                applyRC();
                            }
                        } else { // spin buttons are not present in the DOM
                            if (value === true) {
                                var spinButtonsDiv = $('<div></div>');
                                if (object.baseHost) { // the initialization element is a div
                                    object.host.after(spinButtonsDiv);
                                    object.render();

                                } else { // the initialization element is an input
                                    var id = object.element.id;
                                    object.host.removeAttr('id');
                                    object.host.wrap('<div id="' + id + '" style="display: inline-block;"></div>');
                                    var wrapper = $('#' + id);
                                    wrapper.append(spinButtonsDiv);
                                    var hostData = object.host.data();
                                    hostData.jqxComplexInput.host = wrapper;
                                    hostData.jqxComplexInput.element = wrapper[0];
                                    object.baseHost = wrapper;
                                    object.baseHost.data(hostData);
                                    object.render();
                                }
                                applyRC();
                            }
                        }
                        break;
                    case 'placeHolder':
                        object._refreshPlaceHolder(oldvalue);
                        break;
                    case 'roundedCorners':
                        if (object._spinButtonsContainer) {
                            if (value === true) {
                                if (object.rtl === false) {
                                    object.host.addClass(object.toThemeProperty('jqx-rc-l'));
                                    object._spinButtonsContainer.addClass(object.toThemeProperty('jqx-rc-r'));
                                } else {
                                    object.host.addClass(object.toThemeProperty('jqx-rc-r'));
                                    object._spinButtonsContainer.addClass(object.toThemeProperty('jqx-rc-l'));
                                }
                            } else {
                                if (object.rtl === false) {
                                    object.host.removeClass(object.toThemeProperty('jqx-rc-l'));
                                    object._spinButtonsContainer.removeClass(object.toThemeProperty('jqx-rc-r'));
                                } else {
                                    object.host.removeClass(object.toThemeProperty('jqx-rc-r'));
                                    object._spinButtonsContainer.removeClass(object.toThemeProperty('jqx-rc-l'));
                                }
                            }
                        } else {
                            if (value === true) {
                                object.host.addClass(object.toThemeProperty('jqx-rc-all'));
                            } else {
                                object.host.removeClass(object.toThemeProperty('jqx-rc-all'));
                            }
                        }
                        break;
                    case 'disabled':
                        if (value === true) {
                            object.host.attr('disabled', true);
                            object.host.addClass(object.toThemeProperty('jqx-fill-state-disabled jqx-input-disabled'));
                            if (object._spinButtonsContainer) {
                                object._spinButtonsContainer.addClass(object.toThemeProperty('jqx-fill-state-disabled'));
                            }
                        } else {
                            object.host.removeAttr('disabled');
                            object.host.removeClass(object.toThemeProperty('jqx-fill-state-disabled jqx-input-disabled'));
                            if (object._spinButtonsContainer) {
                                object._spinButtonsContainer.removeClass(object.toThemeProperty('jqx-fill-state-disabled'));
                            }
                        }
                        break;
                    case 'rtl':
                        if (object._spinButtonsContainer) {
                            if (value === true) {
                                object.host.addClass(object.toThemeProperty('jqx-complex-input-child-rtl'));
                                object._spinButtonsContainer.removeClass(object.toThemeProperty('jqx-complex-input-spin-buttons-container-ltr'));
                                object._spinButtonsContainer.addClass(object.toThemeProperty('jqx-complex-input-child-rtl jqx-complex-input-spin-buttons-container-rtl'));
                                if (object.roundedCorners === true) {
                                    object.host.removeClass(object.toThemeProperty('jqx-rc-l'));
                                    object.host.addClass(object.toThemeProperty('jqx-rc-r'));
                                    object._spinButtonsContainer.removeClass(object.toThemeProperty('jqx-rc-r'));
                                    object._spinButtonsContainer.addClass(object.toThemeProperty('jqx-rc-l'));
                                }
                            } else {
                                object.host.removeClass(object.toThemeProperty('jqx-complex-input-child-rtl'));
                                object._spinButtonsContainer.removeClass(object.toThemeProperty('jqx-complex-input-child-rtl jqx-complex-input-spin-buttons-container-rtl'));
                                object._spinButtonsContainer.addClass(object.toThemeProperty('jqx-complex-input-spin-buttons-container-ltr'));
                                if (object.roundedCorners === true) {
                                    object.host.removeClass(object.toThemeProperty('jqx-rc-r'));
                                    object.host.addClass(object.toThemeProperty('jqx-rc-l'));
                                    object._spinButtonsContainer.removeClass(object.toThemeProperty('jqx-rc-l'));
                                    object._spinButtonsContainer.addClass(object.toThemeProperty('jqx-rc-r'));
                                }
                            }
                        }
                        break;
                    case 'theme':
                        $.jqx.utilities.setTheme(oldvalue, value, object.host);
                        break;
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
            arg.type = this.changeType;
            this.changeType = null;
            event.args = arg;

            if (event.preventDefault) {
                event.preventDefault();
            }

            var result = this.host.trigger(event);
            return result;
        },

        // appends spin buttons
        _appendSpinButtons: function () {
            var that = this;

            that._spinButtonsContainer = $(that.baseHost.children('div'));
            that._spinButtonsContainer.attr('unselectable', 'on');
            that._spinButtonsContainer.addClass(that.toThemeProperty('jqx-fill-state-normal jqx-complex-input-child jqx-formatted-input-spin-buttons-container jqx-complex-input-spin-buttons-container'));
            if (that.rtl === false) {
                that._spinButtonsContainer.addClass(that.toThemeProperty('jqx-complex-input-spin-buttons-container-ltr'));
            } else {
                that._spinButtonsContainer.addClass(that.toThemeProperty('jqx-complex-input-child-rtl jqx-complex-input-spin-buttons-container-rtl'));
            }
            // spin buttons
            var spinButtonString = '<div unselectable="on" class="' + that.toThemeProperty('jqx-fill-state-normal jqx-formatted-input-spin-button') + '"><div class="' + that.toThemeProperty('jqx-input-icon') + '"></div></div>';
            that._upbutton = $(spinButtonString);
            that._spinButtonsContainer.append(that._upbutton);
            that._downbutton = $(spinButtonString);
            that._spinButtonsContainer.append(that._downbutton);
            // arrows
            that._upArrow = that._upbutton.find('div');
            that._upArrow.addClass(that.toThemeProperty('jqx-icon-arrow-up'));
            that._downArrow = that._downbutton.find('div');
            that._downArrow.addClass(that.toThemeProperty('jqx-icon-arrow-down'));
            that._upArrow.add(that._downArrow).attr('unselectable', 'on');
            if (that.template) {
                that._upbutton.addClass(that.toThemeProperty("jqx-" + that.template))
                that._downbutton.addClass(that.toThemeProperty("jqx-" + that.template))
            }
        },

        // adds the necessary classes for the widget
        _addClasses: function () {
            var that = this;

            that.host.addClass(that.toThemeProperty('jqx-widget jqx-input jqx-complex-input jqx-widget-content'));

            if (that.baseHost) {
                that.baseHost.addClass(that.toThemeProperty('jqx-widget jqx-complex-input-parent'));
                that.host.addClass(that.toThemeProperty('jqx-complex-input-child'));
            }

            if (that.roundedCorners === true) {
                if (that._spinButtonsContainer) {
                    if (that.rtl === false) {
                        that.host.addClass(that.toThemeProperty('jqx-rc-l'));
                        that._spinButtonsContainer.addClass(that.toThemeProperty('jqx-rc-r'));
                    } else {
                        that.host.addClass(that.toThemeProperty('jqx-rc-r'));
                        that._spinButtonsContainer.addClass(that.toThemeProperty('jqx-rc-l'));
                    }
                } else {
                    that.host.addClass(that.toThemeProperty('jqx-rc-all'));
                }
            }

            if (that.disabled === true) {
                that.host.attr('disabled', true);
                that.host.addClass(that.toThemeProperty('jqx-fill-state-disabled jqx-input-disabled'));
                if (that._spinButtonsContainer) {
                    that._spinButtonsContainer.addClass(that.toThemeProperty('jqx-fill-state-disabled'));
                }
            }

            if (that.rtl === true) {
                that.host.add(that._spinButtonsContainer).addClass(that.toThemeProperty('jqx-complex-input-child-rtl'));
            }
        },

        // sets the input's placeholder
        _refreshPlaceHolder: function (oldPlaceHolder) {
            var that = this;

            if ('placeholder' in that.element) {
                that.host.attr('placeHolder', that.placeHolder);
            } else {
                if (that.element.value === '' || that.element.value === oldPlaceHolder) {
                    that.element.value = that.placeHolder;
                }
            }
        },

        // set the width and height of the widget
        _setSize: function () {
            var that = this;

            function resize() {
                var baseHostHeight = that.baseHost.height();
                var inputBordersAndPadding = parseInt(that.host.css('border-left-width'), 10) + parseInt(that.host.css('border-right-width'), 10) + parseInt(that.host.css('padding-left'), 10) + parseInt(that.host.css('padding-right'), 10);
                var ie7Fix = 0;
                if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                    ie7Fix = inputBordersAndPadding;
                    that.host.height(that.baseHost.height() - (parseInt(that.host.css('border-top-width'), 10) + parseInt(that.host.css('border-bottom-width'), 10) + parseInt(that.host.css('padding-top'), 10) + parseInt(that.host.css('padding-bottom'), 10)) * 2);
                }
                if (that._spinButtonsContainer) {
                    var fluidFix = typeof that.width === 'string' && that.width.charAt(that.width.length - 1) === '%' ? 1 : 0;
                    that.host.width(that.baseHost.width() - inputBordersAndPadding - that._spinButtonsContainer.outerWidth() - ie7Fix - fluidFix);
                    if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                        that._spinButtonsContainer.height(baseHostHeight - (parseInt(that._spinButtonsContainer.css('border-top-width'), 10) + parseInt(that._spinButtonsContainer.css('border-bottom-width'), 10) + parseInt(that._spinButtonsContainer.css('padding-top'), 10) + parseInt(that._spinButtonsContainer.css('padding-bottom'), 10)) * 2);
                    }
                } else {
                    that.host.width(that.baseHost.width() - inputBordersAndPadding - ie7Fix);
                }
            }

            if (that.baseHost) {
                that.baseHost.width(that.width);
                that.baseHost.height(that.height);
                resize();
            } else {
                that.host.width(that.width);
                that.host.height(that.height);
            }

            if ($.jqx.browser.msie && $.jqx.browser.version < 9) {
                that.host.css('line-height', that.host.height() + 'px');
            }

            var host = that.baseHost || that.host;

            $.jqx.utilities.resize(host, function () {
                resize();

                if (($.jqx.browser.msie && $.jqx.browser.version < 9 || !$.jqx.browser.msie) && typeof that.height === 'string' && that.height.charAt(that.height.length - 1) === '%') { // height is in percent
                    that.host.css('line-height', that.host.height() + 'px');
                }
            });
        },

        // adds event handlers
        _addHandlers: function () {
            var that = this, id;
            if (that.baseHost) {
                id = that.baseHost[0].id;
            } else {
                id = that.element.id;
            }
            var specialCharacters = [8, 9, 13, 32, 35, 36, 37, 38, 39, 40, 46]; // backspace, tab, enter, space, end, home, left arrow, up arrow, right arrow, down arrow, delete

            that.addHandler(that.host, 'focus.jqxComplexInput' + id, function () {
                that.host.addClass(that.toThemeProperty('jqx-fill-state-focus'));
                if (that._spinButtonsContainer) {
                    that._spinButtonsContainer.addClass(that.toThemeProperty('jqx-fill-state-focus'));
                }

                if (that.bar) {
                    that.bar.addClass('focused');
                }
                if (that.label) {
                    that.label.addClass('focused');
                }

                if (!('placeholder' in that.element) && (that.element.value === that.placeHolder)) {
                    that.element.value = '';
                }

                if (that.decimalNotation !== 'default') {
                    var caretPosition = that._getCaretPosition();
                    that.element.value = that._currentNumber.value;
                    that._setCaretPosition(caretPosition);
                }
            });
            that.addHandler(that.host, 'blur.jqxComplexInput' + id, function () {
                that.host.removeClass(that.toThemeProperty('jqx-fill-state-focus'));
                if (that._spinButtonsContainer) {
                    that._spinButtonsContainer.removeClass(that.toThemeProperty('jqx-fill-state-focus'));
                }

                if (that.bar) {
                    that.bar.removeClass('focused');
                }
                if (that.label) {
                    that.label.removeClass('focused');
                }

                if (that.element.value !== that.value || (('placeholder' in that.element) || (!('placeholder' in that.element) && that.element.value === ''))) {
                    that._onChange(that.value);
                }

                if (!('placeholder' in that.element) && (that.element.value === '' || that.element.value === that.placeHolder)) {
                    that.element.value = that.placeHolder;
                }

                if (that.decimalNotation !== 'default') {
                    that._setNotation();
                }
            });
            that.addHandler(that.host, 'keydown.jqxComplexInput' + id, function (event) {
                var keyCode = !event.charCode ? event.which : event.charCode;
                that.changeType = 'keyboard';
                // Ctrl + C (Copy), Ctrl + V (Paste) and Ctrl + X (Cut) support
                if (event.ctrlKey === true && (keyCode === 67 || keyCode === 86 || keyCode === 88)) {
                    return;
                }

                var key = String.fromCharCode(keyCode);
                if (keyCode >= 96 && keyCode <= 105) { // for numeric keypad keys
                    key = (keyCode - 96).toString();
                    keyCode = keyCode - 48;
                }

                if ((!that._firefox && keyCode === 187 || that._firefox && keyCode === 61) && event.shiftKey === true) {
                    key = '+';
                } else if ((!that._firefox && keyCode === 189 || that._firefox && keyCode === 173) && event.shiftKey === false) {
                    key = '-';
                } else if (keyCode === 190 && event.shiftKey === false) {
                    key = '.';
                }

                var test = that._allowedCharacters.test(key);
                if (test === true) { // test for allowed characters (numbers from 0 to 9, +, - and i)
                    if (key === '+' || key === '-') {
                        var numberOfSigns = (that.element.value.match(/-/g) || []).length + (that.element.value.match(/\+/g) || []).length;
                        if (numberOfSigns > 1) { // no more than two sign characters (+ or -) are allowed
                            return false;
                        }
                    } else if (key === '.') {
                        var numberOfDecSeparators = (that.element.value.match(/\./g) || []).length;
                        if (numberOfDecSeparators > 1) { // no more than two decimal separator characters (.) are allowed
                            return false;
                        }
                    } else if (key.toLowerCase() === 'i') { // no more than one i character is allowed
                        if (that.element.value.indexOf(key.toLowerCase()) !== -1) {
                            return false;
                        }
                    }
                } else if (specialCharacters.indexOf(keyCode) !== -1) {
                    return;
                } else {
                    return false;
                }
            });
            that.addHandler(that.host, 'keypress.jqxComplexInput' + id, function (event) {
                var keyCode = !event.charCode ? event.which : event.charCode;
                if (keyCode === 13) {
                    if (that.element.value !== that.value) {
                        that._onChange(that.value);
                    }
                }
            });

            // spin buttons handlers
            if (that._spinButtonsContainer) {
                var buttons = that._upbutton.add(that._downbutton);

                that.addHandler(that._upbutton, 'mousedown.jqxComplexInputSpinButtonUp' + id, function () {
                    if (!that.disabled && that.value !== '' && that.value !== null) {
                        that._upbutton.addClass(that.toThemeProperty('jqx-fill-state-pressed'));
                        that.changeType = 'mouse';
                        that._incrementOrDecrement(true);
                    }
                });

                that.addHandler(that._upbutton, 'mouseup.jqxComplexInputSpinButtonUp' + id, function () {
                    if (!that.disabled && that.value !== '' && that.value !== null) {
                        that._upbutton.removeClass(that.toThemeProperty('jqx-fill-state-pressed'));
                    }
                });

                that.addHandler(that._downbutton, 'mousedown.jqxComplexInputSpinButtonDown' + id, function () {
                    if (!that.disabled && that.value !== '' && that.value !== null) {
                        that._downbutton.addClass(that.toThemeProperty('jqx-fill-state-pressed'));
                        that.changeType = 'mouse';
                        that._incrementOrDecrement(false);
                    }
                });

                that.addHandler(that._downbutton, 'mouseup.jqxComplexInputSpinButtonDown' + id, function () {
                    if (!that.disabled && that.value !== '' && that.value !== null) {
                        that._downbutton.removeClass(that.toThemeProperty('jqx-fill-state-pressed'));
                    }
                });

                that.addHandler(buttons, 'mouseenter.jqxComplexInputSpinButtons' + id, function (e) {
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
                that.addHandler(buttons, 'mouseleave.jqxComplexInputSpinButtons' + id, function (e) {
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

                that.addHandler($('body'), 'mouseup.jqxComplexInputSpinButtons' + id, function () {
                    that._upbutton.add(that._downbutton).removeClass(that.toThemeProperty('jqx-fill-state-pressed'));
                });
            }
        },

        // removes event handlers
        _removeHandlers: function () {
            var that = this, id;
            if (that.baseHost) {
                id = that.baseHost[0].id;
            } else {
                id = that.element.id;
            }

            that.removeHandler(that.host, 'focus.jqxComplexInput' + id);
            that.removeHandler(that.host, 'blur.jqxComplexInput' + id);
            that.removeHandler(that.host, 'keydown.jqxComplexInput' + id);
            that.removeHandler(that.host, 'keypress.jqxComplexInput' + id);
            if (that._spinButtonsContainer) {
                var buttons = that._upbutton.add(that._downbutton);
                that.removeHandler(that._upbutton, 'mousedown.jqxComplexInputSpinButtonUp' + id);
                that.removeHandler(that._upbutton, 'mouseup.jqxComplexInputSpinButtonUp' + id);
                that.removeHandler(that._downbutton, 'mousedown.jqxComplexInputSpinButtonDown' + id);
                that.removeHandler(that._downbutton, 'mouseup.jqxComplexInputSpinButtonDown' + id);
                that.removeHandler(buttons, 'mouseenter.jqxComplexInputSpinButtons' + id);
                that.removeHandler(buttons, 'mouseleave.jqxComplexInputSpinButtons' + id);
                that.removeHandler($('body'), 'mouseup.jqxComplexInputSpinButtons' + id);
            }
        },

        // change event handler
        _onChange: function (oldValue) {
            var that = this, realValue, imaginaryValue;

            var value = that.element.value.toLowerCase();

            if ($.trim(value) !== '' && $.trim(value) !== that.placeHolder) {
                // validation for double plus/minus/decimal separator
                if (value.indexOf('++') !== -1 || value.indexOf('+-') !== -1) {
                    var plusIndex = value.indexOf('+');
                    value = value.slice(0, plusIndex + 1) + '' + value.slice(plusIndex + 2, value.length);
                } else if (value.indexOf('--') !== -1 || value.indexOf('-+') !== -1) {
                    var minusIndex = value.indexOf('-');
                    value = value.slice(0, minusIndex + 1) + '' + value.slice(minusIndex + 2, value.length);
                }
                if (value.indexOf('..') !== -1) {
                    var decimalSeparatorIndex = value.indexOf('.');
                    value = value.slice(0, decimalSeparatorIndex + 1) + '' + value.slice(decimalSeparatorIndex + 2, value.length);
                }

                var real = that._getReal(value);
                var imaginary = that._getImaginary(value);
                var space = ' ';
                var sign = imaginary >= 0 ? '+' : '-';
                var i = 'i';

                realValue = real;
                imaginaryValue = imaginary;

                // NaN validation
                if (isNaN(realValue) || isNaN(imaginaryValue)) {
                    that.element.value = oldValue;
                    return;
                }

                that.element.value = real + '' + space + '' + sign + '' + space + '' + Math.abs(imaginary) + '' + i;
                that.value = that.element.value;
            } else {
                realValue = 0;
                imaginaryValue = 0;
                that.value = '';
            }

            if (that.value !== oldValue) {
                that._currentNumber = { value: that.value, realPart: realValue, imaginaryPart: imaginaryValue };
                that._raiseEvent('0', { 'value': that.value, 'oldValue': oldValue, 'realPart': realValue, 'imaginaryPart': imaginaryValue }); // change event
            }
        },

        // increments or decrements the real or imaginary part depending on caret position
        _incrementOrDecrement: function (increment) {
            var that = this,
                caretPosition,
                middle,
                focused = that.host.is(':focus'),
                currentValue = that.element.value,
                real = that._currentNumber.realPart,
                imaginary = that._currentNumber.imaginaryPart;

            if (focused) {
                caretPosition = that._getCaretPosition();
            }

            if (imaginary >= 0) {
                middle = currentValue.indexOf('+');
            } else {
                if (currentValue.charAt(0) === '-') {
                    currentValue = currentValue.slice(1, currentValue.length);
                }
                middle = currentValue.indexOf('-');
            }

            function incDecPart(part) {
                var stringValue = part.toString(),
                    separatorIndex = stringValue.indexOf('.'),
                    separator,
                    intPart,
                    fractPart;

                if (separatorIndex !== -1) {
                    intPart = parseInt(stringValue.slice(0, separatorIndex), 10);
                    fractPart = stringValue.slice(stringValue.indexOf('.') + 1);
                    separator = '.';
                } else {
                    intPart = part;
                    fractPart = '';
                    separator = '';
                }
                if (increment === true) {
                    part = intPart + that.spinButtonsStep;
                } else {
                    part = intPart - that.spinButtonsStep;
                }
                part = parseFloat(part + '' + separator + '' + fractPart);
                return part;
            }

            if (caretPosition === undefined || caretPosition <= middle) {
                real = incDecPart(real);
            } else {
                imaginary = incDecPart(imaginary);
            }

            var sign = imaginary >= 0 ? '+' : '-';
            var newValue = real + ' ' + sign + ' ' + Math.abs(imaginary) + 'i';
            that.element.value = newValue;
            that._onChange(that.value);

            if (focused) {
                that._setCaretPosition(caretPosition);
            } else {
                if (that.decimalNotation !== 'default') {
                    that._setNotation();
                }
            }
        },

        // gets the caret's position
        _getCaretPosition: function () {
            var input = this.element;
            if ('selectionStart' in input) {
                return input.selectionStart;
            } else if (document.selection) {
                input.focus();
                var sel = document.selection.createRange();
                var selLen = document.selection.createRange().text.length;
                sel.moveStart('character', -input.value.length);
                return sel.text.length - selLen;
            }
        },

        // sets the caret's position
        _setCaretPosition: function (pos) {
            var input = this.element;
            setTimeout(function () {
                if ('selectionStart' in input) {
                    input.focus();
                    input.setSelectionRange(pos, pos);
                } else {
                    var range = input.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', pos);
                    range.moveStart('character', pos);
                    range.select();
                }
            }, 10);
        },

        // returns the decimal notations of the real and imaginary parts from a value in exponential notation
        _exponentialToDecimal: function (value) {
            var middle = value.indexOf('e') + 2;
            var temp = value.slice(middle);
            var plusIndex = temp.indexOf('+');
            var minusIndex = temp.indexOf('-');
            if (plusIndex !== -1 && (plusIndex < minusIndex || minusIndex === -1)) {
                middle = plusIndex;
            } else {
                middle = minusIndex;
            }
            var imaginary = temp.slice(middle);
            var real = value.replace(imaginary, '');
            imaginary = imaginary.slice(0, imaginary.length - 1);
            var sign = imaginary.charAt(0);
            imaginary = $.trim(imaginary.slice(1));
            if (sign === '-') {
                imaginary = '-' + imaginary;
            }

            real = parseFloat(real).toFixed(20) * 1;
            imaginary = parseFloat(imaginary).toFixed(20) * 1;
            return { realPart: real, imaginaryPart: imaginary };
        },

        // transforms the complex number to the notation specified by the decimalNotation property
        _setNotation: function () {
            var that = this;

            var real = that.getDecimalNotation(that._currentNumber.realPart, that.decimalNotation);
            var imaginary = that.getDecimalNotation(Math.abs(that._currentNumber.imaginaryPart), that.decimalNotation);
            var sign = that._currentNumber.imaginaryPart >= 0 ? '+' : '-';
            that.element.value = real + ' ' + sign + ' ' + imaginary + 'i';
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
        }
    });
})(jqxBaseFramework); //ignore jslint
