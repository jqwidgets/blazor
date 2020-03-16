/* tslint:disable */
/* eslint-disable */
(function ($)
{
    'use strict';

    $.jqx.jqxWidget('jqxMaskedInput', '', { });

    $.extend($.jqx._jqxMaskedInput.prototype, {

        defineInstance: function ()
        {
            var settings = {
                //Type: String
                //Default: null
                //Sets the masked input's value.
                value: null,
                //Type: String.
                //Default: null.
                //Sets the masked input's mask.
                mask: '99999',
                //Type: Number.
                //Default: 0.
                //Sets width of the masked input in pixels. Only positive values have effect.
                width: 200,
                //Type: Number.
                //Default: 0.
                //Sets height of the masked input in pixels. 
                height: 25,
                // Type: String
                // Sets the text alignment.
                textAlign: 'left',
                // Type: Bool
                // Default: false
                // Sets the readOnly state of the input.
                readOnly: false,
                cookies: false,
                // Type: Char
                // Default: '_'
                // Sets the prompt char displayed when an editable char is empty.
                promptChar: '_',
                placeHolder: "",
                template: '',
                rtl: false,
                disabled: false,
                hint:true,
                events:
                [
                   'valueChanged', 'textchanged', 'mousedown', 'mouseup', 'keydown', 'keyup', 'keypress', 'change'
                ],
                aria:
                {
                    'aria-valuenow': { name: 'value', type: 'string' },
                    'aria-disabled': { name: 'disabled', type: 'boolean' }
                }
            };
            if (this === $.jqx._jqxMaskedInput.prototype) {
                return settings;
            }
            $.extend(true, this, settings);
            return settings;
        },

        // creates the masked input's instance. 
        createInstance: function ()
        {
            this.render();
        },

        render: function ()
        {
            var that = this;
            that.element.setAttribute('role', 'textbox');
            that.element.setAttribute('data-role', 'input');

            that.host.addClass(that.toThemeProperty('jqx-maskedinput'));
            var _val = that.element.getAttribute('value');
            if (_val !== undefined && _val !== '' && _val !== null)
            {
                that.value = _val;
            }

            $.jqx.aria(this);
            $.jqx.aria(this, 'aria-multiline', false);
            $.jqx.aria(this, 'aria-readonly', that.readOnly);
            
            that._helpers = [];
            that._helpers['element'] = new jqxHelper(that.element);
            that._helpers['element'].addClass(that.toThemeProperty('jqx-input jqx-input-widget jqx-rc-all jqx-widget jqx-widget-content'));

            var name = that.element.getAttribute('name');

            if (that.element.nodeName.toLowerCase() === 'div')
            {
                that.element.innerHTML = '';
                var inputTag = document.createElement('input');
                inputTag.setAttribute('type', 'textarea');
                inputTag.setAttribute('autocomplete', 'off');
                inputTag.setAttribute('autocorrect', 'off');
                inputTag.setAttribute('autocapitalize', 'off');
                inputTag.setAttribute('spellcheck', false);
                inputTag.setAttribute('name', name);
                that.element.appendChild(inputTag);
                that.maskbox = $(inputTag);
                if (that.disabled)
                {
                    that._helpers['element'].addClass(that.toThemeProperty('jqx-input-disabled jqx-fill-state-disabled'));
                    inputTag.setAttribute('disabled', true);
                }
            }
            else
            {
                that.maskbox = that.host;
                that.element.setAttribute('autocomplete', 'off');
                that.element.setAttribute('autocorrect', 'off');
                that.element.setAttribute('autocapitalize', 'off');
                that.element.setAttribute('spellcheck', false);
                that.element.setAttribute('name', name);
                if (that.disabled)
                {
                    that._helpers['element'].addClass(that.toThemeProperty('jqx-input-disabled jqx-fill-state-disabled'));
                    that.element.setAttribute('disabled', true);
                }
            }

            that._helpers['maskbox'] = new jqxHelper(that.maskbox[0]);
            that._helpers['maskbox'].addClass(that.toThemeProperty('jqx-reset jqx-input-content jqx-widget-content'));

            if (that.rtl)
            {
                that._helpers['maskbox'].addClass(that.toThemeProperty('jqx-rtl'));
            }

            that.propertyChangeMap['disabled'] = function (instance, key, oldVal, value) {
                if (value) {
                    instance._helpers['maskbox'].addClass(that.toThemeProperty('jqx-input-disabled'));
                }
                else {
                    instance._helpers['maskbox'].removeClass(that.toThemeProperty('jqx-input-disabled'));
                }
            };


            that.selectedText = '';
            that.self = this;
            that.oldValue = that._value();
            that.items = [];
            that._initializeLiterals();
            that._render();

            if (that.value != null)
            {
                that.inputValue(that.value.toString());
            }

            if (that.host.parents('form').length > 0)
            {
                that.host.parents('form').on('reset', function ()
                {
                    setTimeout(function ()
                    {
                        that.clearValue();
                    }, 10);
                });
            }

            that.addHandlers();

            if (that.cookies)
            {
                var cookieResult = $.jqx.cookie.cookie('maskedInput.' + that.element.id);
                if (cookieResult)
                {
                    that.val(cookieResult);
                }
            }
        },

        addHandlers: function ()
        {
            var that = this;
            var oldVal = '';

            this.addHandler(this.maskbox, 'blur', function ()
            {
                if (that.rtl)
                {
                    that.maskbox.css('direction', 'ltr');
                }
                that._helpers['maskbox'].removeClass(that.toThemeProperty('jqx-fill-state-focus'));
                if (that.maskbox.val() !== oldVal)
                {
                    that._raiseEvent(7, { type: 'keyboard' });
                    if (that.cookies)
                    {
                        $.jqx.cookie.cookie('maskedInput.' + that.element.id, that.maskbox.val());
                    }
                }
            });

            this.addHandler(this.maskbox, 'focus',
            function ()
            {
                oldVal = that.maskbox[0].value;
                if (that.rtl)
                {
                    that.maskbox[0].style.direction = 'rtl';
                }

                that._helpers['element'].addClass(that.toThemeProperty('jqx-fill-state-focus'));
            });

            this.addHandler(this.host, 'keydown', function (event)
            {
                var isreadOnly = that.readOnly;
                var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;
                if (isreadOnly || that.disabled)
                {
                    return false;
                }
                var result = that._handleKeyDown(event, key);
                if (!result)
                {
                    if (event.preventDefault)
                    {
                        event.preventDefault();
                    }
                    if (event.stopPropagation)
                    {
                        event.stopPropagation();
                    }
                }
                return result;
            });

            this.addHandler(this.host, 'keyup', function (event)
            {
                var isreadOnly = that.readOnly;
                if (isreadOnly || that.disabled)
                {
                    return true;
                }
                if (event.preventDefault)
                {
                    event.preventDefault();
                }
                if (event.stopPropagation)
                {
                    event.stopPropagation();
                }

                return false;
            });

            this.addHandler(this.host, 'keypress', function (event)
            {
                var isreadOnly = that.readOnly;
                var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;
                if (isreadOnly || that.disabled)
                {
                    return true;
                }
                var result = that._handleKeyPress(event, key);
                if (!result)
                {
                    if (event.preventDefault)
                    {
                        event.preventDefault();
                    }
                    if (event.stopPropagation)
                    {
                        event.stopPropagation();
                    }
                }
                return result;
            });
        },

        focus: function ()
        {
            try
            {
                var that = this;
                that.maskbox.focus();
                setTimeout(function ()
                {
                    that.maskbox.focus();
                });
            }
            catch (error)
            {
            }
        },
   
        _getString: function ()
        {
            var s = '';
            for (var i = 0; i < this.items.length; i++)
            {
                var character = this.items[i].character;
                if ((this.items[i].character === this.promptChar) && (this.promptChar !== this.items[i].defaultCharacter))
                {
                    s += this.items[i].defaultCharacter;
                }
                else
                {
                    s += character;
                }
            }

            return s;
        },

        _initializeLiterals: function ()
        {
            if (this.mask === undefined || this.mask === null)
            {
                this.items = [];
                return;
            }
            var that = this;
            var literal = function (character, regex, canEdit) {
                var res = {};
                res.character = character;
                res.regex = regex;
                res.canEdit = canEdit;
                res.defaultCharacter = that.promptChar;
                return res;
            };
            this.mask = this.mask.toString();
            var length = this.mask.length;
            for (var i = 0; i < length; i++)
            {
                var character = this.mask.substring(i, i + 1);
                var regex = '';
                var canEdit = false;

                if (character === '[')
                {
                    for (var j = i; j < length; j++)
                    {
                        var closingCharacter = this.mask.substring(j, j + 1);
                        if (closingCharacter === ']')
                        {
                            break;
                        }
                    }
                    regex = '(' + this.mask.substring(i, j + 1) + ')';
                    i = j;
                    canEdit = true;
                }

                if (character === '#')
                {
                    regex = '(\\d|[+]|[-])';
                    canEdit = true;
                }
                else if (character === '9' || character === '0')
                {
                    regex = '\\d';
                    canEdit = true;
                }
                else if (character === '$')
                {
                    canEdit = false;
                }
                else if (character === '/' || character === ':')
                {
                    canEdit = false;
                }
                else if (character === 'A' || character === 'a')
                {
                    regex = '\\w';
                    canEdit = true;
                }
                else if (character === 'c' || character === 'C')
                {
                    regex = '.';
                    canEdit = true;
                }
                else if (character === 'L' || character === 'l')
                {
                    regex = '([a-zA-Z])';
                    canEdit = true;
                }
 
                var item = {};
                if (canEdit)
                {
                    item = literal(this.promptChar, regex, canEdit);
                }
                else
                {
                    item = literal(character, regex, canEdit);
                }

                this.items.push(item);
            }
        },

        setRegex: function (index, regex, canEdit, defaultCharacter)
        {
            if ((index === null || index === undefined) || (regex === null || regex === undefined)) {
                return;
            }

            if (index < this.items.length)
            {
                this.items[index].regex = regex;
                if (canEdit !== null && canEdit !== undefined)
                {
                    this.items[index].canEdit = canEdit;
                }

                if (defaultCharacter !== null && defaultCharacter !== undefined)
                {
                    this.items[index].defaultCharacter = defaultCharacter;
                }
            }
        },

        _match: function (character, regex)
        {
            var regExpr = new RegExp(regex, 'i');
            return regExpr.test(character);
        },

        _raiseEvent: function (id, arg)
        {
            var evt = this.events[id];
            var args = {};
            args.owner = this;

            var result = true;
            var event = new $.Event(evt);
            event.owner = this;
            args.value = this.inputValue();
            args.text = this.maskedValue();
            if (id === 7)
            {
                args.type = arg.type;
                if (args.type === undefined)
                {
                    args.type = null;
                }
            }
            event.args = args;

            if (id < 2 || id > 6)
            {
                result = this.host.trigger(event);
            }

            return result;
        },


        _handleKeyPress: function (e, key)
        {
            var specialKey = this._isSpecialKey(key, e);
            return specialKey;
        },


        _insertKey: function (key, e)
        {
            var selection = this._selection();
            var rootElement = this;
            var text;
            if (selection.start >= 0 && selection.start < this.items.length)
            {
                var letter = String.fromCharCode(key);
                if (key >= 65 && key <= 90)
                {
                    if (!e.shiftKey)
                    {
                        letter = letter.toLowerCase();
                    }
                }
                var selectedTextDeleted = false;
                for (var i = 0; i < this.items.length; i++)
                {
                    if (i < selection.start)
                    {
                        continue;
                    }

                    var item = rootElement.items[i];
                    if (!item.canEdit)
                    {
                        continue;
                    }

                    if (rootElement._match(letter, item.regex))
                    {
                        if (!selectedTextDeleted && selection.length > 0)
                        {
                            for (var j = selection.start; j < selection.end; j++)
                            {
                                if (rootElement.items[j].canEdit)
                                {
                                    rootElement.items[j].character = rootElement.promptChar;
                                }
                            }

                            text = rootElement._getString();
                            rootElement.maskedValue(text);
                            selectedTextDeleted = true;
                        }

                        item.character = letter;
                        text = rootElement._getString();
                        rootElement.maskedValue(text);

                        if (selection.start < rootElement.items.length)
                        {
                            rootElement._setSelectionStart(i + 1);
                        }

                        break;
                    }
                    else
                    {
                        break;
                    }
                }
            }
        },


        _deleteSelectedText: function ()
        {
            var selection = this._selection();
            var deleted = false;

            if (selection.start > 0 || selection.length > 0)
            {
                for (var i = selection.start; i < selection.end; i++)
                {
                    if (i < this.items.length && this.items[i].canEdit && this.items[i].character !== this.promptChar)
                    {
                        this.items[i].character = this.promptChar;
                        deleted = true;
                    }
                }

                var text = this._getString();
                this.maskedValue(text);
                return deleted;
            }
        },


        _saveSelectedText: function ()
        {
            var selection = this._selection();
            var text = '';
            if (selection.start > 0 || selection.length > 0)
            {
                for (var i = selection.start; i < selection.end; i++)
                {
                    if (this.items[i].canEdit)
                    {
                        text += this.items[i].character;
                    }
                }
            }
            if (window.clipboardData)
            {
                window.clipboardData.setData('Text', text);
            }
            else
            {
                var copyFrom = $('<textarea style=\'position: absolute; left: -1000px; top: -1000px;\'/>');
                copyFrom.val(text);
                $('body').append(copyFrom);
                copyFrom.select();
                setTimeout(function ()
                {
                    document.designMode = 'off';
                    copyFrom.select();
                    copyFrom.remove();
                }, 100);
            }
            return text;
        },


        _pasteSelectedText: function ()
        {
            var selection = this._selection();
            var text = '';
            var k = 0;
            var newSelection = selection.start;
            var clipboardText = '';
            var that = this;
            var paste = function (clipboardText) {
                if (clipboardText !== that.selectedText && clipboardText.length > 0) {
                    that.selectedText = clipboardText;
                    if (that.selectedText === null || that.selectedText === undefined) {
                        return;
                    }
                }

                if (selection.start >= 0 || selection.length > 0) {
                    for (var i = selection.start; i < that.items.length; i++) {
                        if (that.items[i].canEdit) {
                            if (k < that.selectedText.length) {
                                that.items[i].character = that.selectedText[k];
                                k++;
                                newSelection = 1 + i;
                            }
                        }
                    }
                }

                text = that._getString();
                that.maskedValue(text);

                if (newSelection < that.items.length) {
                    that._setSelectionStart(newSelection);
                }
                else {
                    that._setSelectionStart(that.items.length);
                }
            };
            if (window.clipboardData) {
                clipboardText = window.clipboardData.getData('Text');
                paste(clipboardText);
            }
            else {
                var pasteFrom = $('<textarea style=\'position: absolute; left: -1000px; top: -1000px;\'/>');
                $('body').append(pasteFrom);
                pasteFrom.select();
                setTimeout(function () {
                    var value = pasteFrom.val();
                    paste(value);
                    pasteFrom.remove();
                }, 100);
            }
        },

        _handleKeyDown: function (e, key)
        {
            var selection = this._selection();
            var start, i;

            if (key >= 96 && key <= 105)
            {
                key = key - 48;
            }

            var ctrlKey = e.ctrlKey || e.metaKey;
            if ((ctrlKey && key === 97 /* firefox */) || (ctrlKey && key === 65) /* opera */)
            {
                return true;
            } // allow Ctrl+X (cut)
            if ((ctrlKey && key === 120 /* firefox */) || (ctrlKey && key === 88) /* opera */)
            {
                this.selectedText = this._saveSelectedText(e);
                this._deleteSelectedText(e);
                if ($.jqx.browser.msie) {
                    return false;
                }
                return true;
            }
            // allow Ctrl+C (copy)
            if ((ctrlKey && key === 99 /* firefox */) || (ctrlKey && key === 67) /* opera */)
            {
                this.selectedText = this._saveSelectedText(e);
                if ($.jqx.browser.msie) {
                    return false;
                }
                return true;
            }
            // allow Ctrl+Z (undo)
            if ((ctrlKey && key === 122 /* firefox */) || (ctrlKey && key === 90) /* opera */) {
                return false;
            }
            // allow or deny Ctrl+V (paste), Shift+Ins
            if ((ctrlKey && key === 118 /* firefox */) || (ctrlKey && key === 86) /* opera */ || (e.shiftKey && key === 45))
            {
                this._pasteSelectedText();
                if ($.jqx.browser.msie) {
                    return false;
                }
                return true;
            }
        
            // handle backspace.
            if (key === 8)
            {
                if (selection.length === 0)
                {
                    for (i = this.items.length - 1; i >= 0; i--)
                    {
                        if (this.items[i].canEdit && i < selection.end && this.items[i].character !== this.promptChar)
                        {
                            this._setSelection(i, i + 1);
                            break;
                        }
                    }
                }

                selection = this._selection();
                var deletedText = this._deleteSelectedText();

                if (selection.start > 0 || selection.length > 0)
                {
                    if (selection.start <= this.items.length) {
                        if (deletedText) {
                            this._setSelectionStart(selection.start);
                        }
                        else {
                            this._setSelectionStart(selection.start - 1);
                        }
                    }
                }
                return false;
            }

            if (key === 190)
            {
                start = selection.start;
                for (i = start; i < this.items.length; i++)
                {
                    if (this.items[i].character === '.')
                    {
                        this._setSelectionStart(i + 1);
                        break;
                    }
                }
            }
            if (key === 191)
            {
                start = selection.start;
                for (i = start; i < this.items.length; i++)
                {
                    if (this.items[i].character === '/')
                    {
                        this._setSelectionStart(i + 1);
                        break;
                    }
                }
            }
            if (key === 189)
            {
                start = selection.start;
                for (i = start; i < this.items.length; i++)
                {
                    if (this.items[i].character === '-')
                    {
                        this._setSelectionStart(i + 1);
                        break;
                    }
                }
            }
            // handle del.
            if (key === 46) {
                if (selection.length === 0) {
                    for (i = 0; i < this.items.length; i++) {
                        if (this.items[i].canEdit && i >= selection.start && this.items[i].character !== this.promptChar) {
                            this._setSelection(i, i + 1);
                            break;
                        }
                    }
                }

                var oldSelection = selection;
                selection = this._selection();
                if (selection.start >= 0 || selection.length >= 0) {
                    if (selection.start < this.items.length) {
                        if (selection.length <= 1) {
                            if (oldSelection.end !== selection.end) {
                                this._setSelectionStart(selection.end);
                            }
                            else {
                                this._setSelectionStart(selection.end + 1);
                            }
                        }
                        else {
                            this._setSelectionStart(selection.start);
                        }
                    }
                }
                return false;
            }

            this._insertKey(key, e);

            var specialKey = this._isSpecialKey(key, e);

            return specialKey;
        },

        _isSpecialKey: function (key, event)
        {
            if (key === 189 /* dot */ ||
			key === 9 /* tab */ ||
			key === 13 /* enter */ ||
			key === 35 /* end */ ||
			key === 36 /* home */ ||
			key === 37 /* left */ ||
			key === 39 /* right */ ||
        	key === 46 /* del */
		    )
            {
                return true;
            }
            if ((key === 16 && event.shiftKey) || event.ctrlKey || event.metaKey)
            {
                return true;
            }
            return false;
        },

        _selection: function ()
        {
            var selectionLength;
            var e = this.maskbox[0];
            if ('selectionStart' in this.maskbox[0]) {
                selectionLength = e.selectionEnd - e.selectionStart;
                return { start: e.selectionStart, end: e.selectionEnd, length: selectionLength, text: e.value };
            }
            else {
                var r = document.selection.createRange();
                if (r == null) {
                    return { start: 0, end: e.value.length, length: 0 };
                }

                var re = this.maskbox[0].createTextRange();
                var rc = re.duplicate();
                re.moveToBookmark(r.getBookmark());
                rc.setEndPoint('EndToStart', re);
                selectionLength = r.text.length;

                return { start: rc.text.length, end: rc.text.length + r.text.length, length: selectionLength, text: r.text };
            }
        },

        _setSelection: function (start, end)
        {
            if ('selectionStart' in this.maskbox[0])
            {
                this.maskbox[0].focus();
                this.maskbox[0].setSelectionRange(start, end);
            }
            else
            {
                var range = this.maskbox[0].createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', start);
                range.select();
            }
        },

        _setSelectionStart: function (start)
        {
            this._setSelection(start, start);
        },

        refresh: function (internalRefresh)
        {
            if (!internalRefresh)
            {
                this._render();
            }
        },

        resize: function (width, height)
        {
            this.width = width;
            this.height = height;
            this.refresh();
        },

        _render: function ()
        {
            var leftBorder = parseInt(this.host.css('border-left-width'), 10);
            var rightBorder = parseInt(this.host.css('border-left-width'), 10);
            var topBorder = parseInt(this.host.css('border-left-width'), 10);
            var bottomBorder = parseInt(this.host.css('border-left-width'), 10);

            var height = parseInt(this.host.css('height'), 10) - topBorder - bottomBorder;
            var width = parseInt(this.host.css('width'), 10) - leftBorder - rightBorder;
            if (this.width != null && this.width.toString().indexOf('px') !== -1)
            {
                width = this.width;
            }
            else
                if (this.width !== undefined && !isNaN(this.width))
                {
                    width = this.width;
                }

            if (this.height != null && this.height.toString().indexOf('px') !== -1)
            {
                height = this.height;
            }
            else if (this.height !== undefined && !isNaN(this.height))
            {
                height = this.height;
            }

            width = parseInt(width, 10);
            height = parseInt(height, 10);

            if (this.maskbox[0] !== this.element)
            {
                this.maskbox.css({
                    'border-left-width': 0,
                    'border-right-width': 0,
                    'border-bottom-width': 0,
                    'border-top-width': 0
                });
            }

            this.maskbox.css('text-align', this.textAlign);
            var fontSize = this.maskbox.css('font-size');

            if (!isNaN(height))
            {
                this.maskbox.css('height', parseInt(fontSize, 10) + 4 + 'px');
            }

            if (!isNaN(width))
            {
                this.maskbox.css('width', width);
            }

            var top = parseInt(height, 10) - 2 * parseInt(topBorder, 10) - 2 * parseInt(bottomBorder, 10) - parseInt(fontSize, 10);
            if (isNaN(top)) {
                top = 0;
            }
         
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

            if (this.maskbox[0] !== this.element)
            {
                this.maskbox[0].style.height = "100%";
            }
            this.maskbox[0].value = this._getString();

            if (this.width)
            {
                if (this.width.toString().indexOf('%') >= 0)
                {
                    this.element.style.width = this.width;
                }
                if (this.height.toString().indexOf('%') >= 0)
                {
                    this.element.style.height = this.height;
                }
            }

            this._addBarAndLabel(this.maskbox);
            this._updateHint();
        },

        _addBarAndLabel: function (host) {
            var that = this;

            if (that.label) {
                return;
            }

            if (!that.isMaterialized()) {
                return;
            }

            if (this.element instanceof HTMLInputElement) {
                var group = $("<div></div>");
                group.addClass(that.toThemeProperty('jqx-input-group jqx-maskedinput'));
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

                group[0].style.width = this.input.style.width;
                group[0].style.height = this.input.style.height;

                this.label = label;
                this.bar = bar;
                this.element.style = '';
                this.host = group;
                this.element = group[0];
                this.host.data(data);
                
                this.input.style.width = "100%";
                this.input.style.height = "100%";
            }
            else {
                var label = $("<label></label");
                if (this.hint) {
                    label[0].innerHTML = this.placeHolder;
                }
                label.addClass(that.toThemeProperty('jqx-input-label'));
                host.after(label);
                that.label = label;

                var bar = $("<span></span>");
                host.after(bar);
                bar.addClass(that.toThemeProperty('jqx-input-bar'));
                that.bar = bar;

                var that = this;
            }

            if (that.template) {
                that.bar.addClass(that.toThemeProperty("jqx-" + that.template));
                that.label.addClass(that.toThemeProperty("jqx-" + that.template));
            }

        },

        _updateHint: function () {
            var that = this;

            if (!that.hint) {
                return;
            }

            if (that.isMaterialized()) {
                setTimeout(function () {
                    if (that.maskbox[0].value.length === 0) {
                        that.element.removeAttribute('hint');
                        that.label[0].innerHTML = that.placeHolder;
                    }
                    else {
                        that.element.setAttribute('hint', true);
                    }
                });
            }
        },
        destroy: function ()
        {
            var that = this;
            $.jqx.utilities.resize(this.host, null, true);
            that.host.remove();
            that._helpers = [];
        },

        // gets or sets the input's value.
        maskedValue: function (newValue)
        {
            if (newValue === undefined)
            {
                return this._value();
            }

            this.value = newValue;
            this._refreshValue();

            if (this.oldValue !== newValue)
            {
                this._raiseEvent(1, newValue);
                this.oldValue = newValue;
                this._raiseEvent(0, newValue);
            }

            return this;
        },

        // sets a property.
        propertyChangedHandler: function (object, key, oldValue, value)
        {
            if (this.isInitialized === undefined || this.isInitialized === false)
            {
                return;
            }

            if (key === 'rtl')
                {
                    if (object.rtl) {
                    object._helpers['maskbox'].addClass(object.toThemeProperty('jqx-rtl'));
                }
                else {
                     object._helpers['maskbox'].removeClass(object.toThemeProperty('jqx-rtl'));
                }
            }

            if (key === 'value')
            {
                if (value === undefined || value === null) {
                    value = '';
                }
                if (value === '')
                {
                    this.clear();
                }
                else
                {
                    value = value.toString();
                    this.inputValue(value);
                }
                object._raiseEvent(7, value);
            }

            if (key === 'theme')
            {
                $.jqx.utilities.setTheme(oldValue, value, this.host);
            }

            if (key === 'disabled')
            {
                if (value)
                {
                    object._helpers['maskbox'].addClass(object.toThemeProperty('jqx-input-disabled'));
                    object._helpers['element'].addClass(object.toThemeProperty('jqx-fill-state-disabled'));
                    object._helpers['maskbox'].attr('disabled', true);
                }
                else
                {
                    object._helpers['maskbox'].removeClass(this.toThemeProperty('jqx-input-disabled'));
                    object._helpers['element'].removeClass(this.toThemeProperty('jqx-fill-state-disabled'));
                    object._helpers['maskbox'].attr('disabled', false);
                }
                $.jqx.aria(object, 'aria-disabled', value);
            }

            if (key === 'readOnly')
            {
                this.readOnly = value;
            }

            if (key === 'promptChar')
            {
                for (var i = 0; i < object.items.length; i++)
                {
                    if (object.items[i].character === object.promptChar)
                    {
                        object.items[i].character = value;
                        object.items[i].defaultCharacter = value;
                    }
                }

                object.promptChar = value;
            }

            if (key === 'textAlign')
            {
                object.maskbox.css('text-align', value);
                object.textAlign = value;
            }

            if (key === 'mask')
            {
                object.mask = value;
                object.items = [];
                object._initializeLiterals();
                object.value = object._getString();
                object._refreshValue();
            }
            if (key === 'width')
            {
                object.width = value;
                object._render();
            }
            else if (key === 'height')
            {
                object.height = value;
                object._render();
            }
        },

        // gets the input's value.
        _value: function ()
        {
            var val = this.value;
            return val;
        },

        _getEditStringLength: function ()
        {
            var value = '';
            for (var i = 0; i < this.items.length; i++)
            {
                if (this.items[i].canEdit)
                {
                    value += this.items[i].character;
                }
            }

            return value.length;
        },

        _getEditValue: function ()
        {
            var value = '';
            for (var i = 0; i < this.items.length; i++)
            {
                if (this.items[i].canEdit && this.items[i].character !== this.promptChar)
                {
                    value += this.items[i].character;
                }
            }

            return value;
        },

        parseValue: function (value)
        {
            if (value === undefined || value === null) {
                return null;
            }
            var input = value.toString();
            var newValue = '';
            var x = 0;
            for (var m = 0; m < input.length; m++)
            {
                var data = input.substring(m, m + 1);

                for (var i = x; i < this.items.length; i++)
                {
                    if (this.items[i].canEdit && this._match(data, this.items[i].regex))
                    {
                        newValue += data;
                        x = i;
                        break;
                    }
                }
            }

            return newValue;
        },

        clear: function ()
        {
            this.clearValue();
        },

        // deprecated. to be removed in the next version.
        clearValue: function ()
        {
            this.inputValue('', true);
        },

        val: function (data)
        {
            if (data !== undefined && typeof data !== 'object')
            {
                if (typeof data === 'number' && isFinite(data)) {
                    data = data.toString();
                }

                this.maskedValue(data);
            }

            return this.maskbox[0].value;
        },

        // gets or sets the editable input value.
        inputValue: function (data, fullRefresh)
        {
            var i;

            if (data === undefined || data === null)
            {
                var value = '';
                for (i = 0; i < this.items.length; i++)
                {
                    if (this.items[i].canEdit)
                    {
                        value += this.items[i].character;
                    }
                }

                return value;
            }
            else
            {
                var k = 0;
                data = data.toString();

                for (i = 0; i < this.items.length; i++)
                {
                    if (this.items[i].canEdit)
                    {
                        if (this._match(data.substring(k, k + 1), this.items[i].regex))
                        {
                            this.items[i].character = data.substring(k, k + 1);
                            k++;
                        }
                        else if (fullRefresh)
                        {
                            this.items[i].character = this.promptChar;
                            k++;
                        }
                    }
                }

                var newString = this._getString();
                this.maskedValue(newString);

                return this.inputValue();
            }
        },

        // applies the value to the input.
        _refreshValue: function ()
        {
            var value = this.maskedValue();
            var k = 0;
            for (var i = 0; i < this.items.length; i++)
            {
                if (value.length > k)
                {
                    if (this.items[i].canEdit && this.items[i].character !== value[k])
                    {
                        if ((this._match(value[k], this.items[i].regex) || value[k] === this.promptChar) && value[k].length === 1)
                        {
                            this.items[i].character = value[k];
                        }
                    }
                    k++;
                }
            }

            this.value = this._getString();
            value = this.value;
            this.maskbox[0].value = value;
            $.jqx.aria(this, 'aria-valuenow', value);
        }
    });
})(jqxBaseFramework);
