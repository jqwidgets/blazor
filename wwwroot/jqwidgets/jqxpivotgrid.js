/* tslint:disable */
/* eslint-disable */
(function ($) {
    $.jqx.jqxWidget("jqxPivotGrid", "", {});

    $.extend($.jqx._jqxPivotGrid.prototype, {

        defineInstance: function () {
            var _defaultSettings = {
                scrollBarsEnabled: true,
                source: null,
                groupingColumns: [],
                isGroupingEnabled: false,

                _offsetX: 0,
                _offsetY: 0,

                _currentPosition: {},
                _selectStartPosition: {},

                _isMouseLeftButtonDown: false,
                _timeLastUp: new Date(),
                _timeLastDown: new Date(),

                resizeTooltipEnabled: false,
                isHorizontalResize: true,
                _colResizeState: 'NO_RESIZE',

                activeEditor: { Editor: null },

                _id: 0,

                _colItemRangeSelectionBeg: null,
                _colItemRangeSelectionEnd: null,
                _rowItemRangeSelectionBeg: null,
                _rowItemRangeSelectionEnd: null,
                _isCTRLPressed: false,
                _internalSelectMode: 'CELLS_SELECT',
                _mostRightItemBounds: { x: 0, y: 0, width: 0, height: 0 },
                _mostLeftItemBounds: { x: 0, y: 0, width: 0, height: 0 },

                _adjSelectedItemsSave: {},

                multipleSelectionEnabled: true,
                selectionEnabled: true,
                selectionMode: 'CELLS_SELECT',

                treeStyleRows: true,
                autoResize: false,

                cellsRenderer: null,
                itemsRenderer: null,

                localization: null
            }

            $.extend(true, this, _defaultSettings);

            this._createPivotAreas();
            return _defaultSettings;
        },

        _createPivotAreas: function () {
            if (this._pivotRows) {
                this._pivotRows.clear();
                delete this._pivotRows;
            }

            if (this._pivotColumns) {
                this._pivotColumns.clear();
                delete this._pivotColumns;
            }

            if (this._pivotCells) {
                this._pivotCells._resetCanvas();
                this._pivotCells.clear();
                delete this._pivotCells;
            }

            this._pivotRows = new $.jqx.jqxPivotGrid.pivotRows(this);
            this._pivotColumns = new $.jqx.jqxPivotGrid.pivotColumns(this);

            this._pivotCells = new $.jqx.jqxPivotGrid.pivotCells();
            this._pivotCells.parentPivotGrid = this;
        },

        _instanceId: 0,

        createInstance: function (args) {
            var element = this.element;
            var host = this.host;

            var self = this;

            self.localizeStrings(self.localization);

            var hostClass = 'jqx-pivotgrid jqx-rc-all jqx-widget ' + this.toThemeProperty('jqx-widget-content');

            var touchClass = "";
            if (this._isTouchDevice()) {
                touchClass = "class='jqx-grid-menu-item-touch'";
            }

            host.append("<div class='" + hostClass + "' style='width:100%; height: 100%; overflow:hidden; position:relative; onselectstart=\'return false;\' oncontextmenu=\'return false;\''>"
            + "<div id='divContent' style='width:100px; height:100%;'></div>"
            + "<div id='divHScroll' style='width:100%; height:17px;'></div>"
            + "<div id='divVScroll' style='width:17px; height:100%;'></div>"
            + "<div id='divContextMenu'><ul>"
            + "<li " + touchClass + "><div id='sortasc' class='jqx-pivotgrid-sortasc-icon'></div><span>" + self._localizedStrings.sortascendingstring + "</span></li>"
            + "<li " + touchClass + "><div id='sortdesc' class='jqx-pivotgrid-sortdesc-icon'></div><span>" + self._localizedStrings.sortdescendingstring + "</span></li>"
            + "<li " + touchClass + "><div id='sortremove' class='jqx-pivotgrid-sortremove-icon'></div><span>" + self._localizedStrings.sortremovestring + "</span></li>"
            + "</ul></div>"
            + "</div>"
            );

            var contentHost = host.find('#divContent');
            var contentDiv = contentHost[0];

            var divCanvas = document.createElement("div");
            divCanvas.style.position = 'relative';
            divCanvas.style.left = '0px';
            divCanvas.style.top = '0px';
            divCanvas.style.width = '100%';
            divCanvas.style.height = '100%';
            divCanvas.style.overflow = 'hidden';

            contentHost.append(divCanvas);

            this.contentCanvas = this.Canvas = divCanvas;
            this.hostVScroll = host.find('#divVScroll');
            this.hostHScroll = host.find('#divHScroll');

            this.hScroll = host.find('#divHScroll').jqxScrollBar({ vertical: false, theme: this.theme });
            this.vScroll = host.find('#divVScroll').jqxScrollBar({ vertical: true, theme: this.theme });

            self._createContextMenu();

            self.id = self._instanceId++;
            self._resizeLineId = 'divResizeLine' + self.id;

            $(document.body).append("<div id='" + self._resizeLineId + "' style='position: absolute; display: none;'></div>");

            try {
                self.dataBind();
            }
            catch (e) {
                throw 'Databinding exception: ' + e.toString();
                return;
            }

            self._installEventHandlers();

            $.jqx.utilities.resize(
                self.host,
                function () {
                    self.refresh();
                },
                false
            );

            if (!self._isInitialized)
                self._isInitialized = true;
        }, // createInstance

        destroy: function () {
            this._isInitialized = false;

            this.host.find('#divHScroll').off();
            this.host.find('#divVScroll').off();

            this._contextMenu.off();

            this.removeHandler(this.host);

            $.jqx.utilities.resize(this.host, null, true);
        },

        _installEventHandlers: function () {
            var self = this;

            self.hostVScroll.on('valueChanged', function (event) {
                if (event.currentTarget == self.hostVScroll[0])
                    self.onVScroll(event.currentValue);
            });

            self.hostHScroll.on('valueChanged', function (event) {
                if (event.currentTarget == self.hostHScroll[0])
                    self.onHScroll(event.currentValue);
            });

            self.addHandler(self.host, 'mousewheel DOMMouseScroll', function (event) {
                if (self._isContextMenuOpen)
                    return;

                if (self._pivotDesigner && self._pivotDesigner._isWindowOpen())
                    return;

                var eventPos = $.jqx.position(event);
                if (!self.isPtInRect({ x: eventPos.left, y: eventPos.top }, self._rect))
                    return;

                event.preventDefault();

                if (!self._scrollBarPositions['vertical'].visible)
                    return;

                self.onMouseWheel(event);
            });

            self.addHandler(self.host, 'mouseenter', function (event) {
                if (event.currentTarget == self.element)
                    self._onMouseEnter(event);
            });

            self.addHandler(self.host, 'mouseleave', function (event) {
                if (event.currentTarget == self.element)
                    self._onMouseLeave(event);
            });

            self.addHandler(self.host, 'mousedown', function (event) {
                if (self._isContextMenuOpen)
                    return;

                if (self._pivotDesigner && self._pivotDesigner._isWindowOpen())
                    return;

                event.preventDefault();
                self._onMouseDown(event);
                this.focus();
            });

            self.addHandler($(document), 'mouseup', function (event) {
                if (self._isContextMenuOpen)
                    return;

                if (self._pivotDesigner && self._pivotDesigner._isWindowOpen())
                    return;

                event.preventDefault();
                self._onMouseUp(event);
                if (event.cancel)
                    return;

                var eventPos = $.jqx.position(event);
                if (!self.isPtInRect({ x: eventPos.left, y: eventPos.top }, self._rect)) {
                    if (self._colResizeState != 'RESIZING')
                        return;
                }


                self._onMouseClick(event);
            });

            self.addHandler($(document), 'mousemove', function (event) {
                if (self._isContextMenuOpen)
                    return;

                if (self._pivotDesigner && self._pivotDesigner._isWindowOpen())
                    return;

                self._onMouseMove(event);
            });

            self.addHandler($(document), 'keydown', function (event) {
                if (self._isContextMenuOpen)
                    return;

                if (self._pivotDesigner && self._pivotDesigner._isWindowOpen())
                    return;

                if (self._isContextMenuOpen)
                    return;

                if (event.keyCode == 17) {
                    self._isCTRLPressed = true;
                }
                else if (event.keyCode == 16) {
                    self._isSHIFTPressed = true;
                }
                else if (self._handleKeyboardNavigation) {
                    self._handleKeyboardNavigation(event);
                }
            });

            self.addHandler($(document), 'keyup', function (event) {
                if (self._isContextMenuOpen)
                    return;

                if (self._pivotDesigner && self._pivotDesigner._isWindowOpen())
                    return;

                if (self._isContextMenuOpen)
                    return;

                if (event.keyCode == 17) {
                    self._isCTRLPressed = false;
                }
                else if (event.keyCode == 16) {
                    self._isSHIFTPressed = false;
                }
            });
        },

        _createContextMenu: function () {
            var self = this;
            var host = this.host;

            var ctxMenuElement = host.find("#divContextMenu");

            self._contextMenu = ctxMenuElement.jqxMenu({
                width: '120px',
                autoCloseOnClick: true,
                autoOpenPopup: false,
                animationShowDuration: 0,
                animationHideDuration: 0,
                animationShowDelay: 0,
                theme: this.theme,
                keyboardNavigation: false,
                mode: 'popup'
            });

            var liElements = ctxMenuElement.find('li');
            var measureString = '';
            for (var i = 0; i < liElements.length; i++) {
                var str = $(liElements[i]).text();
                if (str.length > measureString.length) {
                    measureString = str;
                }
            }

            var measureElement = $('<span style="white-space:nowrap;">' + measureString + '</span>');
            measureElement.addClass(this.toThemeProperty('jqx-menu-item'));
            this.host.append(measureElement);
            var menuWidth = measureElement.outerWidth() + 30;
            measureElement.remove();

            self._contextMenu = ctxMenuElement.jqxMenu({ width: menuWidth });

            self._contextMenu.on('shown', function () {
                self._isContextMenuOpen = true;
            });
            self._contextMenu.on('closed', function () {
                self._isContextMenuOpen = false;
                self._hideItemMenuElement();
            });

            self._contextMenu.on('itemclick', function (event) {
                event.stopImmediatePropagation();
                event.stopPropagation();
                var item = self._menuElement._itemMouseOver;
                if (!item)
                    return;

                var otherHierarchy = item.hierarchy == self._pivotColumns ? self._pivotRows : self._pivotColumns;

                var innerHtml = event.args.innerHTML;
                if (innerHtml.indexOf('sortasc') != -1) {
                    otherHierarchy.sortBy(item, 'asc');
                }
                else if (innerHtml.indexOf('sortdesc') != -1) {
                    otherHierarchy.sortBy(item, 'desc');
                }
                else if (innerHtml.indexOf('sortremove') != -1) {
                    otherHierarchy.removeSort();
                }

            });
        },

        _isTouchDevice: function () {
            if (this.touchDevice != undefined)
                return this.touchDevice;

            var isTouchDevice = $.jqx.mobile.isTouchDevice();
            this.touchDevice = isTouchDevice;
            if (this.touchmode == true) {
                if ($.jqx.browser.msie && $.jqx.browser.version < 9) {
                    this.enablehover = false;
                    return false;
                }

                isTouchDevice = true;
                $.jqx.mobile.setMobileSimulator(this.element);
                this.touchDevice = isTouchDevice;
            }
            else if (this.touchmode == false) {
                isTouchDevice = false;
            }
            if (isTouchDevice && this.touchModeStyle != false) {
                this.touchDevice = true;
                this.host.addClass(this.toThemeProperty('jqx-touch'));
                this.host.find('jqx-widget-content').addClass(this.toThemeProperty('jqx-touch'));
                this.host.find('jqx-widget-header').addClass(this.toThemeProperty('jqx-touch'));
                this.scrollbarsize = this.touchscrollbarsize;
            }
            return isTouchDevice;
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (this._isInitialized == undefined || this._isInitialized == false)
                return;

            if (key == 'source')
                this.dataBind();
            else if (key == 'theme') {
                this.hostVScrollBar.jqxScrollBar('theme', this.theme);
                this.hostHScrollBar.jqxScrollBar('theme', this.theme);
            }

            this._internalRefresh();
        },


        genId: function () {
            return this._id++;
        },

        getCellId: function (pivotColumn, pivotRow) {
            return pivotColumn.id + '_' + pivotRow.id;
        },

        _scrollTimer: undefined,

        _renderOnTimeout: function (timeout) {
            clearTimeout(this._scrollTimer);
            var self = this;

            if (timeout == 0) {
                this._pivotColumns._refreshRequired = this._pivotRows._refreshRequired = true;
                self._internalRefresh();
            }
            else {
                this._scrollTimer = setTimeout(function () { self._render(); }, timeout);
            }
        },

        onVScroll: function (position) {
            position = Math.round(position);
            if (position == this._offsetY)
                return;

            var minVScrollStep = 50;

            var timeout = 0;

            this._offsetY = position;
            this._renderOnTimeout(timeout);
        },

        onHScroll: function (position) {
            position = Math.round(position);
            if (position == this._offsetX)
                return;

            var minVScrollStep = 50;

            var timeout = 0;

            this._offsetX = position;
            this._renderOnTimeout(timeout);
        },

        onMouseWheel: function (event) {
            var delta = 0;
            if (!event)
                event = window.event;
            if (event.wheelDelta) {
                delta = event.wheelDelta / 120;
                //if (window.opera)
                //    delta = -delta;
            } else if (event.detail) {
                delta = -event.detail / 3;
            }

            if (!delta)
                return;

            if (event.preventDefault)
                event.preventDefault();

            event.returnValue = false;

            var min = this.vScroll.jqxScrollBar('min');
            var max = this.vScroll.jqxScrollBar('max');
            var value = this.vScroll.jqxScrollBar('value');

            delta *= 10;
            value = value - delta;
            if (value > max)
                value = max;
            if (value < min)
                value = min;

            this.vScroll.jqxScrollBar('value', value);
        },

        _onMouseMove: function (event) {
            var eventPos = $.jqx.position(event);
            var x = eventPos.left;
            var y = eventPos.top;

            if (!this.isPtInRect({ x: x, y: y }, this._rect)) {
                // allow processing outside of the grid only
                // in case of resizing
                if (this._colResizeState != 'RESIZING')
                    return;
            }

            var pos = this.host.offset();

            x -= Math.round(pos.left);
            y -= Math.round(pos.top);

            x = Math.max(x, 0);
            y = Math.max(y, 0);

            if (this._currentPosition.x == x && this._currentPosition.y == y) {
                //this._refreshMouseCursor();
                return;
            }
            else {
                this._currentPosition.x = x;
                this._currentPosition.y = y;
            }


            // test if the mouse is over the scrollbars
            for (var scrollbar in this._scrollBarPositions) {
                if (this._scrollBarPositions[scrollbar].visible &&
                    this.isPtInRect({ x: x, y: y }, this._scrollBarPositions[scrollbar].rect)) {
                    return;
                }
            }

            this._handleMouseMove(event);

            if (this.activeEditor && this.activeEditor.Editor) {
                //this._ensureEditorFocus();
            }
            else {
                //this.focus();
            }
        },

        _onMouseEnter: function (event) {
        },

        _onMouseLeave: function (event) {
            this._hideItemMenuElement();
        },

        _onMouseDown: function (event) {

            var out = { isOnItemButton: false };
            var item = this._itemHitTest(this._currentPosition, out);

            if (null != item) {
                var eventCancel = this._raisePivotItemMouseEvent(item, 'pivotitemmousedown', event.button == 0 ? 'left' : 'right');
                if (eventCancel) {
                    event.cancel = true;
                    return;
                }
            }

            if (event.button == 0)
                this.onMouseLeftButtonDown(event);
            else if (event.button == 2)
                this.onMouseRightButtonDown(event);
        },

        _onMouseUp: function (event) {
            var out = { isOnItemButton: false };

            var item = this._itemHitTest(this._currentPosition, out);
            if (item != null) {
                var eventCancel = this._raisePivotItemMouseEvent(item, 'pivotitemmouseup', event.button == 0 ? 'left' : 'right');
                if (eventCancel) {
                    event.cancel = true;
                    return;
                }
            }

            if (event.button == 0)
                this.onMouseLeftButtonUp(event);
            else if (event.button == 2)
                this.onMouseRightButtonUp(event);
        },

        _onMouseClick: function (event) {
            var self = this;
            var ev = event;

            self._handleMouseClick(event);
            if (event.cancel)
                return;

            if (self._dtLastMouseClick) {
                var diff = new Date() - self._dtLastMouseClick;
                if (diff < 500) {
                    this._handleMouseDoubleClick(event);
                    self._dtLastMouseClick = undefined;
                    return;
                }
            }

            self._dtLastMouseClick = new Date();
        },

        setDivContent: function (domElement, content, padding, align, updateInnerDivWidth) {
            var innerDiv = this.getChild(domElement, 'innerDiv');
            innerDiv.style.padding = padding.top + 'px ' + padding.right + 'px ' + padding.bottom + 'px ' + padding.left + 'px';
            if (align)
                innerDiv.style['text-align'] = align;

            this.setElementSize(domElement, parseFloat(domElement.style.width), parseFloat(domElement.style.height));

            if (updateInnerDivWidth)
                innerDiv.style.width = parseFloat(domElement.style.width) - padding.left + 'px';

            innerDiv.innerHTML = content;
        },

        setElementPosition: function (domElement, x, y) {
            domElement.style.position = 'absolute';
            domElement.style.left = x + 'px';
            domElement.style.top = y + 'px';
        },

        _getFloat: function (args) {
            var val;
            for (var i = 0; i < args.length; i++) {
                val = parseFloat(args[i]);
                if (!isNaN(val))
                    return val;
            }

            return NaN;
        },

        setElementSize: function (domElement, w, h) {
            domElement.style.width = w + 'px';
            domElement.style.height = h + 'px';

            var innerDiv = this.getChild(domElement, 'innerDiv');
            if (innerDiv) {
                var left = this._getFloat([innerDiv.style.padding.left, innerDiv.style.padding, 0]);
                var right = this._getFloat([innerDiv.style.padding.right, innerDiv.style.padding, 0]);
                var top = this._getFloat([innerDiv.style.padding.top, innerDiv.style.padding, 0]);
                var bottom = this._getFloat([innerDiv.style.padding.bottom, innerDiv.style.padding, 0]);

                innerDiv.style.width = (w - left - right) + 'px';
                innerDiv.style.height = (h - top - bottom) + 'px';
            }
        },

        createCanvas: function (parentElement) {
            var div = document.createElement("div");
            div.style['background-color'] = 'transparent';
            div.style.overflow = 'hidden';
            parentElement.appendChild(div);
            return div;
        },

        createDiv: function (parentElement, elementId, width, height) {
            var div = document.createElement("div");
            div.id = elementId;
            div.style.height = height + 'px';
            div.style.width = width + 'px';

            var innerDiv = document.createElement('div');
            innerDiv.id = 'innerDiv';
            innerDiv.style.height = height + 'px';
            innerDiv.style.width = width + 'px'

            div.appendChild(innerDiv);

            parentElement.appendChild(div);

            return div;
        },

        getPivotRows: function () {
            return this._pivotRows;
        },

        getPivotColumns: function () {
            return this._pivotColumns;
        },

        getPivotCells: function () {
            return this._pivotCells;
        },

        _layout: function () {
            var contentHost = this.host.find('#divContent');
            var hostVScroll = this.host.find('#divVScroll');
            var hostHScroll = this.host.find('#divHScroll');

            var width = this.host.width();
            var height = this.host.height();

            if (!this._pivotCells.Canvas)
                this._pivotCells.Canvas = this.createCanvas(this.Canvas, 'divCells', 100, 100);

            if (!this._pivotRows.Canvas)
                this._pivotRows.Canvas = this.createCanvas(this.Canvas, 'divRowsHierarchy', 100, 100);

            if (!this._pivotColumns.Canvas)
                this._pivotColumns.Canvas = this.createCanvas(this.Canvas, 'divColumnsHierarchy', 100, 100);

            if (this._pivotRows.isHidden) {
                this._pivotRows.Canvas.style.display = 'none';
            }
            else {
                this._pivotRows.Canvas.style.display = 'block';
                this.setElementPosition(this._pivotRows.Canvas, this._pivotRows.x, this._pivotRows.y);
                this.setElementSize(this._pivotRows.Canvas, this._pivotRows.getWidth() + 1, this._pivotRows.getHeight());

                if (this._pivotRows.renderCanvas == undefined)
                    this._pivotRows.renderCanvas = this.createCanvas(this._pivotRows.Canvas, 'divRowsRender', 100, 100);

                this.setElementSize(this._pivotRows.renderCanvas, this._pivotRows.getWidth() + 1, this._pivotRows.getHeight());
            }

            if (this._pivotColumns.isHidden) {
                this._pivotColumns.Canvas.style.display = 'none';
            }
            else {
                this._pivotColumns.Canvas.style.display = 'block';
                this.setElementPosition(this._pivotColumns.Canvas, this._pivotColumns.x, this._pivotColumns.y);
                this.setElementSize(this._pivotColumns.Canvas, this._pivotColumns.getWidth(), this._pivotColumns.getHeight() + 1);

                if (this._pivotColumns.renderCanvas == undefined)
                    this._pivotColumns.renderCanvas = this.createCanvas(this._pivotColumns.Canvas, 'divColumnsRender', 100, 100);

                this.setElementSize(this._pivotColumns.renderCanvas, this._pivotColumns.getWidth(), this._pivotColumns.getHeight() + 1);
            }

            this.setElementPosition(this._pivotCells.Canvas, this._pivotColumns.x, this._pivotRows.y);
            this.setElementSize(this._pivotCells.Canvas, this._pivotCells.viewPort.width, this._pivotCells.viewPort.height);

            if (this._pivotCells.renderCanvas == undefined)
                this._pivotCells.renderCanvas = this.createCanvas(this._pivotCells.Canvas, 'divCellsRender', 100, 100);

            this.setElementSize(this._pivotCells.renderCanvas, this._pivotColumns.getWidth() + 1, this._pivotRows.getHeight() + 1);
        },

        refresh: function () {
            this._pivotColumns._renderRequired = true;
            this._pivotRows._renderRequired = true;
            this._pivotCells.clear();

            this._internalRefresh();
        },

        _internalRefresh: function () {
            var pos = this.host.offset();

            if (this.autoResize) {
                var colHierarchyHeight = this._pivotColumns.isHidden ? 0 : this._pivotColumns.getHeight();
                var colHierarchyWidth = this._pivotColumns.isHidden ? 0 : this._pivotColumns.getWidth();
                var rowsHierarchyHeight = this._pivotRows.isHidden ? 0 : this._pivotRows.getHeight();
                var rowsHierarchyWidth = this._pivotRows.isHidden ? 0 : this._pivotRows.getWidth();

                // Setup the scrollers
                var sz = {};
                sz.width = colHierarchyWidth + rowsHierarchyWidth + 1;
                sz.height = colHierarchyHeight + rowsHierarchyHeight + 1;

                if (sz.width != this.host.width() || sz.height != this.host.height()) {
                    this._pivotColumns._renderRequired = this._pivotRows._renderRequired = true;
                    this.host.css({ width: sz.width + 'px', height: sz.height + 'px' });
                }
            }

            this._rect = { x: pos.left, y: pos.top, width: this.host.width(), height: this.host.height() };

            this._render();
            var hostHScroll = this.host.find('#divHScroll');
            hostHScroll.jqxScrollBar('refresh');
        },

        _render: function () {
            var isfullUpdate = this._pivotColumns._renderRequired || this._pivotRows._renderRequired;

            if (this._pivotRows.compactStyleRenderingEnabled != this.treeStyleRows) {
                this._pivotRows.compactStyleRenderingEnabled = this.treeStyleRows;
                isfullUpdate = true;
            }

            if (isfullUpdate) {
                this._pivotRows._renderRequired = this._pivotColumns._renderRequired = true;
                this.RenderGridContent();
                this._layout();
            }

            this._pivotRows.viewPort.y = this._offsetY + (this._pivotColumns.isVisible() ? this._pivotColumns.viewPort.height : 0);
            this._pivotColumns.viewPort.x = this._offsetX + (this._pivotRows.isVisible() ? this._pivotRows.viewPort.width : 0);

            this._pivotColumns.refresh();
            this._pivotRows.refresh();

            // cells area update
            //if (isfullUpdate) {
            this._pivotCells.render();
            //}
            //else {
            //this._pivotCells.RefreshSelectionContent();
            //}

            this._updateMenuElement();
        },

        _updateMenuElement: function () {
            var contentHost = this.host.find('#divContent');
            var contentDiv = contentHost[0];

            if (this._menuElement) {
                $(this._menuElement).off();
                contentDiv.removeChild(this._menuElement);
            }

            var div = document.createElement("div");
            div.style.height = '16px';
            div.style.width = '16px';
            div.style.id = 'menu_element';

            div.style.align = 'left';
            div.style.valign = 'top';
            div.style.display = 'none';

            contentDiv.appendChild(div);

            this._menuElement = div;

            var self = this;
            $(self._menuElement).on('click', function () {
                self._showItemContextMenu();
            });
        },

        dataBind: function () {
            var pivot = this.source;

            if (this.localization && !pivot.localization)
                pivot.localization = this.localization;

            pivot.dataBind();

            function populateHierarchy(obj1, obj2, parentItem, hierarchy, isColumnsHierarchy) {
                for (var i in obj1.items) {
                    var item = obj1.items[i];

                    var gridItem = new $.jqx.jqxPivotGrid.pivotItem(parentItem, hierarchy);
                    gridItem.text = item.text;
                    gridItem.adapterItem = item;
                    gridItem.isColumn = isColumnsHierarchy;

                    obj2.items.push(gridItem);

                    populateHierarchy(item, gridItem, gridItem, hierarchy, isColumnsHierarchy);
                }

                for (var i in obj1.valueItems) {
                    var item = obj1.valueItems[i];

                    var gridItem = new $.jqx.jqxPivotGrid.pivotItem(parentItem, hierarchy);
                    gridItem.adapterItem = item;
                    gridItem.text = item.text;
                    gridItem.isColumn = isColumnsHierarchy;
                    gridItem._isValueItem = true;

                    obj2.valueItems.push(gridItem);

                    populateHierarchy(item, gridItem, gridItem, hierarchy, isColumnsHierarchy);
                }
            }

            this._createPivotAreas();

            populateHierarchy(pivot._rowsHierarchy, this._pivotRows, null, this._pivotRows, false);
            populateHierarchy(pivot._columnsHierarchy, this._pivotColumns, null, this._pivotColumns, true);

            this.bindingState = "DataBoundPivot";

            this._pivotRows.autoResize('default');
            this._pivotColumns.autoResize('default');

            this._internalRefresh();
        },

        getChild: function (domElement, id) {
            var childElements = domElement.childNodes
            for (var i = 0; i < childElements.length; i++) {
                if (childElements[i].id == id)
                    return childElements[i];
            }

            return null;
        },

        scrollToOffset: function (x, y) {
            var gridcells = this.gridcells;
            for (var i = 0; i < gridcells.length; i++) {
                gridcells[i].style.top = y + parseInt(gridcells[i].originalY) + 'px';
                this.setDivContent(gridcells[i], 'cell ' + i);
            }
        },

        getWidth: function () {
            return this.host.width();
        },

        getHeight: function () {
            return this.host.height();
        },

        RenderGridContent: function () {
            if (!this._pivotColumns._renderRequired &&
                !this._pivotRows._renderRequired) {

                this._pivotRows.viewPort.y = this._offsetY;
                this._pivotColumns.viewPort.x = this._offsetX;
                return;
            }

            if (this.PaintSuspended)
                return;

            if (this._colResizeState == 'RESIZING')
                return;

            var rect = {};
            rect.x = this._offsetX;
            rect.y = this._offsetY;
            rect.width = this.getWidth();
            rect.height = this.getHeight();

            if (rect.width == 0 || rect.height == 0)
                return;

            this.PaintSuspended = true;

            if (this._pivotColumns._isColumnsCountRequresUpdate) {
                this._pivotColumns._updateVisibleLeaves();
                this._pivotColumns._updateColumnsCount();
                this._pivotColumns._updateColumnsIndexes();
            }

            if (this._pivotRows._isColumnsCountRequresUpdate) {
                this._pivotRows._updateColumnsCount();
                this._pivotRows._updateColumnsIndexes();
            }

            if (this.getWidth() == 0 || this.getHeight() == 0) {
                this.PaintSuspended = false;
                return;
            }

            if (this.GroupingEnabled && this.groupingColumns.length > 0)
                this._pivotRows.isHidden = true;

            if (this._pivotColumns._renderRequired) {
                this._pivotColumns.render();
            }

            if (this._pivotRows._renderRequired) {
                this._pivotRows.render();
            }

            var colHierarchyHeight = (this._pivotColumns.isVisible() ? this._pivotColumns.getHeight() : 0);
            var rowsHierarchyWidth = (this._pivotRows.isVisible() ? this._pivotRows.getWidth() : 0);

            // Setup the scrollers
            var sz = {
                width: this._pivotColumns.getWidth() + rowsHierarchyWidth,
                height: this._pivotRows.getHeight() + colHierarchyHeight
            };

            if (this.scrollableAreaSize != sz || this.isSyncScrollRequired) {
                this.scrollableAreaSize = sz;

                this.SynchronizeScrollBars();
            }

            //this.AdjustBorderLines();

            var contentHost = this.host.find('#divContent');
            var hostVScroll = this.host.find('#divVScroll');
            var hostHScroll = this.host.find('#divHScroll');

            var isHScrollVisible = hostHScroll.css('display') != 'none';
            var isVScrollVisible = hostVScroll.css('display') != 'none';

            contentHost.css({ height: (rect.height - (isHScrollVisible ? hostHScroll.height() + 4 : 0)) + 'px' });
            contentHost.css({ width: (rect.width - (isVScrollVisible ? hostVScroll.width() + 4 : 0)) + 'px' });

            var rheight = rect.height;
            if (rect.height == this.getHeight()) {
                rheight = rect.height - colHierarchyHeight - ((isHScrollVisible) ? hostHScroll.height() + 4 : 0);
                if (rheight < 0)
                    rheight = rect.height;
            }

            this._pivotRows.x = 0;
            this._pivotRows.y = colHierarchyHeight;
            this._pivotRows.viewPort = {
                x: this._pivotRows.x,
                y: rect.y,
                width: this._pivotRows.getWidth(),
                height: rheight
            };

            var cwidth = rect.width;
            if (rect.width == this.getWidth()) {
                cwidth = rect.width - rowsHierarchyWidth - ((isVScrollVisible) ? hostVScroll.width() + 4 : 0);
                if (cwidth < 0)
                    cwidth = rect.width;
            }

            this._pivotColumns.x = rowsHierarchyWidth;
            this._pivotColumns.y = 0;
            this._pivotColumns.viewPort = {
                x: rect.x,
                y: this._pivotColumns.y,
                width: cwidth,
                height: this._pivotColumns.getHeight()
            };

            this._pivotCells.Bounds = {
                x: this._pivotColumns.x,
                y: this._pivotRows.y,
                width: this._pivotColumns.getWidth(),
                height: rheight
            };

            this._pivotCells.viewPort = {
                x: rect.x,
                y: rect.y,
                width: cwidth,
                height: rheight
            };

            if (this.draggingItem != null && dragElement.visibility == visibility.visible) {
                dragElement.setValue(Canvas.ZIndexProperty, 10000);
            }

            this._pivotRows._renderRequired = false;
            this._pivotColumns._renderRequired = false;

            this.PaintSuspended = false;
        },

        SynchronizeScrollBars: function () {
            var showVScroll = false;
            var showHScroll = false;

            var hostVScroll = this.host.find('#divVScroll');
            var hostHScroll = this.host.find('#divHScroll');
            var isHScrollVisible = hostHScroll.css('display') != 'none';
            var isVScrollVisible = hostVScroll.css('display') != 'none';

            var scrollCtrlWidth = hostHScroll.height();

            var vScrollVisibilityChanged = false;
            var hScrollVisibilityChanged = false;

            if (this.scrollableAreaSize.height > this.getHeight())
                showVScroll = true;

            if (this.scrollableAreaSize.width > this.getWidth())
                showHScroll = true;

            if (this.scrollableAreaSize.height <= this.getHeight() && this.scrollableAreaSize.width <= this.getWidth()) {
                showVScroll = false;
                showHScroll = false;
            }

            if (showVScroll)
                showHScroll = showHScroll || (this.scrollableAreaSize.width > this.getWidth() - scrollCtrlWidth);

            if (showHScroll)
                showVScroll = showVScroll || (this.scrollableAreaSize.height > this.getHeight() - scrollCtrlWidth);

            if (showVScroll) {
                if (!isVScrollVisible) {
                    vScrollVisibilityChanged = true;
                }

                hostVScroll[0].style.display = 'block';

                var vscrollHeight = this.getHeight() - (showHScroll ? scrollCtrlWidth + 5 : 0);

                if (vscrollHeight < 0) {
                    vscrollHeight = 0;
                }

                this.setElementPosition(hostVScroll[0], this.getWidth() - scrollCtrlWidth - 4, 0);
                this.setElementSize(hostVScroll[0], scrollCtrlWidth, vscrollHeight);

                hostVScroll.jqxScrollBar('min', 0);

                var vScrollMaximum = this.scrollableAreaSize.height - (this.getHeight() - (showHScroll ? scrollCtrlWidth : 0)) + 4;

                if (vScrollMaximum != hostVScroll.jqxScrollBar('max')) {
                    hostVScroll.jqxScrollBar('max', vScrollMaximum);
                }

                if (this.VerticalScrollBarSmallChange != undefined)
                    hostVScroll.jqxScrollBar('step', this.VerticalScrollBarSmallChange);
                else
                    hostVScroll.jqxScrollBar('step', 10);

                var vScrollLargeChange = this.scrollableAreaSize.height / 10;
                if (vScrollLargeChange < 10)
                    vScrollLargeChange = 10;

                // use the user specified value if available
                if (this.VerticalScrollBarLargeChange != undefined)
                    vScrollLargeChange = verticalScrollBarLargeChange;

                if (hostVScroll.jqxScrollBar('largestep') != vScrollLargeChange)
                    hostVScroll.jqxScrollBar('largestep', vScrollLargeChange);

                if (hostVScroll.jqxScrollBar('largestep') < hostVScroll.jqxScrollBar('step'))
                    hostVScroll.jqxScrollBar('largestep', hostVScroll.jqxScrollBar('step'));

                if (this.rtl) {
                }
                else {
                    //hostVScroll.addClass('jqx-rc-tr');
                    //if (!showHScroll)
                    //  hostVScroll.addClass('jqx-rc-br');
                    //else
                    //  hostVScroll.removeClass('jqx-rc-br');
                }
            }
            else {
                if (isVScrollVisible) {
                    vScrollVisibilityChanged = true;
                }

                hostVScroll.jqxScrollBar('value', 0);
                hostVScroll[0].style.display = 'none';
            }

            if (showHScroll) {
                if (isHScrollVisible) {
                    hScrollVisibilityChanged = true;
                }

                hostHScroll[0].style.display = 'block';

                var hScrollWidth = this.getWidth() - (showVScroll ? scrollCtrlWidth + 5 : 0);
                if (hScrollWidth < 0 || hScrollWidth == undefined) {
                    hScrollWidth = 0;
                }

                this.setElementPosition(hostHScroll[0], 0, this.getHeight() - scrollCtrlWidth - 4);
                this.setElementSize(hostHScroll[0], hScrollWidth, scrollCtrlWidth);

                if (hostHScroll.jqxScrollBar('min') != 0) {
                    hostHScroll.jqxScrollBar('min', 0)
                }

                var hScrollMaximum = this.scrollableAreaSize.width - (this.getWidth() - (showVScroll ? scrollCtrlWidth : 0)) + 4;

                if (hostHScroll.jqxScrollBar('max') != hScrollMaximum) {
                    hostHScroll.jqxScrollBar('max', hScrollMaximum);
                }

                // use the user speified value if available
                if (this.HorizontalScrollBarSmallChange != undefined)
                    hostHScroll.jqxScrollBar('step', this.HorizontalScrollBarSmallChange);
                else
                    hostHScroll.jqxScrollBar('step', 10);

                var hScrollLargeChange = (this.getWidth() / 2);
                if (hScrollLargeChange < 25)
                    hScrollLargeChange = 25;

                // use the user specified value if available
                if (this.HorizontalScrollBarLargeChange != undefined)
                    hScrollLargeChange = this.HorizontalScrollBarSmallChange;

                hostHScroll.jqxScrollBar('largestep', hScrollLargeChange);

                if (hostHScroll.jqxScrollBar('largestep') < hostHScroll.jqxScrollBar('largestep'))
                    hostHScroll.jqxScrollBar('largestep', hostHScroll.jqxScrollBar('step'));
            }
            else {
                if (isHScrollVisible) {
                    hScrollVisibilityChanged = true;
                }

                hostHScroll.jqxScrollBar('value', 0);
                hostHScroll[0].style.display = 'none';
            }

            showHScroll = showHScroll && this.scrollBarsEnabled;
            showVScroll = showVScroll && this.scrollBarsEnabled;

            if (showHScroll != (hostHScroll[0].display == 'block')) {
                hostHScroll[0].display = showHScroll ? 'block' : 'none';
                hScrollVisibilityChanged = true;
            }
            if (showVScroll != (hostVScroll[0].display == 'block')) {
                hostVScroll[0].display = showVScroll ? 'block' : 'none';
                vScrollVisibilityChanged = true;
            }

            this._scrollBarPositions = {
                vertical: { visible: showVScroll, rect: { x: hostVScroll.position().left, y: hostVScroll.position().top, width: hostVScroll.width(), height: hostVScroll.height() } },
                horizontal: { visible: showHScroll, rect: { x: hostHScroll.position().left, y: hostHScroll.position().top, width: hostHScroll.width(), height: hostHScroll.height() } }
            };

            hostHScroll.jqxScrollBar('refresh');
            hostVScroll.jqxScrollBar('refresh');
        },

        isPtInRect: function (point, rect) {
            return (point.x >= rect.x && point.x <= rect.x + rect.width &&
                point.y >= rect.y && point.y <= rect.y + rect.height);

        },

        ///////////////// MOUSE EVENTS //////////////////
        onMouseLeftButtonUp: function (event) {
            var self = this;

            for (var scrollbar in self._scrollBarPositions) {
                if (this._scrollBarPositions[scrollbar].visible &&
                    this.isPtInRect(self._currentPosition, self._scrollBarPositions[scrollbar].rect)) {
                    if (self._isMouseCaptured()) {
                        self._releaseMouseCapture();
                    }
                    self._isMouseLeftButtonDown = false;
                    return;
                }
            }

            if (self._isMouseCaptured()) {
                self._releaseMouseCapture();
                return;
            }

            if (self._itemMenuButtonMouseOver || self._isContextMenuOpen)
                return;

            self.canDrag = false;

            var eventPos = $.jqx.position(event);
            var isInRect = self.isPtInRect({ x: eventPos.left, y: eventPos.top }, self._rect);

            var hitInfo = self._pivotCells._hitTest(self._currentPosition);

            if (hitInfo && isInRect) {
                var eventCancel = self._raisePivotCellMouseEvent(hitInfo.pivotRow, hitInfo.pivotColumn, 'pivotcellmouseup', 'left');
                if (eventCancel)
                    return;
            }

            // handle item resizing
            if (self._colResizeState == 'RESIZING') {
                self._colResizeState = 'NO_RESIZE';

                self._updateCursor('ARROW');

                self._pivotColumns._renderRequired = true;
                self._pivotRows._renderRequired = true;

                var pt = {
                    x: self.resizingItem.x + self.resizingItem.hierarchy.x - self._offsetX,
                    y: self.resizingItem.y + self.resizingItem.hierarchy.y - self._offsetY
                };


                if (this.isHorizontalResize)
                    self.resizingItem.setWidth(Math.max(self.resizingItem.minimumWidth, Math.abs(self._currentPosition.x - pt.x)));
                else
                    self.resizingItem.setHeight(Math.max(self.resizingItem.minimumHeight, Math.abs(self._currentPosition.y - pt.y)));

                $('body').find('#' + self._resizeLineId).hide();

                self.resizingItem = null;

                if (self.resizeTooltipEnabled) {
                    //this._resizeTooltip.visibility = visibility.Collapsed;
                }

                self._isMouseLeftButtonDown = false;
                self._internalRefresh();
                return;
            } // resizing

            var out = { isOnItemButton: false };

            var item = self._itemHitTest(self._currentPosition, out);
            if (item != null) {
                if (out.isOnItemButton || out.isOnMenuButton)
                    return;
            }

            var isDrag = false;
            if (self._canDrop(item)) {
                self._endDrag(item);
                isDrag = true;
            }
            else if (self.dragElement && self.dragElement.style.display == 'block') {
                self._endDrag(draggingItem);
                isDrag = true;
            }

            if (isDrag) {
                self._isMouseLeftButtonDown = false;
                self._internalRefresh();
                return;
            }

            self._isMouseLeftButtonDown = false;
            if (isInRect && self.activeEditor.Editor == null) {
                self._updateSelection();
            }

        },

        onMouseLeftButtonDown: function (event) {
            for (var scrollbar in this._scrollBarPositions) {
                if (this._scrollBarPositions[scrollbar].visible &&
                    this.isPtInRect(this._currentPosition, this._scrollBarPositions[scrollbar].rect)) {
                    this._captureMouse();
                    return;
                }
            }

            var out = { isOnItemButton: false };
            var item = this._itemHitTest(this._currentPosition, out);

            this._timeLastDown = new Date();

            var isShiftPressed = false;

            if (!this.isShiftPressed) {
                this._selectStartPosition = { x: this._currentPosition.x, y: this._currentPosition.y };
            }

            if (this._itemMenuButtonMouseOver || this._isContextMenuOpen)
                return;

            this._isMouseLeftButtonDown = true;

            // handle column resizing
            if (this._colResizeState == 'READY_RESIZE') {
                this._colResizeState = 'RESIZING';

                this._updateCursor(this.isHorizontalResize ? 'COLUMN_RESIZE' : 'ROW_RESIZE');

                this._refreshMouseCursor();
                return;
            }
            else if (this._colResizeState == 'RESIZING') {
                return;
            }

            if (null != item) {
                if (out.isOnItemButton) {
                    if (this._lastToggle && this._lastToggle.item == item && (new Date() - this._lastToggle.time) < 500)
                        return;

                    this._isMouseLeftButtonDown = false;
                    if (item.isExpanded)
                        item.collapse();
                    else
                        item.expand();

                    this._lastToggle = { time: new Date(), item: item };

                    this._internalRefresh();
                    return;
                }

                this.canDrag = true;
                if (out.isOnItemButton)
                    this._updateCursor('ARROW');
                else
                    this._updateCursor('CROSS');

                if (item.isColumn)
                    this._internalSelectMode = 'COL_SELECT';
                else
                    this._internalSelectMode = 'ROW_SELECT';
            }
            else
                this._internalSelectMode = 'CELLS_SELECT';

            var hitInfo = this._pivotCells._hitTest(this._currentPosition);
            if (hitInfo) {
                var eventCancel = this._raisePivotCellMouseEvent(hitInfo.pivotRow, hitInfo.pivotColumn, 'pivotcellmousedown', 'left');
                if (eventCancel)
                    return;
            }

            if (this.activeEditor.Editor == null) {
                this._updateSelection();
            }

            this._refreshMouseCursor();
        }, // _onMouseDown

        onMouseRightButtonDown: function (event) {
            this._timeLastDown = new Date();

            var out = { isOnItemButton: false };
            var item = this._itemHitTest(this._currentPosition, out);
            if (item != null) {
                this._raisePivotItemMouseEvent(item, 'pivotitemmousedown', 'right');
                return;
            }

            var hitInfo = this._pivotCells._hitTest(this._currentPosition);
            if (hitInfo) {
                this._raisePivotCellMouseEvent(hitInfo.pivotRow, hitInfo.pivotColumn, 'pivotcellmousedown', 'right');
            }
        },

        onMouseRightButtonUp: function (event) {
            var self = this;

            var eventPos = $.jqx.position(event);
            var isInRect = self.isPtInRect({ x: eventPos.left, y: eventPos.top }, self._rect);

            var hitInfo = this._pivotCells._hitTest(this._currentPosition);
            if (hitInfo && isInRect) {
                this._raisePivotCellMouseEvent(hitInfo.pivotRow, hitInfo.pivotColumn, 'pivotcellmouseup', 'right');
            }

            this._timeLastUp = new Date();
        },

        _itemMouseMove: function (point, item) {
            if (this.resizingItem) {
                if (this.isHorizontalResize)
                    this._updateCursor('COLUMN_RESIZE');
                else
                    this._updateCursor('ROW_RESIZE');
                return;
            }

            if (this._menuElement._itemMouseOver != item)
                this._hideItemMenuElement();

            this._updateCursor('CROSS');

            var displayBounds = { x: item.x, y: item.y, width: item.getDisplayWidth(), height: item.getDisplayHeight() };
            if (item.isColumn)
                displayBounds.x += item.hierarchy.x - this._offsetX;
            else
                displayBounds.y += item.hierarchy.y - this._offsetY;

            if (item.IsRowsHierarchyItem && _pivotRows.compactStyleRenderingEnabled)
                displayBounds.height = item.height;

            displayBounds.right = displayBounds.x + displayBounds.width;
            displayBounds.bottom = displayBounds.y + displayBounds.height;

            // check whether the cursor is over the resize line
            if (Math.abs(displayBounds.right - point.x) <= 4 && point.y >= displayBounds.y && point.y <= displayBounds.bottom) {
                this.isHorizontalResize = true;

                if (item.hierarchy.resizable && !this._pivotColumns.isGroupingColumn(item)) {
                    this._updateCursor('COLUMN_RESIZE');
                    this.resizingItem = (item.isColumn) ? item._getLastVisibleLeaf(item) : item;

                    // If the item is in a collapsed state we need to pick the item
                    // at the lowest expanded level
                    if (!this.resizingItem.isColumn && !this.resizingItem.isExpanded) {
                        var leafItems = this._pivotRows._getVisibleLeafLevelItems();
                        for (var i in leafItems) {
                            var leafItem = leafItems[i];
                            if (leafItem.ItemLevel > this.resizingItem.ItemLevel)
                                this.resizingItem = leafItem;
                        }
                    }

                    this._colResizeState = 'READY_RESIZE';
                }
                return;
            }

            if (!item.isColumn && Math.abs(displayBounds.bottom - point.y) <= 3) {
                this.isHorizontalResize = false;

                if (!(item.IsRowsHierarchyItem && this._pivotRows.compactStyleRenderingEnabled))
                    item = item._getLastVisibleLeaf(item);

                if (item.hierarchy.resizable) {
                    this._updateCursor('ROW_RESIZE');
                    this.resizingItem = item;

                    this._colResizeState = 'READY_RESIZE';
                }

                return;
            }

            var otherHierarchy = item.hierarchy.getOtherHierarchy();

            if (item.hierarchy.sortable && otherHierarchy.items.length > 0) {
                // check if on menu button
                this._hitTestShowItemMenuElement(point, item, displayBounds);
            }
        }, // _itemMouseMove

        isInHierarchyViewPort: function (point, hierarchy) {
            if (hierarchy.isColumnsHierarchy)
                return (this.isPtInRect({ x: point.x + this._offsetX, y: point.y }, hierarchy.viewPort));
            else
                return (this.isPtInRect({ x: point.x, y: point.y + this._offsetY }, hierarchy.viewPort));

        },

        _hitTestShowItemMenuElement: function (point, item, displayBounds) {
            if (this._menuElement && this._menuElement._itemMouseOver && this._menuElement._itemMouseOver._element)
                $(this._menuElement._itemMouseOver._element).find('#sortElement').show();

            this._menuElement.style.display = 'none';

            if (this._isContextMenuOpen ||
                item.valueItems.length > 0 ||
                !(
                    point.x < displayBounds.right &&
                    point.x > displayBounds.x &&
                    point.y >= displayBounds.y &&
                    point.y <= displayBounds.bottom)
                ) {
                return;
            }

            {
                var hostRect = $.extend({}, this._rect);
                hostRect.x = hostRect.y = 0;

                if (this.vScroll[0].display == 'block')
                    hostRect.width -= this.vScroll.width();

                if (this.hScroll[0].display == 'block')
                    hostRect.height -= this.hScroll.height();

                var pointNoScroll = { x: this._currentPosition.x, y: this._currentPosition.y };
                pointNoScroll.x -= item.hierarchy.x - (item.hierarchy.viewPort.x - item.hierarchy.x);
                pointNoScroll.y -= item.hierarchy.y - (item.hierarchy.viewPort.y - item.hierarchy.y);

                menuRect = { x: item.x + displayBounds.width - 18, y: item.y + (displayBounds.height - 16) / 2 + 1, width: 16, height: 16 };

                this._menuElement.style.height = menuRect.height + 'px';

                this._menuElement['className'] = this.toThemeProperty('jqx-pivotgrid-menu-button');

                if (item.isColumn)
                    menuRect.x += item.hierarchy.x - this._offsetX;
                else
                    menuRect.y += item.hierarchy.y - this._offsetY;

                this.setElementPosition(this._menuElement, menuRect.x, menuRect.y);

                if (this.isPtInRect({ x: menuRect.x, y: menuRect.y }, hostRect) &&
                    this.isPtInRect({ x: menuRect.x, y: menuRect.y + menuRect.height }, hostRect) &&
                    this.isPtInRect({ x: menuRect.x + menuRect.width, y: menuRect.y }, hostRect) &&
                    this.isPtInRect({ x: menuRect.x + menuRect.width, y: menuRect.y + menuRect.height }, hostRect)) {
                    this._menuElement.style.display = 'block';
                    this._menuElement._itemMouseOver = item;

                    $(this._menuElement._itemMouseOver._element).find('#sortElement').hide();

                    if (!item._currentCustomContent) {
                        var backgroundColor = $(item._element).css('background-color');
                        this._menuElement.style['background-color'] = backgroundColor;
                    }

                    if (item.isColumn)
                        menuRect.x += this._offsetX - item.hierarchy.x;
                    else
                        menuRect.y += this._offsetY - item.hierarchy.y;

                    if (this.isPtInRect({ x: pointNoScroll.x, y: pointNoScroll.y }, menuRect)) {
                        this._itemMenuButtonMouseOver = true;
                    }
                };
            }
        },

        _hideItemMenuElement: function () {
            if (this._menuElement && !this._isContextMenuOpen && this._menuElement.style.display == 'block') {
                this._menuElement.style.display = 'none';
                $(this._menuElement._itemMouseOver._element).find('#sortElement').show();
            }
        },

        _hideItemContextMenu: function () {
            this._contextMenu.jqxMenu('close');
            this._hideItemMenuElement();
        },

        _showItemContextMenu: function () {
            var item = this._menuElement._itemMouseOver;
            if (!item)
                return;

            var width = this._contextMenu.width();
            var height = this._contextMenu.height();

            this._contextMenu.find('#sortasc')[0]['className'] = 'jqx-pivotgrid-sortasc-icon ' + this.toThemeProperty('jqx-pivotgrid-sortasc-icon');
            this._contextMenu.find('#sortdesc')[0]['className'] = 'jqx-pivotgrid-sortdesc-icon ' + this.toThemeProperty('jqx-pivotgrid-sortdesc-icon');
            this._contextMenu.find('#sortremove')[0]['className'] = 'jqx-pivotgrid-sortremove-icon ' + this.toThemeProperty('jqx-pivotgrid-sortremove-icon');

            // calculate menu x,y coordinates
            var menuX = -width + item.displayWidth + item.x + (item.hierarchy.viewPort.x - this._offsetX) - this._offsetX;
            if (!item.isColumn)
                menuX = item.x + item.displayWidth;

            var menuY = item.y + item.getDisplayHeight();
            if (!item.isColumn)
                menuY = item.y - this._offsetY + item.hierarchy.y;

            // ensure that the menu fits with the grid's bounds
            if (menuX <= 1)
                menuX = 1;

            if (menuY < this._pivotColumns.y + this._pivotColumns.getHeight())
                menuY = this._pivotColumns.y + this._pivotColumns.getHeight();

            if (menuY + height > this._rect.height)
                menuY = this._rect.height - height;

            // open the context menu
            this._contextMenu.jqxMenu('open', menuX + this._rect.x, menuY + this._rect.y);

            this._contextMenu.focus();
        },

        _handleMouseMove: function (event) {
            if (this._colResizeState == 'RESIZING') {
                this._doResize({ x: this._currentPosition.x, y: this._currentPosition.y });
                this._refreshMouseCursor();
                return;
            }
            else {
                this._colResizeState = 'NO_RESIZE';
                this.resizingItem = null;
            }

            var currPos = this._currentPosition;

            var colItem = null;
            if (this.isInHierarchyViewPort({ x: currPos.x, y: currPos.y }, this._pivotColumns)) {
                colItem = this._pivotColumns.hitTest(currPos);
            }

            var pivotRow = null;
            if (this.isInHierarchyViewPort({ x: currPos.x, y: currPos.y }, this._pivotRows)) {
                pivotRow = this._pivotRows.hitTest(currPos);
            }

            this._itemMenuButtonMouseOver = false;

            if (colItem != null || pivotRow != null) {
                var itemMouseMove = colItem == null ? pivotRow : colItem;

                this.gridCellMouseOver = null;

                this._itemMouseMove(currPos, itemMouseMove);
                if (this._focusedItem != itemMouseMove) {
                    this._focusedItem = itemMouseMove;
                    if (this._isMouseLeftButtonDown) {
                        this._updateSelection();
                    }
                }

                var highlightRect = {};

                if (this.CellsHighlightOnHierarchyItemMoveEnabled &&
                    (
                        (itemMouseMove.IsRowsHierarchyItem && (this.CellsHighlightMode == 'CELLS_HIGHLIGHT_ROW')) ||
                        (itemMouseMove.isColumn && (this.CellsHighlightMode == 'CELLS_HIGHLIGHT_COLUMN'))
                    )
                   ) {
                    if (itemMouseMove.isColumn) {
                        highlightRect = { x: itemMouseMove.x, y: 0, width: itemMouseMove.DisplayWidth, height: this._pivotRows.getHeight() };
                    }
                    else {
                        highlightRect = { x: 0, y: itemMouseMove.y, width: this._pivotColumns.getWidth(), height: itemMouseMove.getDisplayHeight() };
                    }

                    // disable highlight for row details and group columns
                    if ((itemMouseMove.isColumn && this.isGroupingEnabled && this.groupingColumns.length > 0) ||
                        (itemMouseMove.IsRowsHierarchyItem && this._pivotRows.isOnRowDetails(this._currentPosition, itemMouseMove))) {
                        highlightRect = { x: 0, y: 0, width: 0, height: 0 };
                    }
                }

                this._refreshMouseCursor();
                return;
            }
            else {
                this._hideItemMenuElement();
            }

            var refreshCellsRequired = this.gridCellMouseOver != null;

            // the mouse is moving within the matrix 
            this.resizingItem = null;
            this._focusedItem = null;
            this._colResizeState = 'NO_RESIZE';
            this._updateCursor('ARROW');

            var gridCellMouseOverSave = null;
            if (this.gridCellMouseOver) {
                gridCellMouseOverSave = {};
                gridCellMouseOverSave.pivotColumn = this.gridCellMouseOver.pivotColumn;
                gridCellMouseOverSave.pivotRow = this.gridCellMouseOver.pivotRow;
            }

            var hitInfo = this._pivotCells._hitTest(currPos);
            if (this._isMouseLeftButtonDown && hitInfo) {
                if (this.gridCellMouseOver == null || this.gridCellMouseOver.pivotRow != pivotRow || this.gridCellMouseOver.pivotColumn != colItem)
                    this.gridCellMouseOver = { pivotRow: hitInfo.pivotRow, pivotColumn: hitInfo.pivotColumn, pivotCells: this._pivotCells };

                var highlightRect = { x: 0, y: 0, width: 0, height: 0 };
                if (this.cellsHighlightMode == 'CELLS_HIGHLIGHT_COLUMN') {
                    highlightRect = { x: this.gridCellMouseOver.pivotColumn.x, y: 0, width: this.gridCellMouseOver.pivotColumn.getDisplayWidth(), height: this._pivotRows.getHeight() };
                }
                else if (this.cellsHighlightMode == 'CELLS_HIGHLIGHT_ROW') {
                    highlightRect = { x: 0, y: this.gridCellMouseOver.pivotRow.y, width: this._pivotColumns.getWidth(), height: this.gridCellMouseOver.pivotRow.getDisplayHeight() };
                }
                else if (this.cellsHighlightMode == 'CELLS_HIGHLIGHT_SINGLE_CELL') {
                    highlightRect = { x: this.gridCellMouseOver.pivotColumn.x, y: this.gridCellMouseOver.pivotRow.y, width: this._pivotColumns.getWidth(), height: this.gridCellMouseOver.pivotRow.getDisplayHeight() };

                    if (this.isGroupingEnabled && this.groupingColumns.length > 0) {
                        if (this.gridCellMouseOver.pivotRow.items.length > 0) {
                            highlightRect = { x: 0, y: 0, width: 0, height: 0 };
                        }
                    }

                    if (this.gridCellMouseOver.pivotRow.RowDetailsVisible) {
                        highlightRect.height -= this.gridCellMouseOver.pivotRow.GetRowDetailsHeight();
                    }
                }

                // disable highlight for row details and group columns
                if (this._pivotColumns.isGroupingColumn(this.gridCellMouseOver.pivotColumn) || this._pivotRows.isOnRowDetails(this._currentPosition, this.gridCellMouseOver.pivotRow))
                    highlightRect = { x: 0, y: 0, width: 0, height: 0 };
            }
            else {
                this.gridCellMouseOver = null;
            }

            if (this.gridCellMouseOver != null && (this.gridCellMouseOver != gridCellMouseOverSave || gridCellMouseOverSave.pivotRow != this.gridCellMouseOver.pivotRow || gridCellMouseOverSave.pivotColumn != this.gridCellMouseOver.pivotColumn)) {
                if (this._isMouseLeftButtonDown && !this._itemMenuButtonMouseOver) {
                    this._updateSelection();
                    this._internalRefresh();
                }
            }
        },

        _handleMouseClick: function (event) {
            var out = { isOnItemButton: false }
            var hitItem = this._itemHitTest(this._currentPosition, out);
            if (hitItem != null) {
                var eventCancel = this._raisePivotItemMouseEvent(hitItem, 'pivotitemclick', (event.button == 0) ? 'left' : 'right');
                if (eventCancel) {
                    event.cancel = true;
                    return;
                }

                if (this._itemMenuButtonMouseOver || this._isContextMenuOpen)
                    return;

                if (this._isMouseLeftButtonDown && !out.isOnItemButton && hitItem.sortMode == 'Automatic' && hitItem.valueItems.length == 0) {
                    var savedCursor = this.cursor;
                    this.cursor = 'Wait';

                    this.cursor = savedCursor;
                }
            }
            else {
                var hitInfo = this._pivotCells._hitTest(this._currentPosition);
                if (hitInfo) {
                    var eventCancel = this._raisePivotCellMouseEvent(hitInfo.pivotRow, hitInfo.pivotColumn, 'pivotcellclick', (event.button == 0) ? 'left' : 'right');
                    if (eventCancel) {
                        event.cancel = true;
                        return;
                    }
                }
            }

            //if (this._isMouseLeftButtonDown) {
            //    this._updateSelection();
            //}
        },

        _handleMouseDoubleClick: function (event) {
            if (this.activeEditor.Editor != null) {
                var args = null;

                if (false == this.hideEditor('MOUSE_DBLCLICK', args, true)) {
                    return;
                }
            }

            if (this._itemMenuButtonMouseOver || this._isContextMenuOpen)
                return;

            var out = { isOnItemButton: false };
            var item = this._itemHitTest(this._currentPosition, out);

            if (item != null) {
                if (out.isOnMenuButton)
                    return;

                var eventCancel = this._raisePivotItemMouseEvent(item, 'pivotitemdblclick', (event.button == 0) ? 'left' : 'right');
                if (eventCancel)
                    return;

                if (this._lastToggle && this._lastToggle.item == item && (new Date() - this._lastToggle.time) < 500)
                    return;

                if (event.button == 0) {
                    if (item.isExpanded)
                        item.collapse();
                    else
                        item.expand();

                    item.hierarchy.selectItem(item);
                    this._internalRefresh();
                }

                this._lastToggle = { time: new Date(), item: item };
            }
            else {
                var hitInfo = this._pivotCells._hitTest(this._currentPosition);

                if (hitInfo) {
                    var eventCancel = this._raisePivotCellMouseEvent(hitInfo.pivotRow, hitInfo.pivotColumn, 'pivotcelldblclick', (event.button == 0) ? 'left' : 'right');
                    if (eventCancel)
                        return;
                }

            }

            this._refreshMouseCursor();
        },

        _isMouseCaptured: function () {
            return this._captured === true;
        },

        _releaseMouseCapture: function () {
            this._captured = false;
        },

        _captureMouse: function () {
            this._captured = true;
        },

        //////////////// END OF MOUSE EVENTS ////////////

        _updateCursor: function (cursor) {
            if (cursor == 'ARROW')
                this.element.style.cursor = 'default';
            else if (cursor == 'CROSS')
                this.element.style.cursor = 'pointer';
            else if (cursor == 'COLUMN_RESIZE')
                this.element.style.cursor = 'col-resize';
            else if (cursor == 'ROW_RESIZE')
                this.element.style.cursor = 'row-resize';

        },

        _refreshMouseCursor: function () {
        },

        _ensureEditorFocus: function () {
        },

        focus: function () {
        },

        _itemHitTest: function (point, out) {
            out.isOnItemButton = false;

            var item = null;

            if (!this._pivotRows.isHidden && this.isInHierarchyViewPort(point, this._pivotRows)) {
                item = this._pivotRows.hitTest(point);
            }

            if (item == null && !this._pivotColumns.isHidden && this.isInHierarchyViewPort(point, this._pivotColumns)) {
                item = this._pivotColumns.hitTest(point);
            }

            if (item != null) {
                var pointNoScroll = { x: this._currentPosition.x, y: this._currentPosition.y };
                pointNoScroll.x -= item.hierarchy.x - (item.hierarchy.viewPort.x - item.hierarchy.x);
                pointNoScroll.y -= item.hierarchy.y - (item.hierarchy.viewPort.y - item.hierarchy.y);

                if (item.items.length != 0 && item.expandCollapseEnabled != false && item.hierarchy.showExpandCollapseButtons) {

                    var levelDepthPadding = 0;
                    if (!item.hierarchy.isColumnsHierarchy && item.hierarchy.compactStyleRenderingEnabled)
                        levelDepthPadding = 24 * item.itemLevel;

                    // check if the click is over the button
                    if (pointNoScroll.x > item.x + 9 + levelDepthPadding && pointNoScroll.x < item.x + 20 + levelDepthPadding &&
                        pointNoScroll.y > item.y + 9 && pointNoScroll.y < item.y + 20) {
                        out.isOnItemButton = true;
                    }
                }

                var displayBounds = { x: item.x, y: item.y, width: item.getDisplayWidth(), height: item.getDisplayHeight() };
                var menuRect = { x: item.x + displayBounds.width - 16, y: item.y, width: 16, height: displayBounds.height };
                if (this.isPtInRect(pointNoScroll, menuRect) && item.hierarchy.sortable)
                    out.isOnMenuButton = true;

            }

            return item;
        },

        _raisePivotCellMouseEvent: function (pivotRow, pivotColumn, eventName, mousebutton) {
            var event = new $.Event(eventName);
            event.owner = this;
            event.args = { pivotRow: pivotRow, pivotColumn: pivotColumn, mousebutton: mousebutton, cancel: false };

            var host = this.host;
            host.trigger(event);

            if (event.args.cancel)
                return true;

            return false;
        },

        _raisePivotItemMouseEvent: function (hierarchyItem, eventName, mousebutton) {
            var event = new $.Event(eventName);
            event.owner = this;
            event.args = { pivotItem: hierarchyItem, mousebutton: mousebutton, cancel: false };

            var host = this.host;
            host.trigger(event);

            if (event.args.cancel)
                return true;

            return false;
        },

        ////////////////// DRAG-DROP ///////////////////////
        _beginDrag: function (item) {
        },

        _endDrag: function (item) {
        },

        _canDrop: function (item) {
        },
        /////////////// END DRAG-DROP //////////////////////


        //////////////////// RESIZING //////////////////////
        _doResize: function (point) {
            if (!(this.resizingItem != null && this.resizingItem.hierarchy.resizable))
                return;

            if (this._pivotColumns.isGroupingColumn(this.resizingItem))
                return;

            if (this.isHorizontalResize)
                this._updateCursor('COLUMN_RESIZE');
            else
                this._updateCursor('ROW_RESIZE');

            this._focusedItem = this.resizingItem;

            var pt = {
                x: this.resizingItem.x + 2 * this.resizingItem.hierarchy.x - this.resizingItem.hierarchy.viewPort.x,
                y: this.resizingItem.y + 2 * this.resizingItem.hierarchy.y - this.resizingItem.hierarchy.viewPort.y
            };

            var updateBounds = false;
            var hierarchy = this.resizingItem.hierarchy;

            var resizeLine = $('body').find('#' + this._resizeLineId);

            if (this.isHorizontalResize) {
                var newWidth = point.x - pt.x;

                if (newWidth < this.resizingItem.minimumWidth)
                    return;

                var linePos = { x: point.x + this._rect.x, y: this._pivotRows.y + this._rect.y };

                resizeLine.css({ 'border-right': '1px dotted #555', 'border-bottom': '', width: '1px', height: this._pivotCells.viewPort.height, top: linePos.y, left: linePos.x, display: 'block' });

                if (newWidth >= this.resizingItem.minimumWidth &&
                    newWidth <= this.resizingItem.maximumWidth) {
                    if (this.resizeTooltipEnabled) {
                        this._resizeTooltip.Content = "width: " + newWidth + " pixels";
                    }

                    updateBounds = true;
                }

            }
            else {
                var newHeight = point.y - pt.y;
                if (newHeight < this.resizingItem.minimumHeight)
                    return;

                var linePos = { x: this._pivotColumns.x + this._rect.x, y: point.y + this._rect.y };

                resizeLine.css({ 'border-bottom': '1px dotted #555', 'border-right': '', height: '1px', width: this._pivotCells.viewPort.width, left: linePos.x, top: linePos.y, display: 'block', zIndex: 50000 });

                if (newHeight >= this.resizingItem.minimumHeight &&
                    newHeight <= this.resizingItem.maximumHeight) {
                    if (this.resizeTooltipEnabled) {
                        this._resizeTooltip.Content = "height: " + newHeight + " pixels";
                    }

                    updateBounds = true;
                }
            }

            if (updateBounds) {
                if (this.resizeTooltipEnabled) {
                    if (this._resizeTooltip.visibility != visibility.visible)
                        this._resizeTooltip.visibility = visibility.visible;

                    _resizeTooltip.setValue(Canvas.LeftProperty, point.x);
                    _resizeTooltip.setValue(Canvas.TopProperty, point.y);

                    _resizeTooltip.setValue(Canvas.ZIndexProperty, 10002);
                }
            }
        }, // _doResize

        /////////////////END OF RESIZING ///////////////////

        //////////////// SELECTION ////////////////////////
        _internalClearSelection: function () {
            this._pivotColumns._internalClearSelection();
            this._pivotRows._internalClearSelection();
            this._pivotCells._internalClearSelection();
        },

        _beginSelectionUpdate: function () {
            if (this._isCTRLPressed && this.multipleSelectionEnabled)
                return;

            this._pivotCells._beginSelectionUpdate();
            this._pivotColumns._beginSelectionUpdate();
            this._pivotRows._beginSelectionUpdate();
        },

        _endSelectionUpdate: function () {
            this._pivotColumns._endSelectionUpdate();
            this._pivotRows._endSelectionUpdate();
            this._pivotCells._endSelectionUpdate();
        },

        _updateSelection: function () {
            if (!this.selectionEnabled)
                return;

            this._colItemRangeSelectionBeg = null;
            this._rowItemRangeSelectionBeg = null;

            this._beginSelectionUpdate();

            var selectionClearedAtStart = false;
            if (!this._isCTRLPressed || false == this.multipleSelectionEnabled) {
                this._internalClearSelection();
                selectionClearedAtStart = true;
            }

            if (this.activeEditor.Editor != null) {
                this._internalClearSelection();
                this._endSelectionUpdate();
                return;
            }

            var colBeg = -1;
            var rowBeg = -1;

            var selectStartPositionAdj = { x: this._selectStartPosition.x, y: this._selectStartPosition.y };
            selectStartPositionAdj.y -= this._offsetY;
            selectStartPositionAdj.x -= this._offsetX;

            var out = { isOnItemButton: false };
            var hitItem = this._itemHitTest(this._selectStartPosition, out);
            if (hitItem != null) {
                if (!(!hitItem.isColumn && this._pivotRows.compactStyleRenderingEnabled))
                    hitItem = hitItem._getFirstVisibleLeaf(hitItem);

                if (hitItem.isColumn) {
                    if (this.selectionMode == 'FULL_ROW_SELECT') {
                        this._internalSelectMode = 'NO_SELECT';
                        this._endSelectionUpdate();
                        return;
                    }
                    else {
                        this._internalSelectMode = 'COL_SELECT';
                    }

                    this._colItemRangeSelectionBeg = hitItem;
                }
                else {
                    if (this.selectionMode == 'FULL_COLUMN_SELECT') {
                        this._internalSelectMode = 'NO_SELECT';
                        this._endSelectionUpdate();
                        this._internalRefresh();
                        return;
                    }
                    else {
                        this._internalSelectMode = 'ROW_SELECT';
                    }

                    this._rowItemRangeSelectionBeg = hitItem;
                }
            }
            else {
                var hitInfo = this._pivotCells._hitTest(this._selectStartPosition);
                if (hitInfo) {
                    this._internalSelectMode = 'CELLS_SELECT';

                    // override the internal selection mode based on user's preferences
                    if (this.selectionMode == 'FULL_ROW_SELECT')
                        this._internalSelectMode = 'ROW_SELECT';
                    else if (this._SelectionMode == 'FULL_COLUMN_SELECT')
                        this._internalSelectMode = 'COL_SELECT';

                }
                else {
                    this._internalSelectMode = 'NO_SELECT';
                    this._endSelectionUpdate();
                    this._internalRefresh();
                    return;
                }
            }

            var currentPositionAdj = { x: this._currentPosition.x, y: this._currentPosition.y };
            if (this._internalSelectMode == 'COL_SELECT') {
                if (currentPositionAdj.y >= this._pivotColumns.y + this._pivotColumns.getHeight())
                    currentPositionAdj.y = this._pivotColumns.y + this._pivotColumns.getHeight() - 1;

                if (currentPositionAdj.y <= this._pivotColumns.y)
                    currentPositionAdj.y = this._selectStartPosition.y;

                if (currentPositionAdj.x <= this._pivotColumns.x)
                    currentPositionAdj.x = this._pivotColumns.x + 1;

                if (currentPositionAdj.x >= this._pivotColumns.x + this._pivotColumns.getWidth())
                    currentPositionAdj.x = this._pivotColumns.x + this._pivotColumns.getWidth() - 1;
            }
            else if (this._internalSelectMode == 'ROW_SELECT') {
                if (currentPositionAdj.y >= this._pivotRows.y + this._pivotRows.getHeight())
                    currentPositionAdj.y = this._pivotRows.y + this._pivotRows.getHeight() - 1;

                if (currentPositionAdj.y <= this._pivotRows.y)
                    currentPositionAdj.y = this._pivotRows.y + 1;

                if (currentPositionAdj.x <= this._pivotRows.x)
                    currentPositionAdj.x = this._pivotRows.x + this._pivotRows.getWidth() - 1;

                if (currentPositionAdj.x >= this._pivotRows.x + this._pivotRows.getWidth())
                    currentPositionAdj.x = this._pivotRows.x + this._pivotRows.getWidth() - 1;
            }
            else if (this._internalSelectMode == 'CELLS_SELECT') {
                if (currentPositionAdj.x < this._pivotColumns.x)
                    currentPositionAdj.x = this._pivotColumns.x + 1;

                if (currentPositionAdj.y < this._pivotRows.y)
                    currentPositionAdj.y = this._pivotRows.y + 1;
            }

            this._colItemRangeSelectionEnd = null;
            this._rowItemRangeSelectionEnd = null;
            var colEnd = -1;
            var rowEnd = -1;

            if (this._internalSelectMode == 'COL_SELECT' || this._internalSelectMode == 'ROW_SELECT') {
                if (hitItem != null) {
                    var hitInfo = {};
                    var itemEnd = this._itemHitTest(currentPositionAdj, hitInfo);
                    if (null == itemEnd) {
                        this._endSelectionUpdate();
                        return;
                    }

                    if (!(!itemEnd.isColumn && this._pivotRows.compactStyleRenderingEnabled))
                        itemEnd = itemEnd._getLastVisibleLeaf(itemEnd);

                    if (itemEnd.isColumn)
                        this._colItemRangeSelectionEnd = itemEnd;
                    else
                        this._rowItemRangeSelectionEnd = itemEnd;
                }
                else {
                    //var cellEnd = this._pivotCells.hitTest(currentPositionAdj);
                    this._pivotCells.hitTest(currentPositionAdj, hitInfo);
                    if (hitInfo != null) {
                        this._colItemRangeSelectionEnd = hitInfo.pivotColumn;
                        this._rowItemRangeSelectionEnd = hitInfo.pivotRow;
                    }
                    else {
                        this._colItemRangeSelectionEnd = null;
                        this._rowItemRangeSelectionEnd = null;
                    }
                }
            }

            if (this._internalSelectMode == 'CELLS_SELECT') {
                var hitInfo = this._pivotCells._hitTest(this._selectStartPosition);

                this._colItemRangeSelectionBeg = hitInfo.pivotColumn;
                this._rowItemRangeSelectionBeg = hitInfo.pivotRow;
                if (!hitInfo) // no start point -- return w/o selecting
                {
                    this._endSelectionUpdate();
                    this._internalRefresh();
                    return;
                }

                if (selectStartPositionAdj.x != currentPositionAdj.x ||
                    selectStartPositionAdj.y != currentPositionAdj.y) {
                    this._pivotCells.hitTest(currentPositionAdj, hitInfo);
                    this._colItemRangeSelectionEnd = hitInfo.pivotColumn;
                    this._rowItemRangeSelectionEnd = hitInfo.pivotRow;
                }

                if (!hitInfo.pivotRow || !hitInfo.pivotColumn) // only a single cell should be selected
                {
                    this._internalSelectMode = 'CELLS_SELECT'

                    this._pivotCells._internalSelectCell(this._rowItemRangeSelectionBeg, this._colItemRangeSelectionBeg);

                    this._cellKBRangeSelectionStart = this._cellKBRangeSelectionEnd = { pivotRow: this._rowItemRangeSelectionBeg, pivotColumn: this._colItemRangeSelectionBeg, pivotCells: this._pivotCells };

                    this._endSelectionUpdate();
                    this._internalRefresh();
                    return;
                }
            }

            this._saveSelectedItemsRangeOrder();
            this._adjustSelectedItemsOrder(selectionClearedAtStart);

            // if we have multiple selection within the text data filed area
            if (this._internalSelectMode == 'CELLS_SELECT') {
                // Get the start and end rows and columns
                var visibleRowItems = this._pivotRows._getVisibleLeafLevelItems();
                var visibleColItems = this._pivotColumns._getVisibleLeafLevelItems();

                var rowBeg = this._pivotRows._pointToLeafItemIndexAbsolute(this._selectStartPosition);
                var rowEnd = this._pivotRows._pointToLeafItemIndexAbsolute(currentPositionAdj);
                var colBeg = this._pivotColumns._pointToLeafItemIndexAbsolute(this._selectStartPosition);
                var colEnd = this._pivotColumns._pointToLeafItemIndexAbsolute(currentPositionAdj);

                if ((colBeg == -1 && colEnd == -1) || (rowBeg == -1 && rowEnd == -1)) {
                    this._endSelectionUpdate();
                    this._internalRefresh();
                    return;
                }

                if (colBeg == -1)
                    colBeg = colEnd;

                if (colEnd == -1)
                    colEnd = colBeg;

                if (rowBeg == -1)
                    rowBeg = rowEnd;

                if (rowEnd == -1)
                    rowEnd = rowBeg;

                if (colEnd < colBeg) {
                    var tmp = colBeg;
                    colBeg = colEnd;
                    colEnd = tmp;
                }

                if (rowEnd < rowBeg) {
                    var tmp = rowBeg;
                    rowBeg = rowEnd;
                    rowEnd = tmp;
                }

                for (var r = rowBeg; r <= rowEnd && r < visibleRowItems.length; r++) {
                    var pivotRow = visibleRowItems[r];

                    for (var c = colBeg; c <= colEnd && c < visibleColItems.length; c++) {
                        var colItem = visibleColItems[c];

                        this._pivotCells._internalSelectCell(pivotRow, colItem);

                        // if (colItem == this._colItemRangeSelectionEnd)
                        //     break;
                    }

                    // if (pivotRow == this._rowItemRangeSelectionEnd)
                    //     break;

                }

                this._cellKBRangeSelectionStart = { pivotRow: this._rowItemRangeSelectionBeg, pivotColumn: this._colItemRangeSelectionBeg, pivotCells: this._pivotCells };
                this._cellKBRangeSelectionEnd = { pivotRow: this._rowItemRangeSelectionEnd, pivotColumn: this._colItemRangeSelectionEnd, pivotCells: this._pivotCells };

                this._endSelectionUpdate();
                this._internalRefresh();
                return;
            }

            this._restoreSelectedItemsRangeOrder();

            // if we have a multiple selection by dragging over the headers
            this._applyItemsMultiSelect(selectionClearedAtStart);

            this._endSelectionUpdate();
            this._internalRefresh();
        },

        _saveSelectedItemsRangeOrder: function () {
            this._adjSelectedItemsSave.colBeg = this._colItemRangeSelectionBeg;
            this._adjSelectedItemsSave.colEnd = this._colItemRangeSelectionEnd;
            this._adjSelectedItemsSave.rowBeg = this._rowItemRangeSelectionBeg;
            this._adjSelectedItemsSave.rowEnd = this._rowItemRangeSelectionEnd;
        },

        _restoreSelectedItemsRangeOrder: function () {
            this._colItemRangeSelectionBeg = this._adjSelectedItemsSave.colBeg;
            this._colItemRangeSelectionEnd = this._adjSelectedItemsSave.colEnd;
            this._rowItemRangeSelectionBeg = this._adjSelectedItemsSave.rowBeg;
            this._rowItemRangeSelectionEnd = this._adjSelectedItemsSave.rowEnd;
        },

        _adjustSelectedItemsOrder: function (selectionClearedAtStart) {
            if (this._colItemRangeSelectionBeg != null && this._colItemRangeSelectionEnd != null && this._colItemRangeSelectionBeg.x > this._colItemRangeSelectionEnd.x) {
                var tmp = this._colItemRangeSelectionBeg;
                this._colItemRangeSelectionBeg = this._colItemRangeSelectionEnd;
                this._colItemRangeSelectionEnd = tmp;
            }
            if (this._rowItemRangeSelectionBeg != null && this._rowItemRangeSelectionEnd != null && this._rowItemRangeSelectionBeg.y > this._rowItemRangeSelectionEnd.y) {
                var tmp = this._rowItemRangeSelectionBeg;
                this._rowItemRangeSelectionBeg = this._rowItemRangeSelectionEnd;
                this._rowItemRangeSelectionEnd = tmp;
            }

            if ((false == this.multipleSelectionEnabled && !selectionClearedAtStart) || this._rowItemRangeSelectionEnd == null) {
                this._rowItemRangeSelectionEnd = this._rowItemRangeSelectionBeg;
            }

            if ((false == this.multipleSelectionEnabled && !selectionClearedAtStart) || this._colItemRangeSelectionEnd == null) {
                this._colItemRangeSelectionEnd = this._colItemRangeSelectionBeg;
            }
        },

        _applyItemsMultiSelect: function (selectionClearedAtStart) {
            this._saveSelectedItemsRangeOrder();
            this._adjustSelectedItemsOrder(selectionClearedAtStart);

            for (var i = 0; i < 2; i++) {
                if (this._internalSelectMode == 'COL_SELECT' && i != 0)
                    continue;

                if (this._internalSelectMode == 'ROW_SELECT' && i != 1)
                    continue;

                var ItemStart = i == 0 ? this._colItemRangeSelectionBeg : this._rowItemRangeSelectionBeg;
                var ItemStop = i == 0 ? this._colItemRangeSelectionEnd : this._rowItemRangeSelectionEnd;

                var h = (i == 0) ? this._pivotColumns : this._pivotRows;

                var arr = h._getVisibleLeafLevelItems();
                if (arr == null) {
                    this._internalRefresh();
                    this._restoreSelectedItemsRangeOrder();
                    return;
                }

                var selectStart = false;
                for (var j in arr) {
                    var item = arr[j];
                    if (item != ItemStart && !selectStart)
                        continue;

                    if (item.getWidthWithChildren() + item.x > this._mostRightItemBounds.x + this._mostRightItemBounds.width) {
                        this._mostRightItemBounds = {
                            x: item.x, y: item.y,
                            width: item.getWidthWithChildren(), height: item.getHeightWithChildren()
                        };
                    }

                    if (item.getWidthWithChildren() + item.x < this._mostLeftItemBounds.x + this._mostLeftItemBounds.width) {
                        this._mostLeftItemBounds = {
                            x: item.x, y: item.y,
                            width: item.getWidthWithChildren(), height: item.getHeightWithChildren()
                        };
                    }

                    selectStart = true;

                    h._internalSelectItem(item);

                    if (item == ItemStop) {
                        break;
                    }
                }

                if (h.isColumnsHierarchy || !h.compactStyleRenderingEnabled)
                    h._applySelectionToParentItems();
            }

            this._restoreSelectedItemsRangeOrder();
        },
        ///////////////// END OF SELECTION ///////////////////

        //////////////// Localization ////////////////////////
        localizeStrings: function (localizationObj, refresh) {
            var self = this;

            if ($.jqx.dataFormat) {
                $.jqx.dataFormat.cleardatescache();
            }

            self._localizedStrings =
            {
                'decimalseparator': '.',
                'thousandsseparator': ',',
                'sortascendingstring': 'Sort Ascending',
                'sortdescendingstring': 'Sort Descending',
                'sortremovestring': 'Remove Sort',
                'alignment': 'Text alignment',
                'cellalignment': 'Number alignment',
                'numberformat': 'Number format',
                'prefix': 'Number prefix',
                'decimalplacestext': 'Decimal places',
                'thousandsseparatortext': 'Thousands separator',
                'decimalseparatortext': 'Decimal separator',
                'nagativebracketstext': 'Nagatives in brackets',
                'fieldsettings': 'Field settings',
                'ok': 'Ok',
                'cancel': 'Cancel'
            };

            var locLowerCaseObj = $.extend({}, localizationObj);
            self._localizedStrings = $.extend(self._localizedStrings, locLowerCaseObj);

            for (var obj in locLowerCaseObj) {
                if (obj && obj.toLowerCase() !== obj) {
                    locLowerCaseObj[obj.toLowerCase()] = locLowerCaseObj[obj];
                }
            }

            // assign to localizedStrings if set
            for (var key in self._localizedStrings) {
                if (locLowerCaseObj[key] !== undefined) {
                    self._localizedStrings[key] = locLowerCaseObj[key];
                }
            }
        },

    });

})(jqxBaseFramework);
/////////////////// End of jqxPivotGrid ////////////////////////

