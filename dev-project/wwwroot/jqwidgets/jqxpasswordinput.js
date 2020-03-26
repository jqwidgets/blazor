/* tslint:disable */
/* eslint-disable */
(function ($)
{
    'use strict';
    $.jqx.jqxWidget('jqxPasswordInput', '', {});

    $.extend($.jqx._jqxPasswordInput.prototype, {

        defineInstance: function ()
        {
            var settings = {
                //// properties
                width: null,
                height: null,
                disabled: false, // possible values: true, false
                rtl: false, // possible values: true, false
                placeHolder: null,
                showStrength: false, // possible values: true, false
                showStrengthPosition: 'right', // possible values: top, bottom, left, right
                maxLength: null,
                minLength: null,
                showPasswordIcon: true, // possible values: true, false
                strengthTypeRenderer: null, // callback function
                passwordStrength: null, // callback function
                changeType: null,
                hint: true,
                localization: { passwordStrengthString: 'Password strength', tooShort: 'Too short', weak: 'Weak', fair: 'Fair', good: 'Good', strong: 'Strong', showPasswordString: 'Show Password' },
                strengthColors: { tooShort: 'rgb(170, 0, 51)', weak: 'rgb(170, 0, 51)', fair: 'rgb(255, 204, 51)', good: 'rgb(45, 152, 243)', strong: 'rgb(118, 194, 97)' }
            };
            if (this === $.jqx._jqxPasswordInput.prototype) {
                return settings;
            }
            $.extend(true, this, settings);
            return settings;
        },

        createInstance: function ()
        {
            var that = this;
            that._inDOM = document.body.contains(that.element);
            // renders the widget
            that.render();
        },

        //// methods

        // public methods

        // renders the widget
        render: function ()
        {
            var that = this;
            var browser = $.jqx.browser.browser;
            var version = $.jqx.browser.version;
            // checks if the user's browser is not Internet Explorer 7 or 8
            this._browserCheck = browser != 'msie' || (version != '7.0' && version != '8.0');
            this.widgetID = that.element.id;

            var typeExceptionMessage = 'Invalid input type. Please set the type attribute of the input element to password.';
            if (this.element.getAttribute('type') != 'password')
            {
                throw typeExceptionMessage;
            }

            this.input = this.element;

            if (that.isMaterialized()) {
                var group = $("<div></div>");
                group.addClass(that.toThemeProperty('jqx-input-group'));
                this.host.after(group);
                var input = this.element;
                var data = this.host.data();

                group.append(input);

                var label = $("<label></label");

                if (this.hint) {
                    label[0].innerHTML = this.placeHolder;
                }

                label.addClass(that.toThemeProperty('jqx-input-label'));
                group.append(label);

                var bar = $("<span></span>");
                group.append(bar);
                bar.addClass(that.toThemeProperty('jqx-input-bar'));

                group[0].id = this.element.id;
                this.element.removeAttribute('id');

                group[0].style.cssText = this.element.style.cssText;
                that.input = that.element;
                this.element.style.cssText = '';
                this.bar = bar;
                this.label = label;
                this.host = group;
                this.element = group[0];
                this.host.data(data);

                var that = this;

                if (that.template) {
                    that.bar.addClass(that.toThemeProperty("jqx-" + that.template));
                    that.label.addClass(that.toThemeProperty("jqx-" + that.template));
                }
            }

            that._hidden = true;

            // sets the widget's theme and classes
            that._setTheme();

            // sets the widget's attributes according to the set properties
            that._setAttributes();

            // appends the Show password icon
            that._showPassword();

            // appends the Show strength tooltip
            that._showStrength();

            $.jqx.utilities.resize(this.host, function ()
            {
                if (!that._inDOM)
                {
                    var parentNode = that.element.parentNode;
                    if (that.element.nextSibling)
                    {
                        parentNode.insertBefore(that.icon, that.element.nextSibling);
                    } else
                    {
                        parentNode.appendChild(that.icon);
                    }
                    that._inDOM = true;
                    return;
                }
                if (that.element === document.activeElement || that.isMaterialized())
                {
                    that._positionIcon();
                    if (that.showStrength)
                    {
                        that.host.jqxTooltip('close');
                    }
                }
            });
        },

        // refreshes the widget
        refresh: function (initialRefresh)
        {
            var that = this;
            if (initialRefresh)
            {
                return;
            }

            that.removeHandler(that.host, 'change.passwordinput' + that.widgetID);
            that.removeHandler(that.host, 'focus.passwordinput' + that.widgetID);
            that.removeHandler(that.host, 'blur.passwordinput' + that.widgetID);
            that.removeHandler(that.host, 'click.passwordinput' + that.widgetID);
            that.removeHandler(that.host, 'keyup.passwordinput' + that.widgetID);
            that.removeHandler(that.icon, 'mousedown.passwordinput' + that.widgetID);
            that.removeHandler($(document), 'mouseup.passwordinput' + that.widgetID);
            that.removeHandler($(document), 'mousedown.passwordinput' + that.widgetID);
            that._setAttributes();
            that._setTheme();
            that._showPassword();
            that._showStrength();
        },

        // gets or sets the password's value
        val: function (value)
        {
            var that = this,
                currentPassword = that.input.value,
                hasPlaceholder = 'placeholder' in that.input;

            if ($.isEmptyObject(value) && value !== '')
            {
                if (!hasPlaceholder && currentPassword === that.placeHolder)
                {
                    currentPassword = '';
                }
                return currentPassword;
            } else
            {
                if (hasPlaceholder && value === currentPassword)
                {
                    return;
                }

                if (!hasPlaceholder)
                {
                    if (value === '')
                    {
                        if (currentPassword !== that.placeHolder)
                        {
                            that.input.value = that.placeHolder;
                            that.input.setAttribute('type', 'text');
                        }
                        return;
                    } else
                    {
                        that.input.setAttribute('type', 'password');
                    }
                }

                that.input.value = value;

                if (that.showStrength === true)
                {
                    that._evaluateStrength(); // re-evaluates the new password strength
                }
            }
        },

        // private methods

        // called when a property is changed
        propertyChangedHandler: function (object, key, oldvalue, value)
        {
            if (key === 'theme')
            {
                $.jqx.utilities.setTheme(oldvalue, value, object.host);
                return;
            }

            if (key == 'disabled')
            {
                // checks if the widget is disabled
                if (object.disabled)
                {
                    object.element.setAttribute('disabled', 'disabled');
                    object.element.className += ' ' + object.toThemeProperty('jqx-fill-state-disabled');
                } else
                {
                    object.host.removeAttr('disabled');
                    object.host.removeClass(object.toThemeProperty('jqx-fill-state-disabled'));
                }
                return;
            }

            if (key == 'placeHolder')
            {
                if (this._browserCheck)
                {
                    if ('placeholder' in this.element)
                    {
                        object.element.setAttribute('placeholder', object.placeHolder);
                    } else
                    {
                        if (object.input.value === '')
                        {
                            object.input.setAttribute('type', 'text');
                            object.input.value = value;
                        } else if (object.input.value == oldvalue)
                        {
                            object.input.value = value;
                        }
                    }
                }
            } else
            {
                this.refresh();
            }
        },

        resize: function (width, height)
        {
            this.width = width;
            this.height = height;
            if (this.width != null && this.width.toString().indexOf("px") != -1) {
                this.element.style.width = this.width;
            }
            else if (this.width != undefined && !isNaN(this.width)) {
                this.element.style.width = this.width + 'px';
            }

            if (this.height != null && this.height.toString().indexOf("px") != -1) {
                this.element.style.height = this.height;
            }
            else if (this.height != undefined && !isNaN(this.height)) {
                this.element.style.height = this.height + 'px';
            };
        },

        // sets the widget's attributes according to the set properties
        _setAttributes: function ()
        {
            var that = this;
            var widget = that.element;

            // sets the widget's width and height
            if (this.width != null && this.width.toString().indexOf("px") != -1) {
                this.element.style.width = this.width;
            }
            else if (this.width != undefined && !isNaN(this.width)) {
                this.element.style.width = this.width + 'px';
            }

            if (this.height != null && this.height.toString().indexOf("px") != -1) {
                this.element.style.height = this.height;
            }
            else if (this.height != undefined && !isNaN(this.height)) {
                this.element.style.height = this.height + 'px';
            };
            if (this.height != null && this.height.toString().indexOf("%") != -1) {
                this.element.style.height = this.height;
            }
            if (this.width != null && this.width.toString().indexOf("%") != -1) {
                this.element.style.width = this.width;
            }
            // sets the maximum number of characters in the password
            if (that.maxLength)
            {
                widget.setAttribute('maxlength', that.maxLength);
            }
            if (that.minLength)
            {
                widget.setAttribute('minLength', that.minLength);
            }

            // sets the placeholder text
            if (that.placeHolder && that._browserCheck)
            {
                if ('placeholder' in that.element)
                {
                    widget.setAttribute('placeholder', that.placeHolder);
                } else
                {
                    if (widget.value === '')
                    {
                        widget.setAttribute('type', 'text');
                        widget.value = that.placeHolder;
                    }
                }
            }

            // checks if the widget is disabled
            if (that.disabled)
            {
                widget.setAttribute('disabled', 'disabled');
                widget.className += ' ' + this.toThemeProperty('jqx-fill-state-disabled');
            } else
            {
                widget.removeAttribute('disabled');
                that.host.removeClass(that.toThemeProperty('jqx-fill-state-disabled'));
            }

            var stopFlag = false;
            that.addHandler(widget, 'change.passwordinput' + that.widgetID, function (event)
            {
                if (!stopFlag)
                {
                    //event.stopImmediatePropagation();
                    event.preventDefault();
                    event.stopPropagation();
                    stopFlag = true;
                    that._raiseEvent();
                    stopFlag = false;
                }
                that._refreshPlaceHolder();
            });

            // binds to the click event
            that.addHandler(widget, 'click.passwordinput' + that.widgetID, function ()
            {
                if (that.showPasswordIcon && that.icon)
                {
                    that.icon.style.display = 'inline';
                    that._positionIcon();
                }
            });

            that.interval = null;
            that.addHandler(widget, 'keydown.passwordinput' + that.widgetID, function ()
            {
                that.changeType = 'keyboard';
                if (that.showPasswordIcon && that.icon)
                {
                    if (that.interval)
                    {
                        clearInterval(that.interval);
                    }
                    var t = 0;
                    that.interval = setInterval(function ()
                    {
                        if (that.icon.style.display != 'none')
                        {
                            that._positionIcon();
                            t++;
                            if (t > 5)
                            {
                                clearInterval(that.interval);
                            }
                        }
                        else
                        {
                            clearInterval(that.interval);
                        }
                    }, 100);
                }
            });

            // binds to the focus event
            that.addHandler(widget, 'focus.passwordinput' + that.widgetID, function ()
            {
                that._focused = true;
                widget.className += ' ' + that.toThemeProperty('jqx-fill-state-focus');
                if (that.placeHolder && that._browserCheck && !('placeholder' in that.element) && widget.value == that.placeHolder)
                {
                    widget.value = '';
                    if (that._hidden)
                    {
                        widget.setAttribute('type', 'password');
                    }
                }
                if (that.val().length > 0)
                {
                    if (that.showStrength)
                    {
                        var cntnt = that.host.jqxTooltip('content');
                        if (cntnt)
                        {
                            that.host.jqxTooltip('open');
                        }
                    }
                }
                if (that.showPasswordIcon && that.icon)
                {
                    that.icon.style.display = 'inline';
                    that._positionIcon();
                }
            });

            // binds to the blur event
            that.addHandler(widget, 'blur.passwordinput' + that.widgetID, function ()
            {
                that._focused = false;
                that.host.removeClass(that.toThemeProperty('jqx-fill-state-focus'));
                if (that.placeHolder && that._browserCheck && !('placeholder' in that.input) && widget.value === '')
                {
                    that.input.value = that.placeHolder;
                    that.input.setAttribute('type', 'text');
                }

                if (that.showPasswordIcon && that._browserCheck)
                {
                    if (that.rtl === false)
                    {
                        that.host.removeClass(that.toThemeProperty('jqx-passwordinput-password-icon-ltr'));
                    } else
                    {
                        that.host.removeClass(that.toThemeProperty('jqx-passwordinput-password-icon-rtl'));
                    }
                }

                if (that.showStrength)
                {
                    that.host.jqxTooltip('close');
                }

                if (that.showPasswordIcon && that.icon)
                {
                    that.icon.style.display = 'none';
                }
            });
        },

        _refreshPlaceHolder: function () {
            var that = this;

            if (!that.isMaterialized()) {
                if ('placeholder' in this.input && !($.jqx.browser.msie && $.jqx.browser.version < 9)) {
                    that.input.setAttribute('placeHolder', that.placeHolder);
                } else {
                    if (that.input.value === '') {
                        that.input.value = that.placeHolder;
                    }
                }
            }

            if (that.input.value !== "") {
                that.element.setAttribute("hint", true);
            }
            else {
                that.element.removeAttribute("hint");
            }

            if (that.label) {
                that.label.innerHTML = that.placeHolder;
            }
        },

        destroy: function ()
        {
            if (this.host.jqxTooltip)
            {
                this.host.jqxTooltip('destroy');
            }
            this.host.remove();
        },

        // sets the widget's theme and classes
        _setTheme: function ()
        {
            var that = this,
                classToAdd = 'jqx-widget jqx-widget-content jqx-input jqx-input-widget jqx-rc-all';

            if (that.rtl)
            {
                classToAdd += ' jqx-rtl';
                that.element.style.direction = 'rtl';
            } else
            {
                that.host.removeClass(that.toThemeProperty('jqx-rtl'));
                that.element.style.direction = 'ltr';
            }
            that.element.className += ' ' + that.toThemeProperty(classToAdd);
        },

        // implements the Show password icon
        _showPassword: function ()
        {
            if (this.showPasswordIcon && this._browserCheck)
            {
                var that = this,
                    icon = document.createElement('span'),
                    eventNamespace = '.passwordinput' + that.widgetID;
                icon.setAttribute('tabindex', -1);
                icon.setAttribute('hasfocus', false);
                icon.setAttribute('title', that.localization.showPasswordString);
                icon.style.position = 'absolute';
                icon.style.display = 'none';
                icon.className = that.toThemeProperty('jqx-passwordinput-password-icon');
                var parentNode = that.element.parentNode;
                if (parentNode)
                {
                    if (that.element.nextSibling)
                    {
                        parentNode.insertBefore(icon, that.element.nextSibling);
                    } else
                    {
                        parentNode.appendChild(icon);
                    }
                }
                that.icon = icon;
                that._positionIcon();
                var hide = function ()
                {
                    that.element.setAttribute('type', 'password');
                    if (that.input) {
                        that.input.setAttribute('type', 'password');
                    }
                    that._hidden = true;
                };
                var toggle = function ()
                {
                    if (that._hidden === false)
                    {
                        hide();
                    } else if (that._hidden)
                    {
                        that.element.setAttribute('type', 'text');
                        if (that.input) {
                            that.input.setAttribute('type', 'text');
                        }
                        that._hidden = false;
                    }
                };

                var isTouchDevice = $.jqx.mobile.isTouchDevice();
                if (isTouchDevice)
                {
                    that.addHandler(that.icon, 'mousedown' + eventNamespace, function ()
                    {
                        toggle();
                        return false;
                    });
                } else
                {
                    that.addHandler(that.icon, 'mousedown' + eventNamespace, function ()
                    {
                        toggle();
                        return false;
                    });
                    that.addHandler($(document), 'mouseup' + eventNamespace, function ()
                    {
                        hide();
                        return false;
                    });
                    that.addHandler($(document), 'mousedown' + eventNamespace, function ()
                    {
                        if (that._focused)
                        {
                            hide();
                        }
                    });
                }
            }
        },

        _positionIcon: function ()
        {
            var hostOffset = this.host.offset(),
                w = this.element.offsetWidth,
                h = this.element.offsetHeight,
                iconHelper = $(this.icon);
            if (this.rtl)
            {
                iconHelper.offset({
                    top: parseInt(hostOffset.top + h / 2 - 10 / 2, 10), left: hostOffset.left + 2
                });
            } else
            {
                iconHelper.offset({
                    top: parseInt(hostOffset.top + h / 2 - 10 / 2, 10), left: hostOffset.left + w - 18
                });
            }
        },

        // implements the Show strength functionality
        _showStrength: function ()
        {
            var that = this;
            if (that.showStrength)
            {
                if (that.host.jqxTooltip)
                {
                    var strengthID = that.widgetID + 'Strength',
                        strengthIDV = strengthID + 'Value',
                        strengthIDI = strengthID + 'Indicator';
                    var content;

                    if (!that.strengthTypeRenderer)
                    {
                        // default content
                        content = '<div style="width: 220px;"><div><span style="font-weight: bold;">' + that.localization.passwordStrengthString + ': </span><span id="' + strengthIDV + '"></span></div><div id="' + strengthIDI + '"></div></div>';
                    } else
                    {
                        // custom content
                        var password = that.input.value;
                        if (!('placeholder' in that.input) && that._browserCheck && password == that.placeHolder)
                        {
                            password = '';
                        }
                        that._countCharacters();
                        var strengthValue = that.localization.tooShort;
                        var newValue = that.strengthTypeRenderer(password, { letters: that.letters, numbers: that.numbers, specialKeys: that.specials }, strengthValue);
                        content = newValue;
                    }

                    that.host.jqxTooltip({
                        theme: that.theme, position: that.showStrengthPosition, content: content, trigger: 'none', autoHide: false, rtl: that.rtl
                    });

                    if (!that.strengthTypeRenderer)
                    {
                        var strengthIndicator = document.getElementById(strengthIDI);
                        document.getElementById(strengthIDV).innerHTML = that.localization.tooShort;
                        strengthIndicator.className += ' jqx-passwordinput-password-strength-inicator';
                        strengthIndicator.style.backgroundColor = that.strengthColors.tooShort;
                        if (that.rtl === false)
                        {
                            strengthIndicator.style['float'] = 'left';
                        } else
                        {
                            strengthIndicator.style['float'] = 'right';
                        }
                    }

                    that._checkStrength();
                } else
                {
                    throw new Error('jqxPasswordInput: Missing reference to jqxtooltip.js');
                }
            }
        },

        // checks the password's strength
        _checkStrength: function ()
        {
            var that = this;

            that.addHandler(that.host, 'keyup.passwordinput' + that.widgetID, function ()
            {
                that._evaluateStrength();
            });
        },

        _raiseEvent: function ()
        {
            var event = new $.Event('change');

            event.args = {
                type: this.changeType
            };
            this.changeType = null;
            event.owner = this;
            var result = this.host.trigger(event);
            return result;
        },

        // evaluates the password strength
        _evaluateStrength: function ()
        {
            var that = this;
            var password = that.input.value;
            var length = password.length;

            that._countCharacters();

            if (length > 0)
            {
                if (that.showStrength)
                {
                    var opened = !that.host.jqxTooltip('opened');
                    if (opened)
                    {
                        that.host.jqxTooltip('open');
                    }
                }
            }

            // default password strength rule
            var strengthCo = that.letters + that.numbers + 2 * that.specials + that.letters * that.numbers / 2 + length;
            var strengthValue;
            if (length < 8)
            {
                strengthValue = that.localization.tooShort;
            } else if (strengthCo < 20)
            {
                strengthValue = that.localization.weak;
            } else if (strengthCo < 30)
            {
                strengthValue = that.localization.fair;
            } else if (strengthCo < 40)
            {
                strengthValue = that.localization.good;
            } else
            {
                strengthValue = that.localization.strong;
            }

            var newValue;
            if (that.strengthTypeRenderer)
            {
                newValue = that.strengthTypeRenderer(password, { letters: that.letters, numbers: that.numbers, specialKeys: that.specials }, strengthValue);
                that.host.jqxTooltip({
                    content: newValue
                });
            } else
            {
                // checks if a custom password strength rule is defined
                if (that.passwordStrength)
                {
                    newValue = that.passwordStrength(password, { letters: that.letters, numbers: that.numbers, specialKeys: that.specials }, strengthValue);
                    $.each(that.localization, function ()
                    {
                        var item = this;
                        if (newValue == item)
                        {
                            strengthValue = newValue;
                            return false;
                        }
                    });
                }

                document.getElementById(that.widgetID + 'StrengthValue').innerHTML = strengthValue;

                var ident = document.getElementById(that.widgetID + 'StrengthIndicator'),
                    width, backgroundColor;

                switch (strengthValue)
                {
                    case that.localization.tooShort:
                        width = '20%';
                        backgroundColor = that.strengthColors.tooShort;
                        break;
                    case that.localization.weak:
                        width = '40%';
                        backgroundColor = that.strengthColors.weak;
                        break;
                    case that.localization.fair:
                        width = '60%';
                        backgroundColor = that.strengthColors.fair;
                        break;
                    case that.localization.good:
                        width = '80%';
                        backgroundColor = that.strengthColors.good;
                        break;
                    case that.localization.strong:
                        width = '100%';
                        backgroundColor = that.strengthColors.strong;
                        break;
                }

                ident.style.width = width;
                ident.style.backgroundColor = backgroundColor;
            }
        },

        // counts the letters, numbers and special characters in the password
        _countCharacters: function ()
        {
            var that = this;
            that.letters = 0;
            that.numbers = 0;
            that.specials = 0;
            var specialCharacters = '<>@!#$%^&*()_+[]{}?:;|\'\"\\,./~`-=';

            var password = that.input.value;
            var length = password.length;
            for (var i = 0; i < length; i++)
            {
                var character = password.charAt(i);
                var code = password.charCodeAt(i);
                // checks if the character is a letter
                if ((code > 64 && code < 91) || (code > 96 && code < 123) || (code > 127 && code < 155) || (code > 159 && code < 166))
                {
                    that.letters += 1;
                    continue;
                }
                // checks if the character is a number
                if (isNaN(character) === false)
                {
                    that.numbers += 1;
                    continue;
                }
                // checks if the character is a special character
                if (specialCharacters.indexOf(character) != -1)
                {
                    that.specials += 1;
                    continue;
                }
            }
        },

        _toPx: function (value)
        {
            if (typeof value === 'number')
            {
                return value + 'px';
            } else
            {
                return value;
            }
        }
    });
})(jqxBaseFramework); //ignore jslint
