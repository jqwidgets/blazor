/* tslint:disable */
/* eslint-disable */
(function ($) {
    'use strict';
    $.jqx.jqxWidget('jqxTabs', '', {});

    $.extend($.jqx._jqxTabs.prototype, {

        defineInstance: function () {
            var settings = {
                // Type: Number
                // Default: 250
                // Gets or sets the duration of the scroll animation.
                scrollAnimationDuration: 200,
                // Type: Bool
                // Default: true
                // Gets or sets whether the hover effect is active.
                enabledHover: true,
                // Type: Bool
                // Default: false
                // Gets or sets whether the tab view is disabled.
                disabled: false,
                // Type: Bool
                // Default: false
                // Gets or sets whether the tab view is collapsible.
                collapsible: false,
                // Type: String
                // Default: none
                // Gets or sets the animation type of switching tabs. Possible values ['none', 'fade'].
                animationType: 'none',
                // Type: Bool
                // Default: true
                // Gets or sets whether the scroll animation is enabled.
                enableScrollAnimation: true,
                // Type: Number
                // Default: 450
                // Gets or sets animation duration of showing animation.
                contentTransitionDuration: 450,
                // Type: String
                // Default: click
                // Gets or sets user interaction used for switching the different tabs. Possible values ['click', 'dblclick', 'mouseenter', 'none'].
                toggleMode: 'click',
                // Type: Number
                // Default: 0
                // Gets or sets current selected item.
                selectedItem: 0,
                // Type: Number or String
                // Default: auto
                // Gets or sets widget's height.
                height: 'auto',
                // Type: Number or String
                // Default: auto
                // Gets or sets widget's width.
                width: 'auto',
                // Type: String
                // Default: top
                // Gets or sets widget's navigation location. Possible values ['top', 'bottom'].
                position: 'top',
                // Type: Bool
                // Default: false
                // Gets or sets whether the selection tracker is enabled.
                selectionTracker: false,
                // Type: Bool
                // Default: true
                // Gets or sets whether the scrolling is enabled.
                scrollable: true,
                // Type: String
                // Default: both
                // Gets or sets the position of the scroll arrows. Possible values ['left', 'right', 'both'].
                scrollPosition: 'right',
                // Type: Number
                // Default: 70
                // Gets or sets the scrolling step.
                scrollStep: 70,
                // Type: Bool
                // Default: true
                // Gets or sets whether the tab view's header is with the height equals to the height of it's biggest item.
                autoHeight: true,
                // sets a height of the header
                headerHeight: null,
                // Type: Bool
                // Default: false
                // Gets or sets whether tabs will have close buttons.
                showCloseButtons: false,
                // Type: Bool
                // Default: true
                // Gets or sets whether all tabs can be closed with the 'close' button or with the 'removeAt' function.
                canCloseAllTabs: true,
                // Type: Number
                // Default: 16
                // Gets or sets the close button size.
                closeButtonSize: 16,
                // Type: Number
                // Default: 16
                // Gets or sets the arrow buttons size.
                arrowButtonSize: 16,
                // Type: Bool
                // Default: true
                // Gets or sets whether the keyboard navigation is activated.
                keyboardNavigation: true,
                // Type: Bool
                // Default: false
                // Gets or sets whether the tab view's elements could be reordered.
                reorder: false,
                // Type: Number
                // Default: 300
                // Gets or sets whether the selection tracker animation duration.
                selectionTrackerAnimationDuration: 300,
                //Private variables
                _isTouchDevice: false,
                roundedCorners: true,
                //This variable is used in the expanding and collapsing. Onece when the tab have been collapsed bottom or top (depending ot
                //header's position) border is added to the titles and _headerWrapper's height is increasing with 1px. When the header increase
                //its size with one pixel _headerExpandingBalance is increasing with one, when it's decreased it's decreasing with one.
                _headerExpandingBalance: 0,
                _dragStarted: false,
                _tabCaptured: false,
                //Used in scrolling when the user is dragging any item
                _lastUnorderedListPosition: 0,
                _selectedItem: 0,
                _titleList: [],
                _contentList: [],
                _contentWrapper: null,
                _unorderedList: null,
                _scrollTimeout: null,
                isCollapsed: false,
                touchMode: false,
                initTabContent: null,
                enableDropAnimation: false,
                //This property is used to cancel selecting and unselecting events. It is keeping reference to these events.
                _currentEvent: null,
                //This property indicates is the unordered list wide enough to add scroll arrows
                _needScroll: true,
                //This variable is used for not allowing to the user to perform any action when there is an active animation.
                //Before the animation start we are adding property (with the name of the animated object) to the _isAnimated object and setting it's value to true.
                //When the animation ends we are setting this property to false.
                //In the method which is checking is there an active animation we are checking is there any property with value true.
                _isAnimated: {},
                _events: [
                    'created', 'selected', 'add', 'removed', 'enabled', 'disabled', 'selecting', 'unselecting',
                    'unselected', 'dragStart', 'dragEnd', 'locked', 'unlocked', 'collapsed', 'expanded', 'tabclick'
                ],
                _initTabContentList: [],
                _invalidArgumentExceptions: {
                    'invalidScrollAnimationDuration': 'The scroll animation duration is not valid!',
                    'invalidWidth': 'Width you\'ve entered is invalid!',
                    'invalidHeight': 'Height you\'ve entered is invalid!',
                    'invalidAnimationType': 'You\'ve entered invalid animation type!',
                    'invalidcontentTransitionDuration': 'You\'ve entered invalid value for contentTransitionDuration!',
                    'invalidToggleMode': 'You\'ve entered invalid value for toggleMode!',
                    'invalidPosition': 'You\'ve entered invalid position!',
                    'invalidScrollPosition': 'You\'ve entered invalid scroll position!',
                    'invalidScrollStep': 'You\'ve entered invalid scroll step!',
                    'invalidStructure': 'Invalid structure!',
                    'invalidArrowSize': 'Invalid scroll button size!',
                    'invalidCloseSize': 'Invalid close button size!'
                },
                aria:
                     {
                         'aria-disabled': { name: 'disabled', type: 'boolean' }
                     },

                rtl: false
            };

            if (this === $.jqx._jqxTabs.prototype) {
                return settings;
            }

            $.extend(true, this, settings);
            return settings;
        },

        createInstance: function () {
            this._IE8 = $.jqx.browser.msie && $.jqx.browser.version < 9;
            $.jqx.aria(this);
            this.element.className += ' ' + this.toThemeProperty('jqx-tabs jqx-widget jqx-widget-content');
            this.element.setAttribute('role', 'tablist');
            var elementChildren = this.host.children();
            for (var i = 0; i < elementChildren.length; i++) {
                var child = elementChildren[i];
                if (child.nodeName.toLowerCase() === 'ul') {
                    this._unorderedList = child;
                } else if (child.nodeName.toLowerCase() === 'div') {
                    this._contentList.push(child);
                }
            }

            this._unorderedListHelper = $(this._unorderedList);
            if (this._unorderedListHelper.initAnimate) {
                this._unorderedListHelper.initAnimate();
            }
            this._closeButtonList = [];
            this._selectedItem = this.selectedItem;
            this._isTouchDevice = $.jqx.mobile.isTouchDevice();
            this._needScroll = this.scrollable;
            if (this.selectionTracker) {
                this.selectionTracker = this._seletionTrackerBrowserCheck();
            }
            if (this._isTouchDevice) {
                this.reorder = false;
                this.keyboardNavigation = false;
            }
            //Saving all titles and contents into collections

            this._titleList = this._unorderedListHelper.children();
            var count = this._titleList.length;

            while (count) {
                count--;
                this._titleList[count].setAttribute('role', 'tab');
                if (!this._titleList[count].getAttribute('id')) {
                    this._titleList[count].setAttribute('id', this.element.id + 'Tab' + count);
                }
                this._contentList[count].setAttribute('role', 'tabpanel');
            }
            this._validateProperties();
            this._refresh();
            this._moveSelectionTrack(this._selectedItem, 0);
            if (this.disabled) {
                this.disable();
            }
            this.element.tabIndex = 0;
            this._raiseEvent(0);
            this._enableWindowResize();
        },

        _hiddenParent: function () {
            var that = this;
            if (that.host.css('display') === 'none') {
                return true;
            }
            var hiddenParent = false;
            $.each(that.host.parents(), function () {
                if ($(this).css('display') === 'none') {
                    hiddenParent = true;
                    return false;
                }
            });
            return hiddenParent;
        },

        _enableWindowResize: function () {
            var that = this;
            var hidden = $.jqx.isHidden(that.host);
            $.jqx.utilities.resize(this.host, function () {
                if (hidden) {
                    that._uiRefresh(true);
                    hidden = false;
                }
                else {
                    that.refresh();
                }
                that._refreshBarPosition();
            });
        },

        resize: function (width, height) {
            this.width = width;
            this.height = height;
            var hidden = $.jqx.isHidden(this.host);
            if (hidden) {
                this._uiRefresh(true);
                hidden = false;
            }
            else {
                this.refresh();
            }
        },

        refresh: function (initialRefresh) {
            if (true !== initialRefresh || initialRefresh === undefined) {
                this._setSize();
            }
        },

        _seletionTrackerBrowserCheck: function () {
            var txt = 'Browser CodeName: ' + navigator.appCodeName + '';
            txt += 'Browser Name: ' + navigator.appName + '';
            txt += 'Browser Version: ' + navigator.appVersion + '';
            // txt += 'Cookies Enabled: ' + navigator.cookieEnabled + '';
            txt += 'Platform: ' + navigator.platform + '';
            txt += 'User-agent header: ' + navigator.userAgent + '';

            if (txt.indexOf('IEMobile') !== -1) {
                return false;
            }
            if (txt.indexOf('Windows Phone OS') !== -1) {
                return false;
            }
            if ($.jqx.browser.msie && $.jqx.browser.version <= 7) {
                return false;
            }
            return true;
        },

        render: function () {
            this._refresh();
        },

        _uiRefresh: function (render) {
            //Using this backup variable because after refresh the scroll position should be recovered
            this._unorderedListLeftBackup = this._unorderedListHelper.css('left');

            if (render) {
                this._render();
            }
            this._addStyles();
            this._performLayout();
            this._prepareTabs();
            this._removeEventHandlers();
            this._addEventHandlers();
            if (this._unorderedListLeftBackup === 'auto') {
                this._unorderedListLeftBackup = this._getArrowsDisplacement();
            }
            this._unorderedList.style.left = this._toPx(this._unorderedListLeftBackup);
            if (this.rtl) {
                if (this.scrollable && this._rightArrow && $(this._rightArrow).css('visibility') !== 'hidden') {
                    var buttonsSize = 2 * this.arrowButtonSize;
                    var left = this._width(this.element) - parseInt(this._width(this._unorderedList) + buttonsSize + parseInt(this._unorderedListHelper.css('margin-left'), 10), 10);
                    this._unorderedList.style.left = left + 'px';
                }
            }

            var that = this;

            setTimeout(function () {
                that._performLayout();
            }, 100);
        },

        _refresh: function () {
            if ($.jqx.isHidden(this.host)) {
                return;
            }

            this._uiRefresh(true);

            this.host.addClass('jqx-tabs-header-position-' + this.position);
        },

        _addStyles: function () {
            this._unorderedList.className += ' ' + this.toThemeProperty('jqx-tabs-title-container');
            this._unorderedList.style.outline = 'none';
            this._unorderedList.style.whiteSpace = 'nowrap';
            this._unorderedList.style.marginTop = '0px';
            this._unorderedList.style.marginBottom = '0px';
            this._unorderedList.style.padding = '0px';
            this._unorderedList.style.background = 'transparent';
            this._unorderedList.style.border = 'none';
            this._unorderedList.style.borderStyle = 'none';
            this._unorderedList.style.textIndent = '0px';

            var count = this.length();
            while (count) {
                count--;

                var currentTitle = this._titleList[count],
                    classToApply = 'jqx-tabs-title jqx-item';

                currentTitle.style.padding = '';

                if (this.position === 'bottom') {
                    classToApply += ' jqx-tabs-title-bottom';
                }

                if (currentTitle.disabled) {
                    classToApply += ' jqx-tabs-title-disable jqx-fill-state-disabled';
                }

                switch (this.position) {
                    case 'top':
                        classToApply += ' jqx-rc-t';
                        this._removeClass(this._contentList[count], this.toThemeProperty('jqx-rc-t'));
                        this._contentList[count].className += ' ' + this.toThemeProperty('jqx-rc-b');
                        break;
                    case 'bottom':
                        classToApply += ' jqx-rc-b';
                        this._removeClass(this._contentList[count], this.toThemeProperty('jqx-rc-b'));
                        this._contentList[count].className += ' ' + this.toThemeProperty('jqx-rc-t');
                        break;
                }

                currentTitle.className = 'jqx-reset jqx-disableselect ' + this.toThemeProperty(classToApply);
            }
            if (this.selectionTracker) {
                switch (this.position) {
                    case 'top':
                        this._removeClass(this._selectionTracker, this.toThemeProperty('jqx-rc-b'));
                        this._selectionTracker.className += ' ' + this.toThemeProperty('jqx-rc-t');
                        break;
                    case 'bottom':
                        this._removeClass(this._selectionTracker, this.toThemeProperty('jqx-rc-t'));
                        this._selectionTracker.className += ' ' + this.toThemeProperty('jqx-rc-b');
                        break;
                }
            }
        },

        _raiseEvent: function (eventId, data) {
            var event = new $.Event(this._events[eventId]);
            event.owner = this;
            event.args = data;
            if (eventId === 6 || eventId === 7) {
                event.cancel = false;
                this._currentEvent = event;
            }
            var result = '';
            try {
                result = this.host.trigger(event);
                if (eventId === 1) {
                    var that = this;
                    if (this.selectionTracker || this.animationType !== 'none') {
                        setTimeout(function () {
                            if (!that._initTabContentList[that.selectedItem]) {
                                if (that.initTabContent) {
                                    that.initTabContent(that.selectedItem);
                                    that._initTabContentList[that.selectedItem] = true;
                                }
                            }
                            var event = new $.Event('loadContent');
                            event.owner = this;
                            if (that._contentList.length > 0 && that._contentList[that.selectedItem]) {
                                $(that._contentList[that.selectedItem]).trigger(event);
                            }
                        }, 50 + that.selectionTrackerAnimationDuration);
                    }
                    else {
                        var loadContentEvent = new $.Event('loadContent');
                        if (!that._initTabContentList[that.selectedItem]) {
                            if (that.initTabContent) {
                                that.initTabContent(that.selectedItem);
                                that._initTabContentList[that.selectedItem] = true;
                            }
                        }
                        loadContentEvent.owner = this;

                        var resizeEvent = new $.Event('resize');
                        this.host.trigger(resizeEvent);
                    }
                }
            }
            catch (error) {
                if (error && console) {
                    console.log(error);
                }
            }

            return result;
        },

        _getArrowsDisplacement: function () {
            if (!this._needScroll) {
                return 0;
            }
            var trackerDisplacement;
            var leftArrowWidth = this.arrowButtonSize;
            var rightArrowWidth = this.arrowButtonSize;
            if (this.scrollPosition === 'left') {
                trackerDisplacement = leftArrowWidth + rightArrowWidth;
            } else if (this.scrollPosition === 'both') {
                trackerDisplacement = leftArrowWidth;
            } else {
                trackerDisplacement = 0;
            }
            return trackerDisplacement;
        },

        _scrollRight: function (duration) {
            this._stop(this._unorderedListHelper);
            this._unlockAnimation('unorderedList');
            var scrollWidth = parseInt(this._width(this._unorderedList) + parseInt(this._unorderedListHelper.css('margin-left'), 10), 10),
                hostWidth = this._width(this.element),
                leftArrowWidth, rightArrowWidth,
                unorderedListLeft = parseInt(this._unorderedListHelper.css('left'), 10),
                trackerDisplacement = this._getArrowsDisplacement(),
                left = 0,
                selectionTrackerLeft;
            if (this.scrollable) {
                leftArrowWidth = this._leftArrow.offsetWidth;
                rightArrowWidth = this._rightArrow.offsetWidth;
            } else {
                leftArrowWidth = 0;
                rightArrowWidth = 0;
            }
            duration = (this.enableScrollAnimation) ? duration : 0;
            if (this._width(this._headerWrapper) > parseInt(this._unorderedListHelper.css('margin-left'), 10) + this._width(this._unorderedList)) {
                left = trackerDisplacement;
            } else if (Math.abs(unorderedListLeft) + this.scrollStep <
                Math.abs(hostWidth - scrollWidth) + leftArrowWidth + rightArrowWidth + trackerDisplacement) {
                left = unorderedListLeft - this.scrollStep;
                selectionTrackerLeft = unorderedListLeft - this.scrollStep + parseInt($(this._titleList[this._selectedItem]).position().left, 10);
            } else {
                left = hostWidth - scrollWidth - (2 * this.arrowButtonSize - trackerDisplacement);
                //Making this check because jQuery(selector).position().left is giving different results
                if (left < parseInt(this._unorderedListHelper.css('left'), 10) - 4 &&
                    left > parseInt(this._unorderedListHelper.css('left'), 10) + 4) {
                    selectionTrackerLeft = hostWidth - scrollWidth - leftArrowWidth - rightArrowWidth + parseInt($(this._titleList[this._selectedItem]).position().left, 10);
                }
            }
            this._performScrollAnimation(left, selectionTrackerLeft, duration);
        },

        _scrollLeft: function (duration) {
            this._stop(this._unorderedListHelper);
            this._unlockAnimation('unorderedList');
            var unorderedListLeft = parseInt(this._unorderedListHelper.css('left'), 10),
                trackerDisplacement = this._getArrowsDisplacement(),
                left = 0,
                selectionTrackerLeft;
            //Calculating animation's parameters
            duration = (this.enableScrollAnimation) ? duration : 0;
            if (this._width(this._headerWrapper) >= this._width(this._unorderedList)) {
                left = trackerDisplacement;
            } else if (unorderedListLeft + this.scrollStep < trackerDisplacement) {
                left = unorderedListLeft + this.scrollStep;
                selectionTrackerLeft = unorderedListLeft + this.scrollStep + parseInt($(this._titleList[this._selectedItem]).position().left, 10);
            } else {
                left = trackerDisplacement;
                //Making this check because jQuery(selector).position().left is giving different results
                if (left < parseInt(this._unorderedListHelper.css('left'), 10) - 4 &&
                    left > parseInt(this._unorderedListHelper.css('left'), 10) + 4) {
                    selectionTrackerLeft = parseInt($(this._titleList[this._selectedItem]).position().left, 10);
                }
            }
            this._performScrollAnimation(left, selectionTrackerLeft, duration);
        },

        _performScrollAnimation: function (left, selectionTrackerLeft, duration) {
            var that = this;
            if (selectionTrackerLeft !== undefined) {
                this._moveSelectionTrack(this._selectedItem, 0, selectionTrackerLeft);
            }
            this._lockAnimation('unorderedList');
            that._refreshBarPosition();

            this._unorderedListHelper.animate({ 'left': left }, duration, function () {
                that._moveSelectionTrack(that.selectedItem, 0);
                that._unlockAnimation('unorderedList');
                that._refreshBarPosition();
            });
        },

        _addKeyboardHandlers: function () {
            var that = this;
            if (this.keyboardNavigation) {
                this.addHandler(this.host, 'keydown', function (event) {
                    if (!that._activeAnimation()) {
                        var selectedItem = that._selectedItem;
                        var tracker = that.selectionTracker;
                        //     that.selectionTracker = false;
                        var content = that.getContentAt(selectedItem);
                        if ($(event.target).ischildof(content)) {
                            return true;
                        }
                        if ($(document.activeElement).ischildof($(content))) {
                            return true;
                        }

                        switch (event.keyCode) {
                            case 37:    //left arrow
                                if (that.rtl) {
                                    that.next();
                                } else {
                                    that.previous();
                                }
                                return false;
                            case 39:    //right arrow
                                if (that.rtl) {
                                    that.previous();
                                } else {
                                    that.next();
                                }
                                return false;
                            case 36:    //home
                                that.first();
                                return false;
                            case 35:    //end
                                that.last();
                                return false;
                            case 27:
                                if (that._tabCaptured) {
                                    that._cancelClick = true;
                                    that._uncapture(null, that.selectedItem);
                                    that._tabCaptured = false;
                                }
                                break;
                        }
                        that.selectionTracker = tracker;
                    }
                    return true;
                });
            }
        },

        _addScrollHandlers: function () {
            var that = this;
            this.addHandler(this._leftArrow, 'mousedown', function () {
                that._startScrollRepeat(true, that.scrollAnimationDuration);
            });
            this.addHandler(this._rightArrow, 'mousedown', function () {
                that._startScrollRepeat(false, that.scrollAnimationDuration);
            });
            this.addHandler(this._rightArrow, 'mouseleave', function () {
                clearTimeout(that._scrollTimeout);
            });
            this.addHandler(this._leftArrow, 'mouseleave', function () {
                clearTimeout(that._scrollTimeout);
            });
            this.addHandler($(document), 'mouseup.tab' + this.element.id, this._mouseUpScrollDocumentHandler, this);
            this.addHandler($(document), 'mouseleave.tab' + this.element.id, this._mouseLeaveScrollDocumentHandler, this);
        },

        _mouseLeaveScrollDocumentHandler: function (event) {
            var that = event.data;
            if (!that._scrollTimeout) {
                return;
            }
            clearTimeout(that._scrollTimeout);
        },

        _mouseUpScrollDocumentHandler: function (event) {
            var that = event.data;
            clearTimeout(that._scrollTimeout);
        },

        _mouseUpDragDocumentHandler: function (event) {
            var that = event.data;
            if (that._tabCaptured && that._dragStarted) {
                that._uncapture(event);
            }
            that._tabCaptured = false;
        },

        _addReorderHandlers: function () {
            var that = this;
            that.addHandler($(document), 'mousemove.tab' + that.element.id, that._moveElement, that);
            that.addHandler($(document), 'mouseup.tab' + that.element.id, that._mouseUpDragDocumentHandler, that);
        },

        _addEventHandlers: function () {
            var count = this.length();
            while (count) {
                count--;
                this._addEventListenerAt(count);
            }

            if (this.keyboardNavigation) {
                this._addKeyboardHandlers();
            }
            if (this.scrollable) {
                this._addScrollHandlers();
            }
            if (this.reorder && !this._isTouchDevice) {
                this._addReorderHandlers();
            }
            var that = this;
            try {
                if (document.referrer !== '' || window.frameElement) {
                    if (window.top !== null && window.top !== window.self) {
                        var eventHandle = function () {
                            if (that._tabCaptured) {
                                that._cancelClick = true;
                                that._uncapture(null, that.selectedItem);
                                that._tabCaptured = false;
                            }
                        };
                        var parentLocation = null;
                        if (window.parent && document.referrer) {
                            parentLocation = document.referrer;
                        }

                        if (parentLocation && parentLocation.indexOf(document.location.host) !== -1) {
                            if (window.top.document) {
                                this.addHandler($(window.top.document), 'mouseup.tabs' + this.element.id, eventHandle);
                            }
                        }
                    }
                }
            }
            catch (error) {
            }
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

        _getFocusedItem: function (mouseX) {
            var count = this.length();
            while (count) {
                count--;
                var currentElement = this._titleList[count],
                    currentElementWidth = this._outerWidth(currentElement, true),
                    currentElementX = parseInt($(currentElement).offset().left, 10),
                    currentElementAbsoluteX = currentElementX;
                if ((currentElementAbsoluteX <= mouseX &&
                    currentElementAbsoluteX + currentElementWidth >= mouseX) &&
                    (currentElement !== this._capturedElement) &&
                    (!this._titleList[count].locked) &&
                    (this._titleList[count].disabled !== true)) {
                    return count;
                }
            }

            return -1;
        },

        _uncapture: function (event) {
            var trackerBackup = this.selectionTracker;
            this._unorderedListLeftBackup = this._unorderedListHelper.css('left');
            this._dragStarted = false;
            this._tabCaptured = false;
            var capturedIndex = this._indexOf(this._capturedElement);
            if (!this._capturedElement) {
                return;
            }
            switch (this.position) {
                case 'top':
                    this._capturedElement.style.bottom = '0px';
                    break;
                case 'bottom':
                    this._capturedElement.style.top = '0px';
                    break;
            }
            var mouseOverElementIndex;
            if (event) {
                mouseOverElementIndex = this._getFocusedItem(event.clientX);
            }
            if (mouseOverElementIndex === -1 || !event) {
                this._capturedElement.style.left = '0px';
            } else {
                this._raiseEvent(10, { item: capturedIndex, dropIndex: mouseOverElementIndex });
                this._reorderItems(mouseOverElementIndex, capturedIndex);
            }

            for (var i = 0; i < this._titleList.length; i++) {
                this._titleList[i].style.position = 'static';
            }

            this._reorderHeaderElements();
            this._unorderedList.style.position = 'relative';
            this._unorderedList.style.top = '0px';

            this._prepareTabs();

            if (mouseOverElementIndex === -1 || !event) {
                this._selectedItem = capturedIndex;
                this._moveSelectionTrack(capturedIndex, 0);
                this._addSelectStyle(this._selectedItem, true);
            }
            else {
                this._moveSelectionTrack(this._selectedItem, 0);
                this._addSelectStyle(this._selectedItem, true);
            }

            if (document.selection) {
                document.selection.clear();
            }
            this._unorderedList.style.left = this._toPx(this._unorderedListLeftBackup);
            this.selectionTracker = trackerBackup;
        },

        _reorderItems: function (mouseOverElementIndex, capturedIndex) {
            var selectedItem = this._titleList[this.selectedItem],
                capturedTitle = this._titleList[capturedIndex];
            if (typeof this._capturedElement === 'undefined') {
                this._capturedElement = capturedTitle;
            }
            //Visible reorder
            $(capturedTitle).remove();
            if (capturedIndex < mouseOverElementIndex) {
                if (this._titleList[mouseOverElementIndex + 1]) {
                    this._unorderedList.insertBefore(capturedTitle, this._titleList[mouseOverElementIndex + 1]);
                } else {
                    this._unorderedList.appendChild(capturedTitle);
                }
            } else {
                this._unorderedList.insertBefore(capturedTitle, this._titleList[mouseOverElementIndex]);
            }
            this._reorderElementArrays(mouseOverElementIndex, capturedIndex);
            this._getSelectedItem(selectedItem);
            this._removeEventHandlers();
            this._addEventHandlers();
        },

        _reorderElementArrays: function (mouseOverElementIndex, capturedIndex) {
            //Reordering in the collections and correcting the event handlers
            var capturedContent = this._contentList[capturedIndex];
            if (capturedIndex < mouseOverElementIndex) {
                for (var i = capturedIndex; i <= mouseOverElementIndex; i++) {
                    this._titleList[i] = this._titleList[i + 1];
                    this._contentList[i] = this._contentList[i + 1];
                }
                this._contentList[mouseOverElementIndex] = capturedContent;
                this._titleList[mouseOverElementIndex] = this._capturedElement;
            } else {
                for (var j = capturedIndex; j >= mouseOverElementIndex; j--) {
                    this._titleList[j] = this._titleList[j - 1];
                    this._contentList[j] = this._contentList[j - 1];
                }
                this._contentList[mouseOverElementIndex] = capturedContent;
                this._titleList[mouseOverElementIndex] = this._capturedElement;
            }
        },

        getSelectedItem: function () {
            return this.selectedItem;
        },

        _getSelectedItem: function (selectedItem) {
            //Getting selected item
            var count = this.length();
            while (count) {
                count--;
                if (this._titleList[count] === selectedItem) {
                    this._selectedItem = this.selectedItem = count;
                    break;
                }
            }
        },

        _moveElement: function (event) {
            var that = event.data;
            if (that._tabCaptured) {
                if (document.selection) {
                    document.selection.clear();
                }
                if (!that._dragStarted) {
                    var unorderedListLeft = -parseInt(that._unorderedListHelper.css('left'), 10);

                    if (event.clientX + unorderedListLeft > that._startX + 3 || event.clientX + unorderedListLeft < that._startX - 3) {
                        that._prepareTabForDragging();
                        that._dragStarted = true;
                    }
                } else {
                    that._performDrag(event);
                    clearTimeout(that._scrollTimeout);
                    //         that._dragScroll(event);
                }
            }
        },

        _performDrag: function (event) {
            var zoomFactor = this.getZoomFactor(),
                unorderedListLeft = -parseInt(this._unorderedListHelper.css('left'), 10);

            this._capturedElement.style.left = this._toPx(unorderedListLeft + event.clientX / zoomFactor - this._startX / zoomFactor);
            this._lastX = event.clientX / zoomFactor;
            this._moveSelectionTrack(this.selectedItem, 0);
        },

        getZoomFactor: function () {
            var factor = 1;
            if (document.body.getBoundingClientRect) {
                // rect is only in physical pixel size in IE before version 8 
                var rect = document.body.getBoundingClientRect();
                var physicalW = rect.right - rect.left;
                var logicalW = document.body.offsetWidth;

                // the zoom level is always an integer percent value
                factor = Math.round((physicalW / logicalW) * 100) / 100;
            }
            return factor;
        },

        _prepareTabForDragging: function () {
            this._capturedElement.style.position = 'relative';
            this._capturedElement.style.left = '0px';
            this._capturedElement.style.top = '0px';
            this._capturedElement.style.zIndex = 300;
            this.selectedItem = this._indexOf(this._capturedElement);

            switch (this.position) {
                case 'top':
                    this._capturedElement.style.bottom = this._toPx($(this._capturedElement).css('top'));
                    break;
                case 'bottom':
                    this._capturedElement.style.top = this._toPx($(this._capturedElement).css('top'));
                    break;
            }
            this._raiseEvent(9, { item: this._indexOf(this._capturedElement) });
        },

        _dragScroll: function (event) {
            var lastUnorderedListPosition = parseInt(this._unorderedListHelper.css('left'), 10);
            var that = this,
                headerWrapperHelper = $(that._headerWrapper);
            if (event.clientX <= headerWrapperHelper.offset().left) {
                this._scrollLeft(this.scrollAnimationDuration);
                this._capturedElement.style.left = parseInt($(this._capturedElement).css('left'), 10) + this._lastUnorderedListPosition - lastUnorderedListPosition;
            } else if (event.clientX > headerWrapperHelper.offset().left + that._width(this._headerWrapper)) {
                this._scrollRight(this.scrollAnimationDuration);
                this._capturedElement.style.left = parseInt($(this._capturedElement).css('left'), 10) + this._lastUnorderedListPosition - lastUnorderedListPosition;
            } else {
                that._stop(that._unorderedListHelper);
                this._unlockAnimation('unorderedList');
                clearTimeout(this._scrollTimeout);
            }
            this._scrollTimeout = setTimeout(function () {
                that._dragScroll(event);
            }, this.scrollAnimationDuration);
            this._lastUnorderedListPosition = lastUnorderedListPosition;
        },

        _captureElement: function (event, index) {
            if (!this._tabCaptured &&
                !this._titleList[index].locked &&
                 this._titleList[index].disabled !== true &&
                 !this._activeAnimation()) {
                var unorderedListLeft = -parseInt(this._unorderedListHelper.css('left'), 10);

                this._startX = unorderedListLeft + event.clientX;
                this._startY = event.clientY;
                this._lastX = event.clientX;
                this._lastY = event.clientY;
                this._tabCaptured = true;
                this._capturedElement = this._titleList[index];
            }
        },

        _titleInteractionTrigger: function (index) {
            //Used for removing expand/collapse border fix
            if (this._headerExpandingBalance > 0) {
                this._removeOppositeBorder();
            }
            if (this._selectedItem !== index) {
                this.select(this._titleList[index], 'toggle');
                //If an item have been collapsed and we want to select it
                //before the selection we are uncollapsing the item
                this._titleList[index].collapsed = false;
                if (!this.collapsible) {
                    if (this.height !== 'auto') {
                        this._contentWrapper.style.visibility = 'visible';
                    } else {
                        this._contentWrapper.style.display = 'block';
                    }
                }
            } else if (this.collapsible) {
                if (this.isCollapsed) {
                    this.expand();
                } else {
                    this.collapse();
                }
            }
        },

        //Collapsing the current selected item.
        collapse: function () {
            var index = this._selectedItem,
                that = this;
            this.isCollapsed = true;
            // if (!this._titleList[index].collapsed) {
            //     this._titleList[index].collapsed = true;
            if (that.height !== 'auto') {
                that._contentWrapper.style.visibility = 'hidden';
            } else {
                that._contentWrapper.style.display = 'none';
            }
            that._raiseEvent(13, { item: index });
            if (this.position === 'top') {
                that._headerWrapper.className += ' ' + this.toThemeProperty('jqx-tabs-header-collapsed');
                that.element.className += ' ' + this.toThemeProperty('jqx-tabs-collapsed');
            } else {
                that._headerWrapper.className += ' ' + this.toThemeProperty('jqx-tabs-header-collapsed-bottom');
                that.element.className += ' ' + this.toThemeProperty('jqx-tabs-collapsed-bottom');
            }
        },

        //Expanding the current selected item.
        expand: function () {
            var index = this._selectedItem,
                that = this;
            this.isCollapsed = false;
            //     if (this._titleList[index].collapsed) {
            //       this._titleList[index].collapsed = false;
            this._select(index, that.contentTransitionDuration, null, false, true);
            //Depend on the widget's height we are changing the display or visibility property
            if (that.height !== 'auto') {
                that._contentWrapper.style.visibility = 'visible';
            } else {
                that._contentWrapper.style.display = 'block';
            }
            that._raiseEvent(14, { item: index });
            if (this.position === 'top') {
                that._removeClass(that._headerWrapper, that.toThemeProperty('jqx-tabs-header-collapsed'));
                that._removeClass(that.element, that.toThemeProperty('jqx-tabs-collapsed'));
            }
            else {
                that._removeClass(that._headerWrapper, that.toThemeProperty('jqx-tabs-header-collapsed-bottom'));
                that._removeClass(that.element, that.toThemeProperty('jqx-tabs-collapsed-bottom'));
            }
        },

        _addSelectHandler: function (index) {
            var that = this;
            this.addHandler(this._titleList[index], 'selectstart', function () {
                return false;
            });

            this.addHandler(this._titleList[index], this.toggleMode, (function (index) {
                return function () {
                    that._raiseEvent('15', { item: index });
                    if (!that._tabCaptured && !that._cancelClick) {
                        that._titleInteractionTrigger(index);
                    }
                    return true;
                };

            }(index)));
        },

        _addDragDropHandlers: function (index) {
            var that = this;
            this.addHandler(this._titleList[index], 'mousedown', function (event) {
                that._captureElement(event, index);
             //   return false;
            });

            this.addHandler(this._titleList[index], 'mouseup', function (event) {
                if (that._tabCaptured && that._dragStarted) {
                    that._cancelClick = true;
                    that._uncapture(event, index);
                } else {
                    that._cancelClick = false;
                }
                that._tabCaptured = false;
                return false;
            });
        },

        _removeHoverStates: function () {
            var that = this;
            $.each(this._titleList, function () {
                that._removeClass(this, that.toThemeProperty('jqx-tabs-title-hover-top jqx-tabs-title-hover-bottom'));
            });
        },

        _addHoverHandlers: function (index) {
            var that = this;
            var item = this._titleList[index];

            this.addHandler(item, 'mouseenter mouseleave', function (event) {
                if (index !== that._selectedItem) {
                    var classToAddRemove = 'jqx-fill-state-hover';
                    if (that.position === 'top') {
                        classToAddRemove += ' jqx-tabs-title-hover-top';
                    } else {
                        classToAddRemove += ' jqx-tabs-title-hover-bottom';
                    }
                    if (event.type === 'mouseenter') {
                        item.className += ' ' + that.toThemeProperty(classToAddRemove);
                    } else {
                        that._removeClass(item, that.toThemeProperty(classToAddRemove));
                    }

                    if (that.showCloseButtons) {
                        var closeButton = that._closeButtonList[index];
                        if (event.type === 'mouseenter') {
                            closeButton.className += ' ' + that.toThemeProperty('jqx-tabs-close-button-hover', true);
                        } else {
                            that._removeClass(closeButton, that.toThemeProperty('jqx-tabs-close-button-hover', true));
                        }
                    }
                }
            });
        },

        _addEventListenerAt: function (index) {
            var that = this;
            if (this._titleList[index].disabled) {
                return;
            }
            if (this.reorder && !this._isTouchDevice) {
                this._addDragDropHandlers(index);
            }
            this._addSelectHandler(index);
            if (this.enabledHover) {
                this._addHoverHandlers(index);
            }
            var closeButton = that._closeButtonList[index];
            this.removeHandler(closeButton, 'click');
            this.addHandler(closeButton, 'click', function () {
                that.removeAt(index);
                return false;
            });
        },

        _removeEventHandlers: function () {
            var that = this;
            var count = that.length();
            while (count) {
                count--;
                that._removeEventListenerAt(count);
            }
            if (that.scrollable) {
                that.removeHandler(that._leftArrow, 'mousedown');
                that.removeHandler(that._rightArrow, 'mousedown');
            }
            that.removeHandler($(document), 'mousemove.tab' + that.element.id, that._moveElement);
            that.removeHandler($(document), 'mouseup.tab' + that.element.id, that._mouseUpScrollDocumentHandler);
            that.removeHandler($(document), 'mouseup.tab' + that.element.id, that._mouseUpDragDocumentHandler);
            that.removeHandler(that.host, 'keydown');
        },

        _removeEventListenerAt: function (index) {
            var that = this;
            that.removeHandler(that._titleList[index], that.toggleMode);
            that.removeHandler(that._titleList[index], 'mouseenter');
            that.removeHandler(that._titleList[index], 'mouseleave');
            that.removeHandler(that._titleList[index], 'mousedown');
            that.removeHandler(that._titleList[index], 'mouseup');
            that.removeHandler(that._closeButtonList[index], 'click');
        },

        _moveSelectionTrack: function (item, duration, left) {
            var that = this;
            if (item === -1) {
                return;
            }

            if (this._titleList.length === 0) {
                return;
            }

            if (item >= this._titleList.length) {
                return;
            }

            var currentTitle = this._titleList[item],
                currentTitleHelper = $(currentTitle);

            that._refreshBarPosition();

            if (this.selectionTracker && this._selectionTracker) {
                var leftDisplacement;
                that._stop(that._selectionTrackerHelper);
                this._unlockAnimation('selectionTracker');
                if (left === undefined) {
                    leftDisplacement = parseInt(currentTitleHelper.position().left, 10);
                    if (!isNaN(parseInt(this._unorderedListHelper.css('left'), 10))) {
                        leftDisplacement += parseInt(this._unorderedListHelper.css('left'), 10);
                    }
                    if (!isNaN(parseInt(this._unorderedListHelper.css('margin-left'), 10))) {
                        leftDisplacement += parseInt(this._unorderedListHelper.css('margin-left'), 10);
                    }
                    if (!isNaN(parseInt(currentTitleHelper.css('margin-left'), 10))) {
                        leftDisplacement += parseInt(currentTitleHelper.css('margin-left'), 10);
                    }
                    if (!isNaN(parseInt(currentTitleHelper.css('margin-right'), 10))) {
                        //        leftDisplacement += parseInt(this._titleList[item].css('margin-right'));
                    }
                } else {
                    leftDisplacement = left;
                }
                var topDisplacement = 0;
                var heightDifference = 0;
                if (this.position === 'top') {
                    topDisplacement = this._height(that._headerWrapper) - currentTitle.offsetHeight;
                    if (!this.autoHeight) {
                        heightDifference += parseInt(currentTitleHelper.css('margin-top'), 10);
                    }
                }
                this._lockAnimation('selectionTracker');

                // outerWidth includes the margin-right for some reason.
                // Use this instead: this._titleList[item].width() + this._titleList[item].css('padding-left') + this._titleList[item].css('padding-right');

                var horizontalPadding = parseInt(currentTitleHelper.css('padding-left'), 10) + parseInt(currentTitleHelper.css('padding-right'), 10);

                // the selected item's bottom border should be 0.
                var topOffset = this.position === 'top' ? 0 : 1;
                var headerPadding = parseInt($(this._headerWrapper).css('padding-top'), 10); // -parseInt(this._headerWrapper.css('padding-bottom'));
                var itemPadding = parseInt(currentTitleHelper.css('padding-top'), 10) + parseInt(currentTitleHelper.css('padding-bottom'), 10);
                this._selectionTracker.style.visibility = 'visible';
                this._moveSelectionTrackerContainer.style.visibility = 'visible';
                var topMargin = parseInt(currentTitleHelper.css('margin-top'), 10);
                if (isNaN(topMargin)) {
                    topMargin = 0;
                }
                that._refreshBarPosition();

                that._selectionTrackerHelper.animate({
                    'top': headerPadding + topMargin - topOffset, 'left': leftDisplacement + 'px',
                    'height': parseInt(this._height(currentTitle) + itemPadding, 10), 'width': that._width(currentTitle) + horizontalPadding
                }, duration, function () {
                    that._unlockAnimation('selectionTracker');
                    that._selectionTracker.style.visibility = 'hidden';
                    that._addSelectStyle(item, true);
                    that._moveSelectionTrackerContainer.style.visibility = 'hidden';
                });
            }
        },

        destroy: function () {
            $.jqx.utilities.resize(this.host, null, true);
            if (document.referrer != "" || window.frameElement) {
                if (window.top != null && window.top != window.self) {
                    this.removeHandler($(window.top.document), "mouseup.tabs" + this.element.id);
                }
            }
            this.host.remove();
        },

        _switchTabs: function (selectIndex, unselectIndex) {
            if (selectIndex !== unselectIndex && !this._activeAnimation() && !this._tabCaptured) {
                var that = this;
                //Triggering unselecting and selecting events first because they could be canceled by the user
                this._raiseEvent(7, { item: unselectIndex });
                this._raiseEvent(6, { item: selectIndex });
                //Check if the event is canceled
                if (this._currentEvent) {
                    if (this._currentEvent.cancel) {
                        this._currentEvent = null;
                        return;
                    }
                }

                this._unselect(unselectIndex, null, true);
                this._select(selectIndex, that.contentTransitionDuration, null, true);
                return true;
            }
            return false;
        },

        _activeAnimation: function () {

            for (var child in this._isAnimated) {
                if (this._isAnimated.hasOwnProperty(child)) {
                    if (this._isAnimated[child]) {
                        return true;
                    }
                }
            }
            return false;
        },

        _indexOf: function (item) {
            var count = this.length();
            while (count) {
                count--;
                if (this._titleList[count] === item || this._contentList[count] === item) {
                    return count;
                }
            }
            return -1;
        },

        _validateProperties: function () {
            try {
                if (this.scrollAnimationDuration < 0 || isNaN(this.scrollAnimationDuration)) {
                    throw new Error(this._invalidArgumentExceptions.invalidScrollAnimationDuration);
                }
                if (parseInt(this.width, 10) < 0 && this.width !== 'auto') {
                    throw new Error(this._invalidArgumentExceptions.invalidWidth);
                }
                if (parseInt(this.height, 10) < 0 && this.height !== 'auto') {
                    throw new Error(this._invalidArgumentExceptions.invalidHeight);
                }
                if (this.animationType !== 'none' && this.animationType !== 'fade') {
                    throw new Error(this._invalidArgumentExceptions.invalidAnimationType);
                }
                if (this.contentTransitionDuration < 0 || isNaN(this.contentTransitionDuration)) {
                    throw new Error(this._invalidArgumentExceptions.invalidcontentTransitionDuration);
                }
                if (this.toggleMode !== 'click' && this.toggleMode !== 'dblclick' &&
                this.toggleMode !== 'mouseenter' && this.toggleMode !== 'none') {
                    throw new Error(this._invalidArgumentExceptions.invalidToggleMode);
                }
                if (this.position !== 'top' && this.position !== 'bottom') {
                    throw new Error(this._invalidArgumentExceptions.invalidPosition);
                }
                if (this.scrollPosition !== 'left' && this.scrollPosition !== 'right' && this.scrollPosition !== 'both') {
                    throw new Error(this._invalidArgumentExceptions.invalidScrollPosition);
                }
                if (this.scrollStep < 0 || isNaN(this.scrollStep)) {
                    throw new Error(this._invalidArgumentExceptions.invalidScrollStep);
                }
                if (this._titleList.length !== this._contentList.length || this._titleList.length === 0) {
                    throw new Error(this._invalidArgumentExceptions.invalidStructure);
                }
                if (this.arrowButtonSize < 0 || isNaN(this.arrowButtonSize)) {
                    throw new Error(this._invalidArgumentExceptions.invalidArrowSize);
                }
                if (this.closeButtonSize < 0 || isNaN(this.closeButtonSize)) {
                    throw new Error(this._invalidArgumentExceptions.invalidCloseSize);
                }
            } catch (exception) {
                try { console.log(exception); } catch (e) { }
            }
        },

        _startScrollRepeat: function (isLeft, timeout) {
            var that = this;

            if (isLeft) {
                this._scrollLeft(timeout);
            }
            else {
                this._scrollRight(timeout);
            }

            if (this._scrollTimeout) {
                clearTimeout(this._scrollTimeout);
            }
            this._scrollTimeout = setTimeout(function () {
                that._startScrollRepeat(isLeft, that.scrollAnimationDuration);
            }, timeout);
        },

        _performLayout: function () {
            var count = this.length();
            while (count) {
                count--;
                if (this.position === 'top' ||
                    this.position === 'bottom') {
                    if (this.rtl) {
                        this._titleList[count].style['float'] = 'right';
                    }
                    else {
                        this._titleList[count].style['float'] = 'left';
                    }
                }
            }

            this._fitToSize();
            this._performHeaderLayout();
            this._fitToSize();
        },

        updatetabsheader: function () {
            this._performHeaderLayout();
        },

        _setSize: function () {
            var that = this;
            that._fitToSize();
            that._positionArrows(that._totalItemsWidth);
            if (that._totalItemsWidth > that.element.offsetWidth) {
                that._unorderedList.style.width = that._toPx(that._totalItemsWidth);
            }
            else {
                that._unorderedList.style.width = that.element.offsetWidth - 2 + 'px';
            }
            that._fitToSize();
        },

        _addArrows: function () {
            if (this._leftArrow && this._rightArrow) {
                $(this._leftArrow).remove();
                $(this._rightArrow).remove();
            }

            this._leftArrow = document.createElement('div');
            this._leftArrow.innerHTML = '<span style="display: block; width: 16px; height: 16px;" class="' + this.toThemeProperty('jqx-tabs-arrow-left') + '"></span>';
            this._leftArrow.className = this.toThemeProperty('jqx-tabs-arrow-background jqx-widget-header');
            this._leftArrow.style.zIndex = 30;
            this._leftArrow.style.display = 'none';
            this._leftArrow.style.width = this._toPx(this.arrowButtonSize);
            this._leftArrow.style.height = '100%';

            this._rightArrow = document.createElement('div');
            this._rightArrow.innerHTML = '<span style="display: block; width: 16px; height: 16px;" class="' + this.toThemeProperty('jqx-tabs-arrow-right') + '"></span>';
            this._rightArrow.className = this.toThemeProperty('jqx-tabs-arrow-background jqx-widget-header');
            this._rightArrow.style.zIndex = 30;
            this._rightArrow.style.display = 'none';
            this._rightArrow.style.width = this._toPx(this.arrowButtonSize);
            this._rightArrow.style.height = '100%';

            this._headerWrapper.appendChild(this._leftArrow);
            this._headerWrapper.appendChild(this._rightArrow);
        },

        _tabsWithVisibleCloseButtons: function () {
            if (!this.showCloseButtons) {
                return 0;
            }

            var count = this.length();

            $.each(this._titleList, function () {
                var hasCloseButton = this.attr('hasclosebutton');
                if (hasCloseButton !== undefined && hasCloseButton !== null) {
                    if (hasCloseButton === 'false' || hasCloseButton === false) {
                        count--;
                    }
                }
            });

            return count;
        },

        _calculateTitlesSize: function () {
            var that = this;

            function showHideCloseButton(closeButton, show) {
                if (closeButton) {
                    if (show) {
                        closeButton.style.display = 'block';
                    } else {
                        closeButton.style.display = 'none';
                    }
                }
            }

            var maxItemHeight = 0;
            var totalItemsWidth = 0;
            var count = this.length();

            if (this.rtl && $.jqx.browser.msie && $.jqx.browser.version < 8) {
                this._measureItem = document.createElement('span');
                this._measureItem.style.position = 'relative';
                this._measureItem.style.visibility = 'hidden';
                document.body.appendChild(this._measureItem);
            }

            while (count) {
                count--;
                var currentTitle = this._titleList[count],
                    closeButton = that._closeButtonList[count];
                //To calculate unordered list's children width sum correctly (to prevent from differences in the MSIE and other browsers
                //because of the image size) firstly we are hiding the close button, calculating the width and after that showing it if necessary
                if (this._measureItem) {
                    this._measureItem.innerHTML = currentTitle.innerHTML;
                    this._measureItem.html(this._titleList[count].html());
                    currentTitle.style.width = that._toPx(that._width(this._measureItem));
                }

                currentTitle.style.position = 'static';

                showHideCloseButton(closeButton, false);
                totalItemsWidth += that._outerWidth(currentTitle, true);

                var currentOuterHeight = that._outerHeight(currentTitle, true);
                if (maxItemHeight < currentOuterHeight) {
                    maxItemHeight = currentOuterHeight;
                }
                if (that._height(currentTitle) === 0) {
                    var clone = currentTitle.cloneNode(true);
                    document.body.appendChild(clone);
                    maxItemHeight = that._outerHeight(clone, true);
                    document.body.removeChild(clone);
                }

                var hasCloseButton = currentTitle.getAttribute('hasCloseButton');
                var processed;
                if (hasCloseButton !== undefined && hasCloseButton !== null) {
                    processed = false;
                    if (this.hiddenCloseButtons) {
                        if (this.hiddenCloseButtons[count] === 1) {
                            showHideCloseButton(closeButton, false);
                            processed = true;
                        }
                    }
                    if (!processed) {
                        if (hasCloseButton === 'true' || hasCloseButton === true) {
                            totalItemsWidth += this.closeButtonSize;
                            showHideCloseButton(closeButton, true);
                        } else if (hasCloseButton === 'false' || hasCloseButton === false) {
                            showHideCloseButton(closeButton, false);
                        }
                    }
                } else {
                    if (this.showCloseButtons && (this.canCloseAllTabs || this._tabsWithVisibleCloseButtons() > 1)) {
                        processed = false;
                        if (this.hiddenCloseButtons) {
                            if (this.hiddenCloseButtons[count] === 1) {
                                showHideCloseButton(closeButton, false);
                                processed = true;
                            }
                        }
                        if (!processed) {
                            totalItemsWidth += this.closeButtonSize;
                            showHideCloseButton(closeButton, true);
                        }
                    }
                }

                currentTitle.style.height = this._toPx(that._height(currentTitle));
            }

            if (this._measureItem) {
                $(this._measureItem).remove();
            }

            return { height: maxItemHeight, width: 10 + totalItemsWidth };
        },

        _reorderHeaderElements: function () {
            if (this.selectionTracker) {
                this._moveSelectionTrackerContainer.style.position = 'absolute';
                this._moveSelectionTrackerContainer.style.height = '100%';
                this._moveSelectionTrackerContainer.style.top = '0px';
                this._moveSelectionTrackerContainer.style.left = '0px';
                this._moveSelectionTrackerContainer.style.width = '100%';
            }
            this._headerWrapper.style.position = 'relative';
            this._headerWrapper.style.left = '0px';
            this._headerWrapper.style.top = '0px';

            if (this.scrollable) {
                this._rightArrow.style.width = this._toPx(this.arrowButtonSize);
                this._rightArrow.style.position = 'absolute';
                this._rightArrow.style.top = '0px';
                this._leftArrow.style.width = this._toPx(this.arrowButtonSize);
                this._leftArrow.style.position = 'absolute';
                this._leftArrow.style.top = '0px';
                var _margin = this.theme && this.theme.indexOf('ui-') !== -1 ? 3 : 0;
                if (_margin > 0) {
                    this._rightArrow.className += ' ' + this.toThemeProperty('jqx-rc-r');
                    this._leftArrow.className += ' ' + this.toThemeProperty('jqx-rc-l');
                }
                var position = this.scrollPosition;
                if (this.rtl) {
                    if (position === 'left') {
                        position = 'right';
                    }
                    if (position === 'right') {
                        position = 'left';
                    }
                }

                switch (position) {
                    case 'both':
                        this._rightArrow.style.right = '0px';
                        this._leftArrow.style.left = '0px';
                        break;
                    case 'left':
                        this._rightArrow.style.left = this._toPx(this.arrowButtonSize);
                        this._leftArrow.style.left = '0px';
                        break;
                    case 'right':
                        this._rightArrow.style.right = this._toPx(-_margin);
                        this._leftArrow.style.right = this._toPx(parseInt(this.arrowButtonSize, 10) - _margin);
                        break;
                }
            }
        },

        _positionArrows: function (totalItemsWidth) {
            if (totalItemsWidth >= this._headerWrapper.offsetWidth && this.scrollable) {
                this._needScroll = true;
                //When the arrows are invisible and after that they become visible
                if (this._unorderedListHelper.position().left === 0) {
                    this._unorderedListLeftBackup = this._getArrowsDisplacement() + 'px';
                }
                this._leftArrow.style.display = 'block';
                this._rightArrow.style.display = 'block';
            } else {
                this._needScroll = false;
                this._leftArrow.style.display = 'none';
                this._rightArrow.style.display = 'none';
                this._unorderedList.style.left = '0px';
            }
        },

        _performHeaderLayout: function () {
            this._removeSelectStyle();
            var size = this._calculateTitlesSize();
            var maxItemHeight = size.height;
            var totalItemsWidth = size.width;
            this._headerWrapper.style.height = this._toPx(maxItemHeight);
            this._unorderedList.style.height = this._toPx(maxItemHeight);
            if (this.headerHeight !== null && this.headerHeight !== 'auto') {
                this._headerWrapper.style.height = this._toPx(this.headerHeight);
                this._unorderedList.style.height = this._toPx(this.headerHeight);
            }
            var hostWidth = this._width(this.element);
            if (totalItemsWidth > hostWidth) {
                this._unorderedList.style.width = this._toPx(totalItemsWidth);
            } else {
                this._unorderedList.style.width = this._toPx(hostWidth);
            }
            if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                this._unorderedList.style.position = 'relative';
                this._unorderedList.style.overflow = 'hidden';
            }

            this._reorderHeaderElements();
            totalItemsWidth = totalItemsWidth + parseInt(this._unorderedListHelper.css('margin-left'), 10);
            this._totalItemsWidth = totalItemsWidth;
            this._positionArrows(totalItemsWidth);
            this._unorderedList.style.position = 'relative';
            this._unorderedList.style.top = '0px';
            this._verticalAlignElements();
            this._moveSelectionTrack(this._selectedItem, 0);
            this._addSelectStyle(this.selectedItem);
        },

        _verticalAlignElements: function () {
            var count = this.length();
            //var maxHeightTab = this._maxHeightTab();
            while (count) {
                count--;
                var currentTitle = this._titleList[count],
                    currentTitleHelper = $(currentTitle),
                    textWrapper = currentTitleHelper.children()[0],
                    closeButtonWrapper = this._closeButtonList[count],
                    padding = parseInt(currentTitleHelper.css('padding-top'), 10);
                if (!padding) {
                    padding = 0;
                }
                if (this.autoHeight) {
                    var topPadding = parseInt(currentTitleHelper.css('padding-top'), 10),
                        bottomPadding = parseInt(currentTitleHelper.css('padding-bottom'), 10),
                        topBorder = currentTitleHelper.css('border-top-width'),
                        bottomBorder = currentTitleHelper.css('border-bottom-width');
                    if (topBorder.indexOf('px') === -1) {
                        topBorder = 1;
                    } else {
                        topBorder = parseInt(topBorder, 10);
                    }
                    if (bottomBorder.indexOf('px') === -1) {
                        bottomBorder = 1;
                    } else {
                        bottomBorder = parseInt(bottomBorder, 10);
                    }

                    currentTitle.style.height = this._toPx(this._outerHeight(this._unorderedList, true) - (topPadding + bottomPadding + topBorder + bottomBorder));
                } else {
                    if (this.position === 'top') {
                        var margin = this._height(this._unorderedList) - parseInt(this._outerHeight(currentTitle, true), 10);
                        if (parseInt(currentTitleHelper.css('margin-top'), 10) !== margin && margin !== 0) {
                            currentTitle.style.marginTop = this._toPx(margin);
                        }
                    } else {
                        currentTitle.style.height = this._toPx(this._height(currentTitle));
                    }
                }
                textWrapper.style.height = '100%';

                //  this._titleList[count].children(0).height(this._titleList[count].height());
                var visibleHeight = this._height(currentTitle);
                if (closeButtonWrapper) {
                    var closeButtonWrapperMiddle = visibleHeight / 2 - this._height(closeButtonWrapper) / 2;
                    closeButtonWrapper.style.marginTop = this._toPx(1 + closeButtonWrapperMiddle);
                }
                var textWrapperMiddle = visibleHeight / 2 - this._height(textWrapper) / 2;
                textWrapper.style.marginTop = this._toPx(textWrapperMiddle);
            }
            //Align arrow
            if (this.scrollable) {
                var halfDifference = (parseInt(this._headerWrapper.offsetHeight, 10) - this.arrowButtonSize) / 2;
                $(this._rightArrow).children()[0].style.marginTop = this._toPx(halfDifference);
                this._rightArrow.style.height = '100%';
                $(this._leftArrow).children()[0].style.marginTop = this._toPx(halfDifference);
                this._leftArrow.style.height = '100%';
            }
        },

        _getImageUrl: function (arrowContainer) {
            var imageUrl = arrowContainer.css('background-image');
            imageUrl = imageUrl.replace('url("', '');
            imageUrl = imageUrl.replace('")', '');
            imageUrl = imageUrl.replace('url(', '');
            imageUrl = imageUrl.replace(')', '');
            return imageUrl;
        },

        _fitToSize: function () {
            var percentageWidth = false;
            var percentageHeight = false;
            var that = this;
            if (that.width !== null && that.width.toString().indexOf('%') !== -1) {
                percentageWidth = true;
            }

            if (that.height !== null && that.height.toString().indexOf('%') !== -1) {
                percentageHeight = true;
            }

            if (percentageWidth) {
                this.element.style.width = this.width;
                this._contentWrapper.style.width = '100%';
            } else {
                //Resizing the host and content container if height or width are set
                that.element.style.width = that._toPx(that.width);

                if (this.width !== 'auto') {
                    this._contentWrapper.style.width = '100%';
                }
            }

            var height;
            if (percentageHeight) {
                this.element.style.height = this.height;
                this._contentWrapper.style.width = '100%';
                this._contentWrapper.style.height = 'auto';
                height = this.element.offsetHeight - this._headerWrapper.offsetHeight - 2;
                this._contentWrapper.style.height = height + 'px';
            } else {
                if (this.height !== 'auto') {
                    that.element.style.height = that._toPx(that.height);
                    height = this._height(that.element) - this._headerWrapper.offsetHeight; // -parseInt(this._titleList[this._maxHeightTab()].outerHeight(true));
                    this._contentWrapper.style.height = that._toPx(height); //borderOffset
                } else {
                    this._contentWrapper.style.height = 'auto';
                }
            }
        },

        _maxHeightTab: function () {
            var count = this.length();
            var maxSize = -1;
            var returnIndex = -1;
            while (count) {
                count--;
                if (maxSize < this._outerHeight(this._titleList[count], true)) {
                    returnIndex = count;
                }
            }
            return returnIndex;
        },

        _addSelectionTracker: function () {
            if (this._moveSelectionTrackerContainer) {
                $(this._moveSelectionTrackerContainer).remove();
            }

            this._moveSelectionTrackerContainer = document.createElement('div');
            this._moveSelectionTrackerContainer.className = this.toThemeProperty('jqx-tabs-selection-tracker-container');

            this._selectionTracker = document.createElement('div');
            this._selectionTracker.className = this.toThemeProperty('jqx-tabs-selection-tracker-' + this.position);
            this._selectionTracker.style.color = 'inherit';
            this._selectionTracker.style.position = 'absolute';
            this._selectionTracker.style.zIndex = 10;
            this._selectionTracker.style.left = '0px';
            this._selectionTracker.style.top = '0px';
            this._selectionTracker.style.display = 'inline-block';

            this._moveSelectionTrackerContainer.appendChild(this._selectionTracker);
            this._headerWrapper.appendChild(this._moveSelectionTrackerContainer);
            this._selectionTrackerHelper = $(this._selectionTracker);
            if (this._selectionTrackerHelper.initAnimate) {
                this._selectionTrackerHelper.initAnimate();
            }
        },

        _addContentWrapper: function () {
            //Adding content wrapper
            var floating = 'none';
            //Content wrapper

            var addWrapper = this._contentWrapper === null;
            if (addWrapper) {
                this._contentWrapper = document.createElement('div');
                this._contentWrapper.className = this.toThemeProperty('jqx-tabs-content jqx-widget-content');
                this._contentWrapper.style['float'] = floating;
            }
            var count = this.length();
            while (count) {
                count--;
                this._contentList[count].className += ' ' + this.toThemeProperty('jqx-tabs-content-element');
            }
            if (addWrapper) {
                if (this.position === 'top') {
                    this.element.appendChild(this._contentWrapper);
                } else {
                    this.element.insertBefore(this._contentWrapper, this.element.firstChild);
                }
                for (var i = 0; i < this._contentList.length; i++) {
                    this._contentWrapper.appendChild(this._contentList[i]);
                }
            }
            if (this.roundedCorners) {
                if (this.position === 'top') {
                    this._contentWrapper.className += ' ' + this.toThemeProperty('jqx-rc-b');
                }
                else {
                    this._contentWrapper.className += ' ' + this.toThemeProperty('jqx-rc-t');
                }

                this.element.className += ' ' + this.toThemeProperty('jqx-rc-all');
            }
        },

        _addHeaderWrappers: function () {
            var count = this.length();

            if (this._headerWrapper !== undefined) {
                $(this._headerWrapper).remove();
            
                if (this.bar) {
                    this.bar = null;
                }
            }
            this._headerWrapper = document.createElement('div');
            this._headerWrapper.style.outline = 'none';

            if (this.position === 'top') {
                this.element.insertBefore(this._headerWrapper, this.element.firstChild);
            }
            else {
                this.element.appendChild(this._headerWrapper);
            }
            this._headerWrapper.appendChild(this._unorderedList);

            var headerWrapperClass = 'jqx-tabs-headerWrapper jqx-tabs-header jqx-widget-header';

            if (this.position === 'bottom') {
                headerWrapperClass += ' jqx-tabs-header-bottom';
            }

            if (this.roundedCorners) {
                if (this.position === 'top') {
                    headerWrapperClass += ' jqx-rc-t';
                } else {
                    headerWrapperClass += ' jqx-rc-b';
                }
            }

            this._headerWrapper.className = this.toThemeProperty(headerWrapperClass);

            while (count) {
                count--;
                var currentTitle = this._titleList[count];
                if (currentTitle.querySelector('.jqx-tabs-titleWrapper') === null) {
                    var tabWrapper = document.createElement('div');
                    tabWrapper.className = 'jqx-tabs-titleWrapper';
                    tabWrapper.style.outline = 'none';
                    tabWrapper.style.position = 'relative';
                    tabWrapper.style.zIndex = 15;

                    var currentTitleChildren = $(currentTitle).children();
                    tabWrapper.appendChild(currentTitleChildren[0]);
                    tabWrapper.appendChild(currentTitleChildren[1]);

                    currentTitle.appendChild(tabWrapper);
                }
            }
        },

        _render: function () {
            this._addCloseButtons();
            this._addHeaderWrappers();
            this._addContentWrapper();

            if (this.selectionTracker) {
                this._addSelectionTracker();
            }
            this._addArrows();
        },

        _addCloseButton: function (index, initialization) {
            var titleWrapper = document.createElement('div'),
                currentTitle = this._titleList[index];
            titleWrapper.className = 'jqx-tabs-titleContentWrapper jqx-disableselect';
            var fl = 'left';
            if (this.rtl) {
                fl = 'right';
            }

            if ($(currentTitle).find(".jqx-tabs-close-button").length > 0) {
                $(currentTitle).find(".jqx-tabs-close-button").remove();
            }

            titleWrapper.style['float'] = fl;
            titleWrapper.innerHTML = currentTitle.innerHTML;
            currentTitle.innerHTML = '';
            var closeButton = document.createElement('div');
            closeButton.className = this.toThemeProperty('jqx-tabs-close-button');
            closeButton.style.height = this._toPx(this.closeButtonSize);
            closeButton.style.width = this._toPx(this.closeButtonSize);
            closeButton.style['float'] = fl;
            closeButton.style.fontSize = '1px';

            currentTitle.appendChild(titleWrapper);
            currentTitle.appendChild(closeButton);

            if (initialization === true) {
                this._closeButtonList[index] = closeButton;
            } else {
                this._closeButtonList.splice(index, 0, closeButton);
            }

            if (!this.showCloseButtons) {
                closeButton.style.display = 'none';
            }
            else if (this.hiddenCloseButtons) {
                if (this.hiddenCloseButtons[index] === 1) {
                    closeButton.style.display = 'none';
                }
            }
        },

        _addCloseButtons: function () {
            var count = this.length();
            while (count) {
                count--;
                this._addCloseButton(count, true);
            }
        },

        //Unselecting all items which are not equal to selectedItem property
        _prepareTabs: function () {
            var count = this.length();
            var tracker = this.selectionTracker;
            this.selectionTracker = false;
            while (count) {
                count--;
                if (this._selectedItem !== count) {
                    this._unselect(count, null, false);
                }
            }
            this._select(this._selectedItem, 0, null, false);
            this.selectionTracker = tracker;
            if (this.initTabContent) {
                if (!this._initTabContentList[this.selectedItem]) {
                    if (!this._hiddenParent()) {
                        this.initTabContent(this.selectedItem);
                        this._initTabContentList[this.selectedItem] = true;
                    }
                }
            }
        },

        _isValidIndex: function (index) {
            return (index >= 0 && index < this.length());
        },

        _removeSelectStyle: function () {
            var count = this.length();
            while (count) {
                count--;
                var currentTitle = this._titleList[count];
                if (this.showCloseButtons) {
                    var closeButton = this._closeButtonList[count];
                    this._removeClass(closeButton, this.toThemeProperty('jqx-tabs-close-button-selected'));
                }

                var classToRemove = 'jqx-fill-state-pressed';
                if (this.position === 'top') {
                    classToRemove += ' jqx-tabs-title-selected-top';
                } else {
                    classToRemove += ' jqx-tabs-title-selected-bottom';
                }
                this._removeClass(currentTitle, this.toThemeProperty(classToRemove));
            }
        },

        _addSelectStyle: function (index, force) {
            this._removeSelectStyle();
            if (!this.selectionTracker || (force !== undefined && force)) {
                var currentTitle = this._titleList[index];
                if (index >= 0 && currentTitle !== undefined) {
                    var closeButton = null;
                    if (this.showCloseButtons) {
                        closeButton = this._closeButtonList[index];
                        if (this.hiddenCloseButtons) {
                            if (this.hiddenCloseButtons[index] === 1) {
                                closeButton = null;
                            }
                        }
                    }

                    var classToRemove = 'jqx-fill-state-hover',
                        classToAdd = ' jqx-fill-state-pressed';

                    if (this.position === 'top') {
                        classToRemove += ' jqx-tabs-title-hover-top';
                        classToAdd += ' jqx-tabs-title-selected-top';
                    } else {
                        classToRemove += ' jqx-tabs-title-hover-bottom';
                        classToAdd += ' jqx-tabs-title-selected-bottom';
                    }
                    this._removeClass(currentTitle, this.toThemeProperty(classToRemove));
                    currentTitle.className += this.toThemeProperty(classToAdd);

                    if (closeButton !== null) {
                        closeButton.className += ' ' + this.toThemeProperty('jqx-tabs-close-button-selected');
                    }
                }
            }
        },

        _addItemTo: function (collection, index, item) {
            if (index < collection.length) {
                var temp, swap;
                for (var i = index; i + 1 < collection.length; i++) {
                    if (temp === undefined) {
                        temp = collection[i + 1];
                        collection[i + 1] = collection[i];
                    }
                    else {
                        swap = collection[i + 1];
                        collection[i + 1] = temp;
                        temp = swap;
                    }
                }
                if (temp === undefined) {
                    temp = collection[index];
                }
                collection[index] = item;
                collection.push(temp);
            } else {
                collection.push(item);
            }
        },

        _refreshBarPosition: function () {
            var that = this;

            if (!this.bar) {
                var bar = $("<span></span>");
                $(this._headerWrapper).append(bar);
                bar.addClass(this.toThemeProperty('jqx-tabs-bar'));
                this.bar = bar;
            }

            setTimeout(function () {
                var unorderedListLeft = parseInt(that._unorderedListHelper.css('left'), 10);
                var left = parseInt(that._unorderedListHelper.css('margin-left'));

                that.bar.css('left', left + that._titleList[that._selectedItem].offsetLeft + unorderedListLeft);
                that.bar.width($(that._titleList[that._selectedItem]).outerWidth() - 2);
            });
        },

        _select: function (index, duration, callback, toTrigger, force) {
            if (!this._tabCaptured) {
                this.host.attr('hideFocus', 'true');
                var that = this;
                if (force === undefined) {
                    this._addSelectStyle(index);
                }
                else {
                    this._addSelectStyle(index, force);
                }

                var currentTitle = $(that._titleList[index]),
                    titleId = that._titleList[index].getAttribute('id'),
                    currentContent = $(that._contentList[index]);

                if (this.isCollapsed && this.collapsible) {
                    currentContent[0].style.display = 'none';
                    this._selectCallback(index, callback, toTrigger);
                    return;
                }


                that._refreshBarPosition();
                
                switch (this.animationType) {
                    case 'none':
                        if (!that.selectionTracker) {
                            for (var i = 0; i < this._contentList.length; i++) {
                                if (index !== i && $(that._contentList[i]).css('display') === 'block') {
                                    that._contentList[i].style.display = 'none';
                                    $.jqx.aria($(that._titleList[i]), 'aria-selected', false);
                                    $.jqx.aria($(that._contentList[i]), 'aria-hidden', true);
                                }
                            }
                            currentContent[0].style.display = 'block';
                            $.jqx.aria(currentTitle, 'aria-selected', true);
                            $.jqx.aria(currentContent, 'aria-hidden', false);
                            $.jqx.aria(this, 'aria-activedescendant', titleId);
                        } else {
                            setTimeout(function () {
                                currentContent[0].style.display = 'block';
                                $.jqx.aria(currentTitle, 'aria-selected', true);
                                $.jqx.aria(currentContent, 'aria-hidden', false);
                                $.jqx.aria(that, 'aria-activedescendant', titleId);
                            }, this.selectionTrackerAnimationDuration);
                        }

                        this._selectCallback(index, callback, toTrigger);
                        break;
                    case 'fade':
                        this._lockAnimation('contentListSelect');
                        that._selectCallback(index, callback, toTrigger);
                        if (currentContent.initAnimate && currentContent.fadeIn === undefined) {
                            currentContent.initAnimate();
                        }
                        currentContent.fadeIn({
                            duration: 1000, complete: function () {
                                that._unlockAnimation('contentListSelect');
                                $.jqx.aria(currentTitle, 'aria-selected', true);
                                $.jqx.aria(currentContent, 'aria-hidden', false);
                                $.jqx.aria(that, 'aria-activedescendant', titleId);
                            }
                        });
                        break;
                }
            }
        },

        _selectCallback: function (index, callback, toTrigger) {
            this._selectedItem = index;
            this.selectedItem = this._selectedItem;
            if (callback) {
                callback();
            }
            if (toTrigger) {
                this._raiseEvent(1, { item: index });
            }
        },

        _unselect: function (index, callback, toTrigger) {
            if (index >= 0) {
                if (!this._tabCaptured) {
                    var that = this,
                        currentContent = that._contentList[index],
                        currentContentHelper = $(currentContent),
                        currentTitle = that._titleList[index],
                        currentTitleHelper = $(currentTitle);

                    if (currentContentHelper.initAnimate && currentContentHelper.animate === undefined) {
                        currentContentHelper.initAnimate();
                    }
                    that._stop(currentContentHelper);
                    if (this.animationType === 'fade') {
                        currentContent.style.display = 'none';
                        $.jqx.aria(currentTitleHelper, 'aria-selected', false);
                        $.jqx.aria(currentContentHelper, 'aria-hidden', true);
                    } else {
                        if (this.selectionTracker) {
                            setTimeout(function () {
                                currentContent.style.display = 'none';
                                $.jqx.aria(currentTitleHelper, 'aria-selected', false);
                                $.jqx.aria(currentContentHelper, 'aria-hidden', true);
                            }, this.selectionTrackerAnimationDuration);
                        } else {
                            currentContent.style.display = 'none';
                            $.jqx.aria(currentTitleHelper, 'aria-selected', false);
                            $.jqx.aria(currentContentHelper, 'aria-hidden', true);
                        }
                    }

                    this._unselectCallback(index, callback, toTrigger);

                    if (!this.selectionTracker) {
                        that._removeClass(currentTitle, that.toThemeProperty('jqx-tabs-title-selected jqx-fill-state-pressed'));
                    }
                }
            }
        },


        _unselectCallback: function (index, callback, toTrigger) {
            if (toTrigger) {
                this._raiseEvent(8, { item: index });
            }

            if (callback) {
                callback();
            }
        },

        //Disabling the widget
        disable: function () {
            var count = this.length();
            while (count) {
                count--;
                this.disableAt(count);
            }
        },

        //Enabling the widget
        enable: function () {
            var count = this.length();
            while (count) {
                count--;
                this.enableAt(count);
            }
        },

        // gets the count of the enabled items.
        getEnabledTabsCount: function () {
            var length = 0;
            $.each(this._titleList, function () {
                if (!this.disabled) {
                    length++;
                }
            });

            return length;
        },

        // gets the count of the disabled items.
        getDisabledTabsCount: function () {
            var length = 0;
            $.each(this._titleList, function () {
                if (this.disabled) {
                    length++;
                }
            });

            return length;
        },

        //Removing tab with indicated index
        removeAt: function (index) {
            if (this._isValidIndex(index) && (this.canCloseAllTabs || this.length() > 1)) {
                this._removeHoverStates();
                var that = this,
                    closeItemWidth = that._outerWidth(this._titleList[index], true),
                    title = this.getTitleAt(index);
                this._unorderedList.style.width = that._toPx(that._width(this._unorderedList) - closeItemWidth);
                $(this._titleList[index]).remove();
                $(this._contentList[index]).remove();

                //var ensureVisibleIndex = 0;
                this._titleList.splice(index, 1);
                this._contentList.splice(index, 1);
                that._closeButtonList.splice(index, 1);

                this._addStyles();
                this._performHeaderLayout();
                this._removeEventHandlers();
                this._addEventHandlers();
                this._raiseEvent(3, { item: index, title: title });
                this._isAnimated = {};

                var current;
                if (this.selectedItem > 0) {
                    this._selectedItem = -1;
                    if (this.selectedItem >= index) {
                        current = this._getPreviousIndex(this.selectedItem);
                        this.select(current);
                    } else {
                        this.select(that.selectedItem);
                    }
                }
                else {
                    this._selectedItem = -1;
                    current = this._getNextIndex(this.selectedItem);
                    this.select(current);
                }

                //Fixing some issues with the scrolling
                if (parseInt(this._unorderedListHelper.css('left'), 10) > this._getArrowsDisplacement()) {
                    this._unorderedList.style.left = that._toPx(this._getArrowsDisplacement());
                }
                if (that._width(this._unorderedList) <= that._width(this._headerWrapper)) {
                    var duration = (this.enableScrollAnimation) ? this.scrollAnimationDuration : 0;
                    this._lockAnimation('unorderedList');
                    this._unorderedListHelper.animate({ 'left': 0 }, duration, function () {
                        that._unlockAnimation('unorderedList');
                    });
                }
            }
        },

        //Removing the first tab
        removeFirst: function () {
            this.removeAt(0);
        },

        //Removing the last tab
        removeLast: function () {
            this.removeAt(this.length() - 1);
        },

        //Disabling tab with indicated index
        disableAt: function (index) {
            var currentTitle = this._titleList[index];
            if (!currentTitle.disabled || currentTitle.disabled === undefined) {
                if (this.selectedItem === index) {
                    var selectedNext = this.next();
                    if (!selectedNext) {
                        selectedNext = this.previous();
                    }
                }

                currentTitle.disabled = true;
                this.removeHandler(currentTitle, this.toggleMode);
                if (this.enabledHover) {
                    $(currentTitle).off('mouseenter').off('mouseleave');
                }
                this._removeEventListenerAt(index);
                currentTitle.className += ' ' + this.toThemeProperty('jqx-tabs-title-disable jqx-fill-state-disabled');
                this._raiseEvent(5, { item: index });
            }
        },

        //Enabling tab in indicated position
        enableAt: function (index) {
            var currentTitle = this._titleList[index];
            if (currentTitle.disabled) {
                currentTitle.disabled = false;
                this._addEventListenerAt(index);
                this._removeClass(currentTitle, this.toThemeProperty('jqx-tabs-title-disable jqx-fill-state-disabled'));
                this._raiseEvent(4, { item: index });
            }
        },

        //Adding tab in indicated position
        addAt: function (index, title, content) {
            if (index >= 0 && index <= this.length()) {
                this._removeHoverStates();

                var titleContainer = document.createElement('li');
                titleContainer.innerHTML = title;
                titleContainer.className = this.toThemeProperty('jqx-tabs-title jqx-item');

                var navigatorInnerContainer = document.createElement('div');
                navigatorInnerContainer.innerHTML = content;
                navigatorInnerContainer.className = this.toThemeProperty('jqx-tabs-content-element');

                if (this.position === 'bottom') {
                    titleContainer.className += ' ' + this.toThemeProperty('jqx-tabs-title-bottom');
                }
                var fullRefresh = false;

                if (this._titleList.length === 0) {
                    this._unorderedList.appendChild(titleContainer);
                } else {
                    if (index < this.length() && index >= 0) {
                        this._unorderedList.insertBefore(titleContainer, this._titleList[index]);
                    } else {
                        this._unorderedList.appendChild(titleContainer);
                    }
                }

                this._contentWrapper.appendChild(navigatorInnerContainer);
                this._addItemTo(this._titleList, index, titleContainer);
                this._addItemTo(this._contentList, index, navigatorInnerContainer);

                this._addCloseButton(index);

                if (this._selectedItem > index) {
                    this._selectedItem++;
                }
                this._switchTabs(index, this._selectedItem);
                this._selectedItem = index;

                this._uiRefresh(fullRefresh);
                this._raiseEvent(2, { item: index });
                this._moveSelectionTrack(this._selectedItem, 0);
            }
        },

        //Adding tab in the beginning
        addFirst: function (title, content) {
            this.addAt(0, title, content);
        },

        //Adding tab in the end
        addLast: function (title, content) {
            this.addAt(this.length(), title, content);
        },

        val: function (value) {
            if (arguments.length === 0 || typeof (value) === 'object') {
                return this._selectedItem;
            }

            this.select(value);
            return this._selectedItem;
        },

        //Selecting tab with indicated index
        select: function (index) {
            if (typeof (index) === 'object') {
                index = this._indexOf(index);
            }

            var canSelect = index >= 0 && index < this._titleList.length ? this._titleList[index].getAttribute('canselect') : true;
            if (canSelect === undefined || canSelect === null || canSelect === 'true' || canSelect === true) {
                if (index !== this._selectedItem && this._isValidIndex(index)) {
                    if (!this._activeAnimation() && !this._titleList[index].disabled) {
                        var res = this._switchTabs(index, this._selectedItem);
                        if (res) {
                            this.ensureVisible(index);
                        }
                    }
                }
            }
        },

        //Selecting the previous item
        previous: function (item) {
            var index = this._selectedItem;
            if (item !== undefined && !isNaN(item)) {
                index = item;
            }

            while (index > 0 && index < this._titleList.length) {
                index--;
                if (!this._titleList[index].disabled) {
                    this.select(index);
                    return true;
                }
            }
            return false;
        },


        _getPreviousIndex: function (index) {
            if (index !== undefined && !isNaN(index)) {
                var savedIndex = index;
                while (index > 0 && index <= this._titleList.length) {
                    index--;
                    if (!this._titleList[index].disabled) {
                        return index;
                    }
                }

                return savedIndex;
            } else {
                return 0;
            }
        },


        _getNextIndex: function (index) {
            if (index !== undefined && !isNaN(index)) {
                var savedIndex = index;

                while (index >= 0 && index < this._titleList.length) {
                    if (!this._titleList[index].disabled) {
                        return index;
                    }
                    index++;
                }

                return savedIndex;
            } else {
                return 0;
            }
        },

        //Selecting the next item
        next: function (item) {
            var index = this._selectedItem;
            if (item !== undefined && !isNaN(item)) {
                index = item;
            }

            while (index >= 0 && index < this._titleList.length - 1) {
                index++;
                if (!this._titleList[index].disabled) {
                    this.select(index);
                    return true;
                }
            }

            return false;
        },

        //Selecting the first item
        first: function () {
            var index = 0;
            if (this._titleList[index].disabled) {
                this.next(index);
            }
            else {
                this.select(index);
            }
        },

        //Selecting the first item
        last: function () {
            var index = this._titleList.length - 1;
            if (this._titleList[index].disabled) {
                this.previous(index);
            }
            else {
                this.select(index);
            }
        },

        //Returning the tabs count
        length: function () {
            return this._titleList.length;
        },

        //Locking tab with specific index
        lockAt: function (index) {
            if (this._isValidIndex(index) &&
                (!this._titleList[index].locked ||
                 this._titleList[index].locked === undefined)) {
                this._titleList[index].locked = true;
                this._raiseEvent(11, { item: index });
            }
        },

        //Unlocing a tab with specific index
        unlockAt: function (index) {
            if (this._isValidIndex(index) &&
                this._titleList[index].locked) {
                this._titleList[index].locked = false;
                this._raiseEvent(12, { item: index });
            }
        },

        //Locing all tabs
        lockAll: function () {
            var count = this.length();
            while (count) {
                count--;
                this.lockAt(count);
            }
        },

        //Unlocking all tabs
        unlockAll: function () {
            var count = this.length();
            while (count) {
                count--;
                this.unlockAt(count);
            }
        },

        //Showing close button in a specific position
        showCloseButtonAt: function (index) {
            if (this._isValidIndex(index)) {
                if (!this.showCloseButtons) {
                    this.showCloseButtons = true;
                    this.updatetabsheader();
                }

                this._closeButtonList[index].style.display = 'block';
                if (!this.hiddenCloseButtons) {
                    this.hiddenCloseButtons = [];
                }
                this.hiddenCloseButtons[index] = 0;
            }
        },

        //Hiding a close button in a specific position
        hideCloseButtonAt: function (index) {
            if (this._isValidIndex(index)) {
                this._closeButtonList[index].style.display = 'none';
                if (!this.hiddenCloseButtons) {
                    this.hiddenCloseButtons = [];
                }
                this.hiddenCloseButtons[index] = 1;
            }
        },

        //Hiding all close buttons
        hideAllCloseButtons: function () {
            var count = this.length();
            while (count) {
                count--;
                this.hideCloseButtonAt(count);
            }
        },

        //Showing all close buttons.
        showAllCloseButtons: function () {
            var count = this.length();
            while (count) {
                count--;
                this.showCloseButtonAt(count);
            }
        },

        //Getting the title of specified tab.
        getTitleAt: function (index) {
            if (this._titleList[index]) {
                return $(this._titleList[index]).text();
            }
            return null;
        },

        //Getting the content of specified tab.
        getContentAt: function (index) {
            if (this._contentList[index]) {
                return this._contentList[index];
            }
            return null;
        },

        setTitleAt: function (index, text) {
            if (this._titleList[index]) {
                $(this._titleList[index]).text(text);
                if (this.showCloseButtons) {
                    this._addCloseButton(index);
                    this._removeEventHandlers();
                    this._addEventHandlers();

                }
                this.render();
                this.refresh();
            }
        },

        setContentAt: function (index, html) {
            if (this._contentList[index]) {
                $(this._contentList[index]).html(html);
            }
        },

        //This method is ensuring the visibility of item with indicated index.
        //If the item is currently not visible the method is scrolling to it.
        ensureVisible: function (index) {
            var that = this;
            if (index === undefined || index === -1 || index === null) {
                index = this.selectedItem;
            }
            if (!this._isValidIndex(index)) {
                return false;
            }
            var currentTitle = this._titleList[index];
            var itemRelativePosition = parseInt($(currentTitle).position().left, 10) + parseInt(this._unorderedListHelper.css('margin-left'), 10);
            var unorderedListPosition = parseInt(this._unorderedListHelper.css('left'), 10);
            var headerWrapperWidth = this._outerWidth(this._headerWrapper, true);
            var itemWidth = this._outerWidth(currentTitle, true);
            var visibleAreaLeftEnd = unorderedListPosition - this._getArrowsDisplacement();
            var visibleAreaRightEnd = headerWrapperWidth - this._getArrowsDisplacement() - visibleAreaLeftEnd;
            var scrollPosition, trackerPosition;
            if (itemRelativePosition < -visibleAreaLeftEnd) {
                scrollPosition = -itemRelativePosition + this._getArrowsDisplacement();
                trackerPosition = this._getArrowsDisplacement();
            } else if (itemRelativePosition + itemWidth > visibleAreaRightEnd - this._getArrowsDisplacement()) {
                scrollPosition = -itemRelativePosition + headerWrapperWidth - itemWidth -
                ((this.scrollable) ? (2 * this.arrowButtonSize - this._getArrowsDisplacement()) : 0);
                trackerPosition = headerWrapperWidth - itemWidth - this._getArrowsDisplacement();
            } else {
                this._moveSelectionTrack(index, this.selectionTrackerAnimationDuration);
                return true;
            }
            this._lockAnimation('unorderedList');
            this._unorderedListHelper.animate({ 'left': scrollPosition }, this.scrollAnimationDuration, function () {
                that._unlockAnimation('unorderedList');
                that._moveSelectionTrack(that._selectedItem, 0);
                return true;
            });
            this._moveSelectionTrack(index, this.selectionTrackerAnimationDuration, trackerPosition);
            return true;
        },

        // gets whether an item is visible.
        isVisibleAt: function (index) {
            var that = this;
            if (index === undefined || index === -1 || index === null) {
                index = that.selectedItem;
            }
            if (!that._isValidIndex(index)) {
                return false;
            }
            var currentTitle = that._titleList[index];
            var itemRelativePosition = parseInt($(currentTitle).position().left, 10) + parseInt(that._unorderedListHelper.css('margin-left'), 10);
            var unorderedListPosition = parseInt(that._unorderedListHelper.css('left'), 10);
            var headerWrapperWidth = that._outerWidth(that._headerWrapper, true);
            var itemWidth = that._outerWidth(currentTitle, true);
            var visibleAreaLeftEnd = unorderedListPosition - that._getArrowsDisplacement();
            var visibleAreaRightEnd = headerWrapperWidth - that._getArrowsDisplacement() - visibleAreaLeftEnd;
            if (itemRelativePosition < -visibleAreaLeftEnd) {
                return false;
            } else if (itemRelativePosition + itemWidth > visibleAreaRightEnd) {
                return false;
            } else {
                return true;
            }
            return true;
        },

        //Return true if the tab is disabled and false if it is not
        isDisabled: function (index) {
            return this._titleList[index].disabled;
        },

        _lockAnimation: function (type) {
            if (this._isAnimated) {
                this._isAnimated[type] = true;
            }
        },

        _unlockAnimation: function (type) {
            if (this._isAnimated) {
                this._isAnimated[type] = false;
            }
        },

        propertiesChangedHandler: function (object, oldValues, newValues) {
            if (newValues && newValues.width && newValues.height && Object.keys(newValues).length === 2) {
                object._setSize();
            }
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (object.batchUpdate && object.batchUpdate.width && object.batchUpdate.height && Object.keys(object.batchUpdate).length === 2) {
                return;
            }
            this._validateProperties();
            switch (key) {
                case 'touchMode':
                    if (value) {
                        object.enabledHover = false;
                        object.keyboardNavigation = false;
                    }
                    break;
                case 'width':
                case 'height':
                    object._setSize();
                    return;
                case 'disabled':
                    if (value) {
                        this.disable();
                    } else {
                        this.enable();
                    }
                    return;
                case 'showCloseButtons':
                    if (value) {
                        this.showAllCloseButtons();
                    } else {
                        this.hideAllCloseButtons();
                    }
                    this._performHeaderLayout();
                    return;
                case 'selectedItem':
                    if (this._isValidIndex(value)) {
                        this.select(value);
                    }
                    return;
                case 'scrollStep':
                case 'contentTransitionDuration':
                case 'scrollAnimationDuration':
                case 'enableScrollAnimation':
                    return;
                case 'selectionTracker':
                    if (value) {
                        this._refresh();
                        this.select(this._selectedItem);
                    } else {
                        if (this._selectionTracker) {
                            this._selectionTrackerHelper.remove();
                        }
                    }
                    return;
                case 'scrollable':
                    if (value) {
                        this._refresh();
                        this.select(this._selectedItem);
                    } else {
                        $(this._leftArrow).remove();
                        $(this._rightArrow).remove();
                        this._performHeaderLayout();
                    }
                    return;
                case 'autoHeight':
                    this._performHeaderLayout();
                    return;
                case 'theme':
                    $.jqx.utilities.setTheme(oldvalue, value, this.host);
                    return;
            }
            this._unorderedList.style.left = '0px';
            this._refresh();
            this.select(this._selectedItem);
            this._addSelectStyle(this._selectedItem, true);
        },

        _toPx: function (value) {
            if (typeof value === 'number') {
                return value + 'px';
            } else {
                return value;
            }
        },

        // a replacement of jQuery's .removeClass()
        _removeClass: function (element, classToRemove) {
            $(element).removeClass(classToRemove);
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
            return width;
        },

        // a replacement of jQuery's .outerWidth()
        _outerWidth: function (element, margins) {
            var outerWidth = element.offsetWidth;
            if (margins) {
                var elementHelper = $(element),
                    leftMargin = parseInt(elementHelper.css('margin-left'), 10),
                    rightMargin = parseInt(elementHelper.css('margin-right'), 10);
                outerWidth += leftMargin + rightMargin;
            }
            return outerWidth;
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
            return height;
        },

        // a replacement of jQuery's .outerHeight()
        _outerHeight: function (element, margins) {
            var outerHeight = element.offsetHeight;
            if (margins) {
                var elementHelper = $(element),
                    topMargin = parseInt(elementHelper.css('margin-top'), 10),
                    bottomMargin = parseInt(elementHelper.css('margin-bottom'), 10);
                outerHeight += topMargin + bottomMargin;
            }
            return outerHeight;
        },

        _stop: function (elementHelper) {
            if (elementHelper.stop) {
                elementHelper.stop();
            } else {
                elementHelper.animate('stop', true);
            }
        }
    });
}(jqxBaseFramework)); //ignore jslint