/////////////////// propertyBags //.////////////////////////////
$.jqx.jqxPivotGrid = $.jqx.jqxPivotGrid || {};
$.jqx.define($.jqx.jqxPivotGrid, 'propertyBag', '');

$.extend($.jqx.jqxPivotGrid.propertyBag.prototype, {
    defineInstance: function () {
        this.namedPropertyTables = {};
        this._tableSizes = {};
        this.enablePropertyChangeNotifications = false;
    },

    getPropertyTable: function (name) {
        if (undefined == this.namedPropertyTables[name]) {
            this.namedPropertyTables[name] = {};
            this._tableSizes[name] = 0;
        }

        return this.namedPropertyTables[name];
    },

    getPropertyCount: function (name) {
        var properyTable = this.getPropertyTable(name);
        if (null == properyTable)
            return 0;

        return this._tableSizes[name];
    },

    getPropertyValue: function (name, key) {
        var properyTable = this.getPropertyTable(name);
        if (null == properyTable)
            return null;

        if (properyTable[key] != undefined)
            return properyTable[key];

        return null;
    },

    containsPropertyValue: function (name, key) {
        var properyTable = this.getPropertyTable(name);
        if (null == properyTable)
            return false;

        return properyTable[key] != undefined;
    },

    removePropertyValue: function (name, key) {
        var properyTable = this.getPropertyTable(name);
        if (null == properyTable)
            return;

        delete properyTable[key];

        this._tableSizes[name]--;
    },

    setPropertyValue: function (name, key, value) {
        var properyTable = this.getPropertyTable(name);
        if (null == properyTable)
            return;

        if (value == null || value == undefined) {
            if (properyTable[key]) {
                this._tableSizes[name]--;
                delete properyTable[key];
            }
        }
        else {
            if (!properyTable[key])
                this._tableSizes[name]++;

            properyTable[key] = value;
        }

        if (this.enablePropertyChangeNotifications)
            this.onPropertyChanged(name);
    },

    clear: function (name) {
        if (name == '' || name == null || name == undefined) {
            this.namedPropertyTables = {};
            return;
        }

        var properyTable = this.getPropertyTable(name);
        properyTable = {};

        this._tableSizes[name] = 0;
    },

    onPropertyChanged: function (propertyName) {
        $.event.trigger('propertychanged', propertyName);
    }
});
/////////////////  End of propertyBags /////////////////////

