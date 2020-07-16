/* tslint:disable */
/* eslint-disable */
(function ($) {

    $.jqx.jqxWidget("jqxComboBox", "", {});

    $.extend($.jqx._jqxComboBox.prototype, {
        defineInstance: function () {
            var settings = {
                // enables/disables the combobox.
                disabled: false,
                // gets or sets the listbox width.
                width: 200,
                // gets or sets the listbox height.
                height: 25,
                // Represents the collection of list items.
                items: new Array(),
                // Gets or sets the selected index.
                selectedIndex: -1,
                selectedItems: new Array(),
                _selectedItems: new Array(),
                // data source.
                source: null,
                autoItemsHeight: false,
                // gets or sets the scrollbars size.
                scrollBarSize: $.jqx.utilities.scrollBarSize,
                // gets or sets the scrollbars size.
                arrowSize: 17,
                // enables/disables the hover state.
                enableHover: true,
                // enables/disables the selection.
                enableSelection: true,
                // gets the visible items. // this property is internal for the combobox.
                visualItems: new Array(),
                // gets the groups. // this property is internal for the combobox.
                groups: new Array(),
                // gets or sets whether the items width should be equal to the combobox's width.
                equalItemsWidth: true,
                // gets or sets the height of the ListBox Items. When the itemHeight:= - 1, each item's height is equal to its desired height.
                itemHeight: -1,
                // represents the combobox's events.
                visibleItems: new Array(),
                // emptry group's text.
                hint: true,
                emptyGroupText: 'Group',
                emptyString: "",
                ready: null,
                // Type: Number
                // Default: 100
                // Showing Popup Animation's delay.
                openDelay: 250,
                // Type: Number
                // Default: 200
                // Hiding Popup Animation's delay.
                closeDelay: 300,
                // default, none
                // Type: String.
                // enables or disables the animation.
                animationType: 'default',
                // Type: String
                // Default: auto ( the drop down takes the combobox's width.)
                // Sets the popup's width.
                dropDownWidth: 'auto',
                // Type: String
                // Default: 200px ( the height is 200px )
                // Sets the popup's height.
                dropDownHeight: '200px',
                // Type: Boolean
                // Default: false
                // Sets the popup's height to be equal to the items summary height,            
                autoDropDownHeight: false,
                // Type: Boolean
                // Default: false
                // Enables or disables the browser detection.
                enableBrowserBoundsDetection: false,
                dropDownHorizontalAlignment: 'left',
                dropDownVerticalAlignment: 'bottom',
                dropDownContainer: "default",
                // Type: String
                // Default: startswithignorecase
                // Possible Values: 'none, 'contains', 'containsignorecase', 'equals', 'equalsignorecase', 'startswithignorecase', 'startswith', 'endswithignorecase', 'endswith'
                searchMode: 'startswithignorecase',
                autoComplete: false,
                remoteAutoComplete: false,
                remoteAutoCompleteDelay: 500,
                selectionMode: "default",
                minLength: 2,
                displayMember: "",
                valueMember: "",
                groupMember: "",
                searchMember: "",
                keyboardSelection: true,
                renderer: null,
                autoOpen: false,
                template: "",
                checkboxes: false,
                promptText: "",
                placeHolder: "",
                rtl: false,
                listBox: null,
                validateSelection: null,
                showCloseButtons: true,
                renderSelectedItem: null,
                search: null,
                popupZIndex: 2000,
                searchString: null,
                multiSelect: false,
                showArrow: true,
                _disabledItems: new Array(),
                touchMode: 'auto',
                autoBind: true,
                aria:
                {
                    "aria-disabled": { name: "disabled", type: "boolean" }
                },
                events:
                [
                // occurs when the combobox is opened.
                  'open',
                // occurs when the combobox is closed.
                  'close',
                // occurs when an item is selected.
                  'select',
                // occurs when an item is unselected.
                  'unselect',
                // occurs when the selection is changed.
                  'change',
                // triggered when the user checks or unchecks an item. 
                  'checkChange',
                // triggered when the binding is completed.
                  'bindingComplete',
                  // triggered when a new item is added.
                    'itemAdd',
                   // triggered when a new item is removed.
                   'itemRemove',
                   // triggered when a new item is updated.
                   'itemUpdate'
                ]
            };
            if (this === $.jqx._jqxComboBox.prototype) {
                return settings;
            }
            $.extend(true, this, settings);
            return settings;
        },

        createInstance: function (args) {
            var that = this;
            this.host.attr('role', 'combobox');
            $.jqx.aria(this, "aria-autocomplete", "both");

            if ($.jqx._jqxListBox == null || $.jqx._jqxListBox == undefined) {
                throw new Error("jqxComboBox: Missing reference to jqxlistbox.js.");
            }
            $.jqx.aria(this);

            // prompt text is deprecated.
            if (this.promptText != "") {
                this.placeHolder = this.promptText;
            }

            this.render();
        },

        render: function () {
            var that = this;
            var nodeName = that.element.nodeName.toLowerCase();
            if (nodeName == "select" || nodeName == "ul" || nodeName == "ol") {
                that.field = that.element;
                if (that.field.className) {
                    that._className = that.field.className;
                }

                var properties = {
                    'title': that.field.title
                };

                if (that.field.id.length) {
                    properties.id = that.field.id.replace(/[^\w]/g, '_') + "_jqxComboBox";
                }
                else {
                    properties.id = $.jqx.utilities.createId() + "_jqxComboBox";
                }

                var wrapper = $("<div></div>", properties);
                if (!that.width) {
                    that.width = $(that.field).width();
                }
                if (!that.height) {
                    that.height = $(that.field).outerHeight();
                }

                that.element.style.cssText = that.field.style.cssText;
                $(that.field).hide().after(wrapper);
                var data = that.host.data();
                that.host = wrapper;
                that.host.data(data);
                that.element = wrapper[0];
                that.element.id = that.field.id;
                that.field.id = properties.id;
                if (that._className) {
                    that.host.addClass(that._className);
                    $(that.field).removeClass(that._className);
                }

                if (that.field.tabIndex) {
                    var tabIndex = that.field.tabIndex;
                    that.field.tabIndex = -1;
                    that.element.tabIndex = tabIndex;
                }
                if (that.field.innerHTML != "") {
                    var result = $.jqx.parseSourceTag(that.field);
                    that.source = result.items;
                    if (that.selectedIndex == -1)
                        that.selectedIndex = result.index;
                }
            }
            else {
                if (that.host.find('li').length > 0 || that.host.find('option').length > 0) {
                    var result = $.jqx.parseSourceTag(that.element);
                      that.source = result.items;
                }
            }
                that.removeHandlers();
            that.isanimating = false;
            that.id = $.jqx.utilities.createId();
            that.element.innerHTML = "";
            var comboStructure = $("<div style='background-color: transparent; -webkit-appearance: none; outline: none; width:100%; height: 100%; padding: 0px; margin: 0px; border: 0px; position: relative;'>" +
                "<div id='dropdownlistWrapper' style='padding: 0; margin: 0; border: none; background-color: transparent; float: left; width:100%; height: 100%; position: relative;'>" +
                "<div id='dropdownlistContent' style='padding: 0; margin: 0; border-top: none; border-bottom: none; float: left; position: absolute;'/>" +
                "<div id='dropdownlistArrow' role='button' style='padding: 0; margin: 0; border-left-width: 1px; border-bottom-width: 0px; border-top-width: 0px; border-right-width: 0px; float: right; position: absolute;'/>" +
                "</div>" +
                "</div>");
            that.comboStructure = comboStructure;
            if ($.jqx._jqxListBox == null || $.jqx._jqxListBox == undefined) {
                throw "jqxComboBox: Missing reference to jqxlistbox.js.";
            }

            that.touch = $.jqx.mobile.isTouchDevice();
            if (that.touchMode === true) {
                that.touch = true;
            }

            that.host.append(comboStructure);

            that.dropdownlistWrapper = that.host.find('#dropdownlistWrapper');
            that.dropdownlistArrow = that.host.find('#dropdownlistArrow');
            that.dropdownlistContent = that.host.find('#dropdownlistContent');
            that.dropdownlistContent.addClass(that.toThemeProperty('jqx-combobox-content'));
            that.dropdownlistContent.addClass(that.toThemeProperty('jqx-widget-content'));
            that.dropdownlistWrapper[0].id = "dropdownlistWrapper" + that.element.id;
            that.dropdownlistArrow[0].id = "dropdownlistArrow" + that.element.id;
            that.dropdownlistContent[0].id = "dropdownlistContent" + that.element.id;
            if (that.template)
            {
                that.dropdownlistArrow.addClass(that.toThemeProperty("jqx-" + that.template + ""));
            }
            that.dropdownlistContent.append($('<input autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" style="box-sizing: border-box; margin: 0; padding: 0; padding-left: 3px; padding-right: 3px; border: 0;" type="textarea"/>'));
            that.input = that.dropdownlistContent.find('input');
            that.input.addClass(that.toThemeProperty('jqx-combobox-input'));
            that.input.addClass(that.toThemeProperty('jqx-widget-content'));

            if (that.host.attr('tabindex')) {
                that.input.attr('tabindex', that.host.attr('tabindex'));
                that.host.removeAttr('tabindex');
            }


            var label = $("<label></label");
            if (this.hint) {
                label[0].innerHTML = this.placeHolder;
            }

            label.addClass(that.toThemeProperty('jqx-input-label'));
            that.dropdownlistWrapper.append(label);
            that.label = label;

            var bar = $("<span></span>");
            that.dropdownlistWrapper.append(bar);
            bar.addClass(that.toThemeProperty('jqx-input-bar'));
            that.bar = bar;

            var that = this;

            if (that.template) {
                that.bar.addClass(that.toThemeProperty("jqx-" + that.template));
                that.label.addClass(that.toThemeProperty("jqx-" + that.template));
            }

            that._addInput();
            if (that.rtl) {
                that.input.css({ direction: "rtl" });
                that.dropdownlistContent.addClass(that.toThemeProperty('jqx-combobox-content-rtl'));
            }

            try {
                var listBoxID = 'listBox' + that.id;
                var oldContainer = $($.find('#' + listBoxID));
                if (oldContainer.length > 0) {
                    oldContainer.remove();
                }
                $.jqx.aria(this, "aria-owns", listBoxID);
                $.jqx.aria(this, "aria-haspopup", true);
                $.jqx.aria(this, "aria-multiline", false);
                if (that.listBoxContainer) that.listBoxContainer.jqxListBox('destroy');
                if (that.container) that.container.remove();
                var container = $("<div style='overflow: hidden; border: none; background-color: transparent; position: absolute;' id='listBox" + that.id + "'><div id='innerListBox" + that.id + "'></div></div>");
                container.hide();
                if (that.dropDownContainer == "element") {
                    container.appendTo(that.host);
                }
                else {
                    container.appendTo(document.body);
                }
                that.container = container;
                that.listBoxContainer = $($.find('#innerListBox' + that.id));

                var width = that.width;
                if (that.dropDownWidth != 'auto') {
                    width = that.dropDownWidth;
                }

                if (that.dropDownHeight == null) {
                    that.dropDownHeight = 200;
                }

                that.container.width(parseInt(width) + 25);
                that.container.height(parseInt(that.dropDownHeight) + 25);
                that._ready = false;

                that.addHandler(that.listBoxContainer, 'bindingComplete', function (event) {
                    if (!that.listBox) {
                        that.listBox = $.data(that.listBoxContainer[0], "jqxListBox").instance;
                    }
                    if (!that._ready) {
                        if (that.ready) {
                            that.ready();
                        }
                        that._ready = true;
                    }
                    that._raiseEvent('6');
                });
                that.addHandler(that.listBoxContainer, 'itemAdd', function (event) {
                    that._raiseEvent('7', event.args);
                });
                that.addHandler(that.listBoxContainer, 'itemRemove', function (event) {
                    that._raiseEvent('8', event.args);
                });
                that.addHandler(that.listBoxContainer, 'itemUpdate', function (event) {
                    that._raiseEvent('9', event.args);
                });

                var initializing = true;
                that.listBoxContainer.jqxListBox({
                    autoItemsHeight: that.autoItemsHeight,
                    _checkForHiddenParent: false, allowDrop: false, allowDrag: false,
                    checkboxes: that.checkboxes, emptyString: that.emptyString, autoBind: !that.remoteAutoComplete && that.autoBind,
                    renderer: that.renderer, rtl: that.rtl, itemHeight: that.itemHeight, selectedIndex: that.selectedIndex, incrementalSearch: false, width: width, scrollBarSize: that.scrollBarSize, autoHeight: that.autoDropDownHeight, height: that.dropDownHeight, groupMember: that.groupMember, searchMember: that.searchMember, displayMember: that.displayMember, valueMember: that.valueMember, source: that.source, theme: that.theme,
                    rendered: function () {
                        that.listBox = $.data(that.listBoxContainer[0], "jqxListBox").instance;
                        if (that.remoteAutoComplete) {
                            if (that.autoDropDownHeight) {
                                that.container.height(that.listBox.virtualSize.height + 25);
                                that.listBoxContainer.height(that.listBox.virtualSize.height);
                                that.listBox._arrange();
                            }
                            else {
                                that.listBox._arrange();
                                that.listBox.ensureVisible(0);
                                that.listBox._renderItems();
                                that.container.height(that.listBoxContainer.height() + 25);
                            }

                            if (that.searchString != undefined && that.searchString.length >= that.minLength) {
                                var items = that.listBoxContainer.jqxListBox('items');
                                if (items) {
                                    if (items.length > 0) {
                                        if (!that.isOpened()) {
                                            that.open();
                                        }
                                    }
                                    else that.close();
                                } else that.close();
                            }
                            else {
                                that.close();
                            }
                        }
                        else {
                            that.renderSelection('mouse');
                            if (that.multiSelect) {
                                that.doMultiSelect(false);
                            }
                        }

                        if (that.rendered) {
                            that.rendered();
                        }
                    }
                });

                if (that.dropDownContainer == "element") {
                    that.listBoxContainer.css({ position: 'absolute', top: 0, left: 0 });
                }
                else {
                    that.listBoxContainer.css({ position: 'absolute', zIndex: that.popupZIndex, top: 0, left: 0 });
                }
                that.listBoxContainer.css('border-top-width', '1px');
                that.listBoxContainer.addClass(that.toThemeProperty('jqx-popup'));
                if ($.jqx.browser.msie) {
                    that.listBoxContainer.addClass(that.toThemeProperty('jqx-noshadow'));
                }
                if (that.template)
                {
                    that.listBoxContainer.addClass(that.toThemeProperty("jqx-" + that.template + "-item"));
                }

                that.listBox = $.data(that.listBoxContainer[0], "jqxListBox").instance;
                that.listBox.enableSelection = that.enableSelection;
                that.listBox.enableHover = that.enableHover;
                that.listBox.equalItemsWidth = that.equalItemsWidth;
                that.listBox._arrange();
                that.addHandler(that.listBoxContainer, 'unselect', function (event) {
                    if (!that.multiSelect) {
                        that._raiseEvent('3', { index: event.args.index, type: event.args.type, item: event.args.item });
                    }
                });

                that.addHandler(that.listBoxContainer, 'change', function (event) {
                    if (!that.multiSelect) {
                        that.selectedIndex = that.listBox.selectedIndex;
                        that._raiseEvent('4', { index: event.args.index, type: event.args.type, item: event.args.item });
                    }
                });

                if (that.animationType == 'none') {
                    that.container.css('display', 'none');
                }
                else {
                    that.container.hide();
                }
                initializing = false;
            }
            catch (e) {
                throw e;
            }


            var that = this;
            that.input.attr('disabled', that.disabled);
            var ie7 = $.jqx.browser.msie && $.jqx.browser.version < 8;
            if (!ie7) {
                if (that.isMaterialized() && that.hint) {
                    that.label[0].innerHTML = that.placeHolder;
                }
                else {
                    that.input.attr('placeholder', that.placeHolder);
                }
            }

            that.propertyChangeMap['disabled'] = function (instance, key, oldVal, value) {
                if (value) {
                    instance.host.addClass(that.toThemeProperty('jqx-combobox-state-disabled'));
                    instance.host.addClass(that.toThemeProperty('jqx-fill-state-disabled'));
                    instance.dropdownlistContent.addClass(that.toThemeProperty('jqx-combobox-content-disabled'));
                }
                else {
                    instance.host.removeClass(that.toThemeProperty('jqx-combobox-state-disabled'));
                    instance.host.removeClass(that.toThemeProperty('jqx-fill-state-disabled'));
                    instance.dropdownlistContent.removeClass(that.toThemeProperty('jqx-combobox-content-disabled'));
                }
                instance.input.attr('disabled', instance.disabled);
                $.jqx.aria(instance, "aria-disabled", instance.disabled);
                instance.input.attr('disabled', instance.disabled);
            }

            if (that.disabled) {
                that.host.addClass(that.toThemeProperty('jqx-combobox-state-disabled'));
                that.host.addClass(that.toThemeProperty('jqx-fill-state-disabled'));
                that.dropdownlistContent.addClass(that.toThemeProperty('jqx-combobox-content-disabled'));
            }

            that.host.addClass(that.toThemeProperty('jqx-combobox-state-normal'));
            that.host.addClass(that.toThemeProperty('jqx-combobox'));
            that.host.addClass(that.toThemeProperty('jqx-rc-all'));
            that.host.addClass(that.toThemeProperty('jqx-widget'));
            that.host.addClass(that.toThemeProperty('jqx-widget-content'));
            that.dropdownlistArrowIcon = $("<div></div>");
            if (that.dropDownVerticalAlignment == "top")
            {
                that.dropdownlistArrowIcon.addClass(that.toThemeProperty('jqx-icon-arrow-up'));
            }
            else
            {
                that.dropdownlistArrowIcon.addClass(that.toThemeProperty('jqx-icon-arrow-down'));
            }
            that.dropdownlistArrowIcon.addClass(that.toThemeProperty('jqx-icon'));
            that.dropdownlistArrow.append(that.dropdownlistArrowIcon);
            that.dropdownlistArrow.addClass(that.toThemeProperty('jqx-combobox-arrow-normal'));
            that.dropdownlistArrow.addClass(that.toThemeProperty('jqx-fill-state-normal'));
            if (!that.rtl) {
                that.dropdownlistArrow.addClass(that.toThemeProperty('jqx-rc-r'));
            }
            else {
                that.dropdownlistArrow.addClass(that.toThemeProperty('jqx-rc-l'));
            }

            that._setSize();
            that._updateHandlers();

            that.addHandler(that.input, 'keyup.textchange', function (event) {
                if (that._writeTimer) clearTimeout(that._writeTimer);
                that._writeTimer = setTimeout(function () {
                    var foundMatch = that._search(event);
                    if (that.cinput && that.input) {
                        if (!that.displayMember) {
                            that.cinput[0].value = that.input[0].value;
                        }
                        else {
                            that._updateInputSelection();
                        }
                    }
                }, 50);
            });

            // fix for IE7
            if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                if (that.host.parents('.jqx-window').length > 0) {
                    var zIndex = that.host.parents('.jqx-window').css('z-index');
                    container.css('z-index', zIndex + 10);
                    that.listBoxContainer.css('z-index', zIndex + 10);
                }
            }

            if (that.checkboxes) {
                that.input.attr('readonly', true);
                $.jqx.aria(this, "aria-readonly", true);
            }
            else {
                $.jqx.aria(this, "aria-readonly", false);
            }
            if (!that.remoteAutoComplete) {
                that.searchString = "";
            }

            this.bar.css('top', this.host.height());
        },

        _addInput: function () {
            var name = this.host.attr('name');
            this.cinput = $("<input type='hidden'/>");
            this.host.append(this.cinput);
            if (name) {
                this.cinput.attr('name', name);
            }
        },

        _updateInputSelection: function () {
            if (this.cinput) {
                var selectedValues = new Array();
                if (this.selectedIndex == -1) {
                    this.cinput.val("");
                }
                else {
                    var selectedItem = this.getSelectedItem();
                    if (selectedItem != null) {
                        this.cinput.val(selectedItem.value);
                        selectedValues.push(selectedItem.value);
                    }
                    else {
                        this.cinput.val(this.dropdownlistContent.text());
                    }
                }

                if (this.checkboxes || this.multiSelect) {
                    if (!this.multiSelect) {
                        var items = this.getCheckedItems();
                    }
                    else {
                        var items = this.getSelectedItems();
                    }

                    var str = "";
                    if (items != null) {
                        for (var i = 0; i < items.length; i++) {
                            if (i == items.length - 1) {
                                str += items[i].value;
                            }
                            else {
                                str += items[i].value + ",";
                            }
                            selectedValues.push(items[i].value);
                        }
                    }
                    this.cinput.val(str);
                }
                if (this.field && this.cinput) {
                    if (this.field.nodeName.toLowerCase() == "select") {
                        $.each(this.field, function (index, value) {
                            $(this).removeAttr('selected');
                            this.selected = selectedValues.indexOf(this.value) >= 0;
                            if (this.selected) {
                                $(this).attr('selected', true);
                            }
                        });
                    }
                    else {
                        $.each(this.items, function (index, value) {
                            $(this.originalItem.originalItem).removeAttr('data-selected');
                            this.selected = selectedValues.indexOf(this.value) >= 0;
                            if (this.selected) {
                                $(this.originalItem.originalItem).attr('data-selected', true);
                            }
                        });
                    }
                }
            }
        },

        _search: function (event) {
            var that = this;

            if (event.keyCode == 9)
                return;

            if (that.searchMode == 'none' || that.searchMode == null || that.searchMode == 'undefined') {
                return;
            }

            if (event.keyCode == 16 || event.keyCode == 17 || event.keyCode == 20)
                return;

            if (that.checkboxes) {
                return;
            }

            if (that.multiSelect) {
                var span = $("<span style='visibility: hidden; white-space: nowrap;'>" + document.createTextNode(that.input.val()) + "</span>");
                span.addClass(that.toThemeProperty('jqx-widget'));
                $(document.body).append(span);
                var width = span.width() + 15;
                span.remove();

                if (width > that.host.width()) {
                    width = that.host.width();
                }
                if (width < 25) {
                    width = 25;
                }

                that.input.css('width', width + 'px');
                if (that.selectedItems.length == 0) {
                    that.input.css('width', '100%');

                    if (!that.isMaterialized()) {
                        that.input.attr('placeholder', that.placeHolder);
                    }
                }
                else {
                    if (!that.isMaterialized()) {
                        that.input.attr('placeholder', "");
                    }
                }

                var top = parseInt(this._findPos(that.host[0])[1]) + parseInt(that.host.outerHeight()) - 1 + 'px';
                var isMobileBrowser = $.jqx.mobile.isSafariMobileBrowser() || $.jqx.mobile.isWindowsPhone();
                if ((isMobileBrowser != null && isMobileBrowser)) {
                    top = $.jqx.mobile.getTopPos(this.element) + parseInt(that.host.outerHeight());
                    if ($('body').css('border-top-width') != '0px') {
                        top = parseInt(top) - this._getBodyOffset().top + 'px';
                    }
                }

                that.container.css('top', top);
                var height = parseInt(that.host.height());
                that.dropdownlistArrow.height(height);
            }

            if (!that.isanimating) {
                if (event.altKey && event.keyCode == 38) {
                    that.hideListBox('altKey');
                    return false;
                }

                if (event.altKey && event.keyCode == 40) {
                    if (!that.isOpened()) {
                        that.showListBox('altKey');
                    }
                    return false;
                }
            }

            if (event.keyCode == 37 || event.keyCode == 39)
                return false;

            if (event.altKey || event.keyCode == 18)
                return;

            if (event.keyCode >= 33 && event.keyCode <= 40) {
                return;
            }

            if (event.ctrlKey || that.ctrlKey) {
                if (event.keyCode != 88 && event.keyCode != 86) {
                    return;
                }
            }

            var value = that.input.val();
            if (value.length == 0 && !that.autoComplete) {
                that.listBox.searchString = that.input.val();
                that.listBox.clearSelection();
                that.hideListBox('search');
                that.searchString = that.input.val();
                return;
            }

            if (that.remoteAutoComplete) {
                var that = this;
                var clearListSelection = function () {
                    that.listBox.vScrollInstance.value = 0;
                }

                if (value.length >= that.minLength) {
                    if (!event.ctrlKey && !event.altKey) {
                        if (that.searchString != value) {
                            var source = that.listBoxContainer.jqxListBox('source');
                            if (source == null) {
                                that.listBoxContainer.jqxListBox({ source: that.source });
                            }
                            if (that._searchTimer) {
                                clearTimeout(that._searchTimer);
                            }
                            if (event.keyCode != 13 && event.keyCode != 27) {
                                that._searchTimer = setTimeout(function () {
                                    clearListSelection();
                                    if (that.autoDropDownHeight) {
                                        that.listBox.autoHeight = true;
                                    }
                                    that.searchString = that.input.val();
                                    if (that.search != null) {
                                        that.search(that.input.val());
                                    }
                                    else {
                                        throw "'search' function is not defined";
                                    }

                                }, that.remoteAutoCompleteDelay);
                            }
                        }
                        that.searchString = value;
                    }
                }
                else {
                    if (that._searchTimer) clearTimeout(that._searchTimer);
                    clearListSelection();
                    that.searchString = "";
                    that.search("");
                    that.listBoxContainer.jqxListBox({ source: null });
                }
                return;
            }

            var that = this;
            if (value === that.searchString) {
                return;
            }

            if (!(event.keyCode == '27' || event.keyCode == '13')) {
                var currentValue = that.input[0].value;
                var matches = that._updateItemsVisibility(value);
                var matchItems = matches.matchItems;
                if (that.autoComplete && that.autoItemsHeight) {
                    that.input[0].value = currentValue;
                }
                var index = matches.index;
                if (!that.autoComplete && !that.remoteAutoComplete) {
                    if (!that.multiSelect || (that.multiSelect && index >= 0)) {
                        that.listBox.selectIndex(index);
                        var isInView = that.listBox.isIndexInView(index);
                        if (!isInView) {
                            that.listBox.ensureVisible(index);
                        }
                        else {
                            that.listBox._renderItems();
                        }
                    }
                }

                if (that.autoComplete && matchItems.length === 0) {
                    that.hideListBox('search');
                }
            }

            if (event.keyCode == '13') {
                var isOpen = that.container.css('display') == 'block';
                if (isOpen && !that.isanimating) {
                    that.hideListBox('keyboard');
                    that._oldvalue = that.listBox.selectedValue;
                    return;
                }
            }
            else if (event.keyCode == '27') {
                var isOpen = that.container.css('display') == 'block';
                if (isOpen && !that.isanimating) {
                    if (!that.multiSelect) {
                        var item = that.listBox.getVisibleItem(that._oldvalue);
                        if (item) {
                            var that = this;
                            setTimeout(
                                   function () {
                                       if (that.autoComplete) {
                                           that._updateItemsVisibility("");
                                       }
                                       that.listBox.selectIndex(item.index);
                                       that.renderSelection('api');
                                   }, that.closeDelay);
                        }
                        else {
                            that.clearSelection();
                        }
                    }
                    else {
                        that.input.val("");
                        that.listBox.selectedValue = null;
                    }

                    that.hideListBox('keyboard');
                    that.renderSelection('api');
                    event.preventDefault();
                    return false;
                }
            }
            else {
                if (!that.isOpened() && !that.opening && !event.ctrlKey) {
                    if (that.listBox.visibleItems && that.listBox.visibleItems.length > 0) {
                        if (that.input.val() != that.searchString && that.searchString != undefined && index != -1) {
                            that.showListBox('search');
                        }
                    }
                }
                that.searchString = that.input.val();

                if (that.searchString == "") {
                    if (!that.listBox.itemsByValue[""]) {
                        index = -1;
                        if (!that.multiSelect) {
                            that.clearSelection();
                        }
                    }
                }

                var item = that.listBox.getVisibleItem(index);

                if (item != undefined) {
                    that._updateInputSelection();
                }
            }
        },

        val: function (value) {
            if (!this.input) return "";
            var isEmpty = function (obj) {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key))
                        return false;
                }

                if (typeof value == "number")
                    return false;
                if (typeof value == "date")
                    return false;
                if (typeof value == "boolean")
                    return false;
                if (typeof value == "string")
                    return false;

                return true;
            }

            if (isEmpty(value) || arguments.length == 0) {
                var item = this.getSelectedItem();
                if (item) {
                    return item.value;
                }

       
                return this.input.val();
            }
            else {
                var item = this.getItemByValue(value);
                if (item != null) {
                    this.selectItem(item);
                }
                else {
                    this.input.val(value);
                }
                return this.input.val();
            }
        },

        focus: function () {
            var that = this;
            var doFocus = function () {
                that.input.focus();
                var val = that.input.val();
                that._setSelection(0, val.length);
            }
            doFocus();
            setTimeout(function () {
                doFocus();
            }, 10);
        },

        _setSelection: function (start, end) {
            try {
                if ('selectionStart' in this.input[0]) {
                    this.input[0].focus();
                    this.input[0].setSelectionRange(start, end);
                }
                else {
                    var range = this.input[0].createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', end);
                    range.moveStart('character', start);
                    range.select();
                }
            }
            catch (error) {
            }
        },

        setContent: function (value) {
            this.input.val(value);
        },

        // get all matches of a searched value.
        _updateItemsVisibility: function (value) {
            var items = this.getItems();
            if (items == undefined) {
                return { index: -1, matchItem: new Array() }
            }

            var that = this;
            var index = -1;
            var matchItems = new Array();
            var newItemsIndex = 0;

            $.each(items, function (i) {
                var itemValue = '';
                if (!this.isGroup) {
                    if (this.searchLabel) {
                        itemValue = this.searchLabel;
                    }
                    else if (this.label) {
                        itemValue = this.label;
                    }
                    else if (this.value) {
                        itemValue = this.value;
                    }
                    else if (this.title) {
                        itemValue = this.title;
                    }
                    else itemValue = 'jqxItem';
                    itemValue = itemValue.toString();
                    var matches = false;
                    switch (that.searchMode) {
                        case 'containsignorecase':
                            matches = $.jqx.string.containsIgnoreCase(itemValue, value);
                            break;
                        case 'contains':
                            matches = $.jqx.string.contains(itemValue, value);
                            break;
                        case 'equals':
                            matches = $.jqx.string.equals(itemValue, value);
                            break;
                        case 'equalsignorecase':
                            matches = $.jqx.string.equalsIgnoreCase(itemValue, value);
                            break;
                        case 'startswith':
                            matches = $.jqx.string.startsWith(itemValue, value);
                            break;
                        case 'startswithignorecase':
                            matches = $.jqx.string.startsWithIgnoreCase(itemValue, value);
                            break;
                        case 'endswith':
                            matches = $.jqx.string.endsWith(itemValue, value);
                            break;
                        case 'endswithignorecase':
                            matches = $.jqx.string.endsWithIgnoreCase(itemValue, value);
                            break;
                    }

                    if (that.autoComplete && !matches) {
                        this.visible = false;
                    }

                    if (matches && that.autoComplete) {
                        matchItems[newItemsIndex++] = this;
                        this.visible = true;
                        index = this.visibleIndex;
                    }

                    if (value == '' && that.autoComplete) {
                        this.visible = true;
                        matches = false;
                    }

                    if (that.multiSelect) {
                        this.disabled = false;
                        if (that.selectedItems.indexOf(this.value) >= 0 || that._disabledItems.indexOf(this.value) >= 0) {
                            this.disabled = true;
                            matches = false;
                        }
                    }

                    if (!that.multiSelect) {
                        if (matches && !that.autoComplete) {
                            index = this.visibleIndex;
                            return false;
                        }
                    }
                    else {
                        if (matches && !that.autoComplete) {
                            if (index === -1) {
                                index = this.visibleIndex;
                            }
                            return true;
                        }
                    }
                }
            });
            this.listBox.searchString = value;
            var that = this;
            var selectFirstItem = function () {
                if (!that.multiSelect) return;
                var nonDisabledIndex = 0;
                var foundIndex = false;
                var item = null;
                for (var indx = 0; indx < that.listBox.items.length; indx++) {
                    that.listBox.selectedIndexes[indx] = -1;
                    if (!that.listBox.items[indx].disabled) {
                        if (foundIndex == false) {
                            item = that.listBox.items[indx];
                            nonDisabledIndex = item.visibleIndex;
                            foundIndex = true;
                        }
                    }
                }
                that.listBox.selectedIndex = -1;
                that.listBox.selectedIndex = nonDisabledIndex;
                that.listBox.selectedIndexes[nonDisabledIndex] = nonDisabledIndex;
                if (that.listBox.visibleItems.length > 0) {
                    if (item) {
                        that.listBox.selectedValue = item.value;
                    }
                    else {
                        that.listBox.selectedValue = null;
                    }
                }
                else {
                    that.listBox.selectedValue = null;
                }
                that.listBox.ensureVisible(0);
            }

            if (!this.autoComplete) {
                selectFirstItem();
                return { index: index, matchItems: matchItems };
            }

            this.listBox.renderedVisibleItems = new Array();
            var vScrollValue = this.listBox.vScrollInstance.value;
            this.listBox.vScrollInstance.value = 0;
            this.listBox.visibleItems = new Array();
            this.listBox._renderItems();
            var selectedValue = this.listBox.selectedValue;
            var item = this.listBox.getItemByValue(selectedValue);
            if (!this.multiSelect) {
                if (item) {
                    if (item.visible) {
                        this.listBox.selectedIndex = item.visibleIndex;
                        for (var indx = 0; indx < this.listBox.items.length; indx++) {
                            this.listBox.selectedIndexes[indx] = -1;
                        }
                        this.listBox.selectedIndexes[item.visibleIndex] = item.visibleIndex;
                    }
                    else {
                        for (var indx = 0; indx < this.listBox.items.length; indx++) {
                            this.listBox.selectedIndexes[indx] = -1;
                        }
                        this.listBox.selectedIndex = -1;
                    }
                }
            }
            else {
                selectFirstItem();
            }

            this.listBox._renderItems();
            var height = this.listBox._calculateVirtualSize().height;
            if (height < vScrollValue) {
                vScrollValue = 0;
                this.listBox.vScrollInstance.refresh();
            }
            if (this.autoDropDownHeight) {
                this._disableSelection = true;
                if (this.listBox.autoHeight != this.autoDropDownHeight) {
                    this.listBoxContainer.jqxListBox({ autoHeight: this.autoDropDownHeight });
                }
                this.container.height(height + 25);
                this.listBox.invalidate();
                this._disableSelection = false;
            }
            else {
                if (height < parseInt(this.dropDownHeight)) {
                    var scrollOffset = this.listBox.hScrollBar[0].style.visibility == "hidden" ? 0 : 20;
                    this.listBox.height = scrollOffset + height;
                    this.container.height(height + 25 + scrollOffset);
                    this.listBox.invalidate();
                }
                else {
                    this.listBox.height = parseInt(this.dropDownHeight);
                    this.container.height(parseInt(this.dropDownHeight) + 25);
                    this.listBox.invalidate();
                }
            }

            this.listBox.vScrollInstance.setPosition(vScrollValue);
            return { index: index, matchItems: matchItems };
        },

        // gets all items that match to a search value.
        findItems: function (value) {
            var items = this.getItems();
            var that = this;
            var index = 0;
            var matchItems = new Array();

            $.each(items, function (i) {
                var itemValue = '';
                if (!this.isGroup) {
                    if (this.label) {
                        itemValue = this.label;
                    }
                    else if (this.value) {
                        itemValue = this.value;
                    }
                    else if (this.title) {
                        itemValue = this.title;
                    }
                    else itemValue = 'jqxItem';

                    var matches = false;
                    switch (that.searchMode) {
                        case 'containsignorecase':
                            matches = $.jqx.string.containsIgnoreCase(itemValue, value);
                            break;
                        case 'contains':
                            matches = $.jqx.string.contains(itemValue, value);
                            break;
                        case 'equals':
                            matches = $.jqx.string.equals(itemValue, value);
                            break;
                        case 'equalsignorecase':
                            matches = $.jqx.string.equalsIgnoreCase(itemValue, value);
                            break;
                        case 'startswith':
                            matches = $.jqx.string.startsWith(itemValue, value);
                            break;
                        case 'startswithignorecase':
                            matches = $.jqx.string.startsWithIgnoreCase(itemValue, value);
                            break;
                        case 'endswith':
                            matches = $.jqx.string.endsWith(itemValue, value);
                            break;
                        case 'endswithignorecase':
                            matches = $.jqx.string.endsWithIgnoreCase(itemValue, value);
                            break;
                    }

                    if (matches) {
                        matchItems[index++] = this;
                    }
                }
            });

            return matchItems;
        },

        //[optimize]
        _resetautocomplete: function () {
            $.each(this.listBox.items, function (i) {
                this.visible = true;
            });
            this.listBox.vScrollInstance.value = 0;
            this.listBox._addItems();
            this.listBox.autoHeight = false;

            this.listBox.height = this.dropDownHeight;
            this.container.height(parseInt(this.dropDownHeight) + 25);
            this.listBoxContainer.height(parseInt(this.dropDownHeight));
            this.listBox._arrange();

            this.listBox._addItems();
            this.listBox._renderItems();
        },

        // gets all items.
        getItems: function () {
            var item = this.listBox.items;
            return item;
        },

        getVisibleItems: function () {
            return this.listBox.getVisibleItems();
        },

        _setSize: function () {
            var computedStyle = window.getComputedStyle(this.element);
            var borderSize = parseInt(computedStyle.borderLeftWidth) * 2;
            var boxSizing = computedStyle.boxSizing;

            if (boxSizing === 'border-box' || isNaN(borderSize)) {
                borderSize = 0;
            }

            if (this.width != null && this.width.toString().indexOf("px") != -1) {
                this.element.style.width = parseInt(this.width) - borderSize + 'px';
            }
            else if (this.width != undefined && !isNaN(this.width)) {
                this.element.style.width = parseInt(this.width) - borderSize + 'px';
            }

            if (this.height != null && this.height.toString().indexOf("px") != -1) {
                this.element.style.height = parseInt(this.height) - borderSize + 'px';
            }
            else if (this.height != undefined && !isNaN(this.height)) {
                this.element.style.height = parseInt(this.height) - borderSize + 'px';
            };

            var isPercentage = false;
            if (this.width != null && this.width.toString().indexOf("%") != -1) {
                isPercentage = true;
                this.element.style.width = this.width;

                if (borderSize > 0) {
                    this.host.css('box-sizing', 'border-box');
                }
            }

            if (this.height != null && this.height.toString().indexOf("%") != -1) {
                isPercentage = true;
                this.element.style.height = this.height;
            }

            if (isPercentage) {
                var that = this;
                var width = this.host.width();
                if (this.dropDownWidth != 'auto') {
                    width = this.dropDownWidth;
                }
                this.listBoxContainer.jqxListBox({ width: width });
                this.container.width(parseInt(width) + 25);
                this._arrange();
            }
            var that = this;

            var resizeFunc = function () {
                if (that.multiSelect) {
                    that.host.height(that.height);
                }

                that._arrange();
                if (that.multiSelect) {
                    that.host.height('auto');
                }
            }

            that.oldWidth = that.host.width();
            that.oldHeight = that.host.height();
            $.jqx.utilities.resize(this.host, function () {
                var w = that.host.width();
                var h = that.host.height();
                
                if (w != that.oldWidth || h != that.oldHeight) {
                    resizeFunc();
                    that.hideListBox('api');
                }

                that.oldWidth = w;
                that.oldHeight = h;
            });
        },

        // returns true when the listbox is opened, otherwise returns false.
        isOpened: function () {
            var that = this;
            var openedListBox = $.data(document.body, "openedCombojqxListBox" + this.element.id);

            if (this.container.css('display') != 'block')
                return false;

            if (openedListBox != null && openedListBox == that.listBoxContainer) {
                return true;
            }

            return false;
        },

        _updateHandlers: function () {
            var that = this;
            var hovered = false;
            this.removeHandlers();

            if (this.multiSelect) {
                this.addHandler(this.dropdownlistContent, 'click', function (event) {
                    if (event.target.href) return false;

                    that.input.focus();
                    setTimeout(function () {
                        that.input.focus();
                    }, 10);
                });
                this.addHandler(this.dropdownlistContent, 'focus', function (event) {
                    if (event.target.href) return false;

                    that.input.focus();
                    setTimeout(function () {
                        that.input.focus();
                    }, 10);
                });
            }

            if (!this.touch) {
                if (this.host.parents()) {
                    this.addHandler(this.host.parents(), 'scroll.combobox' + this.element.id, function (event) {
                        var opened = that.isOpened();
                        if (opened) {
                            that.close();
                        }
                    });
                }

                this.addHandler(this.host, 'mouseenter', function () {
                    if (!that.disabled && that.enableHover) {
                        hovered = true;
                        that.host.addClass(that.toThemeProperty('jqx-combobox-state-hover'));
                        if (that.dropDownVerticalAlignment == "top")
                        {
                            that.dropdownlistArrowIcon.addClass(that.toThemeProperty('jqx-icon-arrow-up'));
                        }
                        else
                        {
                            that.dropdownlistArrowIcon.addClass(that.toThemeProperty('jqx-icon-arrow-down-hover'));
                        }
                        that.dropdownlistArrow.addClass(that.toThemeProperty('jqx-combobox-arrow-hover'));
                        that.dropdownlistArrow.addClass(that.toThemeProperty('jqx-fill-state-hover'));
                    }
                });
                this.addHandler(this.host, 'mouseleave', function () {
                    if (!that.disabled && that.enableHover) {
                        that.host.removeClass(that.toThemeProperty('jqx-combobox-state-hover'));
                        that.dropdownlistArrowIcon.removeClass(that.toThemeProperty('jqx-icon-arrow-down-hover'));
                        that.dropdownlistArrowIcon.removeClass(that.toThemeProperty('jqx-icon-arrow-up-hover'));
                        that.dropdownlistArrow.removeClass(that.toThemeProperty('jqx-combobox-arrow-hover'));
                        that.dropdownlistArrow.removeClass(that.toThemeProperty('jqx-fill-state-hover'));
                        hovered = false;
                    }
                });
            }

            if (that.autoOpen) {
                this.addHandler(this.host, 'mouseenter', function () {
                    var isOpened = that.isOpened();
                    if (!isOpened && that.autoOpen) {
                        that.open();
                        that.host.focus();
                    }
                });

                this.addHandler($(document), 'mousemove.' + that.id, function (event) {
                    var isOpened = that.isOpened();
                    if (isOpened && that.autoOpen) {
                        var offset = that.host.coord();
                        var top = offset.top;
                        var left = offset.left;
                        var popupOffset = that.container.coord();
                        var popupLeft = popupOffset.left;
                        var popupTop = popupOffset.top;

                        canClose = true;

                        if (event.pageY >= top && event.pageY <= top + that.host.height() + 2) {
                            if (event.pageX >= left && event.pageX < left + that.host.width())
                                canClose = false;
                        }
                        if (event.pageY >= popupTop && event.pageY <= popupTop + that.container.height() - 20) {
                            if (event.pageX >= popupLeft && event.pageX < popupLeft + that.container.width())
                                canClose = false;
                        }

                        if (canClose) {
                            that.close();
                        }
                    }
                });
            }

            var eventName = 'mousedown';
            if (this.touch) eventName = $.jqx.mobile.getTouchEventName('touchstart');

            var dropDownButtonClicked = function (event) {
                if (!that.disabled) {
                    var isOpen = that.container.css('display') == 'block';
                    if (!that.isanimating) {
                        if (isOpen) {
                            that.hideListBox('api');
                            if (!$.jqx.mobile.isTouchDevice()) {
                                that.input.focus();
                                setTimeout(function () {
                                    that.input.focus();
                                }, 10);
                            }
                            return true;
                        }
                        else {
                            if (that.autoDropDownHeight) {
                                that.container.height(that.listBoxContainer.height() + 25);
                                var autoheight = that.listBoxContainer.jqxListBox('autoHeight');
                                if (!autoheight) {
                                    that.listBoxContainer.jqxListBox({ autoHeight: that.autoDropDownHeight })
                                    that.listBox._arrange();
                                    that.listBox.ensureVisible(0);
                                    that.listBox._renderItems();
                                    that.container.height(that.listBoxContainer.height() + 25);
                                }
                            }
                            that.showListBox('api');
                            if (!$.jqx.mobile.isTouchDevice()) {
                                setTimeout(function () {
                                    that.input.focus();
                                }, 10);
                            }
                            else {
                                return true;
                            }
                        }
                    }
                }
            }

            this.addHandler(this.dropdownlistArrow, eventName,
            function (event) {
                dropDownButtonClicked(event);
                //       return false;
            });
            this.addHandler(this.dropdownlistArrowIcon, eventName,
            function (event) {

                //   dropDownButtonClicked(event);
                //     return false;
            });

            this.addHandler(this.host, 'focus', function () {
                that.focus();
            });

            this.addHandler(this.input, 'focus', function (event) {
                that.focused = true;
                that.host.addClass(that.toThemeProperty('jqx-combobox-state-focus'));
                that.host.addClass(that.toThemeProperty('jqx-fill-state-focus'));
                that.bar.addClass('focused');
                that.label.addClass('focused');

                that.dropdownlistContent.addClass(that.toThemeProperty('jqx-combobox-content-focus'));
                if (event.stopPropagation) {
                    event.stopPropagation();
                }

            });
            this.addHandler(this.input, 'blur', function () {
                that.focused = false;
                that.bar.removeClass('focused');
                that.label.removeClass('focused');

                if (!that.isOpened() && !that.opening) {
                    if (that.selectionMode == "dropDownList") {
                        that._selectOldValue();
                    }

                    that.host.removeClass(that.toThemeProperty('jqx-combobox-state-focus'));
                    that.host.removeClass(that.toThemeProperty('jqx-fill-state-focus'));
                    that.dropdownlistContent.removeClass(that.toThemeProperty('jqx-combobox-content-focus'));
                }
                if (that._searchTimer) clearTimeout(that._searchTimer);
            });
            this.addHandler($(document), 'mousedown.' + this.id, that.closeOpenedListBox, { that: this, listbox: this.listBox, id: this.id });
            if (this.touch) {
                this.addHandler($(document), $.jqx.mobile.getTouchEventName('touchstart') + '.' + this.id, that.closeOpenedListBox, { that: this, listbox: this.listBox, id: this.id });
            }

            this.addHandler(this.host, 'keydown', function (event) {
                var isOpen = that.container.css('display') == 'block';
                that.ctrlKey = event.ctrlKey;
                if (that.host.css('display') == 'none') {
                    return true;
                }

                if (event.keyCode == '13' || event.keyCode == '9') {
                    if (isOpen && !that.isanimating) {
                        if (that.listBox.selectedIndex != -1) {
                            that.renderSelection('mouse');
                            var index = that.listBox.selectedIndex;
                            var item = that.listBox.getVisibleItem(index);
                            if (item) {
                                that.listBox.selectedValue = item.value;
                            }
                            that._setSelection(that.input.val().length, that.input.val().length);
                            that.hideListBox('keyboard');
                        }
                        if (event.keyCode == '13') {
                            that._oldvalue = that.listBox.selectedValue;
                        }
                        if (!that.keyboardSelection) {
                            that._raiseEvent('2', { index: that.selectedIndex, type: 'keyboard', item: that.getItem(that.selectedIndex) });
                        }

                        if (event.keyCode == '9') return true;
                        return false;
                    }
                }

                if (event.keyCode == 115) {
                    if (!that.isanimating) {
                        if (!that.isOpened()) {
                            that.showListBox('keyboard');
                        }
                        else if (that.isOpened()) {
                            that.hideListBox('keyboard');
                        }
                    }
                    return false;
                }

                if (event.altKey) {
                    if (that.host.css('display') == 'block') {
                        if (!that.isanimating) {
                            if (event.keyCode == 38) {
                                if (that.isOpened()) {
                                    that.hideListBox('altKey');
                                }
                            }
                            else if (event.keyCode == 40) {
                                if (!that.isOpened()) {
                                    that.showListBox('altKey');
                                }
                            }
                        }
                    }
                }

                if (event.keyCode == '27' || event.keyCode == '9') {
                    if (that.isOpened() && !that.isanimating) {

                        if (event.keyCode == '27') {
                            if (!that.multiSelect) {
                                var item = that.listBox.getItemByValue(that._oldvalue);
                                if (item) {
                                    setTimeout(
                                        function () {
                                            if (that.autoComplete) {
                                                that._updateItemsVisibility("");
                                            }
                                            that.listBox.selectIndex(item.index);
                                            that.renderSelection('api');
                                        }, that.closeDelay);
                                }
                                else {
                                    that.clearSelection();
                                }
                            }
                            else {
                                that.listBox.selectedValue = null;
                                that.input.val("");
                            }
                        }
                        that.hideListBox('keyboard');


                        if (event.keyCode == '9')
                            return true;

                        that.renderSelection('api');
                        event.preventDefault();

                        return false;
                    }
                }

                var key = event.keyCode;

                if (isOpen && !that.disabled && key != 8) {
                    return that.listBox._handleKeyDown(event);
                }
                else if (!that.disabled && !isOpen) {
                    var key = event.keyCode;
                    // arrow keys.
                    if (key == 33 || key == 34 || key == 35 || key == 36 || key == 38 || key == 40) {
                        return that.listBox._handleKeyDown(event);
                    }
                }
                if (key === 8 && that.multiSelect) {
                    if (that.input.val().length === 0) {
                        var lastItem = that.selectedItems[that.selectedItems.length - 1];
                        that.selectedItems.pop();
                        that._selectedItems.pop();
                        if (lastItem) {
                            that._raiseEvent('3', { index: lastItem.index, type: 'keyboard', item: lastItem });
                            that._raiseEvent('4', { index: lastItem.index, type: 'keyboard', item: lastItem });
                        }

                        that.listBox.selectedValue = null;
                        that.doMultiSelect();
                        return false;
                    }
                }


                if (that.isMaterialized() &&  that.hint) {
                    setTimeout(function () {
                        if (that.input[0].value.length === 0) {
                            that.element.removeAttribute('hint');
                            that.label[0].innerHTML = that.placeHolder;
                        }
                        else if (that.hint) {
                            that.element.setAttribute('hint', true);
                        }
                    });
                }
            });

            this.addHandler(this.listBoxContainer, 'checkChange', function (event) {
                that.renderSelection('mouse');
                that._updateInputSelection();
                that._raiseEvent(5, { label: event.args.label, value: event.args.value, checked: event.args.checked, item: event.args.item });
            });

            this.addHandler(this.listBoxContainer, 'select', function (event) {
                if (!that.disabled) {
                    if (event.args.type != 'keyboard' || that.keyboardSelection) {
                        that.renderSelection(event.args.type);
                        if (!that.multiSelect) {
                            that._raiseEvent('2', { index: event.args.index, type: event.args.type, item: event.args.item });
                        }
                        if (event.args.type == 'mouse') {
                            that._oldvalue = that.listBox.selectedValue;

                            if (!that.checkboxes) {
                                that.hideListBox('mouse');
                                if (!that.touch) {
                                    that.input.focus();
                                }
                                else {
                                    return false;
                                }
                            }
                        }
                    }
                }
            });
            if (this.listBox != null && this.listBox.content != null) {
                this.addHandler(this.listBox.content, 'click', function (event) {
                    if (!that.disabled) {
                        if (that.listBox.itemswrapper) {
                            if (event.target === that.listBox.itemswrapper[0])
                                return true;
                        }

                        if (event.target && event.target.className) {
                            if (event.target.className.indexOf('jqx-fill-state-disabled') >= 0) {
                                return true;
                            }
                        }

                        that.renderSelection('mouse');
                        that._oldvalue = that.listBox.selectedValue;
                        if (!that.touch && !that.ishiding) {
                            if (!that.checkboxes) {
                                that.hideListBox('mouse');
                                that.input.focus();
                            }
                        }
                        if (that.touch === true) {
                            if (!that.checkboxes) {
                                that.hideListBox('mouse');
                            }
                        }
                    }
                });
            }
        },

        _selectOldValue: function () {
            var that = this;
            if (that.listBox.selectedIndex == -1) {
                if (!that.multiSelect) {
                    var item = that.listBox.getItemByValue(that._oldvalue);
                    if (item) {
                        setTimeout(
                            function () {
                                if (that.autoComplete) {
                                    that._updateItemsVisibility("");
                                }
                                that.listBox.selectIndex(item.index);
                                that.renderSelection('api');
                            }, that.closeDelay);
                    }
                    else {
                        that.clearSelection();
                        that.listBox.selectIndex(0);
                        that.renderSelection('api');
                    }
                }
                else {
                    that.listBox.selectedValue = null;
                    that.input.val("");
                }
            }
            else {
                that.renderSelection('api');
            }
        },

        removeHandlers: function () {
            var that = this;
            if (this.dropdownlistWrapper != null) {
                this.removeHandler(this.dropdownlistWrapper, 'mousedown');
            }

            if (this.dropdownlistContent) {
                this.removeHandler(this.dropdownlistContent, 'click');
                this.removeHandler(this.dropdownlistContent, 'focus');
            }
            this.removeHandler(this.host, 'keydown');
            this.removeHandler(this.host, 'focus');
            if (this.input != null) {
                this.removeHandler(this.input, 'focus');
                this.removeHandler(this.input, 'blur');
            }
            this.removeHandler(this.host, 'mouseenter');
            this.removeHandler(this.host, 'mouseleave');
            this.removeHandler($(document), 'mousemove.' + that.id);
            if (this.listBoxContainer) {
                this.removeHandler(this.listBoxContainer, 'checkChange');
                this.removeHandler(this.listBoxContainer, 'select');
            }
            if (this.host.parents()) {
                this.removeHandler(this.host.parents(), 'scroll.combobox' + this.element.id);
            }
            if (this.dropdownlistArrowIcon && this.dropdownlistArrow) {
                var eventName = 'mousedown';
                if (this.touch) eventName = $.jqx.mobile.getTouchEventName('touchstart');
                this.removeHandler(this.dropdownlistArrowIcon, eventName);
                this.removeHandler(this.dropdownlistArrow, eventName);
            }
        },

        // gets an item by index.
        getItem: function (index) {
            var item = this.listBox.getItem(index);
            return item;
        },

        getItemByValue: function (value) {
            var item = this.listBox.getItemByValue(value);
            return item;
        },

        getVisibleItem: function (index) {
            var item = this.listBox.getVisibleItem(index);
            return item;
        },

        // renders the selection.
        renderSelection: function (type) {
            if (type == undefined || type == 'none') {
                return;
            }

            if (this._disableSelection === true)
                return;

            if (this.listBox == null)
                return;

            if (this.multiSelect) {
                return;
            }
            var item = this.listBox.visibleItems[this.listBox.selectedIndex];

            if (this.autoComplete && !this.checkboxes) {
                if (this.listBox.selectedValue !== undefined) {
                    var item = this.getItemByValue(this.listBox.selectedValue);
                }
            }

            if (this.checkboxes) {
                var checkedItems = this.getCheckedItems();
                if (checkedItems != null && checkedItems.length > 0) {
                    item = checkedItems[0];
                }
                else item = null;
            }

            if (this.hint) {
                this.label[0].innerHTML = this.placeHolder;
            }

            if (item != null) {
                if (this.hint) {
                    this.element.setAttribute('hint', true);
                }
            }
            else {
                this.element.removeAttribute('hint');
            }

            this.bar.css('top', this.host.height());

            if (item == null) {
                var ie7 = $.jqx.browser.msie && $.jqx.browser.version < 8;
                this.input.val("");
                this.input.attr('value', '');
                if (!ie7) {
                    if (this.isMaterialized()) {
                        this.label[0].innerHTML = this.placeHolder;
                        this.input.removeAttr('placeholder');
                    }
                    else {
                        this.input.attr('placeholder', this.placeHolder);
                    }
                }
                this._updateInputSelection();
                return;
            }

            this.selectedIndex = this.listBox.selectedIndex;
            var spanElement = $('<span></span>');

            if (item.label != undefined && item.label != null && item.label.toString().length > 0) {
                $.jqx.utilities.html(spanElement, item.label);
            }
            else if (item.value != undefined && item.value != null && item.value.toString().length > 0) {
                $.jqx.utilities.html(spanElement, item.value);
            }
            else if (item.title != undefined && item.title != null && item.title.toString().length > 0) {
                $.jqx.utilities.html(spanElement, item.title);
            }
            else {
                $.jqx.utilities.html(spanElement, this.emptyString);
            }
            var spanHeight = spanElement.outerHeight();
            if (this.checkboxes) {
                var items = this.getCheckedItems();
                var str = "";
                for (var i = 0; i < items.length; i++) {
                    if (i == items.length - 1) {
                        str += items[i].label;
                    }
                    else {
                        str += items[i].label + ", ";
                    }
                }
                this.input.val(str);
            }
            else {
                this.input.val(spanElement.text());
            }
            spanElement.remove();
            this._updateInputSelection();
            if (this.renderSelectedItem) {
                var result = this.renderSelectedItem(this.listBox.selectedIndex, item);
                if (result != undefined) {
                    this.input[0].value = result;
                }
            }
            this.input.attr('value', this.input.val());
            if (this.listBox && this.listBox._activeElement) {
                $.jqx.aria(this, "aria-activedescendant", this.listBox._activeElement.id);
            }
        },

        dataBind: function () {
            this.listBoxContainer.jqxListBox({ source: this.source });
            this.renderSelection('mouse');
            if (this.source == null) {
                this.clearSelection();
            }
        },

        clear: function () {
            this.listBoxContainer.jqxListBox({ source: null });
            this.clearSelection();
        },

        // clears the selection.
        clearSelection: function (render) {
            this.selectedIndex = -1;
            this.listBox.clearSelection();
            this.input.val("");
            if (this.multiSelect) {
                this.listBox.selectedValue = "";
                this.selectedItems = new Array();
                this._selectedItems = new Array();
                this.doMultiSelect(false);
            }
        },

        // unselects an item at specific index.
        // @param Number
        unselectIndex: function (index, render) {
            if (isNaN(index))
                return;

            if (this.autoComplete) {
                this._updateItemsVisibility("");
            }

            this.listBox.unselectIndex(index, render);
            this.renderSelection('mouse');
            if (this.multiSelect) {
                if (index >= 0) {
                    var multiItem = this.getItem(index);

                    var indx = this.selectedItems.indexOf(multiItem.value);
                    if (indx >= 0) {
                        if (multiItem.value === this.listBox.selectedValue) {
                            this.listBox.selectedValue = null;
                        }

                        this.selectedItems.splice(indx, 1);
                        this._selectedItems.splice(indx, 1);
                    }
                }
                this.doMultiSelect(false);
            }
        },

        // selects an item at specific index.
        // @param Number
        selectIndex: function (index, ensureVisible, render, forceSelect) {
            if (this.autoComplete) {
                this._updateItemsVisibility("");
            }

            this.listBox.selectIndex(index, ensureVisible, render, forceSelect);
            this.renderSelection('mouse');
            this.selectedIndex = index;
            if (this.multiSelect) {
                this.doMultiSelect();
            }
        },

        selectItem: function (item) {
            if (this.autoComplete) {
                this._updateItemsVisibility("");
            }

            if (this.listBox != undefined) {
                this.listBox.selectedIndex = -1;
                this.listBox.selectItem(item);
                this.selectedIndex = this.listBox.selectedIndex;
                this.renderSelection('mouse');
                if (this.multiSelect) {
                    this.doMultiSelect(false);
                }
            }
        },

        unselectItem: function (item) {
            if (this.autoComplete) {
                this._updateItemsVisibility("");
            }

            if (this.listBox != undefined) {
                this.listBox.unselectItem(item);
                this.renderSelection('mouse');
                if (this.multiSelect) {
                    var multiItem = this.getItemByValue(item);
                    if (multiItem) {
                        var index = this.selectedItems.indexOf(multiItem.value);
                        if (index >= 0) {
                            if (multiItem.value === this.listBox.selectedValue) {
                                this.listBox.selectedValue = null;
                            }

                            this.selectedItems.splice(index, 1);
                            this._selectedItems.splice(index, 1);
                        }
                    }

                    this.doMultiSelect(false);
                }
            }
        },

        checkItem: function (item) {
            if (this.autoComplete) {
                this._updateItemsVisibility("");
            }

            if (this.listBox != undefined) {
                this.listBox.checkItem(item);
            }
        },

        uncheckItem: function (item) {
            if (this.autoComplete) {
                this._updateItemsVisibility("");
            }

            if (this.listBox != undefined) {
                this.listBox.uncheckItem(item);
            }
        },

        indeterminateItem: function (item) {
            if (this.autoComplete) {
                this._updateItemsVisibility("");
            }

            if (this.listBox != undefined) {
                this.listBox.indeterminateItem(item);
            }
        },

        getSelectedValue: function () {
            return this.listBox.selectedValue;
        },

        // gets the selected index.
        getSelectedIndex: function () {
            if (!this.multiSelect) {
                return this.listBox.selectedIndex;
            }
            else {
                if (this.remoteAutoComplete && this.multiSelect && this._selectedItems.length > 0)
                    return this.getSelectedItems()[0].index;

                if (this._selectedItems && this._selectedItems.length > 0) {
                    return this.getSelectedItems()[0].index;
                }
            }
        },

        // gets the selected item.
        getSelectedItem: function () {
            if (!this.multiSelect) {
                return this.getVisibleItem(this.listBox.selectedIndex);
            }
            else {
                if (this.remoteAutoComplete && this.multiSelect && this._selectedItems.length > 0)
                    return this.getSelectedItems()[0];

                if (this._selectedItems && this._selectedItems.length > 0) {
                    return this.getSelectedItems()[0];
                }
                return null;
            }
        },

        // gets the selected items when multiselect is enabled.
        getSelectedItems: function () {
            if (this.remoteAutoComplete && this.multiSelect)
                return this._selectedItems;

            var array = new Array();
            var that = this;
            $.each(this.selectedItems, function () {
                var item = that.getItemByValue(this);
                if (item) {
                    array.push(item);
                }
                else {
                    var item = that._selectedItems[this];
                    if (item) {
                        array.push(item);
                    }
                }
            });
            return array;
        },

        getCheckedItems: function () {
            return this.listBox.getCheckedItems();
        },

        checkIndex: function (index) {
            this.listBox.checkIndex(index);
        },

        uncheckIndex: function (index) {
            this.listBox.uncheckIndex(index);
        },

        indeterminateIndex: function (index) {
            this.listBox.indeterminateIndex(index);
        },
        checkAll: function () {
            this.listBox.checkAll();
            this.renderSelection("mouse");
        },

        uncheckAll: function () {
            this.listBox.uncheckAll();
            this.renderSelection("mouse");
        },

        insertAt: function (item, index) {
            if (item == null)
                return false;

            return this.listBox.insertAt(item, index);
        },

        addItem: function (item) {
            return this.listBox.addItem(item);
        },

        removeAt: function (index) {
            var result = this.listBox.removeAt(index);
            this.renderSelection('mouse');
            return result;
        },

        removeItem: function (item) {
            var result = this.listBox.removeItem(item);
            this.renderSelection('mouse');
            return result;
        },

        updateItem: function (item, oldItem) {
            var result = this.listBox.updateItem(item, oldItem);
            this.renderSelection('mouse');
            return result;
        },

        updateAt: function (item, index) {
            var result = this.listBox.updateAt(item, index);
            this.renderSelection('mouse');
            return result;
        },

        ensureVisible: function (index) {
            return this.listBox.ensureVisible(index);
        },

        disableAt: function (index) {
            var item = this.getVisibleItem(index);
            if (item) {
                this._disabledItems.push(item.value);
            }
            return this.listBox.disableAt(index);
        },

        enableAt: function (index) {
            var item = this.getVisibleItem(index);
            if (item) {
                this._disabledItems.splice(this._disabledItems.indexOf(item.value), 1);
            }
            return this.listBox.enableAt(index);
        },

        disableItem: function (item) {
            var item = this.getVisibleItem(item);
            if (item) {
                this._disabledItems.push(item.value);
            }
            return this.listBox.disableItem(item);
        },

        enableItem: function (item) {
            var item = this.getVisibleItem(item);
            if (item) {
                this._disabledItems.splice(this._disabledItems.indexOf(item.value), 1);
            }
            return this.listBox.enableItem(item);
        },

        _findPos: function (obj) {
            while (obj && (obj.type == 'hidden' || obj.nodeType != 1 || $.expr.filters.hidden(obj))) {
                obj = obj['nextSibling'];
            }
            if (obj) {
                var position = $(obj).coord(true);
                return [position.left, position.top];
            }
        },

        testOffset: function (element, offset, inputHeight) {
            var dpWidth = element.outerWidth();
            var dpHeight = element.outerHeight();
            var viewWidth = $(window).width() + $(window).scrollLeft();
            var viewHeight = $(window).height() + $(window).scrollTop();

            if (offset.left + dpWidth > viewWidth) {
                if (dpWidth > this.host.width()) {
                    var hostLeft = this.host.coord().left;
                    var hOffset = dpWidth - this.host.width();
                    offset.left = hostLeft - hOffset + 2;
                }
            }
            if (offset.left < 0) {
                offset.left = parseInt(this.host.coord().left) + 'px'
            }

            offset.top -= Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
                Math.abs(dpHeight + inputHeight + 23) : 0);

            return offset;
        },

        open: function () {
            if (!this.isOpened() && !this.opening) {
                this.showListBox('api');
            }
        },

        close: function () {
            if (this.isOpened()) {
                this.hideListBox('api');
            }
        },

        _getBodyOffset: function () {
            var top = 0;
            var left = 0;
            if ($('body').css('border-top-width') != '0px') {
                top = parseInt($('body').css('border-top-width'));
                if (isNaN(top)) top = 0;
            }
            if ($('body').css('border-left-width') != '0px') {
                left = parseInt($('body').css('border-left-width'));
                if (isNaN(left)) left = 0;
            }
            return { left: left, top: top };
        },

        // shows the listbox.
        showListBox: function (mode) {
            if (this.listBox.items && this.listBox.items.length == 0)
                return;

            if (mode == "search" && !this.autoComplete && !this.remoteAutoComplete) {
                if (this.autoDropDownHeight) {
                    this.container.height(this.listBoxContainer.height() + 25);
                }
            }
            this.element.setAttribute('opened', true);

            if (this.autoComplete || this.multiSelect && !this.remoteAutoComplete) {
                if (mode != 'search') {
                    this._updateItemsVisibility("");

                    if (this.multiSelect) {
                        var visibleItems = this.getVisibleItems();
                        for (var i = 0; i < visibleItems.length; i++) {
                            if (!visibleItems[i].disabled) {
                                this.ensureVisible(i);
                                break;
                            }
                        }
                    }
                }
            }
            if (this.remoteAutoComplete) {
                this.listBox.clearSelection();
            }

            if (mode != 'search') {
                this._oldvalue = this.listBox.selectedValue;
            }

            $.jqx.aria(this, "aria-expanded", true);

            if (this.dropDownWidth == 'auto' && this.width != null && this.width.indexOf && this.width.indexOf('%') != -1) {
                if (this.listBox.host.width() != this.host.width()) {
                    var width = this.element.offsetWidth;
                    this.listBoxContainer.jqxListBox({ width: width });
                    this.listBoxContainer[0].style.width = width + "px";
                    this.container.width(parseInt(width) + 25);
                }
            }
            if (this.dropDownWidth == 'auto' && this.host.css('border-left-width') === "0px") {
                var width = this.element.offsetWidth;
                this.listBoxContainer.jqxListBox({ width: width + 1 });
                this.container.width(parseInt(width) + 25);
            }


            var that = this;
            var listBox = this.listBoxContainer;
            var listBoxInstance = this.listBox;
            var scrollPosition = $(window).scrollTop();
            var scrollLeftPosition = $(window).scrollLeft();
            var top = parseInt(this._findPos(this.host[0])[1]) + parseInt(this.host.outerHeight()) - 1 + 'px';
            var left, leftPos = parseInt(Math.round(this.host.coord(true).left));
            left = leftPos + 'px';
            if (this.dropDownContainer === 'element') {
                top = parseInt(this.host.outerHeight()) - 1 + 'px';
                left = 0;
            }
            var isMobileBrowser = $.jqx.mobile.isSafariMobileBrowser() || $.jqx.mobile.isWindowsPhone();
            this.ishiding = false;

            var hasTransform = $.jqx.utilities.hasTransform(this.host);

            if (hasTransform || (isMobileBrowser != null && isMobileBrowser)) {
                left = $.jqx.mobile.getLeftPos(this.element);
                top = $.jqx.mobile.getTopPos(this.element) + parseInt(this.host.outerHeight());
                if ($('body').css('border-top-width') != '0px') {
                    top = parseInt(top) - this._getBodyOffset().top + 'px';
                }
                if ($('body').css('border-left-width') != '0px') {
                    left = parseInt(left) - this._getBodyOffset().left + 'px';
                }
            }

            this.host.addClass(this.toThemeProperty('jqx-combobox-state-selected'));
            if (this.dropDownVerticalAlignment == "top")
            {
                this.dropdownlistArrowIcon.addClass(this.toThemeProperty('jqx-icon-arrow-up-selected'));
            }
            else
            {
                this.dropdownlistArrowIcon.addClass(this.toThemeProperty('jqx-icon-arrow-down-selected'));
            }
            this.dropdownlistArrow.addClass(this.toThemeProperty('jqx-combobox-arrow-selected'));
            this.dropdownlistArrow.addClass(this.toThemeProperty('jqx-fill-state-pressed'));
            this.host.addClass(this.toThemeProperty('jqx-combobox-state-focus'));
            this.host.addClass(this.toThemeProperty('jqx-fill-state-focus'));
            this.dropdownlistContent.addClass(this.toThemeProperty('jqx-combobox-content-focus'));

            this.container.css('left', left);
            this.container.css('top', top);
            listBoxInstance._arrange();

            var closeAfterSelection = true;

            var positionChanged = false;

            if (this.dropDownHorizontalAlignment == 'right' || this.rtl) {
                var containerWidth = this.container.outerWidth();
                var containerLeftOffset = Math.abs(containerWidth - this.host.width());

                if (containerWidth > this.host.width()) {
                    this.container.css('left', 25 + parseInt(Math.round(leftPos)) - containerLeftOffset + "px");
                }
                else this.container.css('left', 25 + parseInt(Math.round(leftPos)) + containerLeftOffset + "px");
            }

            if (this.dropDownVerticalAlignment == "top")
            {
                var dpHeight = listBox.height();
                positionChanged = true;

                listBox.css('top', 23);
                listBox.addClass(this.toThemeProperty('jqx-popup-up'));
                var inputHeight = parseInt(this.host.outerHeight());
                var t = parseInt(top) - Math.abs(dpHeight + inputHeight + 23);

                this.container.css('top', t);
            }

            if (this.enableBrowserBoundsDetection) {
                var newOffset = this.testOffset(listBox, { left: parseInt(this.container.css('left')), top: parseInt(top) }, parseInt(this.host.outerHeight()));
                if (parseInt(this.container.css('top')) != newOffset.top) {
                    positionChanged = true;
                    listBox.css('top', 23);
                    listBox.addClass(this.toThemeProperty('jqx-popup-up'));
                }
                else listBox.css('top', 0);

                this.container.css('top', newOffset.top);
                this.container.css('top', newOffset.top);
                if (parseInt(this.container.css('left')) != newOffset.left) {
                    this.container.css('left', newOffset.left);
                }
            }

            if (this.animationType == 'none') {
                this.container.css('display', 'block');
                $.data(document.body, "openedCombojqxListBoxParent", that);
                $.data(document.body, "openedCombojqxListBox" + that.element.id, listBox);
                listBox.css('margin-top', 0);
                listBox.css('opacity', 1);
            }
            else {
                this.container.css('display', 'block');
                var height = listBox.outerHeight();
                listBox.stop();
                if (this.animationType == 'fade') {
                    listBox.css('margin-top', 0);
                    listBox.css('opacity', 0);
                    listBox.animate({ 'opacity': 1 }, this.openDelay, function () {
                        that.isanimating = false;
                        that.opening = false;
                        $.data(document.body, "openedCombojqxListBoxParent", that);
                        $.data(document.body, "openedCombojqxListBox" + that.element.id, listBox);
                    });
                }
                else {
                    listBox.css('opacity', 1);
                    if (positionChanged) {
                        listBox.css('margin-top', height);
                    }
                    else {
                        listBox.css('margin-top', -height);
                    }
                    this.isanimating = true;
                    this.opening = true;
                    listBox.animate({ 'margin-top': 0 }, this.openDelay, function () {
                        that.isanimating = false;
                        that.opening = false;
                        $.data(document.body, "openedCombojqxListBoxParent", that);
                        $.data(document.body, "openedCombojqxListBox" + that.element.id, listBox);
                    });
                }
            }
            listBoxInstance._renderItems();
            if (!positionChanged) {
                this.host.addClass(this.toThemeProperty('jqx-rc-b-expanded'));
                listBox.addClass(this.toThemeProperty('jqx-rc-t-expanded'));
                this.dropdownlistArrow.addClass(this.toThemeProperty('jqx-rc-b-expanded'));
            }
            else {
                this.host.addClass(this.toThemeProperty('jqx-rc-t-expanded'));
                listBox.addClass(this.toThemeProperty('jqx-rc-b-expanded'));
                this.dropdownlistArrow.addClass(this.toThemeProperty('jqx-rc-t-expanded'));
            }
            listBox.addClass(this.toThemeProperty('jqx-fill-state-focus'));

            this._raiseEvent('0', listBoxInstance);
        },

        doMultiSelect: function (setFocus) {
            if (this.checkboxes) {
                this.multiSelect = false;
            }

            var that = this;
            if (!this.multiSelect) {
                var buttons = that.dropdownlistContent.find('.jqx-button');
                var eventName = 'mousedown';
                if (this.touch) {
                    eventName = $.jqx.mobile.getTouchEventName('touchstart');
                }
                this.removeHandler(buttons, eventName);
                this.removeHandler(buttons.find('.jqx-icon-close'), eventName);
                buttons.remove();
                var items = this.listBox.items;
                if (!items) return;
                for (var i = 0; i < items.length; i++) {
                    items[i].disabled = false;
                }
                this.listBox._renderItems();

                this.selectedItems = new Array();
                this._selectedItems = new Array();
                return;
            }

            if (this.validateSelection) {
                var result = this.validateSelection(this.listBox.selectedValue);
                if (!result) {
                    return;
                }
            }

            var oldItems = this.selectedItems;
            if (this.listBox.selectedValue) {
                if (this.selectedItems.indexOf(this.listBox.selectedValue) === -1) {
                    var item = this.getItemByValue(this.listBox.selectedValue);
                    if (item && item.visible) {
                        this.selectedItems.push(this.listBox.selectedValue);
                        this._selectedItems.push(item);
                        this._raiseEvent('2', { index: item.index, item: item });
                        this._raiseEvent('4', { index: item.index, item: item });
                    }
                }
                this.listBox.selectedIndex = 0;
            }

            var items = this.listBox.items;
            if (!items) return;
            for (var i = 0; i < items.length; i++) {
                items[i].disabled = false;
                if (this.selectedItems.indexOf(items[i].value) >= 0 || this._disabledItems.indexOf(this.value) >= 0) {
                    items[i].disabled = true;
                }
            }
            this.listBox._renderItems();

            this.searchString = "";
            this.input.val("");
            var items = "";
            var eventName = 'mousedown';

            var buttons = that.dropdownlistContent.find('.jqx-button');
            if (this.touch) {
                eventName = $.jqx.mobile.getTouchEventName('touchstart');
            }
            this.removeHandler(buttons, eventName);
            this.removeHandler(buttons.find('.jqx-icon-close'), eventName);
            buttons.remove();

            that.input.detach();
            if (this.selectedItems.length > 0) {
                that.input.css('width', '25px');
                if (this.isMaterialized() && that.hint) {
                    that.label[0].innerHTML = this.placeHolder;
                }
                else {
                    that.input.attr('placeholder', "");
                }
            }
            else {
                that.input.css('width', '100%');
                if (that.isMaterialized() && that.hint) {
                    that.label[0].innerHTML = this.placeHolder;
                }
                else {
                    that.input.attr('placeholder', this.placeHolder);
                }
            }

            if (that.isMaterialized()) {
                if (that.hint) {
                    setTimeout(function () {
                        if (that.selectedItems.length === 0) {
                            that.element.removeAttribute('hint');
                            that.label[0].innerHTML = that.placeHolder;
                        }
                        else {
                            if (that.hint) {
                                that.element.setAttribute('hint', true);
                            }
                        }
                    });
                }
            }

            $.each(this.selectedItems, function (index) {
                var item = that.getItemByValue(this);
                if (!item || that.remoteAutoComplete) {
                    item = that._selectedItems[index];
                }

                var group = $('<div style="overflow: hidden; float: left;"></div>');
                group.addClass(that.toThemeProperty('jqx-button'));
                group.addClass(that.toThemeProperty('jqx-combobox-multi-item'));
                group.addClass(that.toThemeProperty('jqx-fill-state-normal'));
                group.addClass(that.toThemeProperty('jqx-rc-all'));
                if (item) {
                    var text = item.label;
                    if (that.renderSelectedItem) {
                        var result = that.renderSelectedItem(index, item);
                        if (result) text = result;
                    }

                    if (group[0].innerHTML == '') {
                        group[0].innerHTML = '<a data-value="' + item.value + '" style="float: left;" href="#">' + text + '</a>';
                    }
                    if (that.rtl) {
                        group[0].innerHTML = '<a data-value="' + item.value + '" style="float: right;" href="#">' + text + '</a>';
                    }
                    var fl = !that.rtl ? 'right' : 'left';

                    if (that.showCloseButtons) {
                        var closebutton = '<div style="position: relative; overflow: hidden; float: ' + fl + '; min-height: 16px; min-width: 18px;"><div style="position: absolute; left: 100%; top: 50%; margin-left: -18px; margin-top: -7px; float: none; width: 16px; height: 16px;" class="' + that.toThemeProperty('jqx-icon-close') + '"></div></div>';
                        if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                            closebutton = '<div style="position: relative; overflow: hidden; float: left; min-height: 16px; min-width: 18px;"><div style="position: absolute; left: 100%; top: 50%; margin-left: -18px; margin-top: -7px; float: none; width: 16px; height: 16px;" class="' + that.toThemeProperty('jqx-icon-close') + '"></div></div>';
                        }
                        if (that.rtl) {
                            var closebutton = '<div style="position: relative; overflow: hidden; float: ' + fl + '; min-height: 16px; min-width: 18px;"><div style="position: absolute; left: 0px; top: 50%; margin-top: -7px; float: none; width: 16px; height: 16px;" class="' + that.toThemeProperty('jqx-icon-close') + '"></div></div>';
                            if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                                closebutton = '<div style="position: relative; overflow: hidden; float: left; min-height: 16px; min-width: 18px;"><div style="position: absolute; left: 0px; top: 50%; margin-top: -7px; float: none; width: 16px; height: 16px;" class="' + that.toThemeProperty('jqx-icon-close') + '"></div></div>';
                            }
                        }

                        group[0].innerHTML += closebutton;
                    }
                }
                else {
                    if (group[0].innerHTML == '') {
                        group[0].innerHTML = '<a href="#"></a>';
                    }
                }
                that.dropdownlistContent.append(group);
            });
            that.dropdownlistContent.append(that.input);
            that.input.val("");
            if (setFocus !== false) {
                that.input.focus();
                setTimeout(function () {
                    that.input.focus();
                }, 10);
            }
            var buttons = that.dropdownlistContent.find('.jqx-button');

            if (this.touchMode === true) eventName = "mousedown";
            this.addHandler(buttons, eventName, function (event) {
                if (event.target.className.indexOf('jqx-icon-close') >= 0)
                    return true;

                if (that.disabled) {
                    return true;
                }

                var text = $(event.target).attr('data-value');
                var item = that.getItemByValue(text);
                if (item) {
                    that.listBox.selectedValue = null;
                    that.listBox.clearSelection();
                }
                that.listBox.scrollTo(0, 0);
                that.open();
                if (event.preventDefault) {
                    event.preventDefault();
                }
                if (event.stopPropagation) {
                    event.stopPropagation();
                }
                return false;
            });
            this.addHandler(buttons.find('.jqx-icon-close'), eventName, function (event) {
                if (that.disabled) {
                    return;
                }

                var text = $(event.target).parent().parent().find('a').attr('data-value');
                var item = that.getItemByValue(text);
                if (item || (that.remoteAutoComplete && !item && that.selectedItems.indexOf(text) >= 0)) {
                    that.listBox.selectedValue = null;
                    var index = that.selectedItems.indexOf(text);
                    var indx = item && item.index >= 0 ? item.index : index;
                    if (index >= 0) {
                        that.selectedItems.splice(index, 1);
                        var selectedItem = that._selectedItems[index];
                        if (!selectedItem) {
                            selectedItem = item;
                        }
                        that._selectedItems.splice(index, 1);

                        that._raiseEvent('3', { index: indx, type: 'mouse', item: selectedItem });
                        that._raiseEvent('4', { index: indx, type: 'mouse', item: selectedItem });
                        that.doMultiSelect();
                    }
                    else {
                        for (var i = 0; i < that.selectedItems.length; i++) {
                            var selectedItem = that.selectedItems[i];
                            if (selectedItem == text) {
                                that.selectedItems.splice(i, 1);
                                that._selectedItems.splice(i, 1);
                                that._raiseEvent('3', { index: indx, type: 'mouse', item: item });
                                that._raiseEvent('4', { index: indx, type: 'mouse', item: item });
                                that.doMultiSelect();
                                break;
                            }
                        }
                    }
                }
            });

            if (this.isMaterialized()) {
                this.host.height(this.dropdownlistContent.height());
            }

            this.bar.css('top', this.host.height());
            that.dropdownlistArrow.height(this.host.height());
            that._updateInputSelection();
        },

        // hides the listbox.
        hideListBox: function (mode) {
            var listBox = this.listBoxContainer;
            var listBoxInstance = this.listBox;
            var container = this.container;
            if (this.container[0].style.display == 'none')
                return;

            this.element.setAttribute('opened', false);

            $.jqx.aria(this, "aria-expanded", false);

            if (mode == "keyboard" || mode == "mouse") {
                this.listBox.searchString = "";
            }

            if (mode == "keyboard" || mode == "mouse" && this.multiSelect) {
                this.doMultiSelect();
            }

            var that = this;
            $.data(document.body, "openedCombojqxListBox" + this.element.id, null);
            if (this.animationType == 'none') {
                this.opening = false;
                this.container.css('display', 'none');
            }
            else {
                if (!this.ishiding) {
                    var height = listBox.outerHeight();
                    listBox.css('margin-top', 0);
                    listBox.stop();
                    this.opening = false;
                    this.isanimating = true;
                    var animationValue = -height;
                    if (parseInt(this.container.coord().top) < parseInt(this.host.coord().top)) {
                        animationValue = height;
                    }
                    if (this.animationType == 'fade') {
                        listBox.css({ 'opacity': 1 });
                        listBox.animate({ 'opacity': 0 }, this.closeDelay, function () {
                            that.isanimating = false;
                            container.css('display', 'none');
                            that.ishiding = false;
                        });
                    }
                    else {
                        listBox.animate({ 'margin-top': animationValue }, this.closeDelay, function () {
                            that.isanimating = false;
                            container.css('display', 'none'); that.ishiding = false;
                        });
                    }
                }
            }

            this.ishiding = true;
            this.host.removeClass(this.toThemeProperty('jqx-combobox-state-selected'));
            this.dropdownlistArrowIcon.removeClass(this.toThemeProperty('jqx-icon-arrow-down-selected'));
            this.dropdownlistArrowIcon.removeClass(this.toThemeProperty('jqx-icon-arrow-up-selected'));
            this.dropdownlistArrow.removeClass(this.toThemeProperty('jqx-combobox-arrow-selected'));
            this.dropdownlistArrow.removeClass(this.toThemeProperty('jqx-fill-state-pressed'));
            if (!this.focused) {
                this.host.removeClass(this.toThemeProperty('jqx-combobox-state-focus'));
                this.host.removeClass(this.toThemeProperty('jqx-fill-state-focus'));
                this.dropdownlistContent.removeClass(this.toThemeProperty('jqx-combobox-content-focus'));
            }
            this.host.removeClass(this.toThemeProperty('jqx-rc-b-expanded'));
            listBox.removeClass(this.toThemeProperty('jqx-rc-t-expanded'));
            this.host.removeClass(this.toThemeProperty('jqx-rc-t-expanded'));
            listBox.removeClass(this.toThemeProperty('jqx-rc-b-expanded'));
            listBox.removeClass(this.toThemeProperty('jqx-fill-state-focus'));
            this.dropdownlistArrow.removeClass(this.toThemeProperty('jqx-rc-t-expanded'));
            this.dropdownlistArrow.removeClass(this.toThemeProperty('jqx-rc-b-expanded'));

            this._raiseEvent('1', listBoxInstance);
        },

        /* Close popup if clicked elsewhere. */
        closeOpenedListBox: function (event) {
            var that = event.data.that;
            var $target = $(event.target);
            var openedListBox = event.data.listbox;
            if (openedListBox == null)
                return true;

            if ($(event.target).ischildof(that.host)) {
                return;
            }

            var dropdownlistInstance = that;

            var isListBox = false;
            $.each($target.parents(), function () {
                if (this.className != 'undefined') {
                    if (this.className.indexOf) {
                        if (this.className.indexOf('jqx-listbox') != -1) {
                            isListBox = true;
                            return false;
                        }
                        if (this.className.indexOf('jqx-combobox') != -1) {
                            if (that.element.id == this.id) {
                                isListBox = true;
                            }
                            return false;
                        }
                    }
                }
            });

            if (openedListBox != null && !isListBox) {
                if (that.isOpened()) {
                    that.hideListBox('api');
                    that.input.blur();
                }
            }

            return true;
        },

        loadFromSelect: function (id) {
            this.listBox.loadFromSelect(id);
            this.clearSelection();
        },

        refresh: function (initialRefresh) {
            this._setSize();
            this._arrange();
            if (this.listBox) {
                this.renderSelection();
            }
        },

        resize: function () {
            this._setSize();
            this._arrange();
        },

        _arrange: function () {
            var width = parseInt(this.host.width());
            var height = parseInt(this.host.height());

            var arrowHeight = this.arrowSize;
            var arrowWidth = this.arrowSize;

            var rightOffset = 1;
            if (!this.showArrow) {
                arrowWidth = 0;
                arrowHeight = 0;
                this.dropdownlistArrow.hide();
                rightOffset = 0;
                this.host.css('cursor', 'arrow');
            }
            else {
                if (this.dropdownlistArrow[0].style.display === "none") {
                    this.dropdownlistArrow.show();
                }
            }
            var contentWidth = width - arrowWidth - 1 * rightOffset;
            if (contentWidth > 0) {
                this.dropdownlistContent[0].style.width = contentWidth + 'px';
            }
            if (this.rtl) {
                this.dropdownlistContent[0].style.width = (-1 + contentWidth + 'px');
            }

            this.dropdownlistContent[0].style.height = height + 'px';
            this.dropdownlistContent[0].style.left = '0px';
            this.dropdownlistContent[0].style.top = '0px';
            this.dropdownlistArrow[0].style.width = arrowWidth  + 'px';
            this.dropdownlistArrow[0].style.height = height + 'px';
            this.dropdownlistArrow[0].style.left = 1 + contentWidth + 'px';

            this.input[0].style.width = '100%';

            if (!this.multiSelect) {
                this.input.height(height);
            }

            var inputHeight = this.input.height();
            if (inputHeight == 0) {
                inputHeight = parseInt(this.input.css('font-size')) + 3;
            }

            if (this.input[0].className.indexOf('jqx-rc-all') == -1) {
                this.input.addClass(this.toThemeProperty('jqx-rc-all'));
            }

            var top = parseInt(height) / 2 - parseInt(inputHeight) / 2;
            if (top > 0) {
          //      this.input[0].style.marginTop = parseInt(top) + "px";
            }

            if (this.rtl) {
                this.dropdownlistArrow.css('left', '0px');
                this.dropdownlistContent.css('left', this.dropdownlistArrow.width());
                if ($.jqx.browser.msie && $.jqx.browser.version <= 8) {
                    this.dropdownlistContent.css('left', 1 + this.dropdownlistArrow.width());
                }
            }
            if (this.multiSelect) {
                this.input.css('float', 'left');
                this.input.width(25);
                this.dropdownlistWrapper.parent().css('height', 'auto');
                this.dropdownlistContent.css('height', 'auto');
                this.dropdownlistWrapper.css('height', 'auto');
                this.dropdownlistContent.css('position', 'relative');
                this.dropdownlistContent.css('cursor', 'text');
                this.host.css('height', 'auto');
                this.host.css('min-height', this.height);
                this.dropdownlistContent.css('min-height', this.height);
                var height = parseInt(this.host.height());
                this.dropdownlistArrow.height(height);
                var initialHeight = parseInt(this.host.css('min-height'));
                var top = parseInt(initialHeight) / 2 - parseInt(inputHeight) / 2;
                if (top > 0) {
                    this.input.css('margin-top', top);
                }


                if (this.isMaterialized()) {
                    this.host.height(this.dropdownlistContent.height());
                }

                this.bar.css('top', this.host.height());
                this.dropdownlistArrow.height(this.host.height());
            }
        },

        destroy: function () {
            if (this.source && this.source.unbindBindingUpdate) {
                this.source.unbindBindingUpdate(this.element.id);
                this.source.unbindBindingUpdate(this.listBoxContainer[0].id);
                this.source.unbindDownloadComplete(this.element.id);
                this.source.unbindDownloadComplete(this.listBoxContainer[0].id);
            }
            $.jqx.utilities.resize(this.host, null, true);
            this.removeHandler(this.listBoxContainer, 'select');
            this.removeHandler(this.listBoxContainer, 'unselect');
            this.removeHandler(this.listBoxContainer, 'change');
            this.removeHandler(this.listBoxContainer, 'bindingComplete');
            this.removeHandler(this.dropdownlistWrapper, 'selectstart');
            this.removeHandler(this.dropdownlistWrapper, 'mousedown');
            this.removeHandler(this.host, 'keydown');
            this.removeHandler(this.listBoxContainer, 'select');
            this.removeHandler(this.listBox.content, 'click');
            this.removeHandlers();
            this.removeHandler(this.input, 'keyup.textchange');

            this.listBoxContainer.jqxListBox('destroy');
            this.listBoxContainer.remove();
            this.host.removeClass();
            this.removeHandler($(document), 'mousedown.' + this.id, this.closeOpenedListBox);
            if (this.touch) {
                this.removeHandler($(document), $.jqx.mobile.getTouchEventName('touchstart') + '.' + this.id);
            }
            this.cinput.remove();
            delete this.cinput;
            this.dropdownlistArrow.remove();
            delete this.dropdownlistArrow;
            this.dropdownlistArrowIcon.remove();
            delete this.dropdownlistArrowIcon;
            delete this.dropdownlistWrapper;
            delete this.listBoxContainer;
            delete this.input;
            delete this.dropdownlistContent;
            delete this.comboStructure;
            this.container.remove();
            delete this.listBox;
            delete this.container;
            var vars = $.data(this.element, "jqxComboBox");
            if (vars) {
                delete vars.instance;
            }
            this.host.removeData();
            this.host.remove();
            delete this.host;
            delete this.set;
            delete this.get;
            delete this.call;
            delete this.element;
        },

        //[optimize]
        _raiseEvent: function (id, arg) {
            if (arg == undefined)
                arg = { owner: null };

            var evt = this.events[id];
            args = arg;
            args.owner = this;

            var event = new $.Event(evt);
            event.owner = this;
            if (id == 2 || id == 3 || id == 4 || id == 5 || id == 6 || id == 7 || id == 8 || id == 9) {
                event.args = arg;
            }

            var result = this.host.trigger(event);
            return result;
        },

        propertiesChangedHandler: function (object, key, value)
        {
            if (value.width && value.height && Object.keys(value).length == 2)
            {
                object._setSize();
                if (key == 'width')
                {
                    if (object.dropDownWidth == 'auto')
                    {
                        var width = object.host.width();
                        object.listBoxContainer.jqxListBox({ width: width });
                        object.container.width(parseInt(width) + 25);
                    }
                }
                object._arrange();
                object.close();
            }
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (object.isInitialized == undefined || object.isInitialized == false)
                return;

            if (object.batchUpdate && object.batchUpdate.width && object.batchUpdate.height && Object.keys(object.batchUpdate).length == 2)
            {
                return;
            }

            if (key == "template")
            {
                object.listBoxContainer.removeClass(object.toThemeProperty("jqx-" + oldvalue + "-item"));
                object.listBoxContainer.addClass(object.toThemeProperty("jqx-" + object.template + "-item"));
                object.dropDownListArrow.removeClass(object.toThemeProperty("jqx-" + oldvalue + ""));
                object.dropDownListArrow.addClass(object.toThemeProperty("jqx-" + object.template + ""));

                var that = this;

                that.bar.removeClass(that.toThemeProperty("jqx-" + oldvalue));
                that.label.removeClass(that.toThemeProperty("jqx-" + oldvalue));
                that.bar.addClass(that.toThemeProperty("jqx-" + that.template));
                that.label.addClass(that.toThemeProperty("jqx-" + that.template));

            }

            if (key == "dropDownVerticalAlignment")
            {
                object.close();
                object.dropdownlistArrowIcon.removeClass(object.toThemeProperty('jqx-icon-arrow-up'));
                object.dropdownlistArrowIcon.removeClass(object.toThemeProperty('jqx-icon-arrow-down'));
                if (object.dropDownVerticalAlignment == "top")
                {
                    object.dropdownlistArrowIcon.addClass(object.toThemeProperty('jqx-icon-arrow-up'));
                }
                else
                {
                    object.dropdownlistArrowIcon.addClass(object.toThemeProperty('jqx-icon-arrow-down'));
                }
                object.listBoxContainer.css('top', 0);
                object.listBoxContainer.removeClass(this.toThemeProperty('jqx-popup-up'));
            }

            if (key == "autoItemsHeight")
            {
                object.listBoxContainer.jqxListBox({ autoItemsHeight: value });
            }

            if (key == "itemHeight") {
                object.listBoxContainer.jqxListBox({ itemHeight: value });
            }

            if (key == "renderSelectedItem") {
                object.renderSelection('mouse');
            }

            if (key == "renderer") {
                object.listBoxContainer.jqxListBox({ renderer: value });
            }

            if (key == "enableSelection") {
                object.listBoxContainer.jqxListBox({ enableSelection: value });
            }
            if (key == "enableHover") {
                object.listBoxContainer.jqxListBox({ enableHover: value });
            }

            if (key === "touchMode") {
                object.listBoxContainer.jqxListBox({ touchMode: value });
                object.touch = $.jqx.mobile.isTouchDevice();
                if (object.touchMode === true) {
                    object.touch = true;
                }
                object._updateHandlers();
            }

            if (key == "multiSelect") {
                if (value) {
                    object.doMultiSelect(false);
                }
                else {
                    var items = object.listBox.items;
                    var selectedIndex = -1;
                    for (var i = 0; i < items.length; i++) {
                        items[i].disabled = false;
                        if (object.selectedItems.indexOf(items[i].value) >= 0 || object._disabledItems.indexOf(object.value) >= 0) {
                            items[i].disabled = true;
                            selectedIndex = items[i].index;
                        }
                    }
                    object.doMultiSelect(false);
                    object.listBox._renderItems();
                    if (!items) return;
                    object.listBox.selectedIndex = selectedIndex;
                    object.renderSelection('mouse');
                    object.dropdownlistWrapper.parent().css('height', '100%');
                    object.dropdownlistContent.css('height', '100');
                    object.dropdownlistWrapper.css('height', '100');
                    object.dropdownlistContent.css('position', 'relative');
                    object.host.css('min-height', null);
                    object._setSize();
                    object._arrange();
                }
            }

            if (key == "showArrow") {
                object._arrange();
                if (object.multiSelect) {
                    object.doMultiSelect(false);
                }
            }

            if (key == "placeHolder") {
                if (object.isMaterialized()) {
                    object.label.innerHTML = object.placeHolder;
                }
                else {
                    object.input.attr('placeholder', object.placeHolder);
                }
            }

            if (key == 'popupZIndex') {
                object.listBoxContainer.css({ zIndex: object.popupZIndex });
            }

            if (key == 'promptText') {
                object.placeHolder = value;
            }

            if (key == 'autoOpen') {
                object._updateHandlers();
            }

            if (key == 'renderer') {
                object.listBox.renderer = object.renderer;
            }
            if (key == 'itemHeight') {
                object.listBox.itemHeight = value;
            }

            if (key == 'source') {
                object.input.val("");
                object.listBoxContainer.jqxListBox({ source: object.source });
                object.renderSelection('mouse');
                if (object.source == null) {
                    object.clearSelection();
                }
                if (object.multiSelect) {
                    object.selectedItems = new Array();
                    object._selectedItems = new Array();
                    object.doMultiSelect(false);
                }
            }
            if (key == "rtl") {
                if (value) {
                    object.dropdownlistArrow.css('float', 'left');
                    object.dropdownlistContent.css('float', 'right');
                }
                else {
                    object.dropdownlistArrow.css('float', 'right');
                    object.dropdownlistContent.css('float', 'left');
                }
                object.listBoxContainer.jqxListBox({ rtl: object.rtl });
            }
            if (key == "displayMember" || key == "valueMember") {
                object.listBoxContainer.jqxListBox({ displayMember: object.displayMember, valueMember: object.valueMember });
                object.renderSelection('mouse');
            }

            if (key == "autoDropDownHeight") {
                object.listBoxContainer.jqxListBox({ autoHeight: object.autoDropDownHeight });
                if (object.autoDropDownHeight) {
                    object.container.height(object.listBoxContainer.height() + 25);
                }
                else {
                    object.listBoxContainer.jqxListBox({ height: object.dropDownHeight });
                    object.container.height(parseInt(object.dropDownHeight) + 25);
                }

                object.listBox._arrange();
                object.listBox._updatescrollbars();
            }

            if (key == "dropDownHeight") {
                if (!object.autoDropDownHeight) {
                    object.listBoxContainer.jqxListBox({ height: object.dropDownHeight });
                    object.container.height(parseInt(object.dropDownHeight) + 25);
                }
            }

            if (key == "dropDownWidth" || key == "scrollBarSize") {
                var width = object.width;
                if (object.dropDownWidth != 'auto') {
                    width = object.dropDownWidth;
                }

                object.listBoxContainer.jqxListBox({ width: width, scrollBarSize: object.scrollBarSize });
                object.container.width(parseInt(width) + 25);
            }

            if (key == 'autoComplete') {
                object._resetautocomplete();
            }

            if (key == "checkboxes") {
                object.listBoxContainer.jqxListBox({ checkboxes: object.checkboxes });
                if (object.checkboxes) {
                    object.input.attr('readonly', true);
                    $.jqx.aria(object, "aria-readonly", true);
                }
                else {
                    $.jqx.aria(object, "aria-readonly", false);
                }
            }

            if (key == 'theme' && value != null) {
                object.listBoxContainer.jqxListBox({ theme: value });
                object.listBoxContainer.addClass(object.toThemeProperty('jqx-popup'));
                if ($.jqx.browser.msie) {
                    object.listBoxContainer.addClass(object.toThemeProperty('jqx-noshadow'));
                }
                $.jqx.utilities.setTheme(oldvalue, value, object.host);
            }

            if (key == 'rtl') {
                object.render();
                object.refresh();
            }

            if (key == 'width' || key == 'height') {
                object._setSize();
                if (key == 'width') {
                    if (object.dropDownWidth == 'auto') {
                        var width = object.host.width();
                        object.listBoxContainer.jqxListBox({ width: width });
                        object.container.width(parseInt(width) + 25);
                    }
                }
                object._arrange();
                object.close();
            }

            if (key == 'selectedIndex') {
                object.listBox.selectIndex(value);
                object.renderSelection('mouse');
            }
        }
    });
})(jqxBaseFramework);
