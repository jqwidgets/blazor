/* tslint:disable */
/* eslint-disable */
(function ($) {
    'use strict';
    $.jqx.jqxWidget('jqxNavigationBar', '', {});

    $.extend($.jqx._jqxNavigationBar.prototype, {

        defineInstance: function () {
            var settings = {
                //// properties common for both jqxExpander and jqxNavigationBar
                width: 'auto',
                height: 'auto',
                expandAnimationDuration: 250,
                collapseAnimationDuration: 250,
                animationType: 'slide', // possible values: 'slide', 'fade', 'none'
                toggleMode: 'click', //possible values: 'click', 'dblclick', 'none'
                showArrow: true, // possible values: true, false
                arrowPosition: 'right', // possible values: 'left', 'right'
                disabled: false, // possible values: true, false
                initContent: null, // callback function
                rtl: false, // possible values: true, false
                easing: 'easeInOutSine', // possible values: easeOutBack, easeInQuad, easeInOutCirc, easeInOutSine, easeInCubic, easeOutCubic, easeInOutCubic, easeInSine, easeOutSine, easeInOutSine
                //// jqxNavigationBar-specific properties
                expandMode: 'singleFitHeight', // possible values: 'single', 'singleFitHeight', 'multiple', 'toggle', 'none'
                expandedIndexes: [], // possible values: empty array (no expanded items) or an array of positive integers
                _expandModes: ['singleFitHeight', 'single', 'multiple', 'toggle', 'none'],
                aria:
                {
                    'aria-disabled': { name: 'disabled', type: 'boolean' }
                },

                //// events
                events: ['expandingItem', 'expandedItem', 'collapsingItem', 'collapsedItem']
            };
            if (this === $.jqx._jqxNavigationBar.prototype) {
                return settings;
            }
            $.extend(true, this, settings);
            return settings;
        },

        createInstance: function () {
            this._isTouchDevice = $.jqx.mobile.isTouchDevice();
            // renders the widget
            $.jqx.aria(this);
            this.render();
        },

        //// methods

        val: function (value) {
            if (arguments.length === 0 || typeof (value) == 'object') {
                return this.expandedIndexes;
            }

            if (typeof value == 'string') {
                this.expandedIndexes.push(parseInt(value, 10));
                this._applyExpandedIndexes();
            }
            else {
                if (value instanceof Array) {
                    this.expandedIndexes = value;
                }
                else {
                    this.expandedIndexes = [value];
                }
                this._applyExpandedIndexes();
            }
            return this.expandedIndexes;
        },

        //// public methods

        // expands the content
        expandAt: function (index) {
            var that = this;
            if (this.expandMode == 'single' || this.expandMode == 'singleFitHeight' || this.expandMode == 'toggle') {
                for (var i = 0; i < that.items.length; i++) {
                    if (i != index) {
                        that.collapseAt(i);
                    }
                }
            }

            var selectedItem = this.items[index];
            if (selectedItem.disabled === false && selectedItem.expanded === false && selectedItem._expandChecker == 1) {
                selectedItem._expandChecker = 0;
                this._raiseEvent('0', { item: index });
                selectedItem._headerHelper.removeClass(this.toThemeProperty('jqx-fill-state-normal'));
                selectedItem._headerHelper.addClass(this.toThemeProperty('jqx-fill-state-pressed jqx-expander-header-expanded'));
                selectedItem._arrowHelper.removeClass(this.toThemeProperty('jqx-icon-arrow-down jqx-icon-arrow-down-hover jqx-icon-arrow-up-hover jqx-icon-arrow-down-selected jqx-expander-arrow-top'));
                selectedItem._arrowHelper.addClass(this.toThemeProperty('jqx-icon-arrow-up jqx-icon-arrow-up-selected jqx-expander-arrow-bottom jqx-expander-arrow-expanded'));

                if (this.heightFlag === false) {
                    that.element.style.overflowX = 'hidden';
                    that.element.style.overflowY = 'hidden';
                }

                this.eCFlag = 1;

                switch (this.animationType) {
                    case 'slide':
                        var content = selectedItem._contentHelper,
                            adjust = 0,
                            total = content.outerHeight();

                        content.slideDown(
                            {
                                duration: this.expandAnimationDuration,
                                easing: this.easing,
                                step: function (now, fx) {
                                    fx.now = Math.round(now);
                                    if (fx.prop !== 'height') {
                                        adjust += fx.now;
                                    } else {
                                        if (that._collapseContent) {
                                            fx.now = Math.round(total - that._collapseContent.outerHeight() - adjust);
                                            adjust = 0;
                                        }
                                        else {
                                            fx.now = Math.round(now);
                                        }
                                    }
                                },
                                complete: function () {
                                    selectedItem.expanded = true;
                                    $.jqx.aria(selectedItem._header, 'aria-expanded', true);
                                    $.jqx.aria(selectedItem._content, 'aria-hidden', false);

                                    that._updateExpandedIndexes();
                                    that._raiseEvent('1', { item: index });
                                    that._checkHeight();
                                    if (that.heightFlag === true) {
                                        that.element.style.overflowX = 'hidden';
                                        that.element.style.overflowY = 'auto';
                                    }
                                    if (that.initContent && selectedItem._initialized === false) {
                                        that.initContent(index);
                                        selectedItem._initialized = true;
                                    }
                                    that.eCFlag = 0;
                                }
                            });
                        break;
                    case 'fade':
                        setTimeout(function () {
                            selectedItem._contentHelper.fadeIn(
                                {
                                    duration: this.expandAnimationDuration,
                                    complete: function () {
                                        selectedItem.expanded = true;
                                        $.jqx.aria(selectedItem._header, 'aria-expanded', true);
                                        $.jqx.aria(selectedItem._content, 'aria-hidden', false);
                                        that._updateExpandedIndexes();
                                        that._raiseEvent('1', { item: index });
                                        that._checkHeight();
                                        if (that.heightFlag === true) {
                                            that.element.style.overflowX = 'hidden';
                                            that.element.style.overflowY = 'auto';
                                        }
                                        if (that.initContent && selectedItem._initialized === false) {
                                            that.initContent(index);
                                            selectedItem._initialized = true;
                                        }
                                        that.eCFlag = 0;
                                    }
                                });
                        }, this.collapseAnimationDuration);
                        break;
                    case 'none':
                        selectedItem._content.style.display = '';
                        selectedItem.expanded = true;
                        $.jqx.aria(selectedItem._header, 'aria-expanded', true);
                        $.jqx.aria(selectedItem._content, 'aria-hidden', false);
                        this._updateExpandedIndexes();
                        this._raiseEvent('1', { item: index });
                        this._checkHeight();
                        if (this.heightFlag === true) {
                            that.element.style.overflowX = 'hidden';
                            that.element.style.overflowY = 'auto';
                        }
                        if (this.initContent && selectedItem._initialized === false) {
                            this.initContent(index);
                            selectedItem._initialized = true;
                        }
                        this.eCFlag = 0;
                        break;
                }
            }
        },

        // collapses the content
        collapseAt: function (index) {
            var selectedItem = this.items[index];
            if (selectedItem.disabled === false && selectedItem.expanded === true && selectedItem._expandChecker === 0) {
                var that = this;
                selectedItem._expandChecker = 1;
                this._raiseEvent('2', { item: index });
                selectedItem._headerHelper.removeClass(this.toThemeProperty('jqx-fill-state-pressed jqx-expander-header-expanded'));
                selectedItem._headerHelper.addClass(this.toThemeProperty('jqx-fill-state-normal'));
                selectedItem._arrowHelper.removeClass(this.toThemeProperty('jqx-icon-arrow-up jqx-icon-arrow-up-selected jqx-icon-arrow-down-selected jqx-expander-arrow-bottom jqx-expander-arrow-expanded'));
                selectedItem._arrowHelper.addClass(this.toThemeProperty('jqx-icon-arrow-down jqx-expander-arrow-top'));

                if (this.heightFlag === false) {
                    that.element.style.overflowX = 'hidden';
                    that.element.style.overflowY = 'hidden';
                }

                this.eCFlag = 1;
                this._collapseContent = selectedItem._contentHelper;

                switch (this.animationType) {
                    case 'slide':
                        var content = selectedItem._contentHelper;
                        content.slideUp({
                            duration: this.collapseAnimationDuration,
                            step: function (now, fx) {
                                fx.now = Math.round(now);
                            },
                            easing: this.easing,
                            complete: function () {
                                selectedItem.expanded = false;
                                selectedItem._content.style.display = 'none';

                                $.jqx.aria(selectedItem._header, 'aria-expanded', false);
                                $.jqx.aria(selectedItem._content, 'aria-hidden', true);

                                that._updateExpandedIndexes();
                                that._raiseEvent('3', { item: index });
                                that._checkHeight();
                                if (that.heightFlag === true) {
                                    that.element.style.overflowX = 'hidden';
                                    that.element.style.overflowY = 'auto';
                                }
                                that.eCFlag = 0;
                                that._collapseContent = null;
                            }
                        });
                        break;
                    case 'fade':
                        selectedItem._contentHelper.fadeOut({
                            duration: this.collapseAnimationDuration,
                            complete: function () {
                                selectedItem.expanded = false;
                                $.jqx.aria(selectedItem._header, 'aria-expanded', false);
                                $.jqx.aria(selectedItem._content, 'aria-hidden', true);
                                that._updateExpandedIndexes();
                                that._raiseEvent('3', { item: index });
                                that._checkHeight();
                                if (that.heightFlag === true) {
                                    that.element.style.overflowX = 'hidden';
                                    that.element.style.overflowY = 'auto';
                                }
                                that.eCFlag = 0;
                            }
                        });
                        break;
                    case 'none':
                        selectedItem._content.style.display = 'none';
                        selectedItem.expanded = false;
                        $.jqx.aria(selectedItem._header, 'aria-expanded', false);
                        $.jqx.aria(selectedItem._content, 'aria-hidden', true);

                        this._updateExpandedIndexes();
                        this._raiseEvent('3', { item: index });
                        this._checkHeight();
                        if (this.heightFlag === true) {
                            that.element.style.overflowX = 'hidden';
                            that.element.style.overflowY = 'auto';
                        }
                        this.eCFlag = 0;
                        break;
                }
            }
        },

        // sets the header content of a specific item
        setHeaderContentAt: function (index, headerContent) {
            this.items[index]._headerText.innerHTML = headerContent;
        },

        // gets the header content of a specific item
        getHeaderContentAt: function (index) {
            return this.items[index]._headerText.innerHTML;
        },

        // sets the content of a specific item
        setContentAt: function (index, content) {
            this.items[index]._content.innerHTML = content;
            this._checkContent(index);
        },

        // gets the content of a specific item
        getContentAt: function (index) {
            return this.items[index]._content.innerHTML;
        },

        // shows the arrow at a specific position
        showArrowAt: function (index) {
            this.items[index]._arrow.style.display = 'block';
        },

        // hides the arrow at a specific position
        hideArrowAt: function (index) {
            this.items[index]._arrow.style.display = 'none';
        },

        // enables the widget
        enable: function () {
            this.disabled = false;
            this._enabledDisabledCheck();
            this.refresh();
            $.jqx.aria(this, 'aria-disabled', false);
        },

        // disables the widget
        disable: function () {
            this.disabled = true;
            this._enabledDisabledCheck();
            this.refresh();
            $.jqx.aria(this, 'aria-disabled', true);
        },

        // enables a specific item
        enableAt: function (index) {
            this.items[index].disabled = false;
            this.refresh();
        },

        // disables a specific item
        disableAt: function (index) {
            this.items[index].disabled = true;
            this.refresh();
        },

        // refreshes the widget
        invalidate: function () {
            this.refresh();
        },

        // refreshes the widget
        refresh: function (initialRefresh) {
            if (initialRefresh === true) {
                return;
            }

            this._removeHandlers();
            for (var i = 0; i < this.items.length; i++) {
                this.items[i]._arrow.style.display = this.showArrow ? 'block' : 'none';
            }
            this._updateExpandedIndexes();
            this._setTheme();
            this._setSize();
            this._toggle();
            this._keyBoard();
        },

        // renders the widget
        render: function () {
            this.widgetID = this.element.id;
            var that = this;
            if (this._expandModes.indexOf(this.expandMode) == -1) {
                this.expandMode = 'singleFitHeight';
            }

            $.jqx.utilities.resize(this.host, function () {
                that._setSize();
            });

            that.element.setAttribute('role', 'tablist');
            // creates an array containing all items.
            if (this.items) {
                this._removeHandlers();
                $.each(this.items, function () {
                    this._header.className = '';
                    this._header.setAttribute('tabindex', null);
                    this._header.style.marginTop = '0px';
                    this._headerText.className = '';
                    this._header.innerHTML = this._headerText.innerHTML;
                    this._content.setAttribute('tabindex', null);
                });
            }
            this.items = [];

            var hostChildren = that.host.children(),
                childrenCount = hostChildren.length;

            // checks whether the HTML structure of the widget is valid and alerts the user if not
            var childrenCountExceptionMessage = 'Invalid jqxNavigationBar structure. Please add an even number of child div elements that will represent each item\'s header and content.';
            try {
                if (childrenCount % 2 !== 0) {
                    throw childrenCountExceptionMessage;
                }
            } catch (exception) {
                throw new Error(exception);
            }

            var childrenTypeExceptionMessage = 'Invalid jqxNavigationBar structure. Please make sure all the children elements of the navigationbar are divs.';
            try {
                for (var c = 0; c < childrenCount; c++) {
                    if (hostChildren[c].tagName.toLowerCase() != 'div') {
                        throw childrenTypeExceptionMessage;
                    }
                }
            } catch (exception) {
                throw new Error(exception);
            }

            // selects each initial header and creates a header wrapper
            for (var item = 0; item < childrenCount; item += 2) {
                var header = hostChildren[item];
                header.innerHTML = '<div>' + header.innerHTML + '</div>';
            }

            // populates the items array
            var i = 0;
            var k;
            for (var j = 0; j < childrenCount / 2; j++) {
                k = i + 1;
                var currentItem = {};
                currentItem = {};
                currentItem._header = hostChildren[i];
                currentItem._headerHelper = $(hostChildren[i]);
                hostChildren[i].setAttribute('role', 'tab');

                currentItem._content = hostChildren[k];
                currentItem._contentHelper = $(hostChildren[k]);
                if (currentItem._contentHelper.initAnimate) {
                    currentItem._contentHelper.initAnimate();
                }

                currentItem.expandedFlag = false;
                currentItem.expanded = false;
                currentItem.focusedH = false;
                currentItem.focusedC = false;

                this.items[j] = currentItem;

                hostChildren[k].setAttribute('role', 'tabpanel');
                i += 2;
            }

            // sets which items are expanded
            var expandedIndexesLength = this.expandedIndexes.length;

            if (this.items && this.items.length === 0) {
                return;
            }
            if (this.expandMode == 'single' || this.expandMode == 'singleFitHeight' || this.expandMode == 'toggle' || this.expandMode == 'none') {
                if (expandedIndexesLength !== 0) {
                    this.items[this.expandedIndexes[0]].expanded = true;
                } else if (expandedIndexesLength === 0 && (this.expandMode == 'single' || this.expandMode == 'singleFitHeight')) {
                    this.items[0].expanded = true;
                }
            } else if (this.expandMode == 'multiple') {
                if (expandedIndexesLength !== 0) {
                    for (var l = 0; l < expandedIndexesLength; l++) {
                        that.items[this.expandedIndexes[l]].expanded = true;
                    }
                }
            }

            this._enabledDisabledCheck();

            var tI = 0;
            $.each(this.items, function (index) {
                var item = this;

                // defines the header text section
                item._headerText = $(item._header).children()[0];
                if (!that.rtl) {
                    $(item._headerText).addClass(that.toThemeProperty('jqx-expander-header-content'));
                }
                else {
                    $(item._headerText).addClass(that.toThemeProperty('jqx-expander-header-content-rtl'));
                }

                // appends an arrow to the header
                item._arrow = document.createElement('div');
                item._arrowHelper = $(item._arrow);
                item._header.appendChild(item._arrow);
                if (that.showArrow) {
                    item._arrow.style.display = 'block';
                } else {
                    item._arrow.style.display = 'none';
                }

                // checks if content is expanded initially
                if (item.expanded === true) {
                    item._arrowHelper.addClass(that.toThemeProperty('jqx-icon-arrow-up jqx-icon-arrow-up-selected jqx-expander-arrow-bottom jqx-expander-arrow-expanded'));
                    if (that.initContent) {
                        setTimeout(function () {
                            that.initContent(index);
                            item._initialized = true;
                        }, 10);
                    } else {
                        item._initialized = true;
                    }
                    item._expandChecker = 0;
                    $.jqx.aria(item._header, 'aria-expanded', true);
                    $.jqx.aria(item._content, 'aria-hidden', false);
                } else if (item.expanded === false) {
                    item._arrowHelper.addClass(that.toThemeProperty('jqx-icon-arrow-down jqx-expander-arrow-top'));
                    item._initialized = false;
                    item._expandChecker = 1;
                    item._content.style.display = 'none';
                    $.jqx.aria(item._header, 'aria-expanded', false);
                    $.jqx.aria(item._content, 'aria-hidden', true);
                }

                // sets the tabindex attribute of headers and content if it is not already set
                if (item._header.getAttribute('tabindex') === null) {
                    tI++;
                    item._header.setAttribute('tabindex', tI);
                }
                if (item._content.getAttribute('tabindex') === null) {
                    tI++;
                    item._content.setAttribute('tabindex', tI);
                }
            });

            // sets the expander's theme and classes
            this._setTheme();

            // sets the width and height of the widget
            this._setSize();

            for (var m = 0; m < that.items.length; m++) {
                // checks if the content is empty
                that._checkContent(m);
            }

            // toggles the widget
            this._toggle();

            // adds keyboard interaction
            this._keyBoard();
        },

        // inserts an item at a specific index
        insert: function (index, header, content) {
            var headerEl = document.createElement('div'),
                contentEl = document.createElement('div');
            headerEl.innerHTML = header;
            contentEl.innerHTML = content;

            if (index >= 0 && index <= this.items.length) {
                var previousHeader = this.items[index]._header;
                this.element.insertBefore(headerEl, previousHeader);
                this.element.insertBefore(contentEl, previousHeader);
            } else {
                this.element.appendChild(headerEl);
                this.element.appendChild(contentEl);
            }

            this.render();
        },

        // inserts an item at the bottom of the navigationbar
        add: function (header, content) {
            this.insert(-1, header, content);
        },

        // updates the header and content of an item at a specific index
        update: function (index, header, content) {
            this.setHeaderContentAt(index, header);
            this.setContentAt(index, content);
        },

        // removes an item at a specific index
        remove: function (index) {
            if (isNaN(index)) {
                index = this.items.length - 1;
            }
            if (!this.items[index]) {
                return;
            }

            this.items[index]._header.remove();
            this.items[index]._content.remove();
            this.items.splice(index, 1);
            var expandedIndex = this.expandedIndexes.indexOf(index);
            if (expandedIndex > -1) {
                this.expandedIndexes.splice(expandedIndex, 1);
            }
            this.render();
        },

        // removes the widget
        destroy: function () {
            this._removeHandlers();
            this.host.remove();
        },

        // focuses on the widget
        focus: function () {
            try {
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    if (item.disabled === false) {
                        item._header.focus();
                        return false;
                    }
                }
            } catch (error) { }
        },

        //// private methods

        _applyExpandedIndexes: function () {
            var that = this;
            var expandedIndexesCount = this.expandedIndexes.length;
            for (var i = 0; i < expandedIndexesCount; i++) {
                var eIndex = that.expandedIndexes[i];

                for (var j = 0; j < that.items.length; j++) {
                    var item = that.items[j];
                    if (j == eIndex) {
                        item.expandedFlag = true;
                        if (item.expanded === false) {
                            that.expandAt(j);
                        }
                        if (that.expandMode == 'single' || that.expandMode == 'singleFitHeight' || that.expandMode == 'toggle' || that.expandMode == 'none') {
                            return false;
                        }
                    } else if (j != eIndex && item.expandedFlag === false) {
                        that.collapseAt(j);
                    }
                }
            }
            for (var k = 0; k < that.items.length; k++) {
                that.items[k].expandedFlag = false;
            }
        },

        //// private methods
        propertiesChangedHandler: function (object, key, value) {
            if (value.width && value.height && Object.keys(value).length == 2) {
                object._setSize();
            }
        },

        // called when a property is changed
        propertyChangedHandler: function (object, key, oldvalue, value) { //ignore jslint
            if (object.batchUpdate && object.batchUpdate.width && object.batchUpdate.height && Object.keys(object.batchUpdate).length == 2) {
                return;
            }

            if (key == 'width' || key == 'height') {
                object._setSize();
                return;
            }

            if (key === "theme") {
                object.render();
                return;
            }

            if (key == 'disabled') {
                object._enabledDisabledCheck();
            } else if (key == 'expandedIndexes') {
                object._applyExpandedIndexes();
            } else {
                object.refresh();
            }
        },

        // raises an event
        _raiseEvent: function (id, args) {
            var evt = this.events[id];
            var event = new $.Event(evt);
            event.owner = this;
            event.args = args;
            event.item = event.args.item;
            var result;
            try {
                result = this.host.trigger(event);
            }
            catch (error) {
            }

            return result;
        },

        resize: function (width, height) {
            this.width = width;
            this.height = height;
            this._setSize();
        },

        // sets the width and height of the widget and the position of the arrow
        _setSize: function () {
            var that = this;
            this.headersHeight = 0;

            var paddingLeft = this.items && this.items.length > 0 ? parseInt(this.items[0]._headerHelper.css('padding-left'), 10) : 0;
            var paddingRight = this.items && this.items.length > 0 ? parseInt(this.items[0]._headerHelper.css('padding-right'), 10) : 0;
            var borderOffset = 2;
            var totalOffset = paddingLeft + paddingRight + borderOffset;
            if (isNaN(totalOffset)) {
                totalOffset = 12;
            }

            // sets the size of the widget
            if (this.width == 'auto') {
                that.element.style.width = 'auto';
            } else {
                if (this.width != null && this.width.toString().indexOf('%') != -1) {
                    that.element.style.width = that.width;
                }
                else {
                    that.element.style.width = (parseInt(this.width, 10) + totalOffset) + 'px';
                }
            }
            if (typeof that.height === 'number') {
                that.element.style.height = that.height + 'px';
            } else {
                that.element.style.height = that.height;
            }

            // sets the size of each item
            for (var i = 0; i < that.items.length; i++) {
                var item = that.items[i];

                var arrowPosition = that.arrowPosition;
                if (that.rtl) {
                    switch (arrowPosition) {
                        case 'left':
                            arrowPosition = 'right';
                            break;
                        case 'right':
                            arrowPosition = 'left';
                            break;
                    }
                }

                // sets the arrow position
                if (arrowPosition == 'right') {
                    item._headerText.style['float'] = 'left';
                    item._headerText.style.marginLeft = '0px';
                    item._arrow.style['float'] = 'right';
                    item._arrow.style.position = 'relative';
                } else if (arrowPosition == 'left') {
                    if (that.width == 'auto') {
                        item._headerText.style['float'] = 'left';
                        item._headerText.style.marginLeft = '17px';
                        item._arrow.style['float'] = 'left';
                        item._arrow.style.position = 'absolute';
                    } else {
                        item._headerText.style['float'] = 'right';
                        item._headerText.style.marginLeft = '0px';
                        item._arrow.style['float'] = 'left';
                        item._arrow.style.position = 'relative';
                    }
                }

                // sets the height of the header
                item._header.style.height = 'auto';
                item._headerText.style.minHeight = item._arrow.offsetHeight;
                that.headersHeight += $(item._header).outerHeight();

                item._arrow.style.marginTop = (item._headerText.offsetHeight / 2 - item._arrow.offsetHeight / 2) + 'px';
            }

            // sets the height of the content
            for (var j = 0; j < that.items.length; j++) {
                var currentItem = that.items[j];
                if (that.height != 'auto') {
                    if (that.expandMode == 'single' || that.expandMode == 'toggle' || that.expandMode == 'multiple') {
                        that.element.style.overflowX = 'hidden';
                        that.element.style.overflowY = 'auto';
                    } else if (that.expandMode == 'singleFitHeight') {
                        var padding = parseInt(currentItem._contentHelper.css('padding-top'), 10) + parseInt(currentItem._contentHelper.css('padding-bottom'), 10);
                        if (that.height && that.height.toString().indexOf('%') >= 0) {
                            currentItem._content.style.height = Math.max(0, (that.element.offsetHeight - that.headersHeight - padding + 2)) + 'px';
                        }
                        else {
                            currentItem._content.style.height = Math.max(0, (that.element.offsetHeight - that.headersHeight - padding)) + 'px';
                        }
                    }
                }
            }

            that._checkHeight();
        },

        // toggles the expander
        _toggle: function () {
            var that = this;
            if (this._isTouchDevice === false) {
                switch (this.toggleMode) {
                    case 'click':
                    case 'dblclick':
                        $.each(this.items, function (index) {
                            var item = this;
                            if (item.disabled === false) {
                                that.addHandler(item._header, that.toggleMode + '.navigationbar' + that.widgetID, function () {
                                    that.focusedH = true;
                                    that._animate(index);
                                });
                            }
                        });
                        break;
                    case 'none':
                        break;
                }
            } else {
                if (this.toggleMode != 'none') {
                    $.each(this.items, function (index) {
                        var item = this;
                        if (item.disabled === false) {
                            that.addHandler(item._header, $.jqx.mobile.getTouchEventName('touchstart') + '.' + that.widgetID, function () {
                                that._animate(index);
                            });
                        }
                    });
                } else {
                    return;
                }
            }
        },

        // calls for either expand() or collapse()
        _animate: function (index, keyboard) {
            var that = this;
            var selectedItem = this.items[index];
            if (this.expandMode != 'none' && this.eCFlag != 1) {
                if (this.items[index].expanded === true) {
                    if (this.expandMode == 'multiple' || this.expandMode == 'toggle') {
                        this.collapseAt(index);
                    }
                } else {
                    this.expandAt(index);
                }
                if (!that._isTouchDevice) {
                    if (keyboard !== true) {
                        selectedItem._headerHelper.addClass(this.toThemeProperty('jqx-fill-state-hover jqx-expander-header-hover'));
                        selectedItem._arrowHelper.addClass(this.toThemeProperty('jqx-expander-arrow-top-hover jqx-expander-arrow-down-hover'));
                    }
                    else {
                        selectedItem._headerHelper.removeClass(this.toThemeProperty('jqx-fill-state-hover jqx-expander-header-hover'));
                        selectedItem._arrowHelper.removeClass(this.toThemeProperty('jqx-expander-arrow-top-hover jqx-expander-arrow-down-hover'));
                    }
                }
            }
        },

        // removes event handlers
        _removeHandlers: function () {
            var that = this;
            this.removeHandler(this.host, 'keydown.navigationbar' + this.widgetID);

            for (var i = 0; i < that.items.length; i++) {
                var item = that.items[i];
                that.removeHandler(item._header, 'click.navigationbar' + that.widgetID);
                that.removeHandler(item._header, 'dblclick.navigationbar' + that.widgetID);
                that.removeHandler(item._header, 'mouseenter.navigationbar' + that.widgetID);
                that.removeHandler(item._header, 'mouseleave.navigationbar' + that.widgetID);
                that.removeHandler(item._header, 'focus.navigationbar' + that.widgetID);
                that.removeHandler(item._header, 'blur.navigationbar' + that.widgetID);
                that.removeHandler(item._content, 'focus.navigationbar' + that.widgetID);
                that.removeHandler(item._content, 'blur.navigationbar' + that.widgetID);
                that.removeHandler(item._headerText, 'focus.navigationbar' + that.widgetID);
                that.removeHandler(item._arrow, 'focus.navigationbar' + that.widgetID);
            }
        },

        // sets the expander's theme and classes
        _setTheme: function () {
            var that = this;
            this.host.addClass(this.toThemeProperty('jqx-reset jqx-widget'));
            if (this.rtl === true) {
                this.host.addClass(this.toThemeProperty('jqx-rtl'));
            }

            $.each(this.items, function (index) {
                var item = this,
                    headerHelper = item._headerHelper,
                    arrowHelper = item._arrowHelper,
                    contentHelper = item._contentHelper,
                    headerClass = 'jqx-widget-header jqx-item jqx-expander-header',
                    contentClass = 'jqx-widget-content jqx-expander-content jqx-expander-content-bottom';
                item._header.style.position = 'relative';
                item._content.style.position = 'relative';

                if (item.disabled === false) {
                    headerHelper.removeClass(that.toThemeProperty('jqx-fill-state-disabled'));
                    contentHelper.removeClass(that.toThemeProperty('jqx-fill-state-disabled'));
                    if (item.expanded === true) {
                        headerClass += ' jqx-fill-state-pressed jqx-expander-header-expanded';
                    } else {
                        headerClass += ' jqx-fill-state-normal';
                        headerHelper.removeClass(that.toThemeProperty('jqx-expander-header-expanded'));
                    }

                    if (!that._isTouchDevice) {
                        // adds events on hover over header
                        that.addHandler(item._header, 'mouseenter.navigationbar' + that.widgetID, function () {
                            if (item._expandChecker == 1) {
                                if (!item.focusedH) {
                                    item._header.style.zIndex = 5;
                                }
                                headerHelper.removeClass(that.toThemeProperty('jqx-fill-state-normal jqx-fill-state-pressed'));
                                headerHelper.addClass(that.toThemeProperty('jqx-fill-state-hover jqx-expander-header-hover'));
                                arrowHelper.addClass(that.toThemeProperty('jqx-expander-arrow-top-hover jqx-expander-arrow-down-hover'));
                                if (item.expanded) {
                                    arrowHelper.addClass(that.toThemeProperty('jqx-icon-arrow-up-hover'));
                                } else {
                                    arrowHelper.addClass(that.toThemeProperty('jqx-icon-arrow-down-hover'));
                                }
                            }
                        });
                        that.addHandler(item._header, 'mouseleave.navigationbar' + that.widgetID, function () {
                            if (!item.focusedH) {
                                item._header.style.zIndex = 0;
                            }
                            headerHelper.removeClass(that.toThemeProperty('jqx-fill-state-hover jqx-expander-header-hover'));
                            arrowHelper.removeClass(that.toThemeProperty('jqx-expander-arrow-top-hover jqx-expander-arrow-down-hover jqx-icon-arrow-up-hover jqx-icon-arrow-down-hover'));
                            if (item._expandChecker == 1) {
                                headerHelper.addClass(that.toThemeProperty('jqx-fill-state-normal'));
                            } else {
                                headerHelper.addClass(that.toThemeProperty('jqx-fill-state-pressed'));
                            }
                        });
                    }
                } else {
                    headerClass += ' jqx-fill-state-disabled';
                    contentClass += ' jqx-fill-state-disabled';
                }

                that.host.addClass(that.toThemeProperty('jqx-navigationbar'));
                headerHelper.addClass(that.toThemeProperty(headerClass));
                contentHelper.addClass(that.toThemeProperty(contentClass));
                if (index !== 0) {
                    item._header.style.marginTop = '-1px';
                }
                arrowHelper.addClass(that.toThemeProperty('jqx-expander-arrow'));
            });
        },

        // checks if the content is empty
        _checkContent: function (index) {
            var item = this.items[index];
            var content = item._content;
            this._cntntEmpty = /^\s*$/.test(this.items[index]._content.innerHTML);
            if (this._cntntEmpty === true) {
                content.style.display = 'none';
                content.style.height = '0px';
                item._contentHelper.addClass(this.toThemeProperty('jqx-expander-content-empty'));
            } else {
                if (item.expanded) {
                    content.style.display = 'block';
                }
                if (this.expandMode == 'singleFitHeight') {
                    var plus = 1;
                    if (index !== 0) {
                    //    plus = 2;
                    }
                    content.style.height = Math.max(0, (this.element.offsetHeight - this.headersHeight  + this.items.length - 2)) + 'px';
                } else {
                    content.style.height = 'auto';
                }
                item._contentHelper.removeClass(this.toThemeProperty('jqx-expander-content-empty'));
            }
        },

        // checks if the expanded widget's height is greater than the host element's
        _checkHeight: function () {
            var that = this;

            if (typeof that.width === 'string' && that.width.indexOf('%') !== -1) {
                return;
            }

            var totalHeight = 0;
            var paddingLeft = this.items && this.items.length > 0 ? parseInt(this.items[0]._headerHelper.css('padding-left'), 10) : 0;
            var paddingRight = this.items && this.items.length > 0 ? parseInt(this.items[0]._headerHelper.css('padding-right'), 10) : 0;
            var borderOffset = 2;
            var totalOffset = paddingLeft + paddingRight + borderOffset;
            if (isNaN(totalOffset)) {
                totalOffset = 12;
            }
            var scrollWidth = 17;

            for (var i = 0; i < that.items.length; i++) {
                var item = that.items[i];
                totalHeight += (item.expanded ? item._contentHelper.outerHeight() : 0) + item._headerHelper.outerHeight();
            }
            if (this.width != 'auto' && this.height != 'auto' && this.expandMode != 'singleFitHeight') {
                if (totalHeight > that.element.offsetHeight) {
                    that.element.style.width = (parseInt(this.width, 10) + totalOffset + scrollWidth) + 'px';
                    this.heightFlag = true;
                } else {
                    that.element.style.width = (parseInt(this.width, 10) + totalOffset) + 'px';
                    this.heightFlag = false;
                }
            }
        },

        // checks whether the widget is disabled or enabled
        _enabledDisabledCheck: function () {
            for (var i = 0; i < this.items.length; i++) {
                this.items[i].disabled = this.disabled;
            }
        },

        // updates the array of expanded indexes
        _updateExpandedIndexes: function () {
            var that = this;
            this.expandedIndexes = [];
            $.each(this.items, function (index) {
                var item = this;
                if (item.expanded === true) {
                    that.expandedIndexes.push(index);
                    if (that.expandMode == 'single' || that.expandMode == 'singleFitHeight' || that.expandMode == 'toggle' || that.expandMode == 'none') {
                        return false;
                    }
                }
            });
        },

        // adds keyboard interaction
        _keyBoard: function () {
            var that = this;
            this._focus();

            this.addHandler(this.host, 'keydown.navigationbar' + this.widgetID, function (event) {
                var handled = false,
                    length = that.items.length;
                $.each(that.items, function (index) {
                    var item = this;
                    if ((item.focusedH === true || item.focusedC === true) && item.disabled === false) {

                        // functionality for different keys
                        switch (event.keyCode) {
                            case 13:
                            case 32:
                                if (that.toggleMode != 'none') {
                                    if (item.focusedH === true) {
                                        that._animate(index, true);
                                    }
                                    handled = true;
                                }
                                break;
                            case 37:
                                if (index !== 0) {
                                    that.items[index - 1]._header.focus();
                                } else {
                                    that.items[length - 1]._header.focus();
                                }
                                handled = true;
                                break;
                            case 38:
                                if (event.ctrlKey === false) {
                                    if (index !== 0) {
                                        that.items[index - 1]._header.focus();
                                    } else {
                                        that.items[length - 1]._header.focus();
                                    }
                                } else {
                                    if (item.focusedC === true) {
                                        item._header.focus();
                                    }
                                }
                                handled = true;
                                break;
                            case 39:
                                if (index != length - 1) {
                                    that.items[index + 1]._header.focus();
                                } else {
                                    that.items[0]._header.focus();
                                }
                                handled = true;
                                break;
                            case 40:
                                if (event.ctrlKey === false) {
                                    if (index != length - 1) {
                                        that.items[index + 1]._header.focus();
                                    } else {
                                        that.items[0]._header.focus();
                                    }
                                } else {
                                    if (item.expanded === true) {
                                        item._content.focus();
                                    }
                                }
                                handled = true;
                                break;
                            case 35:
                                if (index != length - 1) {
                                    that.items[length - 1]._header.focus();
                                }
                                handled = true;
                                break;
                            case 36:
                                if (index !== 0) {
                                    that.items[0]._header.focus();
                                }
                                handled = true;
                                break;
                                //                            case 9:     
                                //                                $.each(that.items, function (index, value) {     
                                //                                    var item = this;     
                                //                                    if (item.disabled == false) {     
                                //                                        item._header.focus();     
                                //                                        return false;     
                                //                                    };     
                                //                                });     
                                //                                handled = true;     
                                //                                break;     
                        }
                        return false;
                    }
                });

                if (handled && event.preventDefault) {
                    event.preventDefault();
                }

                return !handled;
            });
        },

        // focuses/blurs the headers and contents of the items
        _focus: function () {
            var that = this;
            if (this.disabled) {
                return;
            }

            $.each(this.items, function () {
                var item = this;
                that.addHandler(item._header, 'focus.navigationbar' + this.widgetID, function () {
                    item.focusedH = true;
                    $.jqx.aria(item._header, 'aria-selected', true);

                    item._headerHelper.addClass(that.toThemeProperty('jqx-fill-state-focus'));
                    item._header.style.zIndex = 10;
                });
                that.addHandler(item._header, 'blur.navigationbar' + this.widgetID, function () {
                    item.focusedH = false;
                    $.jqx.aria(item._header, 'aria-selected', false);
                    if (item._header.className.indexOf('jqx-expander-header-hover') !== -1) {
                        item._header.style.zIndex = 5;
                    } else {
                        item._header.style.zIndex = 0;
                    }
                    item._headerHelper.removeClass(that.toThemeProperty('jqx-fill-state-focus'));
                });
                that.addHandler(item._headerText, 'focus.navigationbar' + this.widgetID, function () {
                    item._header.focus();
                });
                that.addHandler(item._arrow, 'focus.navigationbar' + this.widgetID, function () {
                    item._header.focus();
                });
                that.addHandler(item._content, 'focus.navigationbar' + this.widgetID, function () {
                    item.focusedC = true;
                    item._contentHelper.addClass(that.toThemeProperty('jqx-fill-state-focus'));
                });
                that.addHandler(item._content, 'blur.navigationbar' + this.widgetID, function () {
                    item.focusedC = false;
                    item._contentHelper.removeClass(that.toThemeProperty('jqx-fill-state-focus'));
                });
            });
        }
    });
})(jqxBaseFramework); //ignore jslint