// PivotCells
(function ($) {

    ///////////////////////////////////////////////////
    //////////////// HIERARCHIES //////////////////////
    $.jqx.jqxPivotGrid = $.jqx.jqxPivotGrid || {};
    $.jqx.define($.jqx.jqxPivotGrid, 'pivotCells', '');

    $.extend($.jqx.jqxPivotGrid.pivotCells.prototype, {

        //////////////// pivotCells //////////////////////
        defineInstance: function () {
            this.parentPivotGrid = null;
            this.IsDataBoundPivotCellsEditable = false;
            this.cellProperties = new $.jqx.jqxPivotGrid.propertyBag();

            this.hashCellAutoSize = {};
            this.hashCellInSpan = {};
            this.hashCellSpan = {};

            this._selectedCells = new Object();
        },

        hitTest: function (point) {
            var hitInfo = this._hitTest(point);
            if (!hitInfo)
                return undefined;

            var cell = { pivotRow: hitInfo.pivotRow, pivotColumn: hitInfo.pivotColumn, pivotCells: this };

            return cell;
        },

        _hitTest: function (point) {
            var hitInfo = {};

            hitInfo.pivotColumn = this.parentPivotGrid._pivotColumns._pointToLeafItemAbsolute(point);
            hitInfo.pivotRow = this.parentPivotGrid._pivotRows._pointToLeafItemAbsolute(point);

            if (this.parentPivotGrid._pivotColumns.isGroupingColumn(hitInfo.pivotColumn))
                return undefined;

            //hitInfo.ColumnIndex = hitInfo.pivotColumn != null ? hitInfo.pivotColumn.ItemIndex : -1;
            //hitInfo.RowIndex = hitInfo.pivotRow != null ? hitInfo.pivotRow.ItemIndex : -1;

            if (hitInfo.pivotColumn == null || hitInfo.pivotRow == null)
                return undefined;

            return hitInfo;
        }, // hitTest

        clear: function () {
            this._reset();
        },

        _reset: function () {
            this.cellProperties.clear();

            this._selectedCells = new Object();

            this.hashCellAutoSize = {};
            this.hashCellInSpan = {};
            this.hashCellSpan = {};

            this._clearElementsAndCellsCache();
        },

        _resetCanvas: function () {
            var canvas = $.jqx.get(this, 'renderCanvas');
            if (!canvas)
                return;

            while (canvas.hasChildNodes()) {
                canvas.removeChild(canvas.firstChild);
            }
        },

        _clearElementsAndCellsCache: function () {
            this._clearCellsCache();
        },

        setCellValue: function (pivotRow, pivotColumn, value) {
            if (pivotRow == null || pivotColumn == null)
                return;

            var cellId = this.parentPivotGrid.getCellId(pivotColumn, pivotRow);

            var cellDS = this.getCellDataSource(pivotRow, pivotColumn);

            var isBound = pivotRow.BoundFieldIndex != -1 && pivotColumn.BoundFieldIndex != -1;

            var isCanceled = false;

            if (dsType == 'DataBound' && isBound) {
                // Raise the GridCellValueChanging event
                isCanceled = this.parentPivotGrid.OnCellValueChanging(pivotRow, pivotColumn, value);
                if (isCanceled)
                    return;

                try {
                    this.parentPivotGrid.setCellValueFromDataSourceNonPivot(pivotRow, pivotColumn, value);
                }
                catch (e) {
                    return;
                }

                // Invalidate the cached value
                this.cellProperties.setPropertyValue("CellValue", cellId, null);

                // Raise the GridCellValueChanged event
                this.parentPivotGrid.OnCellValueChanged(pivotRow, pivotColumn);

                return;
            }
            else if (dsType == 'DataBoundPivot') {
                if (!this.IsDataBoundPivotCellsEditable) {
                    throw "The cell's value is derived from the data source and aggregated. It is not editable in this mode. Use the SetCellDataSource method to change the cell's data source first";
                }
                else
                    return;
            }

            // Raise the GridCellValueChanging event
            var isCanceled = this.parentPivotGrid.OnCellValueChanging(pivotRow, pivotColumn, value);
            if (isCanceled)
                return;

            this.SetCellDataSource(pivotRow, pivotColumn, 'Static');

            this.cellProperties.setPropertyValue("CellValue", cellId, value);
            this.onPropertyChanged("CellValue");

            // Raise the GridCellValueChanged event
            this.parentPivotGrid.OnCellValueChanged(pivotRow, pivotColumn);
        },

        _clearCellsCache: function () {
            this.cellProperties.clear("CellValue");
        },

        _clearCachedCell: function (pivotRow, pivotColumn) {
            var cellId = this.parentPivotGrid.getCellId(pivotColumn, pivotRow);
            if (this.cellProperties.containsPropertyValue("CellValue", cellId)) {
                this.cellProperties.removePropertyValue("CellValue", cellId);
            }
        },

        drillThroughCell: function (pivotRow, pivotColumn) {
            if (!pivotRow || pivotRow.isColumn)
                throw 'Invalid pivotRow parameter';

            if (!pivotColumn || !pivotColumn.isColumn)
                throw 'Invalid pivotColumn parameter';

            return this.parentPivotGrid.source.drillThroughPivotCell(pivotRow.adapterItem, pivotColumn.adapterItem);
        },

        getCellValue: function (pivotRow, pivotColumn) {
            var cellValue = null;

            if (this.parentPivotGrid._pivotColumns.isGroupingColumn(pivotColumn))
                return null;

            var cellId = this.parentPivotGrid.getCellId(pivotColumn, pivotRow);

            // Get the Cell's DataSource type
            var cellDataSourceType = this.getCellDataSource(pivotRow, pivotColumn);

            if (pivotRow.isTotal || pivotColumn.isTotal)
                cellDataSourceType = 'Virtual';

            switch (cellDataSourceType) {
                case 'Virtual':
                    {
                        cellValue = this.parentPivotGrid.onCellValueNeeded(pivotRow, pivotColumn);
                        this.cellProperties.setDirty(cellId);
                        if (cellValue == null && this.parentPivotGrid.bindingState == 'BoundPivot' && (pivotRow.isTotal || pivotColumn.isTotal)) {
                            cellValue = this.parentPivotGrid.getCellValueFromDataSource(pivotRow, pivotColumn);
                        }
                    } break;
                case 'DataBoundPivot':
                    {
                        cellValue = this.cellProperties.getPropertyValue("CellValue", cellId);
                        if (cellValue == null) {
                            cellValue = this.parentPivotGrid.source.getCellValue(pivotRow.adapterItem, pivotColumn.adapterItem);

                            if (this.cellProperties.getPropertyCount("CellValue") < 4000000)
                                this.cellProperties.setPropertyValue("CellValue", cellId, cellValue);
                        }
                    } break;
                case 'DataBound':
                    {
                        cellValue = this.cellProperties.getPropertyValue("CellValue", cellId);
                        if (cellValue == null) {
                            try {
                                cellValue = this.parentPivotGrid.getCellValueFromDataSourceNonPivot(pivotRow, pivotColumn);
                            }
                            catch (e) {
                                return null;
                            }

                            if (this.cellProperties.getPropertyCount("CellValue") < 4000000)
                                this.cellProperties.setPropertyValue("CellValue", cellId, cellValue);
                        }
                    } break;

                case 'NotSet':
                case 'Static':
                default:
                    {
                        cellValue = this.cellProperties.getPropertyValue("CellValue", cellId);
                    } break;
            }

            return cellValue;
        },

        /////////////////// CELL PROPERTIES ///////////////////////
        setCellDataSource: function (pivotRow, pivotColumn, cellDataSource) {
            if (pivotRow == null || pivotColumn == null)
                return;

            var id = this.parentPivotGrid.getCellId(pivotColumn, pivotRow);
            this.cellProperties.setPropertyValue("cellDataSource", id, cellDataSource);
        },

        getCellDataSource: function (pivotRow, pivotColumn) {
            var id = this.parentPivotGrid.getCellId(pivotColumn, pivotRow);
            var dataSource = this.cellProperties.getPropertyValue("cellDataSource", id);
            if (null == dataSource)
                dataSource = pivotColumn.cellDataSource;
            if (dataSource == null || dataSource == 'NotSet')
                dataSource = pivotRow.cellDataSource;

            if (dataSource != null && dataSource != 'NotSet')
                return dataSource;

            if (this.parentPivotGrid.UseVirtualCellsByDefault)
                return 'Virtual';

            if (this.parentPivotGrid.bindingState == 'DataBound' || this.parentPivotGrid.bindingState == 'DataBoundPivot')
                return this.parentPivotGrid.bindingState;

            return 'NotSet';
        },
        ///////////////END OF CELL PROPERTIES /////////////////////


        render: function () {
            var canvas = this.renderCanvas;
            if (!canvas)
                return;
            var dataGrid = this.parentPivotGrid;
            dataGrid.setElementPosition(canvas, -this.parentPivotGrid._offsetX, -this.parentPivotGrid._offsetY);

            var pivotRows = dataGrid._pivotRows;
            var pivotColumns = dataGrid._pivotColumns;

            if (!this._refreshRequired && (!pivotRows._isVirtualMode && !pivotColumns._isVirtualMode))
                return;

            var rows = pivotRows._getLeafItemsToRender();
            var columns = pivotColumns._getLeafItemsToRender();

            this._cellElements = this._cellElements || {};

            var arr = new Array();
            var t = new Date();

            var rowsRange = { first: pivotRows._isVirtualMode ? rows.first : 0, last: pivotRows._isVirtualMode ? rows.last : rows.items.length - 1 };
            var columnsRange = { first: pivotColumns._isVirtualMode ? columns.first : 0, last: pivotColumns._isVirtualMode ? columns.last : columns.items.length - 1 };

            for (var r = rowsRange.last; r >= rowsRange.first; r--) {
                for (var c = columnsRange.last; c >= columnsRange.first; c--) {
                    if (r == -1 || c == -1)
                        continue;

                    var row = rows.items[r];
                    var column = columns.items[c];

                    var cellId = dataGrid.getCellId(column, row);

                    var w = column.getDisplayWidth() - 1;
                    var h = row.getDisplayHeight() - 1;

                    var isCellSelected = this.isCellSelected(row, column);

                    var cachedElement = this._cellElements[cellId];
                    var element = undefined;

                    if (cachedElement && cachedElement.isSelected == isCellSelected)
                        element = cachedElement.element;

                    var padding = { left: 4, top: 4, right: 4, bottom: 4 };

                    var value = this.getCellValue(row, column);
                    var cellContent = "";

                    if (!element) {
                        element = dataGrid.createDiv(canvas, cellContent, w, h);
                        element.cellId = cellId;
                        this._cellElements[cellId] = { element: element, isSelected: isCellSelected };

                        dataGrid.setElementSize(element, w, h);

                        var align = 'right';

                        if (dataGrid.cellsRenderer && $.isFunction(dataGrid.cellsRenderer)) {
                            cellContent = dataGrid.cellsRenderer({ value: value.value, formattedValue: value.formattedValue, isSelected: isCellSelected, pivotRow: row, pivotColumn: column });
                            padding = { left: 0, top: 0, right: 0, bottom: 0 };
                        }
                        else {
                            cellContent = (value !== undefined && value.formattedValue !== undefined) ? value.formattedValue.toString() : "";
                            var formatSettings = this.parentPivotGrid.source.getCellFormatSettings(row.adapterItem, column.adapterItem);
                            if (formatSettings)
                                align = formatSettings.align || 'right';
                        }

                        this.parentPivotGrid.setDivContent(element, cellContent, padding, align);
                        element.originalY = element.style.top;
                        element.className = this.parentPivotGrid.toThemeProperty('jqx-grid-cell-normal');
                    }
                    else {
                        if (element.style.width != w + 'px' || element.style.height != h + 'px')
                            this.parentPivotGrid.setElementSize(element, w, h);
                    }

                    element.tRender = t;

                    if (element.style.display != 'block')
                        element.style.display = 'block';

                    if (element.style.left != column.x + 'px' || element.style.top != row.y + 'px')
                        this.parentPivotGrid.setElementPosition(element, column.x, row.y);

                    var cssOverrideKey = 'cellsClassName';
                    if (this.isCellSelected(row, column)) {
                        element.className = this.parentPivotGrid.toThemeProperty('jqx-grid-cell-selected jqx-fill-state-hover jqx-widget-content');
                        cssOverrideKey = 'cellsClassNameSelected';
                    }
                    else {
                        element.className = this.parentPivotGrid.toThemeProperty('jqx-grid-cell-normal jqx-widget-content');
                    }

                    var cssOverride = $.jqx.getByPriority([
                        row[cssOverrideKey],
                        (row.adapterItem && row.adapterItem.boundField) ? row.adapterItem.boundField[cssOverrideKey] : undefined,
                        column[cssOverrideKey],
                        (column.adapterItem && column.adapterItem.boundField) ? column.adapterItem.boundField[cssOverrideKey] : undefined
                    ]);

                    if (cssOverride)
                        element.className += ' ' + cssOverride;

                    element.className += ' ' + 'jqx-pivotgrid-content-wrapper';
                }
            }

            // garbage collect stale elements
            for (var i = 0; i < canvas.childNodes.length; i++) {
                if (canvas.childNodes[i].cellId &&
                    canvas.childNodes[i].tRender != t) {
                    arr.push(canvas.childNodes[i]);
                }
            }

            while (true) {
                var element = arr.pop();
                if (!element)
                    break;
                else {
                    delete this._cellElements[element.cellId];
                    element.style.display = 'none';
                    canvas.removeChild(element);
                }
            }
            // end of garbage collection

            this._refreshRequired = false;
        }, // render
        ////////////// END STUBS ////////////////


        ////////////// CELLS SELECTION ////////////////
        _beginSelectionUpdate: function () {
            for (var i in this._selectedCells)
                this._selectedCells[i].OldIsSelected = this._selectedCells[i].isSelected;
        },

        _endSelectionUpdate: function () {
            var keysToDelete = new Array();

            for (var i in this._selectedCells) {
                var cellSelection = this._selectedCells[i];

                if (!cellSelection.isSelected)
                    keysToDelete.push(i);

                if (cellSelection.isSelected != cellSelection.OldIsSelected) {
                    // TODO: Raise event
                    //this.parentPivotGrid.OnCellSelectionChanged(cellSelection.pivotRow, cellSelection.pivotColumn);
                }
            }

            if (keysToDelete.length > 0) {
                for (var i in keysToDelete) {
                    delete this._selectedCells[keysToDelete[i]];
                }
            }
        },

        _internalClearSelection: function () {
            for (var i in this._selectedCells)
                this._internalUnselectCell(this._selectedCells[i].pivotRow, this._selectedCells[i].pivotColumn);
        },

        clearSelection: function () {
            this._beginSelectionUpdate();
            this._internalClearSelection();
            this._endSelectionUpdate();
            this.render();
        },

        selectCell: function (pivotRow, pivotColumn) {
            if (!this.parentPivotGrid.selectionEnabled)
                return;

            this._beginSelectionUpdate();

            this._internalSelectCell(pivotRow, pivotColumn);

            this.parentPivotGrid._cellKBRangeSelectionStart = { pivotRow: pivotRow, pivotColumn: pivotColumn, pivotCells: this };
            this.parentPivotGrid._cellKBRangeSelectionEnd = { pivotRow: pivotRow, pivotColumn: pivotColumn, pivotCells: this };

            this._endSelectionUpdate();
        },

        _internalSelectCell: function (pivotRow, pivotColumn) {
            // disable selection for cells under grouping columns
            if (pivotColumn != null && this.parentPivotGrid._pivotColumns.isGroupingColumn(pivotColumn))
                return;

            if (this.parentPivotGrid._internalSelectMode == 'NO_SELECT') {
                switch (this.parentPivotGrid.selectionMode) {
                    case 'CELL_SELECT':
                        this.parentPivotGrid._internalSelectMode = 'CELLS_SELECT';
                        break;
                    case 'FULL_COLUMN_SELECT':
                        this.parentPivotGrid._internalSelectMode = 'COL_SELECT';
                        break;
                    case 'FULL_ROW_SELECT':
                        this.parentPivotGrid._internalSelectMode = 'ROW_SELECT';
                        break;
                }

            }

            var cellId = this.parentPivotGrid.getCellId(pivotColumn, pivotRow);

            delete this._cellElements[cellId];

            if (this._selectedCells[cellId] == undefined) {
                this._selectedCells[cellId] = { pivotRow: pivotRow, pivotColumn: pivotColumn, isSelected: true };
            }
            else {
                this._selectedCells[cellId].isSelected = true;
            }

            // set dirty flags
            this._refreshRequired = true;
        },

        unselectCell: function (pivotRow, pivotColumn) {
            this._beginSelectionUpdate();
            this._internalUnselectCell(pivotRow, pivotColumn);
            this._endSelectionUpdate();
        },

        _internalUnselectCell: function (pivotRow, pivotColumn) {
            var cellId = this.parentPivotGrid.getCellId(pivotColumn, pivotRow);

            if (this._selectedCells[cellId] != undefined) {
                this._selectedCells[cellId].isSelected = false;
            }

            delete this._cellElements[cellId];

            // set dirty flags
            this._refreshRequired = true;
        },

        isCellSelected: function (pivotRow, pivotColumn) {
            var cellId = this.parentPivotGrid.getCellId(pivotColumn, pivotRow);

            if (pivotColumn.isSelected || pivotRow.isSelected)
                return true;

            return this._selectedCells[cellId] != undefined && this._selectedCells[cellId].isSelected;
        },

        getSelectedCellsCount: function () {
            return this._selectedCells.length;
        },

        getSelectedCells: function () {
            var list = new Array();
            for (var i in this._selectedCells) {
                var cell = this._selectedCells[i];
                if (cell.isSelected)
                    list.push({ pivotRow: cell.pivotRow, pivotColumn: cell.pivotColumn, pivotCells: this });
            }

            return list;
        },
        ////////////// END OF CELLS SELECTION /////////

        getNextCell: function (cell, position) {

            var testPoint = {};
            switch (position) {
                case 'left':
                    testPoint = { x: cell.pivotColumn.x - 1, y: cell.pivotRow.y + 1 };
                    break;
                case 'right':
                    testPoint = { x: cell.pivotColumn.x + cell.pivotColumn.getWidth() + 1, y: cell.pivotRow.y + 1 };
                    break;
                case 'top':
                    testPoint = { x: cell.pivotColumn.x + 1, y: cell.pivotRow.y - 1 };
                    break;
                case 'bottom':
                    testPoint = { x: cell.pivotColumn.x + 1, y: cell.pivotRow.y + cell.pivotRow.getHeight() + 1 };
                    break;
            }

            var pointNoScroll = {
                x: testPoint.x + 2 * this.parentPivotGrid._pivotColumns.x - this.parentPivotGrid._pivotColumns.viewPort.x,
                y: testPoint.y + 2 * this.parentPivotGrid._pivotRows.y - this.parentPivotGrid._pivotRows.viewPort.y

            };

            var hitInfo = this._hitTest(pointNoScroll);
            if (!hitInfo)
                return undefined;

            return hitInfo;
        }
    });
})(jqxBaseFramework);
// End of PivotCells

