/* tslint:disable */
/* eslint-disable */
(function ($) {

    $.jqx.pivot = function (dataAdapter, settings) {
        var self = this;

        self.dataAdapter = dataAdapter;
        self.rows = [];
        self.columns = [];
        self.values = [];
        self.filters = [];
        self.pivotValuesOnRows = false;
        self.totals = { rows: { subtotals: false, grandtotals: false }, columns: { subtotals: false, grandtotals: false } };
        self.localization = null;
        self.aggregationFunctions = {};
        self._initSettings = {};

        $.extend(self.aggregationFunctions, self._defaultFunctions);

        if (settings) {
            self._initSettings = settings;
            self.columns = settings.columns || [];
            self.rows = settings.rows || [];
            self.values = settings.values || [];
            self.filters = settings.filters || [];
            self.pivotValuesOnRows = settings.pivotValuesOnRows || false;
            self.totals = settings.totals;
            self.localization = settings.localization;
            $.extend(self.aggregationFunctions, settings.customAggregationFunctions || {});
        }

        if (self.rows.length === 0 && self.columns.length > 0 && self.pivotValuesOnRows === false)
            self.pivotValuesOnRows = true;

        if (self.columns.length === 0 && self.rows.length > 0 && self.pivotValuesOnRows !== false)
            self.pivotValuesOnRows = false;

    },

    $.jqx.pivot.prototype = {
        _clear: function () {
            this._pivot = {
                rows: [],
                columns: [],
                values: [],
                groups: [],
                filters: []
            };

            this._rowsHierarchy = { items: {}, valueItems: {} };
            this._columnsHierarchy = { items: {}, valueItems: {} };
            this._hashPivotItemsToTableRows = {};
            this._hashRefItems = {};

            this._hierarchyItemKeyIndex = 0;
        },

        _contains: function (arr, value, strict) {
            if (!arr)
                return false;

            for (var i = 0; i < arr.length; i++)
                if (strict ? arr[i] === value : arr[i].dataField === value)
                    return true;

            return false;
        },

        _getFieldIndex: function (fields, dataField) {
            if (!fields)
                return -1;

            var propIndex = 0;
            for (; propIndex < fields.length; propIndex++) {
                if (fields[propIndex].name === dataField)
                    break;
            }

            if (propIndex === fields.length)
                return -1;

            return propIndex;
        },

        dataBind: function () {
            this._clear();

            if (!this.dataAdapter)
                return;

            this.dataAdapter.dataBind();

            var keys = ['columns', 'rows', 'values', 'filters'];

            // apply the set pivot fields
            for (var k in keys) {
                var pivotKey = keys[k];
                for (var i = 0; i < this[pivotKey].length; i++) {
                    var item = this[pivotKey][i];
                    if (!item)
                        continue;

                    // ensure each pivot field is used only once
                    var isDuplicate = false;
                    if (pivotKey !== 'values' && pivotKey !== 'filters') {
                        for (var k2 in keys) {
                            var key = keys[k2];

                            if (pivotKey !== key) // allow same data field on columns and rows
                                continue;

                            isDuplicate = this._contains(this._pivot[key], item.dataField);

                            if (isDuplicate)
                                break;
                        }

                        if (isDuplicate)
                            continue;
                    }

                    this._pivot[pivotKey].push(item);
                }
            }

            // create a pivot
            this._createPivot();

        }, // DataBind

        _isRowSkipped: function (gridRow) {
            for (var i in this.filters) {
                var filter = this.filters[i];
                if (!$.isFunction(filter.filterFunction))
                    continue;

                if (filter.dataField && gridRow[filter.dataField] !== undefined) {
                    if (filter.filterFunction(gridRow[filter.dataField]))
                        return true;
                }
            }

            return false;
        },

        getItemsFilterStatus: function(dataField)
        {
            var items = {};
            var records = this.dataAdapter.records;

            for (var r = 0; r < records.length; r++) {
                var gridRow = records[r];

                var value = gridRow[dataField];

                if (items[value])
                    continue;

                for (var i in this.filters) {
                    var filter = this.filters[i];
                    if (filter.dataField !== dataField)
                        continue;

                    var isFiltered = $.isFunction(filter.filterFunction) && filter.filterFunction(value);

                    items[value] = isFiltered;
                }
            }

            return items;
        },

        _createPivot: function () {
            // check pivot mode 
            var isPivotMode = this._pivot.values.length > 0 && (this._pivot.rows.length > 0 || this._pivot.columns.length > 0);

            if (isPivotMode) {
                var hashRowPrefixes = {};
                var hashColPrefixes = {};
                this.hashSummaryPrefixes = {};

                var records = this.dataAdapter.records;

                for (var r = 0; r < records.length; r++) {
                    var gridRow = records[r];

                    if (this._isRowSkipped(gridRow))
                        continue;

                    var sourceDataFields = this.dataAdapter._source.datafields;

                    this._appendPivotHierarchy(
                         r,
                         hashRowPrefixes,
                         this._rowsHierarchy,
                         sourceDataFields,
                         this._pivot.rows,
                         this.pivotValuesOnRows ? this._pivot.values : null);

                    this._appendPivotHierarchy(
                        r,
                        hashColPrefixes,
                        this._columnsHierarchy,
                        sourceDataFields,
                        this._pivot.columns,
                        !this.pivotValuesOnRows ? this._pivot.values : null);
                }

                this._setupTotals(this._columnsHierarchy);
                this._setupTotals(this._rowsHierarchy);
            }

            return;
        },

        // ********* Pivot Totals **********************
        _setupTotals: function (hierarchy) {
            if (!this.totals)
                return;

            var totalsMode = (hierarchy === this._columnsHierarchy) ? this.totals['columns'] : this.totals['rows'];
            if (!totalsMode || (totalsMode['subtotals'] !== true && totalsMode['grandtotals'] !== true))
                return;

            this._addTotals(hierarchy.items, false, totalsMode);

            if ((hierarchy === this._columnsHierarchy) === (!this.pivotValuesOnRows)) {
                this._addvalueItemsToTotals(hierarchy.items);
            }
        },

        _addvalueItemsToTotals: function (collection) {
            for (var i in collection) {
                var item = collection[i];

                if (item.isTotal) {
                    if (!this._hashRefItems[item.key])
                        continue;

                    refItems = this._hashRefItems[item.key].refItems;

                    var list = [];

                    for (var i = 0; i < refItems.length; i++) {
                        var refPivotRows = this._hashPivotItemsToTableRows[refItems[i].key];
                        for (var k = 0; k < refPivotRows.length; k++)
                            list.push(refPivotRows[k]);

                        if (i === 0) {
                            item.valueItems = {};
                            for (var j in refItems[i].valueItems) {
                                var summaryItem = refItems[i].valueItems[j];
                                var newSummaryItem = {
                                    text: summaryItem.text,
                                    boundField: summaryItem.boundField,
                                    isTotal: true,
                                    key: this._hierarchyItemKeyIndex++
                                };

                                item.valueItems[j] = newSummaryItem;

                                //this._addRefItem(newSummaryItem, summaryItem);
                            }
                        }

                    }

                    list.sort(function (a, b) { return a - b; });
                    for (var j in item.valueItems) {
                        this._hashPivotItemsToTableRows[item.valueItems[j].key] = list;
                    }

                    delete this._hashRefItems[item.key];
                }
                else {
                    this._addvalueItemsToTotals(item.items);
                }
            }
        },

        // *********** Pivot table totals *********************
        _clearTotals: function (collection) {
            for (var i in collection) {
                var item = collection[i];
                if (item.isTotal) {
                    delete collection[item];
                }
                else {
                    this._clearTotals(collection[i].items);
                }
            }
        },

        _addTotals: function (collection, isSubTotal, totalsMode) {
            if (undefined === collection)
                return;

            this._clearTotals(collection);

            var refItems = [];
            var cnt = 0;
            for (var i in collection) {
                var item = collection[i];

                if (totalsMode['subtotals'] === true) {
                    this._addTotals(item.items, true, totalsMode);
                }

                refItems.push(item);

                cnt++;
            }

            if (cnt === 0)
                return;

            if (!isSubTotal && totalsMode['grandtotals'] != true) {
                return;
            }

            var entryKey = isSubTotal ? 'SubTotal' : 'Total';
            var totalEntry = '_' + entryKey + '_';

            var text = isSubTotal ? 'SubTotal' : 'Total';

            var localization = this.localization;

            if (localization) {
                if (isSubTotal)
                    text = $.jqx.getByPriority([localization['subtotalstring'], localization['SubTotalString'], text]);
                else
                    text = $.jqx.getByPriority([localization['grandtotalstring'], localization['GrandTotalString'], text]);
            }

            var key = this._hierarchyItemKeyIndex++;
            var itemTotal = collection[totalEntry] = { text: text, key: key };

            var refRows = [];
            for (var i = 0; i < refItems.length; i++)
                for (var j = 0; j < this._hashPivotItemsToTableRows[refItems[i].key].length; j++)
                    refRows.push(this._hashPivotItemsToTableRows[refItems[i].key][j]);

            this._hashRefItems[key] = { item: itemTotal, refItems: refItems };
            this._hashPivotItemsToTableRows[key] = refRows.sort(function (a, b) { return a - b; });

            itemTotal.isTotal = true;
        },
        // *********** End of Pivot table totals *********************

        _appendPivotHierarchy: function (
            rowIndex,
            hashPrefixes,
            hierarchy,
            sourceDataFields,
            boundFields,
            boundValueFields) {

            var boundFieldsValues = [];
            var strPrefix = "";

            var gridRow = this.dataAdapter.records[rowIndex];

            if (!this._getBoundFieldsValues(gridRow, boundFields, boundFieldsValues))
                return false;

            //Debug.Assert(fields.Count == boundFields.Count);

            strPrefix.substring(0, strPrefix.length);

            var parentItem = null;

            //#region Add the Bound fields to the hierarchy
            // If the hierarchy is empty just attach the value fields as attributes
            if (boundFieldsValues.length == 0 && boundValueFields != null) {
                //this._attachValueFieldAsSummaryItem(rowIndex, hashPrefixes, parentItem, strPrefix.ToString(), boundValueFields);
                this._attachValueFieldAsSummaryItem(rowIndex, hashPrefixes, parentItem, strPrefix, boundValueFields);
                return true;
            }

            // append the current item to the hierarchy and attach the value fields as attributes
            for (var i = 0; i < boundFieldsValues.length; i++) {
                strPrefix += "!_$%^&_";
                var currentFieldValue = boundFieldsValues[i];
                strPrefix += currentFieldValue;

                if (!hashPrefixes[strPrefix]) {
                    if (null == parentItem) {
                        parentItem = hierarchy.items[currentFieldValue] = { text: currentFieldValue };
                    }
                    else {
                        this._addSourceRecordToPivotItem(parentItem.key, rowIndex);
                        if (!parentItem.items)
                            parentItem.items = {};

                        parentItem = parentItem.items[currentFieldValue] = { text: currentFieldValue };
                    }

                    this._applyBoundFieldProperties(boundFields[i], parentItem);
                    hashPrefixes[strPrefix] = parentItem;

                    parentItem.key = this._hierarchyItemKeyIndex++;
                }
                else {
                    parentItem = hashPrefixes[strPrefix];
                }

                if (boundValueFields == null || boundValueFields.length == 0) {
                    this._addSourceRecordToPivotItem(parentItem.key, rowIndex);
                }
                else {
                    this._addSourceRecordToPivotItem(parentItem.key, rowIndex);
                    if (boundValueFields != null) {
                        this._attachValueFieldAsSummaryItem(rowIndex, hashPrefixes, parentItem, strPrefix, boundValueFields);
                    }
                }
            }

            // #endregion

            return true;
        }, // _appendPivotHierarchy

        _attachValueFieldAsSummaryItem: function (rowIndex, hashPrefixes, item, strPrefix, boundValueFields) {
            // Add each Value Field behind the parent item
            // or attach it directly to the hierarchy in case of
            // a hierarchy which contains Value fields only
            for (var i = 0; i < boundValueFields.length; i++) {
                var boundValueField = boundValueFields[i];
                var summaryItem = null;

                var prefixKey = strPrefix + boundValueField.dataField + i;
                if (hashPrefixes[prefixKey]) {
                    summaryItem = hashPrefixes[prefixKey];
                }
                else {
                    if (null != item) {
                        if (!item.valueItems)
                            item.valueItems = {};

                        summaryItem = item.valueItems[boundValueField.dataField + i] = { text: boundValueField.text || boundValueField.dataField };
                    }
                    else {
                        var hierarchy = this.pivotValuesOnRows ? this._rowsHierarchy : this._columnsHierarchy;
                        summaryItem = hierarchy.valueItems[boundValueField.dataField + i] = { text: boundValueField.text || boundValueField.dataField };
                    }

                    hashPrefixes[prefixKey] = summaryItem;

                    summaryItem.key = this._hierarchyItemKeyIndex++;
                }

                this._applyBoundFieldProperties(boundValueField, summaryItem);

                this._addSourceRecordToPivotItem(summaryItem.key, rowIndex);
            }
        },

        _applyBoundFieldProperties: function (bf, item) {
            item.boundField = bf;
            if (bf.text)
                item.boundFieldText = bf.text;
        },

        _addSourceRecordToPivotItem: function (hierarchyItemKey, rowIndex) {
            var list = null;
            if (this._hashPivotItemsToTableRows[hierarchyItemKey]) {
                list = this._hashPivotItemsToTableRows[hierarchyItemKey];
            }
            else {
                list = this._hashPivotItemsToTableRows[hierarchyItemKey] = [];
            }

            if (list.length > 0) {
                if (list[list.length - 1] == rowIndex)
                    return;
            }

            list.push(rowIndex);
        },

        _sortedArrayIntersectAndDedup: function (arr1, arr2) {
            var arrOut = [];

            var i = 0;
            var j = 0;
            while (i < arr1.length && j < arr2.length) {
                if (arr1[i] < arr2[j])
                    i++;
                else if (arr1[i] > arr2[j])
                    j++;
                else {
                    if (arrOut.length == 0 || arrOut[arrOut.length - 1] != arr1[i])
                        arrOut.push(arr1[i]);

                    i++;
                    j++;
                }
            }

            return arrOut;
        },

        _getBoundFieldValue: function (gridRow, boundField) {
            if (null == boundField)
                return null;

            return gridRow[boundField];
        },

        _getBoundFieldsValues: function (gridRow, boundFields, outValues) {
            for (var i = 0; i < boundFields.length; i++) {
                var value = gridRow[boundFields[i].dataField];
                if (undefined === value)
                    continue;

                outValues.push(value);
            }

            return true;
        },

        _internalDrillThroughPivotCell: function (key1, key2, excludeFilteredItems) {
            var arr1 = this._hashPivotItemsToTableRows[key1] || [];
            var arr2 = this._hashPivotItemsToTableRows[key2] || [];
            if (arr1.length == 0 || arr2.length == 0)
                return [];

            return this._sortedArrayIntersectAndDedup(arr1, arr2);
        },

        drillThroughPivotCell: function(rowItem, columnItem)
        {
            if (!rowItem || undefined === rowItem.key ||
                !columnItem || undefined === columnItem.key)
                return [];

            var excludeFilteredItems = rowItem.isTotal || columnItem.isTotal;

            return this._internalDrillThroughPivotCell(rowItem.key, columnItem.key, excludeFilteredItems);
        },

        getFunctions: function()
        {
            return this.aggregationFunctions;
        },

        _defaultFunctions: {
            'count': function (arr) {
                return arr.length;
            },
            'sum': function (arr) {
                var sum = 0;
                for (var i = 0; i < arr.length; i++)
                    sum += arr[i];

                return sum;
            },
            'min': function (arr) {
                var min = Infinity;
                for (var i = 0; i < arr.length; i++)
                    if (arr[i] < min)
                        min = arr[i];

                return min;
            },
            'max': function (arr) {
                var max = -Infinity;
                for (var i = 0; i < arr.length; i++)
                    if (arr[i] > max)
                        max = arr[i];

                return max;
            },
            'average': function (arr) {
                var cnt = $.jqx.pivot.prototype._defaultFunctions['count'](arr);
                if (cnt == 0)
                    return 0;

                var sum = $.jqx.pivot.prototype._defaultFunctions['sum'](arr);
                return sum / cnt;
            },
            'product': function (arr) {
                var product = 0;
                for (var i = 0; i < arr.length; i++)
                    if (i == 0)
                        product = arr[i];
                    else
                        product *= arr[i];

                return product;
            }
        },

        getCellValue: function (rowItem, columnItem) {
            var value = this._getCellValueFromDataSource(rowItem, columnItem);
            if (isNaN(value))
                return '';

            var boundField = this.pivotValuesOnRows ? rowItem.boundField : columnItem.boundField;
            var formattedValue = this._formatValue(value, boundField.formatSettings, boundField.formatFunction);

            return { value: value, formattedValue: formattedValue };
        },

        getCellFormatSettings: function (rowItem, columnItem) {
            var boundField = this.pivotValuesOnRows ? rowItem.boundField : columnItem.boundField;
            if (boundField)
                return boundField.formatSettings;
            
            return undefined;
        },

        _getCellValueFromDataSource: function (rowItem, columnItem) {
            if (rowItem == undefined)
                throw 'Invalid rowItem';

            if (columnItem == undefined)
                throw 'Invalid columnItem';

            var excludeFilteredItems = rowItem.isTotal || columnItem.isTotal;

            var drillThroughRows = this._internalDrillThroughPivotCell(rowItem.key, columnItem.key, excludeFilteredItems);
            if (drillThroughRows.length == 0)
                return "";

            var boundField = this.pivotValuesOnRows ? rowItem.boundField : columnItem.boundField;

            if (null == boundField)
                return undefined;

            var boundFieldFn = boundField['function'];

            var fn = boundFieldFn || 'count';

            if (typeof (fn) == 'String')
                fn = fn.toLowerCase();


            try {
                var valuesArray = [];

                for (var i = 0; i < drillThroughRows.length; i++) {
                    var tableRow = drillThroughRows[i];

                    var record = this.dataAdapter.records[tableRow];
                    var value = this._getBoundFieldValue(record, boundField.dataField);
                    valuesArray.push(parseFloat(value));
                }

                if (typeof (fn) == 'string') {
                    fn = this.aggregationFunctions[fn];
                }

                if (typeof (fn) == 'function')
                    return fn(valuesArray);
            }
            catch (e) {
                return NaN;
            }

            return NaN;
        },

        ///////////////////////////////////////////////
        // ******** Values Formatting *****************
        // TODO: Move to jqxdata
        _formatValue: function (value, formatSettings, formatFunction) {
            if (value == undefined)
                return '';

            if (this._isObject(value) && !this._isDate(value) && !formatFunction)
                return '';

            if (formatFunction) {
                if (!$.isFunction(formatFunction))
                    return value.toString();

                try {
                    return formatFunction(value);
                }
                catch (e) {
                    return e.message;
                }
            }

            if (this._isNumber(value))
                return this._formatNumber(value, formatSettings);

            if (this._isDate(value))
                return this._formatDate(value, formatSettings);

            if (formatSettings) {
                return (formatSettings.prefix || '') + value.toString() + (formatSettings.sufix || '');
            }

            return value.toString();
        },

        /** @private */
        _isNumberAsString: function (text) {
            if (typeof (text) != 'string')
                return false;

            text = $.trim(text);
            for (var i = 0; i < text.length; i++) {
                var ch = text.charAt(i);
                if ((ch >= '0' && ch <= '9') || ch == ',' || ch == '.')
                    continue;

                if (ch == '-' && i == 0)
                    continue;

                if ((ch == '(' && i == 0) || (ch == ')' && i == text.length - 1))
                    continue;

                return false;
            }

            return true;
        },

        /** @private */
        _castAsDate: function (value, dateFormat) {
            if (value instanceof Date && !isNaN(value))
                return value;

            if (typeof (value) == 'string') {
                var result;

                if (dateFormat) {
                    result = $.jqx.dataFormat.parsedate(value, dateFormat);
                    if (this._isDate(result))
                        return result;
                }

                // try formats detected earlier
                if (this._autoDateFormats) {
                    for (var i = 0; i < this._autoDateFormats.length; i++) {
                        result = $.jqx.dataFormat.parsedate(value, this._autoDateFormats[i]);
                        if (this._isDate(result))
                            return result;
                    }
                }
                else {
                    this._autoDateFormats = [];
                }

                // try all formats
                var detectedFormat = this._detectDateFormat(value);
                if (detectedFormat) {
                    result = $.jqx.dataFormat.parsedate(value, detectedFormat);
                    if (this._isDate(result)) {
                        this._autoDateFormats.push(detectedFormat);
                        return result;
                    }
                }

                // try default conversion
                result = new Date(value);

                if (this._isDate(result)) {
                    if (value.indexOf(':') == -1)
                        result.setHours(0, 0, 0, 0);
                }

                return result;
            }

            return undefined;
        },

        /** @private */
        _castAsNumber: function (value) {
            if (value instanceof Date && !isNaN(value))
                return value.valueOf();

            if (typeof (value) == 'string') {
                if (this._isNumber(value)) {
                    value = parseFloat(value);
                }
                else {
                    if (!/[a-zA-Z]/.test(value)) {
                        var date = new Date(value);
                        if (date != undefined)
                            value = date.valueOf();
                    }
                }
            }

            return value;
        },

        /** @private */
        _isNumber: function (value) {
            if (typeof (value) == 'string') {
                if (this._isNumberAsString(value))
                    value = parseFloat(value);
            }
            return typeof value === 'number' && isFinite(value);
        },

        /** @private */
        _isDate: function (value) {
            return value instanceof Date && !isNaN(value.getDate());
        },

        /** @private */
        _isBoolean: function (value) {
            return typeof value === 'boolean';
        },

        /** @private */
        _isObject: function (value) {
            return (value && (typeof value === 'object' || $.isFunction(value))) || false;
        },

        /** @private */
        _formatDate: function (value, settings) {
            var result = value.toString();

            if (settings) {
                if (settings.dateFormat)
                    result = $.jqx.dataFormat.formatDate(value, settings.dateFormat);

                result = (settings.prefix || '') + result + (settings.sufix || '');
            }

            return result;
        },

        /** @private */
        _formatNumber: function (value, settings) {
            if (!this._isNumber(value))
                return value;

            settings = settings || {};

            var decimalSeparator = '.';
            var thousandsSeparator = '';

            var self = this;

            if (self.localization) {
                decimalSeparator = self.localization.decimalSeparator || self.localization.decimalseparator || decimalSeparator;
                thousandsSeparator = self.localization.thousandsSeparator || self.localization.thousandsseparator || thousandsSeparator;
            }

            if (settings.decimalSeparator)
                decimalSeparator = settings.decimalSeparator;

            if (settings.thousandsSeparator)
                thousandsSeparator = settings.thousandsSeparator;

            var prefix = settings.prefix || '';
            var sufix = settings.sufix || '';
            var decimalPlaces = settings.decimalPlaces;
            if (isNaN(decimalPlaces))
                decimalPlaces = this._getDecimalPlaces([value], undefined, 3);

            var negativeWithBrackets = settings.negativeWithBrackets || false;

            var negative = (value < 0);

            if (negative && negativeWithBrackets)
                value *= -1;

            var output = value.toString();
            var decimalindex;

            var decimal = Math.pow(10, decimalPlaces);
            output = (Math.round(value * decimal) / decimal).toString();
            if (isNaN(output)) {
                output = '';
            }

            decimalindex = output.lastIndexOf(".");
            if (decimalPlaces > 0) {
                if (decimalindex < 0) {
                    output += decimalSeparator;
                    decimalindex = output.length - 1;
                }
                else if (decimalSeparator !== ".") {
                    output = output.replace(".", decimalSeparator);
                }
                while ((output.length - 1 - decimalindex) < decimalPlaces) {
                    output += "0";
                }
            }

            decimalindex = output.lastIndexOf(decimalSeparator);
            decimalindex = (decimalindex > -1) ? decimalindex : output.length;
            var newoutput = output.substring(decimalindex);
            var cnt = 0;
            for (var i = decimalindex; i > 0; i--, cnt++) {
                if ((cnt % 3 === 0) && (i !== decimalindex) && (!negative || (i > 1) || (negative && negativeWithBrackets))) {
                    newoutput = thousandsSeparator + newoutput;
                }
                newoutput = output.charAt(i - 1) + newoutput;
            }
            output = newoutput;

            if (negative && negativeWithBrackets)
                output = '(' + output + ')';

            return prefix + output + sufix;
        },

        _getDecimalPlaces: function (arr, key, limit) {
            var decimalPlaces = 0;
            if (isNaN(limit))
                limit = 10;

            for (var i = 0; i < arr.length; i++) {
                var value = key === undefined ? arr[i] : arr[i][key];
                if (isNaN(value))
                    continue;

                var valueTxt = value.toString();
                for (var j = 0; j < valueTxt.length; j++) {
                    if (valueTxt[j] < '0' || valueTxt[j] > '9') {
                        decimalPlaces = valueTxt.length - (j + 1);
                        if (decimalPlaces >= 0)
                            return Math.min(decimalPlaces, limit);
                    }
                }

                if (decimalPlaces > 0)
                    value *= Math.pow(10, decimalPlaces);

                while (Math.round(value) != value && decimalPlaces < limit) {
                    decimalPlaces++;
                    value *= 10;
                }
            }

            return decimalPlaces;
        },

        _defaultNumberFormat: { prefix: '', sufix: '', decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2, negativeWithBrackets: false },

        _detectDateFormat: function (samples, additionalFormats) {
            var formats = {
                // en-US
                // short date pattern
                en_US_d: "M/d/yyyy",
                // long date pattern
                en_US_D: "dddd, MMMM dd, yyyy",
                // short time pattern
                en_US_t: "h:mm tt",
                // long time pattern
                en_US_T: "h:mm:ss tt",
                // long date, short time pattern
                en_US_f: "dddd, MMMM dd, yyyy h:mm tt",
                // long date, long time pattern
                en_US_F: "dddd, MMMM dd, yyyy h:mm:ss tt",
                // month/day pattern
                en_US_M: "MMMM dd",
                // month/year pattern
                en_US_Y: "yyyy MMMM",
                // S is a sortable format that does not vary by culture
                en_US_S: "yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss",

                // en-CA
                en_CA_d: "dd/MM/yyyy",
                en_CA_D: "MMMM-dd-yy",
                en_CA_f: "MMMM-dd-yy h:mm tt",
                en_CA_F: "MMMM-dd-yy h:mm:ss tt",

                // formatting of dates in MySQL Databases
                ISO: "yyyy-MM-dd hh:mm:ss",
                ISO2: "yyyy-MM-dd HH:mm:ss",
                d1: "dd.MM.yyyy",
                d2: "dd-MM-yyyy",
                zone1: "yyyy-MM-ddTHH:mm:ss-HH:mm",
                zone2: "yyyy-MM-ddTHH:mm:ss+HH:mm",
                custom: "yyyy-MM-ddTHH:mm:ss.fff",
                custom2: "yyyy-MM-dd HH:mm:ss.fff",

                // de-DE
                de_DE_d: "dd.MM.yyyy",
                de_DE_D: "dddd, d. MMMM yyyy",
                de_DE_t: "HH:mm",
                de_DE_T: "HH:mm:ss",
                de_DE_f: "dddd, d. MMMM yyyy HH:mm",
                de_DE_F: "dddd, d. MMMM yyyy HH:mm:ss",
                de_DE_M: "dd MMMM",
                de_DE_Y: "MMMM yyyy",

                // fr-FR
                fr_FR_d: "dd/MM/yyyy",
                fr_FR_D: "dddd d MMMM yyyy",
                fr_FR_t: "HH:mm",
                fr_FR_T: "HH:mm:ss",
                fr_FR_f: "dddd d MMMM yyyy HH:mm",
                fr_FR_F: "dddd d MMMM yyyy HH:mm:ss",
                fr_FR_M: "d MMMM",
                fr_FR_Y: "MMMM yyyy",

                // it-IT
                it_IT_d: "dd/MM/yyyy",
                it_IT_D: "dddd d MMMM yyyy",
                it_IT_t: "HH:mm",
                it_IT_T: "HH:mm:ss",
                it_IT_f: "dddd d MMMM yyyy HH:mm",
                it_IT_F: "dddd d MMMM yyyy HH:mm:ss",
                it_IT_M: "dd MMMM",
                it_IT_Y: "MMMM yyyy",

                // Ru
                ru_RU_d: "dd.MM.yyyy",
                ru_RU_D: "d MMMM yyyy '?.'",
                ru_RU_t: "H:mm",
                ru_RU_T: "H:mm:ss",
                ru_RU_f: "d MMMM yyyy '?.' H:mm",
                ru_RU_F: "d MMMM yyyy '?.' H:mm:ss",
                ru_RU_Y: "MMMM yyyy",

                // cs-CZ
                cs_CZ_d: "d.M.yyyy",
                cs_CZ_D: "d. MMMM yyyy",
                cs_CZ_t: "H:mm",
                cs_CZ_T: "H:mm:ss",
                cs_CZ_f: "d. MMMM yyyy H:mm",
                cs_CZ_F: "d. MMMM yyyy H:mm:ss",
                cs_CZ_M: "dd MMMM",
                cs_CZ_Y: "MMMM yyyy",

                // he-IL
                he_IL_d: "dd MMMM yyyy",
                he_IL_D: "dddd dd MMMM yyyy",
                he_IL_t: "HH:mm",
                he_IL_T: "HH:mm:ss",
                he_IL_f: "dddd dd MMMM yyyy HH:mm",
                he_IL_F: "dddd dd MMMM yyyy HH:mm:ss",
                he_IL_M: "dd MMMM",
                he_IL_Y: "MMMM yyyy",

                // hr-HR
                hr_HR_d: "d.M.yyyy.",
                hr_HR_D: "d. MMMM yyyy.",
                hr_HR_t: "H:mm",
                hr_HR_T: "H:mm:ss",
                hr_HR_f: "d. MMMM yyyy. H:mm",
                hr_HR_F: "d. MMMM yyyy. H:mm:ss",
                hr_HR_M: "d. MMMM",

                // hu-HU
                hu_HU_d: "yyyy.MM.dd.",
                hu_HU_D: "yyyy. MMMM d.",
                hu_HU_t: "H:mm",
                hu_HU_T: "H:mm:ss",
                hu_HU_f: "yyyy. MMMM d. H:mm",
                hu_HU_F: "yyyy. MMMM d. H:mm:ss",
                hu_HU_M: "MMMM d.",
                hu_HU_Y: "yyyy. MMMM",

                // jp-JP
                jp_JP_d: "gg y/M/d",
                jp_JP_D: "gg y'?'M'?'d'?'",
                jp_JP_t: "H:mm",
                jp_JP_T: "H:mm:ss",
                jp_JP_f: "gg y'?'M'?'d'?' H:mm",
                jp_JP_F: "gg y'?'M'?'d'?' H:mm:ss",
                jp_JP_M: "M'?'d'?'",
                jp_JP_Y: "gg y'?'M'?'",

                // LT
                lt_LT_d: "yyyy.MM.dd",
                lt_LT_D: "yyyy 'm.' MMMM d 'd.'",
                lt_LT_t: "HH:mm",
                lt_LT_T: "HH:mm:ss",
                lt_LT_f: "yyyy 'm.' MMMM d 'd.' HH:mm",
                lt_LT_F: "yyyy 'm.' MMMM d 'd.' HH:mm:ss",
                lt_LT_M: "MMMM d 'd.'",
                lt_LT_Y: "yyyy 'm.' MMMM",

                // sa-IN
                sa_IN_d: "dd-MM-yyyy",
                sa_IN_D: "dd MMMM yyyy dddd",
                sa_IN_t: "HH:mm",
                sa_IN_T: "HH:mm:ss",
                sa_IN_f: "dd MMMM yyyy dddd HH:mm",
                sa_IN_F: "dd MMMM yyyy dddd HH:mm:ss",
                sa_IN_M: "dd MMMM",

                // basic
                basic_y: "yyyy",
                basic_ym: "yyyy-MM",
                basic_d: "yyyy-MM-dd",
                basic_dhm: "yyyy-MM-dd hh:mm",
                basic_bhms: "yyyy-MM-dd hh:mm:ss",
                basic2_ym: "MM-yyyy",
                basic2_d: "MM-dd-yyyy",
                basic2_dhm: "MM-dd-yyyy hh:mm",
                basic2_dhms: "MM-dd-yyyy hh:mm:ss",

                basic3_ym: "yyyy/MM",
                basic3_d: "yyyy/MM/dd",
                basic3_dhm: "yyyy/MM/dd hh:mm",
                basic3_bhms: "yyyy/MM/dd hh:mm:ss",
                basic4_ym: "MM/yyyy",
                basic4_d: "MM/dd/yyyy",
                basic4_dhm: "MM/dd/yyyy hh:mm",
                basic4_dhms: "MM/dd/yyyy hh:mm:ss"
            };

            if (additionalFormats)
                formats = $.extend({}, formats, additionalFormats);

            var arr = [];
            if (!$.isArray(samples))
                arr.push(samples);
            else
                arr = samples;

            for (var j in formats)
                formats[j] = { format: formats[j], count: 0 };

            for (var i = 0; i < arr.length; i++) {
                value = arr[i];
                if (value == null || value == undefined)
                    continue;

                for (var j in formats) {
                    var result = $.jqx.dataFormat.parsedate(value, formats[j].format);
                    if (result != null)
                        formats[j].count++;
                }
            }

            var best = { key: undefined, count: 0 };
            for (var j in formats) {
                if (formats[j].count > best.count) {
                    best.key = j;
                    best.count = formats[j].count;
                }
            }

            return best.key ? formats[best.key].format : '';
        }
        ///////////////////////////////////////////////
        // End of values formatting
        ///////////////////////////////////////////////
    };


})(jqxBaseFramework);