// Pivot hierarchies
(function ($) {

    ///////////////////////////////////////////////////
    //////////////// HIERARCHIES //////////////////////
    $.jqx.jqxPivotGrid = $.jqx.jqxPivotGrid || {};

    //////////////// pivotItem //////////////////////
    $.jqx.jqxPivotGrid.pivotItem = function (parentItem, parentHierarchy) {
        this.text = "Item";

        this.isExpanded = false;
        this.expandCollapseEnabled = true;
        this.isHidden = false;
        this.isFiltered = false;
        this.isSelected = false;

        this._height = 26;
        this._width = 18;

        this.isDirty = true;

        this.parentItem = parentItem || null;
        this.hierarchy = parentHierarchy || parentItem.hierarchy;
        this.parentPivotGrid = this.hierarchy.parentPivotGrid;

        this.id = this.parentPivotGrid.genId();

        this.itemLevel = 0;
        this.itemColumn = 0;
        this._itemOrdinal = NaN;

        this.x = 0;
        this.y = 0;

        this.hierarchyItemWidth = 70;
        this.hierarchyItemHeight = 26;
        this.widthWithChildrenCached = 0;
        this.minimumWidth = 18;
        this.maximumWidth = 10000000;
        this.minimumHeight = 8;
        this.maximumHeight = Infinity;

        this.items = new Array();
        this.valueItems = new Array();
    };

    $.extend($.jqx.jqxPivotGrid.pivotItem.prototype, {
        _getChildItemsToRender: function (list) {
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                if (item.isHidden || item.isFiltered)
                    continue;

                list.push(item);

                if (item.isExpanded)
                    item._getChildItemsToRender(list);
            }
        },

        _calculateWidthWithChildren: function () {
            if (this.isHidden) {
                this.widthWithChildrenCached = 0;
                return;
            }

            var isTreeStyle = (!this.isColumn && this.hierarchy.compactStyleRenderingEnabled);

            if (isTreeStyle) {
                this.widthWithChildrenCached = this.hierarchy.getColumnWidth(0);
                return;
            }

            this.widthWithChildrenCached = this.getWidth();

            if (this.items != null && this.valueItems != null) {

                if (this.getVisibleItemsCount() > 0 || (!this.isColumn && !isTreeStyle)) {
                    var w = 0;
                    if (!this.isColumn) // if row header item width = self + max child's width
                    {
                        var maxLevel = this.hierarchy.getMaxVisibleLevelDepth();
                        for (var i = this.itemLevel; i <= maxLevel; i++)
                            w += this.hierarchy.getColumnWidth(i);
                    }
                    else // if column header item width = sum child's width
                    {
                        w = 0;

                        if (this.isExpanded) {
                            for (var i = 0; i < this.items.length; i++) {
                                if ((this.items[i]).isHidden)
                                    continue;

                                w += this.items[i].getWidthWithChildren();
                            }
                        }

                        for (var i = 0; i < this.valueItems.length; i++) {
                            if (this.valueItems[i].isHidden)
                                continue;

                            w += this.valueItems[i].getWidthWithChildren();
                        }
                    }

                    this.widthWithChildrenCached = w;
                    return;
                }
            }

            this.widthWithChildrenCached = this.getWidth();

            return;
        },

        getWidthWithChildren: function () {
            if (this.hierarchy._renderRequired) {
                this._calculateWidthWithChildren();
            }

            return this.widthWithChildrenCached;
        },

        getDisplayWidth: function () {
            if (!this.isDirty && !this.hierarchy._renderRequired)
                return displayWidth;

            var hasSummaryItems = this.hasVisibleValueItems();

            if (this.isColumn) {
                this.displayWidth = (this.isExpanded || hasSummaryItems) ? this.getWidthWithChildren() : this.getWidth();
            }
            else {
                this.displayWidth = (!this.hierarchy.isColumnsHierarchy && this.hierarchy.compactStyleRenderingEnabled) ? this.getWidthWithChildren() : this.getWidth();
                if (!this.isExpanded && !hasSummaryItems)
                    this.displayWidth = this.hierarchy.getWidth() - this.x;
            }

            if (this.displayWidth < 18)
                this.displayWidth = 18;

            //if (displayWidth > MaximumWidth)
            //    displayWidth = MaximumWidth;

            return this.displayWidth;
        },

        getWidth: function () {
            if (this.isHidden || this.isFiltered)
                return 0;

            if (null == this.hierarchy)
                return 0;

            var columnIndex = this.itemColumn;
            if (!this.hierarchy.isColumnsHierarchy && this.hierarchy.compactStyleRenderingEnabled)
                columnIndex = 0;

            var width = this.minimumWidth;
            if (!this.isColumn) {
                width = this.hierarchy.getColumnWidth(columnIndex);
            }
            else {
                width = this.hierarchyItemWidth;
                if (this.parentItem) { // TODO: revisit this. Not available in orig.
                    var parentWidth = this.parentItem.getWidth();
                    if (parentWidth > width && parentWidth > this.parentItem.widthWithChildrenCached) {
                        // width = this.hierarchyItemWidth = parentWidth;
                    }
                }
            }

            return width;
        },

        _measureElement: function (text) {
            var span = $("<span style='visibility: hidden; white-space: nowrap;'>" + text + "</span>");
            //span.addClass(this.toTP('jqx-widget'));
            $(document.body).append(span);

            var buttonsWidth = this.hierarchy.sortable ? 16 : 0;

            var padding = 4;
            var size = { width: span.width() + buttonsWidth + 2 * padding, height: span.height() + 2 * padding };
            span.remove();

            return size;
        },

        autoResize: function (autoResizeMode) {
            if (!autoResizeMode)
                autoResizeMode = 'fitItemContent';

            if (this.isColumn) {
                this.setWidth(this.minimumWidth);
            }
            else {
                this.setHeight(this.minimumHeight);
            }

            if (autoResizeMode == 'default' || autoResizeMode == 'fitAll' || autoResizeMode == 'fitItemContent')
                this._autoResizeBestItemContent(autoResizeMode);

            //if (autoResizeMode == 'default' || autoResizeMode == 'fitAll' || autoResizeMode == 'fitCellsContent')
            //    this._autoResizeBestCellFit(autoResizeMode);

            if (autoResizeMode == 'default' || autoResizeMode == 'fitAll' || autoResizeMode == 'fitItemContent') {
                if (this.isColumn && this.parentItem != null && this.getWidth() < this.parentItem.getWidth())
                    this.setWidth(this.parentItem.getWidth());
            }
        },

        _autoResizeBestItemContent: function (autoResizeMode) {
            this._updateVisibleChildItemsCount();

            sz = this._measureElement(this.text);

            if (autoResizeMode == 'default' && this.adapterItem.boundField) {
                if (!isNaN(this.adapterItem.boundField.width))
                    sz.width = this.adapterItem.boundField.width;

                if (!isNaN(this.adapterItem.boundField.height))
                    sz.height = this.adapterItem.boundField.height;
            }

            if (this.itemColumn >= this.hierarchy._getColumnsCount())
                this.hierarchy._updateColumnsCount();

            if (this._visibleChildItemsCount > 0)
                sz.width += 30;

            if (this.getWidth() < sz.width || (autoResizeMode == 'default' && this.adapterItem.boundField && !isNaN(this.adapterItem.boundField.width)))
                this.setWidth(sz.width);

            //if (this.isColumn && this.parentItem != null && this.parentItem.getWidth() > this.getWidth())
            //    this.setWidth(this.parentItem.getWidth());

            if (!this.isColumn) {
                if (this.getHeight() < sz.height)
                    this.setHeight(sz.height);
            }
            else {
                var columnsHeight = this.parentPivotGrid._pivotColumns.getHeight();
                if (columnsHeight < sz.height) {
                    this.parentPivotGrid._pivotColumns.setRowHeight(this, sz.height);
                }
            }

            for (var i in this.items)
                this.items[i]._autoResizeBestItemContent(autoResizeMode);

            for (var i in this.valueItems)
                this.valueItems[i]._autoResizeBestItemContent(autoResizeMode);

            if (this.hierarchy != null)
                this.hierarchy._renderRequired = true;
        },

        _autoResizeBestCellFit: function (autoResizeMode) {
            if (this.hierarchy != null && this.hierarchy._renderRequired)
                this.hierarchy.render();

            if (this.hierarchy != null && this.hierarchy.ColumnsCountRequresUpdate)
                this.hierarchy._updateColumnsCount();

            if (this.items.length == 0 && this.valueItems.length == 0) {
                if (this.hierarchy != null &&
                    this.parentPivotGrid != null &&
                    this.parentPivotGrid._pivotCells != null &&
                    this.parentPivotGrid._pivotRows != null &&
                    this.parentPivotGrid._pivotColumns != null) {
                    var bestFitSize = { width: 1, height: 1 };
                    var hierarchy = this.isColumn ? this.parentPivotGrid._pivotRows : this.parentPivotGrid._pivotColumns;
                    var list = this._getVisibleLeafLevelItems();
                    for (var item in list) {
                        var rowitem = !(list[item].isColumn) ? list[item] : this;
                        var colitem = list[item].isColumn ? list[item] : this;

                        var sz = { width: 10, height: 10 };
                        //var sz = this.parentPivotGrid._pivotCells.MeasureBestFitSize(rowitem, colitem);
                        if (bestFitSize.width < sz.width)
                            bestFitSize.width = sz.width;
                        if (bestFitSize.height < sz.height)
                            bestFitSize.height = sz.height;
                    }

                    if (this.width < bestFitSize.width)
                        this.setWidth(bestFitSize.width);

                    if (!this.isColumn && this.getHeight() < bestFitSize.height)
                        this.setHeight(bestFitSize.height);
                }
            }
            else {

                for (var item in this.items)
                    this.items[item]._autoResizeBestCellFit(autoResizeMode);

                for (var item in this.valueItems)
                    this.valueItems[item]._autoResizeBestCellFit(autoResizeMode);
            }

            if (hierarchyHost != null)
                hierarchyHost._renderRequired = true;
        },

        setWidth: function (value) {
            if (value < 0)
                throw new Exception("Invalid pivotItem Width value. The value must greater than 0");

            if (null == this.hierarchy)
                return;

            var columnIndex = this.itemColumn;
            if (!this.hierarchy.isColumnsHierarchy && this.hierarchy.compactStyleRenderingEnabled)
                columnIndex = 0;

            if (this.hierarchy._getColumnsCount() < columnIndex)
                this.hierarchy._updateColumnsCount();

            if (value < this.minimumWidth)
                value = this.minimumWidth;

            if (value > this.maximumWidth)
                value = this.maximumWidth;

            if (this.isColumn) {
                this.hierarchyItemWidth = value;
            }
            else {
                this.hierarchy.setColumnWidth(columnIndex, value);
            }

            this.hierarchy._renderRequired = true;
        },

        getHeight: function () {
            if (this.isHidden || this.isFiltered)
                return 0.0;

            return this.hierarchyItemHeight;
        },

        setHeight: function (value) {
            if (value < 0 || value > 10000)
                throw new Exception("Invalid pivotItem Height value. The value must be between 0 and 10000");

            if (value < this.minimumHeight)
                value = this.minimumHeight;

            if (value > this.maximumHeight)
                value = this.maximumHeight;

            this.hierarchyItemHeight = value;

            if (this.hierarchy != null)
                this.hierarchy._renderRequired = true;

            //RaisePropertyChanged("Height");
        },

        _calculateHeightWithChildren: function () {
            if (this.isHidden || this.isFiltered) {
                this.heightWithChildren = 0;
                return;
            }

            var isTreeStyle = (!this.isColumn && this.hierarchy.compactStyleRenderingEnabled);

            if (this.isExpanded || this.hasVisibleValueItems()) {
                var height = 0;
                if (this.isColumn) // if column header item height = self + max child's height
                {
                    height = this.hierarchyItemHeight;

                    h = 0;
                    if (this.isExpanded) {
                        for (var i = 0; i < this.items.length; i++) {
                            var item_h = this.items[i].getHeightWithChildren();
                            if (h < item_h)
                                h = item_h;
                        }
                    }

                    for (var i = 0; i < this.valueItems.length; i++) {
                        var item_h = this.valueItems[i].getHeightWithChildren();
                        if (h < item_h)
                            h = item_h;
                    }

                    if (h > 0)
                        height += h;
                }
                else // if row header item height = sum child's height
                {
                    height = isTreeStyle ? this.getHeight() : 0;
                    if (this.isExpanded) {
                        for (var i = 0; i < this.items.length; i++) {
                            if (this.items[i].isHidden || this.items[i].isFiltered)
                                continue;

                            height += this.items[i].getHeightWithChildren();
                        }
                    }

                    for (var i = 0; i < this.valueItems.length; i++) {
                        if (this.valueItems[i].isHidden || this.valueItems[i].isFiltered)
                            continue;

                        height += this.valueItems[i].getHeightWithChildren();
                    }
                }

                this.heightWithChildren = height;
            }
            else {
                this.heightWithChildren = this.hierarchyItemHeight;
            }

            if (this.IsRowDetailsVisible)
                this.heightWithChildren += this.RowDetailsHeight;

            return;
        }, // CalculateDisplayHeight

        getHeightWithChildren: function () {
            if (this.hierarchy._renderRequired || this.isDirty) {
                this._calculateHeightWithChildren();
            }

            return this.heightWithChildren;
        },

        getDisplayHeight: function () {
            var hasSummaryItems = this.hasVisibleValueItems();
            var displayHeight = 0.0;
            if (this.isColumn) {
                displayHeight = (this.isExpanded || hasSummaryItems) ? this.getTotalHeight() : this.hierarchy.getHeight() - this.y;
                //displayHeight -= 2;
            }
            else {
                if (this.hierarchy.compactStyleRenderingEnabled) {
                    displayHeight = this.getHeight();

                    if (this.IsRowDetailsVisible)
                        displayHeight += this.RowDetailsHeight;
                }
                else {
                    displayHeight = this.getHeightWithChildren();
                }
            }

            if (displayHeight < this.minimumHeight)
                displayHeight = this.minimumHeight;

            return displayHeight;
        },

        getTotalHeight: function () {
            if (this.isHidden || this.isFiltered)
                return 0.0;

            return this.hierarchyItemHeight + ((this.IsRowDetailsVisible) ? this.RowDetailsHeight : 0);
        },

        ensureVisible: function () {
            var self = this;
            if (self.isVisible())
                return;

            var host = self.hierarchy.parentPivotGrid.host;

            if (self.isColumn) {
                var hostHScroll = host.find('#divHScroll');
                if (self.x + self.getWidth() > self.hierarchy.viewPort.width)
                    hostHScroll.val(self.x + self.getWidth() - self.hierarchy.viewPort.width);
                else
                    hostHScroll.val(self.x);
            }
            else {
                var hostVScroll = host.find('#divVScroll');
                if (self.y + self.getHeight() > self.hierarchy.viewPort.height)
                    hostVScroll.val(self.y + self.getHeight() - self.hierarchy.viewPort.height);
                else
                    hostVScroll.val(self.y);
            }
        },

        isVisible: function () {
            if (this.isHidden)
                return false;

            if (this.y < this.hierarchy.viewPort.y - this.hierarchy.y ||
                    this.y + this.getDisplayHeight() > this.hierarchy.viewPort.y - this.hierarchy.y + this.hierarchy.viewPort.height ||
                    this.x < this.hierarchy.viewPort.x - this.hierarchy.x ||
                    this.x + this.getDisplayWidth() > this.hierarchy.viewPort.x - this.hierarchy.x + this.hierarchy.viewPort.width
                    ) {
                return false;
            }

            return true;
        },

        _updateVisibleChildItemsCount: function () {
            var cnt = 0;
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].isHidden || this.items[i].isFiltered)
                    continue;

                cnt++;
            }

            this._visibleChildItemsCount = cnt;
        },

        render: function (x, y) {
            this._updateVisibleChildItemsCount();

            var nonHiddenNonFilteredItemsCount = -1;
            var absoluteIndex = -1;

            if (this.isHidden || this.isFiltered)
                return true;

            this.x = x;
            this.y = y;

            var isTreeStyle = (!this.isColumn && this.hierarchy.compactStyleRenderingEnabled);

            var offset = isTreeStyle ? this.getTotalHeight() : 0;

            if (this.isExpanded) {
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    if (item.isHidden || item.isFiltered)
                        continue;

                    if (!this.isColumn) // row header item
                    {
                        var childItemX = x;
                        childItemX += isTreeStyle ? 0 : this.getWidth();
                        if (!item.render(childItemX, this.y + offset))
                            break;

                        offset += item.getHeightWithChildren();
                    }
                    else {
                        if (!item.render(this.x + offset, y + this.getTotalHeight()))
                            break;

                        offset += item.getWidthWithChildren();
                    }
                }
            }

            for (var i = 0; i < this.valueItems.length; i++) {
                var item = this.valueItems[i];
                if (item.isHidden || item.isFiltered)
                    continue;

                if (!this.isColumn) // row header item
                {
                    var childItemX = x;
                    childItemX += isTreeStyle ? 0 : this.getWidth();
                    if (!item.render(childItemX, this.y + offset))
                        break;

                    offset += item.getHeightWithChildren();
                }
                else {
                    if (!item.render(this.x + offset, y + this.getTotalHeight()))
                        break;

                    offset += item.getWidthWithChildren();
                }
            }

            this._calculateWidthWithChildren();
            this._calculateHeightWithChildren();

            return true;
        }, // render

        _getChildItemsDepth: function () {
            var depth = 0;
            for (var i = 0; i < this.items.length; i++) {
                var itemDepth = this.items[i]._getChildItemsDepth();
                if (itemDepth > depth)
                    depth = itemDepth;
            }
            for (var i = 0; i < this.valueItems.length; i++) {
                var itemDepth = this.valueItems[i]._getChildItemsDepth();
                if (itemDepth > depth)
                    depth = itemDepth;
            }

            return depth + 1;
        },

        getTotalItemsCount: function () {
            var count = 0;

            if (this.items.length == 0 && this.valueItems.length == 0) {
                count = 1;
            }
            else {
                for (var i = 0; i < this.items.length; i++)
                    count += this.items[i].getTotalItemsCount();

                for (var i = 0; i < this.valueItems.length; i++)
                    count += this.valueItems[i].getTotalItemsCount();
            }

            return count;
        },

        hasVisibleValueItems: function () {
            for (var i = 0; i < this.valueItems.length; i++) {
                var item = this.valueItems[i];
                if (false == item.isHidden && false == item.isFiltered)
                    return true;
            }

            return false;
        },

        getVisibleItemsCount: function () {
            if (this.isHidden || this.isFiltered)
                return 0;

            var count = 0;

            if ((!this.isExpanded || this.items.length == 0) && this.valueItems.length == 0) {
                return count;
            }
            else {
                count = 0;

                for (var i = 0; i < this.items.length; i++)
                    if (!this.items[i].isHidden && !this.items[i].isFiltered)
                        count++;

                for (var i = 0; i < this.valueItems.length; i++)
                    if (!this.valueItems[i].isHidden && !this.valueItems[i].isFiltered)
                        count++;
            }

            return count;
        },

        hitTest: function (point) {
            if (this.isHidden || this.isFiltered)
                return null;

            var h = this.getDisplayHeight() + 1;
            var w = this.getDisplayWidth() + 1;

            if (point.x >= this.x && point.x <= this.x + w &&
                point.y >= this.y && point.y <= this.y + h)
                return this;

            return null;
        },

        ////////////// expand/collapse ////////////////////////
        _expandInternal: function (isExpand, performHierarchyRefresh, isExpandAll) {
            if (this.items.length == 0)
                return;

            if (!this.expandCollapseEnabled)
                return;

            if (this.isExpanded == isExpand)
                return;

            // raise mouse expanding/collapsing event
            var event = new $.Event(this.isExpanded ? 'pivotitemcollapsing' : 'pivotitemexpanding');
            event.owner = this.hierarchy.parentPivotGrid;
            event.args = { pivotItem: this };
            event.cancel = false;

            var host = this.hierarchy.parentPivotGrid.host;
            host.trigger(event);

            // return in case the user cancels the action
            if (event.cancel)
                return;

            this.isExpanded = isExpand;

            if (this.items.length == 0 && this.valueItems.length == 0)
                return;

            // recursively update the child items
            if (isExpandAll) {
                for (var i = 0; i < this.items.length; i++)
                    this.items[i]._expandInternal(isExpand, performHierarchyRefresh, isExpandAll);

                for (var i = 0; i < this.valueItems.length; i++)
                    this.valueItems[i]._expandInternal(isExpand, performHierarchyRefresh, isExpandAll);
            }

            this.hierarchy._renderRequired = true;

            if (performHierarchyRefresh) {
                this.hierarchy._updateVisibleLeaves();
            }

            // raise mouse expanding/collapsing event
            var event = new $.Event(this.isExpanded ? 'pivotitemexpanded' : 'pivotitemcollapsed');
            event.owner = this.hierarchy.parentPivotGrid;
            event.args = { pivotItem: this };

            host.trigger(event);
        }, // _expandInternal

        /// Expands the pivotItem
        expand: function () {
            this._expandInternal(true, true, false);
        },

        // Expands the pivotItem
        collapse: function () {
            this._expandInternal(false, true, false);
        },

        //////////// End of expand/collapse ///////////////////

        _getFirstVisibleLeaf: function (item) {
            if (item.isExpanded) {
                var isFound = false;
                for (var i = 0; i < item.items.length; i++) {
                    if (item.items[i].isHidden == false && item.items[i].isFiltered == false) {
                        item = item.items[i];
                        item = this._getFirstVisibleLeaf(item);
                        isFound = true;
                        break;
                    }
                }
                if (isFound)
                    return item;
            }

            if (item.hasVisibleValueItems) {
                var isFound = false;
                for (var i = 0; i < item.valueItems.length; i++) {
                    if (item.valueItems[i].isHidden == false && item.valueItems[i].isFiltered == false) {
                        item = item.valueItems[i];
                        item = this._getFirstVisibleLeaf(item);
                        isFound = true;
                        break;
                    }
                }
                if (isFound)
                    return item;
            }

            return item;
        },

        _getLastVisibleLeaf: function (item) {
            var isFound = false;
            for (var i = item.valueItems.length - 1; i >= 0; i--) {
                if (item.valueItems[i].isHidden == false && item.valueItems[i].isFiltered == false) {
                    item = item.valueItems[i];
                    item = this._getLastVisibleLeaf(item);
                    isFound = true;
                    break;
                }
            }

            if (isFound)
                return item;

            for (var i = item.items.length - 1; i >= 0 && item.isExpanded; i--) {
                if (item.items[i].isHidden == false && item.items[i].isFiltered == false) {
                    item = item.items[i];
                    item = this._getLastVisibleLeaf(item);
                    break;
                }
            }

            return item;
        }



    } /// END OF pivotItem
    //////////////////////////////////////////////////
    );


    //////////////////////////////////////////////////
    /////////////////////////////////////////////////

    $.jqx.jqxPivotGrid.hierarchy = function () {
        this.parentPivotGrid = arguments[0];
        this._initDefaults();
    }

    $.extend($.jqx.jqxPivotGrid.hierarchy.prototype, {
        _initDefaults: function () {
            this.columnWidths = new Array();
            this.rowHeights = new Array();
            this.items = new Array();
            this.valueItems = new Array();
            this.visibleLeafItems = new Array();
            this.viewPort = new Object();
            this.viewPort.x = 0;
            this.viewPort.y = 0;
            this.viewPort.width = 10000;
            this.viewPort.height = 10000;
            this.isFixed = false;
            this.isHidden = false;
            this.resizable = true;
            this.sortable = true;
            this._renderRequired = true;
            this.maxVisibleLevelDepth = -1;
            this.showExpandCollapseButtons = true;
            this.x = 0;
            this.y = 0;
            this._width = 0;
            this._height = 0;
            this.minColumnWidth = 18;
            this._isColumnsCountRequresUpdate = true;
            this._selectedItems = new Object();
            this.virtualModeThreshold = 5000;
            this._isVirtualMode = true;
        },

        isVisible: function () {
            return !this.isHidden;
        },

        toggle: function () {
            if (this.isHidden)
                this.show();
            else
                this.hide();
        },

        getOtherHierarchy: function () {
            return (this.isColumnsHierarchy) ? this.parentPivotGrid._pivotRows : this.parentPivotGrid._pivotColumns;
        },

        show: function () {
            this.isHidden = false;
            this._renderRequired = true;
            this.getOtherHierarchy()._renderRequired = true;
        },

        hide: function () {
            this.isHidden = true;
            this._renderRequired = true;
            this.getOtherHierarchy()._renderRequired = true;
        },

        refresh: function () {
            var parentPivotGrid = this.parentPivotGrid;

            var itemClassSelected = parentPivotGrid.toThemeProperty('jqx-widget-content jqx-fill-state-pressed jqx-widget-header');
            var itemClassNormal = parentPivotGrid.toThemeProperty('jqx-widget-content jqx-fill-state-normal jqx-widget-header');

            var canvas = $.jqx.get(this, 'renderCanvas');

            var refreshRequired = this._renderRequired || this._refreshRequired;
            if (!refreshRequired)
                return;

            if (this._renderRequired) {
                this.render();
            }

            if (this.isHidden)
                return;

            var arr = new Array();
            var t = new Date();
            var items = this._getItemsToRender();
            if (!items)
                return;

            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var w = item.getDisplayWidth() - 1;
                var h = item.getDisplayHeight() - 1;

                //item._element = undefined;

                var div = item._element;

                if ($.isFunction(parentPivotGrid.itemsRenderer)) {
                    var itemContentCustomContent = parentPivotGrid.itemsRenderer(item);

                    if (div && item._currentCustomContent != itemContentCustomContent) {
                        canvas.removeChild(div);
                        div = item._element = null;
                    }

                    item._currentCustomContent = itemContentCustomContent;
                }

                if (!div) {

                    var padding = { left: 4, top: 4, right: 4, bottom: 4 };
                    if (!this.isColumnsHierarchy && this.compactStyleRenderingEnabled) {
                        padding.left += item.itemLevel * this.compactStyleRenderingItemsIndent;
                    }

                    var itemContent = item.text;

                    var textAlign = 'left';

                    if ($.isFunction(parentPivotGrid.itemsRenderer)) {
                        itemContent = item._currentCustomContent;
                        padding = { left: 0, top: 0, right: 0, bottom: 0 };
                    }
                    else {
                        var expandElement = '';
                        if (item.items.length != 0 && item.hierarchy.showExpandCollapseButtons) {
                            if (item.isExpanded)
                                expandElement = "<div style='position: relative; top: 3px; padding: 5px; width: 11px; height: 11px;' class='jqx-pivotgrid-collapse-button'></div>";
                            else
                                expandElement = "<div style='position: relative; top: 3px; padding: 5px; width: 11px; height: 11px;' class='jqx-pivotgrid-expand-button'></div>";
                        }

                        var sortElement = '';
                        if (item.hierarchy._sortItem == item) {
                            var elementClass = item.hierarchy._sortOrder == 'desc' ? "sortdesc jqx-grid-column-sortdescbutton " + this.parentPivotGrid.toThemeProperty('jqx-icon-arrow-down') : "sortasc jqx-grid-column-sortascbutton " + this.parentPivotGrid.toThemeProperty('jqx-icon-arrow-up');
                            sortElement = "<div id='sortElement' class='" + elementClass + "' style='position: relative; float: right; padding-right: 8px; width: 16px; height: 100%;'></div>";
                        }

                        var itemTextContent = item.text;
                        if (item.adapterItem.boundField)
                            textAlign = item.adapterItem.boundField.align || 'left';

                        textAlign = textAlign.toString().toLowerCase();
                        if (textAlign != 'center' && textAlign != 'right')
                            textAlign = 'left';

                        if (sortElement != '') {

                            var left = 0;
                            var widthDiff = 24;
                            if (expandElement != '') {
                                left = 23;
                                widthDiff += left;
                            }


                            itemContent =
                                expandElement +
                                "<div>" +
                                "<div style='left: " + left + "px; top: 0; position: absolute; height: 100%; width: calc(100% - " + widthDiff + "px); text-overflow: ellipsis; overflow: hidden;  white-space: nowrap;" + "padding-left:" + padding.left + "px; padding-top:" + padding.top + "px; '>" + itemTextContent + "</div>" +
                                "<div style='left: 0; top: 0; position: absolute; height: 100%; width: 100%;'>" + sortElement + "</div>" +
                                "</div>";
                        }
                        else
                        {
                            itemContent = expandElement + itemTextContent + sortElement;
                        }
                    }


                    div = parentPivotGrid.createDiv(canvas, '', w, h);
                    parentPivotGrid.setDivContent(div, itemContent, padding, textAlign, true);

                    var innerDiv = this.parentPivotGrid.getChild(div, 'innerDiv');
                    innerDiv.className = 'jqx-pivotgrid-item';

                    parentPivotGrid.setElementPosition(div, item.x, item.y);

                    div.originalY = div.style.top;
                }

                item.tRender = t;

                var className = item.isSelected ? itemClassSelected : itemClassNormal;

                var cssOverrideKey = item.isSelected ? 'classNameSelected' : 'className';
                var cssOverride = $.jqx.getByPriority([item[cssOverrideKey], (item.adapterItem && item.adapterItem.boundField) ? item.adapterItem.boundField[cssOverrideKey] : undefined, this.hierarchy ? this.hierarchy[cssOverrideKey] : undefined]);
                if (cssOverride)
                    className += ' ' + cssOverride;

                className += ' ' + 'jqx-pivotgrid-content-wrapper';

                if (className != div.className)
                    div.className = className;

                div.style.display = 'block';
                div.item = item;
                item._element = div;
            }

            for (var i = 0; i < canvas.childNodes.length; i++) {
                if (canvas.childNodes[i].item &&
                    canvas.childNodes[i].item.tRender != t) {
                    arr.push(canvas.childNodes[i]);
                }
            }

            var cleanupThreshold = 100;

            while (true) {
                var element = arr.pop();
                if (!element)
                    break;
                else {
                    if (canvas.childNodes.length > cleanupThreshold) {
                        element.item._element = undefined;
                        canvas.removeChild(element);
                    }
                    else {
                        element.item._element.style.display = 'none';
                    }
                }
            }

            var offsetY = !this.isColumnsHierarchy ? -parentPivotGrid._offsetY : 0;
            var offsetX = this.isColumnsHierarchy ? -parentPivotGrid._offsetX : 0;

            parentPivotGrid.setElementPosition(canvas, offsetX, offsetY);

            this._refreshRequired = false;
        },

        clear: function () {
            this._initDefaults();
            this._resetCanvas();
            this.items = [];
            this.valueItems = [];
            this._renderRequired = true;

        },

        _resetCanvas: function () {
            var canvas = $.jqx.get(this, 'renderCanvas');
            if (!canvas)
                return;

            while (canvas.hasChildNodes()) {
                canvas.firstChild.item._element = undefined;
                canvas.removeChild(canvas.firstChild);
            }
        },

        autoResize: function (autoResizeMode) {
            for (var i = 0; i < this.items.length; i++)
                this.items[i].autoResize(autoResizeMode);
            for (var i = 0; i < this.valueItems.length; i++)
                this.valueItems[i].autoResize(autoResizeMode);
        },

        getMaxVisibleLevelDepth: function () {
            if (this.maxVisibleLevelDepth == -1 || this._renderRequired) {
                var list = this._getVisibleLeafLevelItems();
                this.maxVisibleLevelDepth = 0;
                for (var i = 0; i < list.length; i++)
                    if (list[i].itemLevel > this.maxVisibleLevelDepth)
                        this.maxVisibleLevelDepth = list[i].itemLevel;
            }

            return this.maxVisibleLevelDepth;
        },

        getHierarchyDepth: function () {
            var depth = 0;
            for (var i = 0; i < this.items.length; i++) {
                var itemDepth = this.items[i]._getChildItemsDepth();
                if (itemDepth > depth)
                    depth = itemDepth;
            }
            for (var i = 0; i < this.valueItems.length; i++) {
                var itemDepth = this.valueItems[i]._getChildItemsDepth();
                if (itemDepth > depth)
                    depth = itemDepth;
            }

            return depth;
        },

        getSortItem: function () {
            return this._sortItem;
        },

        getSortOrder: function () {
            return this._sortOrder;
        },

        _fnAscSortComparer: function (item1, item2) {
            var parentPivotGrid = item1.hierarchy.parentPivotGrid;

            var otherHierarchy = item1.isColumn ? parentPivotGrid._pivotRows : parentPivotGrid._pivotColumns;
            var sortItem = otherHierarchy._sortItem;

            if (!sortItem)
                return 0;

            if (item1.adapterItem && item1.adapterItem.isTotal)
                return 1;
            if (item2.adapterItem && item2.adapterItem.isTotal)
                return -1;

            var pivotCells = parentPivotGrid._pivotCells;

            var val1 = item1.isColumn ? pivotCells.getCellValue(sortItem, item1) : pivotCells.getCellValue(item1, sortItem);
            var val2 = item2.isColumn ? pivotCells.getCellValue(sortItem, item2) : pivotCells.getCellValue(item2, sortItem);

            return val1.value - val2.value;
        },

        _fnDescSortComparer: function (item1, item2) {
            if (item1.adapterItem && item1.adapterItem.isTotal)
                return 1;
            if (item2.adapterItem && item2.adapterItem.isTotal)
                return -1;

            return -1 * $.jqx.jqxPivotGrid.hierarchy.prototype._fnAscSortComparer(item1, item2);
        },

        _collectionSort: function (collection, fnComparer, isRecursiveCall) {
            if (!this.parentPivotGrid || !this.parentPivotGrid._pivotCells)
                return;

            var otherHierarchy = !this.isColumnsHierarchy ? this.parentPivotGrid._pivotColumns : this.parentPivotGrid._pivotRows;

            if (!collection)
                collection = this.items;

            //if (collection.length == 0)
            //    return;

            if (!fnComparer) {
                fnComparer = otherHierarchy._sortOrder == 'asc' ? this._fnAscSortComparer : this._fnDescSortComparer;
            }

            if (this._isSorted && !isRecursiveCall)
                this._collectionRemoveSort(collection);

            for (var i = 0; i < collection.length; i++) {
                collection[i]._itemOrdinal = i;
                this._collectionSort(collection[i].items, fnComparer, true);
            }

            collection = collection.sort(fnComparer);

            if (!isRecursiveCall) {
                this._isSorted = true;
                this._renderRequired = true;
                otherHierarchy._renderRequired = true;

                this._updateVisibleLeaves();
            }
        },

        _collectionRemoveSort: function (collection, isRecursiveCall) {
            if (!this._isSorted)
                return;

            if (!collection)
                collection = this.items;

            var arr = new Array(collection.length);
            for (var i = 0; i < collection.length; i++) {
                arr[collection[i]._itemOrdinal] = collection[i];
                this._collectionRemoveSort(collection[i].items, true);
            }

            this.items = arr;

            if (!isRecursiveCall) {
                this._renderRequired = true;

                this._updateVisibleLeaves();

                if (this.isColumnsHierarchy)
                    this._isColumnsCountRequresUpdate = true;

                this._isSorted = false;
                var otherHierarchy = this.isColumnsHierarchy ? this.parentPivotGrid._pivotRows : this.parentPivotGrid._pivotColumns;
                otherHierarchy._sortItem = undefined;
                otherHierarchy._sortOrder = undefined;
                otherHierarchy._renderRequired = true;
            }
        },

        sortBy: function (item, sortOrder) {
            if (!item || item.isColumn == this.isColumnsHierarchy || item.valueItems.length > 0)
                return;

            // raise sort changing event
            var event = new $.Event('sortchanging');
            event.owner = this.parentPivotGrid;
            event.args = { pivotItem: item, sortOrder: sortOrder };
            event.cancel = false;

            var host = this.parentPivotGrid.host;
            host.trigger(event);

            if (event.cancel)
                return;

            this._collectionRemoveSort(this.items);
            var hierarchy = item.isColumn ? this.parentPivotGrid._pivotColumns : this.parentPivotGrid._pivotRows;
            hierarchy._sortItem = item;
            hierarchy._sortOrder = sortOrder;

            this._collectionSort();

            this.parentPivotGrid._internalRefresh();

            // raise sort changed event
            event = new $.Event('sortchanged');
            event.owner = this.parentPivotGrid;
            event.args = { pivotItem: item, sortOrder: sortOrder };

            var host = this.parentPivotGrid.host;
            host.trigger(event);
        },

        removeSort: function () {
            var otherHierarchy = this == this.parentPivotGrid._pivotColumns ? this.parentPivotGrid._pivotRows : this.parentPivotGrid._pivotColumns;

            var sortRemoveItem = otherHierarchy._sortItem;
            var sortRemoveOrder = otherHierarchy._sortOrder;

            // raise sort removing event
            var event = new $.Event('sortremoving');
            event.owner = this.parentPivotGrid;
            event.args = { pivotItem: sortRemoveItem, sortOrder: sortRemoveOrder };
            event.cancel = false;

            var host = this.parentPivotGrid.host;
            host.trigger(event);

            if (event.cancel)
                return;

            this._collectionRemoveSort(this.items);

            this.parentPivotGrid._internalRefresh();

            // raise sort removed event
            event = new $.Event('sortremoved');
            event.owner = this.parentPivotGrid;
            event.args = { pivotItem: sortRemoveItem, sortOrder: sortRemoveOrder };
            host.trigger(event);
        },

        _binSearchItems: function (array, point) {
            return this._binSearchItems2(array, point, 0, array.length);
        },

        _binSearchItems2: function (array, point, first, last) {
            var start = first;
            var end = last;

            if (end == start)
                return -1;

            var isSearchOnColumns = array[0].isColumn;

            while (start < end) {
                var mid = parseInt((start + end) / 2);

                var itemMid = array[mid];
                if (isSearchOnColumns) {
                    if (itemMid.x > point.x)
                        end = mid;
                    else if ((mid + 1 < end ? array[mid + 1].x : itemMid.x + itemMid.getWidth()) < point.x)
                        start = mid + 1;
                    else
                        return mid;
                }
                else {
                    if (itemMid.y > point.y)
                        end = mid;
                    else if ((mid + 1 < end ? array[mid + 1].y : itemMid.y + itemMid.getTotalHeight()) < point.y)
                        start = mid + 1;
                    else
                        return mid;
                }
            }

            return -1;
        },

        _pointToLeafItemIndex: function (point) {
            if (this._renderRequired) {
                this.render();
            }

            var pointNoScroll = { x: point.x, y: point.y };
            pointNoScroll.x += -this.x + this.viewPort.x;
            pointNoScroll.y += -this.y + this.viewPort.y;

            var lstEndItems = this._getVisibleLeafLevelItems();

            var hitIndex = this._binSearchItems(lstEndItems, pointNoScroll);
            return hitIndex;

        },

        _pointToLeafItem: function (point) {
            var lstEndItems = this._getVisibleLeafLevelItems();

            var hitIndex = this._pointToLeafItemIndex(point);
            if (hitIndex == -1 || hitIndex < 0 || hitIndex >= lstEndItems.length)
                return null;

            lstEndItems[hitIndex].lfIdx = hitIndex;
            return lstEndItems[hitIndex];

        },

        _pointToLeafItemIndexAbsolute: function (point) {
            if (this._renderRequired) {
                this.render();
            }

            var offsetX = this.viewPort.x - this.x;
            var offsetY = this.viewPort.y - this.y;

            var pointNoScroll = { x: point.x, y: point.y };
            pointNoScroll.x -= this.x - (this.viewPort.x - this.x);
            pointNoScroll.y -= this.y - (this.viewPort.y - this.y);

            var lstEndItems = this._getVisibleLeafLevelItems();

            var hitIndex = this._binSearchItems(lstEndItems, pointNoScroll);
            return hitIndex;

        },

        _pointToLeafItemAbsolute: function (point) {
            var lstEndItems = this._getVisibleLeafLevelItems();

            var hitIndex = this._pointToLeafItemIndexAbsolute(point);
            if (hitIndex == -1 || hitIndex < 0 || hitIndex >= lstEndItems.length)
                return null;

            lstEndItems[hitIndex].lfIdx = hitIndex;
            return lstEndItems[hitIndex];
        },

        _pointInRect: function (point, rect) {
            if (point.x >= rect.x &&
                    point.x <= rect.x + rect.width &&
                    point.y >= rect.y &&
                    point.y <= rect.y + rect.height)
                return true;

            return false;
        },

        hitTest: function (point) {
            if (this._renderRequired)
                this.render();

            var offsetX = this.viewPort.x - this.x;
            var offsetY = this.viewPort.y - this.y;

            if (!this._pointInRect({ x: point.x + offsetX, y: point.y + offsetY }, this.viewPort) || this.isHidden)
                return null;

            var pointNoScroll = { x: point.x, y: point.y };
            pointNoScroll.x -= this.x - (this.viewPort.x - this.x);
            pointNoScroll.y -= this.y - (this.viewPort.y - this.y);

            var lstEndItems = this._getVisibleLeafLevelItems();

            var hitIndex = this._binSearchItems(lstEndItems, pointNoScroll);
            if (hitIndex == -1) {
                return null;
            }
            else {
                var hierarchyItem = lstEndItems[hitIndex];
                var matchItem = hierarchyItem.hitTest(pointNoScroll);
                if (matchItem != null) {
                    return matchItem;
                }
                while (hierarchyItem != null) {
                    hierarchyItem = hierarchyItem.parentItem;
                    if (hierarchyItem != null) {
                        matchItem = hierarchyItem.hitTest(pointNoScroll);
                        if (matchItem != null)
                            return matchItem;
                    }
                }
            }

            return null;
        }, // hitTest

        _addColumn: function (width) {
            if (width < this.minColumnWidth)
                width = this.minColumnWidth;


            this.columnWidths.push(width);

            return this.columnWidths.length - 1;
        },

        setColumnWidth: function (columnIndex, width) {
            if (columnIndex >= this.columnWidths.length) {
                this._updateColumnsCount(columnIndex + 1);
            }

            if (width < this.minColumnWidth)
                width = this.minColumnWidth;

            if (columnIndex < this.columnWidths.length)
                this.columnWidths[columnIndex] = width;

            this._renderRequired = true;

            return true;
        },

        getColumnWidth: function (columnIndex) {
            if (columnIndex >= this.columnWidths.length)
                return 70;

            return this.columnWidths[columnIndex];
        },

        _getVisibleLeaves: function (list, item, isTreeStyle) {
            if (item.isHidden || item.isFiltered)
                return true;

            if (item.items.length == 0 && item.valueItems.length == 0) {
                list.push(item);
                return true;
            }

            if (isTreeStyle) {
                list.push(item);
            }

            if (item.isExpanded) {
                for (var i = 0; i < item.items.length; i++) {
                    var childItem = item.items[i];
                    if (childItem.isHidden || childItem.isFiltered)
                        continue;

                    if ((item.items.length > 0 && childItem.isExpanded) || childItem.hasVisibleValueItems()) {
                        this._getVisibleLeaves(list, childItem, isTreeStyle);
                    }
                    else {
                        list.push(childItem);
                    }
                } // for
            }

            for (var i = 0; i < item.valueItems.length; i++) {
                var valueItem = item.valueItems[i];
                if (valueItem.isHidden || valueItem.isFiltered)
                    continue;

                list.push(valueItem);
            }

            return true;
        },

        _getVisibleLeafLevelItems: function () {
            if (this.visibleLeafItems.length == 0)
                this._updateVisibleLeaves();

            return this.visibleLeafItems;
        },

        _updateVisibleLeaves: function () {
            this.visibleLeafItems = new Array();

            if (this.items.length + this.valueItems.length == 0)
                return;

            var isTreeStyle = !this.isColumnsHierarchy && this.compactStyleRenderingEnabled;

            for (var i = 0; i < this.items.length; i++) {

                var item = this.items[i];
                if (item.isHidden || item.isFiltered)
                    continue;

                if (item.isExpanded || item.hasVisibleValueItems()) {
                    this._getVisibleLeaves(this.visibleLeafItems, item, isTreeStyle);
                }
                else {
                    this.visibleLeafItems.push(item);
                }

            } // for

            for (var i = 0; i < this.valueItems.length; i++) {
                var item = this.valueItems[i];
                if (item.isHidden || item.isFiltered)
                    continue;

                if (item.isExpanded || item.hasVisibleValueItems()) {
                    this._getVisibleLeaves(this.visibleLeafItems, item, isTreeStyle);
                }
                else {
                    this.visibleLeafItems.push(item);
                }
            } // for

            for (var i = 0; i < this.visibleLeafItems.length; i++) {
                this.visibleLeafItems[i]._lfIndex = i;
            }

            this._updateItemsLevelAndColumn();
        },

        _getFirstLeafIndexToRender: function () {
            var point = { x: this.x, y: this.y };

            var pointNoScroll = { x: point.x, y: point.y };
            pointNoScroll.x -= this.x - (this.viewPort.x - this.x);
            pointNoScroll.y -= this.y - (this.viewPort.y - this.y);

            var hitIndex = this._binSearchItems(this._getVisibleLeafLevelItems(), pointNoScroll);
            return hitIndex;
        },

        _getLastLeafIndexToRender: function () {
            var pt = {
                x: Math.min(this.viewPort.width, this.getWidth()) - 5,
                y: Math.min(this.viewPort.height, this.getHeight()) - 5
            };

            var idx = this._pointToLeafItemIndex(pt);

            return idx;
        },

        _getLeafItemsToRender: function () {
            var result = {};
            result.items = this._getVisibleLeafLevelItems();
            result.first = this._getFirstLeafIndexToRender();
            result.last = this._getLastLeafIndexToRender();

            return result;
        },

        _getItemsToRender: function () {
            var data = this._getLeafItemsToRender();

            var first = data.first;
            var last = data.last;

            if (first == -1 || last == -1)
                return;

            var h = {};
            for (i = first; i <= last; i++) {
                var item = data.items[i];
                h[item.id] = item;
                while (item.parentItem != null) {
                    item = item.parentItem;
                    h[item.id] = item;
                }
            }

            var list = new Array();
            for (var i in h)
                list.push(h[i]);

            return list;
        },

        _updateItemsLevelAndColumn2: function (item, depth) {
            item.itemColumn = depth;
            item.itemLevel = depth;

            for (var i = 0; i < item.items.length; i++)
                this._updateItemsLevelAndColumn2(item.items[i], depth + 1);

            for (var i = 0; i < item.valueItems.length; i++)
                this._updateItemsLevelAndColumn2(item.valueItems[i], depth + 1);

        },

        _updateItemsLevelAndColumn: function () {
            for (var i = 0; i < this.items.length; i++)
                this._updateItemsLevelAndColumn2(this.items[i], 0);
            for (var i = 0; i < this.valueItems.length; i++)
                this._updateItemsLevelAndColumn2(this.valueItems[i], 0);

        },

        updateColumnsCount: function () {
            this.updateColumnsCount(0);
        },

        getTotalItemsCount: function () {
            var count = 0;

            if (this.items.length == 0 && this.valueItems.length == 0) {
                count = 1;
            }
            else {
                for (var i = 0; i < this.items.length; i++)
                    count += this.items[i].getTotalItemsCount();

                for (var i = 0; i < this.valueItems.length; i++)
                    count += this.valueItems[i].getTotalItemsCount();
            }

            return count;
        },


        _updateColumnsCount: function (desiredCount) {
            var columnsCount = this._getColumnsCount();
            var totalCount = this.getTotalItemsCount();

            if (desiredCount > 1024)
                desiredCount = 1024;

            if (this.isColumnsHierarchy) {
                if (desiredCount > totalCount)
                    totalCount = desiredCount;
            }
            else {
                var depth = this.getHierarchyDepth();
                totalCount = desiredCount > depth ? desi : depth;
            }

            for (var i = columnsCount; i < totalCount; i++)
                this._addColumn(70);

            this._isColumnsCountRequresUpdate = false;
        }, // _updateColumnsCount

        _updateColumnsIndexes: function () {
            for (var i in this.items)
                this._updateItemsLevelAndColumn2(this.items[i], 0);
            for (var i in this.valueItems)
                this._updateItemsLevelAndColumn2(this.valueItems[i], 0);

        },

        _getColumnsCount: function () {
            return this.columnWidths.length;
        },

        _getRenderedItems: function () {
            var list = new Array();
            this._getChildItemsToRender(list);

            return list;
        },

        _getChildItemsToRender: function (list) {
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                if (item.isHidden || item.isFiltered)
                    continue;

                list.push(item);

                if (item.isExpanded)
                    item._getChildItemsToRender(list);
            }
        },

        getWidth: function () {
            if (this._renderRequired)
                this.render();

            return this._width;
        },

        getHeight: function () {
            if (this._renderRequired)
                this.render();

            return this._height;
        },

        /////////////////// SELECTION ////////////////////

        // Begins selection update. Marks all selected items for unselection.
        _beginSelectionUpdate: function () {
            for (var i in this._selectedItems) {
                this._selectedItems[i].OldIsSelected = this._selectedItems[i].isSelected;
            }
        },

        // Ends selection update. Removes all items which are marked as unselected.
        _endSelectionUpdate: function () {
            var keysToDelete = new Array();
            for (var i in this._selectedItems) {
                var item = this._selectedItems[i];
                if (!item.isSelected)
                    keysToDelete.push(this._selectedItems[i]);

                if (item.isSelected != item.OldIsSelected &&
                    (item.parentItem == null || item.parentItem.isExpanded == true || item._isValueItem)
                    ) {
                    var event = new $.Event('pivotitemselectionchanged');
                    event.owner = this.parentPivotGrid;
                    event.args = { pivotItem: item, selected: item.isSelected };

                    this.parentPivotGrid.host.trigger(event);
                }
            }

            for (var i in keysToDelete) {
                var itemToDelete = this._selectedItems[keysToDelete[i].adapterItem.key];
                itemToDelete.isSelected = itemToDelete.OldIsSelected = false;
                delete this._selectedItems[keysToDelete[i].adapterItem.key];
            }
        },

        // Selects an item in the pivotHierarchy
        selectItem: function (item) {
            if (!this.parentPivotGrid.selectionEnabled)
                return;

            this._beginSelectionUpdate();

            this._internalSelectItem(item);

            this._endSelectionUpdate();
        },

        _internalSelectItem: function (item) {
            if (null == item)
                return;

            if (item.isColumn != this.isColumnsHierarchy)
                return;

            if (this.isColumnsHierarchy && this.isGroupingColumn(item))
                return;

            var key = item.adapterItem.key;

            if (this._selectedItems[key] == undefined) {
                this._selectedItems[key] = item;
            }

            item.isSelected = true;

            // update the dirty flags
            this._refreshRequired = true;
            this.parentPivotGrid._pivotCells._refreshRequired = true;

            // do not apply selection on child items in case of TreeStyle rows rendering
            if (!this.isColumnsHierarchy && item.hierarchy.compactStyleRenderingEnabled)
                return;

            for (var i in item.items)
                this._internalSelectItem(item.items[i]);

            for (var i in item.valueItems)
                this._internalSelectItem(item.valueItems[i]);
        },

        // UnSelects an item in the pivotHierarchy
        unselectItem: function (item) {
            this._beginSelectionUpdate();

            this._internalUnselectItem(item);

            this._endSelectionUpdate();
        },

        _internalUnselectItem: function (item) {
            if (null == item)
                return;

            if (item.isColumn != this.isColumnsHierarchy)
                return;

            var key = item.adapterItem.key;

            if (this._selectedItems[key]) {
                this._selectedItems[key].isSelected = false;

                // update the dirty flags
                this._refreshRequired = true;
                this.parentPivotGrid._pivotCells._refreshRequired = true;
            }

            // do not apply selection on child items in case of TreeStyle rows rendering
            if (!this.isColumnsHierarchy && item.hierarchy.compactStyleRenderingEnabled)
                return;

            for (var i in item.items)
                this._internalUnselectItem(item.items[i]);

            for (var i in item.valueItems)
                this._internalUnselectItem(item.valueItems[i]);
        },

        _internalClearSelection: function () {
            for (var i in this._selectedItems)
                this._internalUnselectItem(this._selectedItems[i]);
        },

        // Unselects all selected items.
        clearSelection: function () {
            this._beginSelectionUpdate();

            this._internalClearSelection();

            this._endSelectionUpdate();
        },

        _applySelectionToParentItem: function (item) {
            var parentItem = item.parentItem;
            if (parentItem == undefined || parentItem == null)
                return;

            var hierarchy = item.hierarchy;

            var bApply = true;
            if (parentItem.isExpanded) {
                for (var i in parentItem.items) {
                    var childItem = parentItem.items[i];
                    if (false == childItem.isSelected && childItem.isHidden == false) {
                        bApply = false;
                        break;
                    }
                }
            }

            if (bApply) {
                for (var i in parentItem.valueItems) {
                    var childItem = parentItem.valueItems[i];
                    if (false == childItem.isSelected && childItem.isHidden == false) {
                        bApply = false;
                        break;
                    }
                }
            }

            if (bApply) {
                var key = parentItem.adapterItem.key;
                if (hierarchy._selectedItems[key] == undefined) {
                    hierarchy._selectedItems[key] = parentItem;
                    //TODO: raise event
                    //parentPivotGrid.OnHierarchyItemSelectionChanged(item);
                }

                parentItem.isSelected = true;

                this._applySelectionToParentItem(parentItem);
            }
        },

        _applySelectionToParentItems: function () {
            for (var i in this._selectedItems) {
                this._applySelectionToParentItem(this._selectedItems[i]);
            }
        },

        // Gets the selected items
        getSelectedItems: function () {
            var list = new Array();
            for (var i in this._selectedItems)
                if (this._selectedItems[i].isSelected)
                    list.push(i);

            return list;
        }

        //////////////// END OF SELECTION ////////////////
    } // pivotHierarchy
    );

    ///////////////////////////////////////////////////
    ///////////////////////////////////////////////////

    $.jqx.jqxPivotGrid.pivotRows = function (parentPivotGrid) {
        $.extend(this, new $.jqx.jqxPivotGrid.hierarchy);

        this.parentPivotGrid = parentPivotGrid;
        this.isColumnsHierarchy = false;
        this.compactStyleRenderingEnabled = false;
        this.compactStyleRenderingItemsIndent = 20;
    };

    $.extend($.jqx.jqxPivotGrid.pivotRows.prototype, $.jqx.jqxPivotGrid.hierarchy.prototype);

    $.extend($.jqx.jqxPivotGrid.pivotRows.prototype, {
        setColumnWidth: function (columnIndex, width) {
            if (columnIndex >= this.columnWidths.Count)
                this._updateColumnsCount(columnIndex + 1);

            if (this.compactStyleRenderingEnabled) {
                columnIndex = 0;
            }

            if (columnIndex < this.columnWidths.length)
                this.columnWidths[columnIndex] = width;

            this._renderRequired = true;

            return true;
        },

        updateBounds: function () {
            // calculate the height & width
            var height = 0;
            var width = 0;
            for (var c = 0; c < 2; c++) {
                var itemsCollection = (c == 0) ? this.items : this.valueItems;
                for (var i = 0; i < itemsCollection.length; i++) {
                    var item = itemsCollection[i];
                    if (item.isHidden)
                        continue;

                    var h = item.getHeightWithChildren();
                    height += h;
                    var w = item.getWidthWithChildren();
                    if (width < w)
                        width = w;
                }
            }

            this._width = width;
            this._height = height + 1;
        },

        render: function () {
            if (this._renderSuppressed)
                return;

            this._refreshRequired = true;
            this.parentPivotGrid._pivotCells._refreshRequired = true;

            this.isRendering = true;

            //this._updateItemsLevelAndColumn();

            if (this._isColumnsCountRequresUpdate)
                this._updateColumnsCount();

            while (this._getColumnsCount() < this.getHierarchyDepth())
                $.jqx.get(this, 'columnWidths').push(70);

            this._updateVisibleLeaves();

            if (this.compactStyleRenderingEnabled) {
                if (this.columnWidths.Count == 0)
                    this._addColumn(70);

                var width = this.columnWidths[0];
                var depth = this.getHierarchyDepth();
                if (width < depth * (this.compactStyleRenderingItemsIndent))
                    width = depth * (this.compactStyleRenderingItemsIndent);

                this.columnWidths[0] = width;
            }

            //ApplyFilters();

            this.updateBounds();

            var offsetY = 0;

            // recompute the items' positions
            if (this.items.length + this.valueItems.length == 0) {
                if (this.parentPivotGrid != null)
                    this.parentPivotGrid.isSyncScrollRequired = true;

                this.isRendering = false;
                this._renderRequired = false;
                return;
            }

            for (var i = 0; i < 2; i++) {
                var itemsCollection = (i == 0) ? this.items : this.valueItems;
                for (var j = 0; j < itemsCollection.length; j++) {
                    var item = itemsCollection[j];
                    if (item.hierarchy == null) {
                        item.hierarchy = this;
                    }

                    if (item.isHidden)
                        continue;

                    var h = item.getHeightWithChildren();

                    if (item.itemLevel < this.columnWidths.length && item.getWidth() > this.columnWidths[item.itemLevel])
                        this.columnWidths[item.itemLevel] = item.getWidth();

                    if (!item.render(0, offsetY))
                        break;

                    offsetY += h;
                }
            }

            this.updateBounds();
            if (this.parentPivotGrid != null) {
                this.parentPivotGrid.isSyncScrollRequired = true;
            }

            // cleanup the canvas
            this._resetCanvas();

            this._renderRequired = false;
            this.isRendering = false;
        },

        isOnRowDetails: function (point, item) {
            if (!item.RowDetailsVisible)
                return false;

            var pointNoScroll = { x: point.x, y: point.y };
            pointNoScroll.x += -this.x + this.viewPort.x;
            pointNoScroll.y += -this.y + this.viewPort.y;

            if (pointNoScroll.y < item.y + item.getDisplayHeight() &&
                pointNoScroll.y > item.y + item.getDisplayHeight() - item.RowDetailsHeight) {
                return true;
            }

            return false;
        }

    } // pivotRows
    );

    ///////////////////////////////////////////////////
    ///////////////////////////////////////////////////

    ///////////////////////////////////////////////////
    ///////////////////////////////////////////////////
    $.jqx.jqxPivotGrid.pivotColumns = function (parentPivotGrid) {
        $.extend(this, new $.jqx.jqxPivotGrid.hierarchy);

        this.parentPivotGrid = parentPivotGrid;
        this.isColumnsHierarchy = true;
    };

    $.extend($.jqx.jqxPivotGrid.pivotColumns.prototype, $.jqx.jqxPivotGrid.hierarchy.prototype);

    $.extend($.jqx.jqxPivotGrid.pivotColumns.prototype, {

        render: function () {
            if (this._renderSuppressed)
                return;

            this._refreshRequired = true;
            this.parentPivotGrid._pivotCells._refreshRequired = true;

            //ApplyFilters();
            this._updateVisibleLeaves();
            this._updateColumnsIndexes();

            if (this.items.length + this.valueItems.length == 0) {
                if (this.parentPivotGrid != null)
                    this.parentPivotGrid.isSyncScrollRequired = true;

                this._updateVisibleLeaves();
                return;
            }

            var offsetX = 0;

            for (var i = 0; i < 2; i++) {
                var itemsCollection = (i == 0) ? this.items : this.valueItems;

                for (var j = 0; j < itemsCollection.length; j++) {
                    var item = itemsCollection[j];
                    if (item.hierarchy == null) {
                        item.hierarchy = this;
                    }

                    if (item.isHidden)
                        continue;

                    var w = item.getWidthWithChildren();

                    if (!item.render(offsetX, 0))
                        break;

                    offsetX += w;
                }
            }

            //RenderingManager.Orientation = Orientation.Horizontal;
            this._renderRequired = false;

            if (this.parentPivotGrid != null) {
                this.parentPivotGrid.isSyncScrollRequired = true;
            }

            this._updateVisibleLeaves();
            this.updateBounds();

            this._resetCanvas();
        },

        updateBounds: function () {
            // calculate the height
            var height = 0;
            var width = 0;

            for (var i = 0; i < 2; i++) {
                var itemsCollection = (i == 0) ? this.items : this.valueItems;
                for (var j = 0; j < itemsCollection.length; j++) {
                    var item = itemsCollection[j];
                    var h = item.getHeightWithChildren();

                    if (height < h)
                        height = h;

                    width += item.getWidthWithChildren();
                }
            }

            this._height = height;
            this._width = width + 1;
        },

        _updateColumnsIndexes: function () {
            var count = this.visibleLeafItems.length;
            for (var i = --count; i >= 0; i--) {
                var item = this.visibleLeafItems[i];

                item.itemColumn = i;

                var parentItem = item.parentItem;
                while (parentItem != null) {
                    if (parentItem.hierarchy != item.hierarchy) {
                        parentItem = null;
                    }
                    else {
                        parentItem.itemColumn = i;

                        item = parentItem;
                        parentItem = item.parentItem;
                    }
                }
            }
        },

        setRowHeight: function (hierarchyItem, height) {
            if (height < 15 || height > 500)
                return false;

            hierarchyItem.hierarchyItemHeight = height;
            this._renderRequired = true;
            return true;
        },

        isGroupingColumn: function (item) {
            if (item == null)
                return false;

            if (this.parentPivotGrid == null)
                return false;

            if (item.ItemIndex < this.parentPivotGrid.groupingColumns.length && this.parentPivotGrid.isGroupingEnabled)
                return true;

            return false;
        }

    });
})(jqxBaseFramework);
// End of Pivot hierarchies

// Pivot grid keyboard navigation
(function ($) {
    $.extend($.jqx._jqxPivotGrid.prototype, {
        _handleKeyboardNavigation: function (event) {
            if (this._internalSelectMode == 'CELLS_SELECT')
                return this._handleCellsKeyboardNavigation(event);
            else if (this._internalSelectMode == 'ROW_SELECT' || this._internalSelectMode == 'COL_SELECT') {
                //   return this._handleItemsKeyboardNavigation(event);
            }

            return false;
        },

        _handleCellsKeyboardNavigation: function (event) {
            var currentCell = this._cellKBRangeSelectionEnd;
            var cellToSelect = undefined;

            var self = this;

            if (!currentCell)
                return false;

            if (event.keyCode == 37 /* keys left */) {
                cellToSelect = this._pivotCells.getNextCell(currentCell, 'left');
            }
            if (event.keyCode == 38 /* key up */) {
                cellToSelect = this._pivotCells.getNextCell(currentCell, 'top');
            }
            else if (event.keyCode == 39 /* keys right */) {
                cellToSelect = this._pivotCells.getNextCell(currentCell, 'right');
            }
            else if (event.keyCode == 40 /* key down */) {
                cellToSelect = this._pivotCells.getNextCell(currentCell, 'bottom');
            }

            if (cellToSelect != null) {
                this._pivotRows._refreshRequired = true;
                this._pivotColumns._refreshRequired = true;
                this._pivotCells._refreshRequired = true;

                this._colItemRangeSelectionBeg = cellToSelect.pivotColumn;
                this._rowItemRangeSelectionBeg = cellToSelect.pivotRow;

                this._beginSelectionUpdate();

                if (!this._isCTRLPressed || false == this.multipleSelectionEnabled) {
                    this._internalClearSelection();
                }

                this._pivotCells._internalSelectCell(this._rowItemRangeSelectionBeg, this._colItemRangeSelectionBeg);

                this._cellKBRangeSelectionEnd = { pivotRow: this._rowItemRangeSelectionBeg, pivotColumn: this._colItemRangeSelectionBeg, pivotCells: this._pivotCells };
                if (!this._cellKBRangeSelectionStart || !this._isSHIFTPressed)
                    this._cellKBRangeSelectionStart = { pivotRow: this._rowItemRangeSelectionBeg, pivotColumn: this._colItemRangeSelectionBeg, pivotCells: this._pivotCells };

                var cBeg = Math.min(this._cellKBRangeSelectionStart.pivotColumn._lfIndex, this._cellKBRangeSelectionEnd.pivotColumn._lfIndex);
                var cEnd = Math.max(this._cellKBRangeSelectionStart.pivotColumn._lfIndex, this._cellKBRangeSelectionEnd.pivotColumn._lfIndex);
                var rBeg = Math.min(this._cellKBRangeSelectionStart.pivotRow._lfIndex, this._cellKBRangeSelectionEnd.pivotRow._lfIndex);
                var rEnd = Math.max(this._cellKBRangeSelectionStart.pivotRow._lfIndex, this._cellKBRangeSelectionEnd.pivotRow._lfIndex);

                for (var c = cBeg; c <= cEnd; c++) {
                    for (var r = rBeg; r <= rEnd; r++) {
                        var pivotColumn = this._pivotColumns.visibleLeafItems[c];
                        var pivotRow = this._pivotRows.visibleLeafItems[r];

                        this._pivotCells._internalSelectCell(pivotRow, pivotColumn);
                    }
                }

                this._endSelectionUpdate();

                cellToSelect.pivotRow.ensureVisible();
                cellToSelect.pivotColumn.ensureVisible();

                this._internalRefresh();
            }

            return false;
        }
    });
})(jqxBaseFramework);

// End of pivot grid keyboard navigation

