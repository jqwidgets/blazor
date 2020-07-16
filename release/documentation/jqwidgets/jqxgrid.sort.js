/* tslint:disable */
/* eslint-disable */
(function ($) {
    $.jqx.dataview.sort = function () {
        this.sortby = function (field, ascending, comparer) {
            var tmpToString = Object.prototype.toString;
            if (ascending == null) {
                this.sortdata = null;
                if (this.grid.sortmode !== "many") {
                    this.sortcache = {};
                }
                else {
                    if (this.sortcache[field]) {
                        delete this.sortcache[field];
                    }
                }

                this.grid._pagescache = new Array();
                this.grid._cellscache = new Array();

                if (this.grid.sortmode !== "many") {
                    this.refresh();
                    return;
                }
            }

            if (this.grid.sortmode === "many") {
                this.grid._pagescache = new Array();
                this.grid._cellscache = new Array();
            }

            if (ascending != null) {
                if (ascending == 'a' || ascending == 'asc' || ascending == 'ascending' || ascending == true) {
                    ascending = true;
                }
                else {
                    ascending = false;
                }
            }

            var lookupkey = field;
            this.sortfield = field;
            this.sortfielddirection = ascending ? "asc" : "desc";

            if (ascending == null) {
                this.sortfielddirection = null;
            }

            if (this.sortcache == undefined) {
                this.sortcache = {};
            }

            this.sortdata = [];
            var _sortdata = [];
            var sorted = false;
            if (lookupkey == 'constructor') lookupkey = "";

            if (!this.virtualmode && this.sortcache[lookupkey] != null && this.grid.sortmode !== "many") {
                var cache = this.sortcache[lookupkey];
                _sortdata = cache._sortdata;

                if (cache.direction == ascending) {
                    _sortdata.reverse();
                }
                else {
                    if (!cache.direction && ascending) {
                        _sortdata.reverse();
                    }

                    sorted = true;
                }

                if (_sortdata.length < this.totalrecords) {
                    this.sortcache = {};
                    sorted = false;
                    _sortdata = [];
                }
            }

            Object.prototype.toString = (typeof field == "function") ? field : function () { return this[field] };
            var records = this.records;
            var me = this.that;

            var datatype = '';

            if (this.source.datafields) {
                $.each(this.source.datafields, function () {
                    if (this.name == field) {
                        if (this.type) {
                            datatype = this.type;
                        }
                        return false;
                    }
                });
            }

            if (_sortdata.length == 0) {
                if (records.length) {
                    var length = records.length;
                    // tries to loop through the records with for loop for better performance.
                    for (var i = 0; i < length; i++) {
                        var record = records[i];
                        if (record != null) {
                            var recordvalue = record;
                            var sortkey = recordvalue.toString();
                            _sortdata.push({ sortkey: sortkey, value: recordvalue, index: i });
                        }
                    }
                }
                else {
                    var caniterate = false;
                    // tries to loop through the records with for..in for better performance.
                    for (obj in records) {
                        var record = records[obj];
                        if (record == undefined) {
                            caniterate = true;
                            break;
                        }

                        var recordvalue = record;
                        _sortdata.push({ sortkey: recordvalue.toString(), value: recordvalue, index: obj });
                    }

                    if (caniterate) {
                        $.each(records, function (i, value) {
                            _sortdata.push({ sortkey: value.toString(), value: value, index: i });
                        });
                    }
                }
            }

            if (!sorted) {
                if (comparer == null) {
                    this._sortcolumntype = datatype;
                    var that = this;
                    _sortdata.sort(function (value1, value2) {
                        return that._compare(value1, value2, datatype);
                    });
                }
                else {
                    _sortdata.sort(comparer);
                }
            }

            if (!ascending) {
                _sortdata.reverse();
            }

            Object.prototype.toString = tmpToString;
            this.sortdata = _sortdata;

            if (ascending !== null) {
                this.sortcache[lookupkey] = { _sortdata: _sortdata, direction: ascending, dataType: this._sortcolumntype, dataField: lookupkey };
            }

            if (this.grid.sortmode === "many") {
                var sortcolumns = [];
                var directions = [];
                var dataTypes = [];

                for (var cacheKey in this.sortcache) {
                    if (cacheKey === 'data') {
                        continue;
                    }

                    var cache = this.sortcache[cacheKey];

                    sortcolumns.push(cache.dataField);
                    directions.push(cache.direction ? 'asc': 'desc');
                    dataTypes.push(cache.dataType);
                }

                if (sortcolumns.length > 0) {
                    var rows = this.multiSort(records, sortcolumns, directions, dataTypes);
                
                    _sortdata = [];

                    $.each(rows, function (i, value) {
                        _sortdata.push({ sortkey: lookupkey, value: value, index: value.boundindex });
                    });

                    this.sortdata = _sortdata;
                }
                else {
                    this.sortcache = {};
                    this.sortdata = null;
                    this.refresh();
                    return;
                }
            }

            this.reload(this.records, this.rows, this.filters, this.updated, true);
        },

        this.multiSort = function (records, sortColumns, directions, dataTypes, customSortingCallback) {
            var that = this;

            if (records.length === 0) {
                return;
            }

            var dataSource = [];

            for (var i = 0; i < records.length; i++) {
                var item = $.extend({}, records[i]);

                dataSource.push(item);
            }

            var isObservableArray = false;

            if (dataSource && dataSource.constructor && dataSource.constructor.name === 'ObservableArray') {
                isObservableArray = true;
            }

            if (!dataSource || !(dataSource instanceof Array) || dataSource.length === 0 ||
                !sortColumns || sortColumns instanceof Array && sortColumns.length === 0) {
                if (!isObservableArray) {
                    throw new Error('sort: Missing or Invalid arguments!');
                }
            }

            if (typeof sortColumns === 'string') {
                sortColumns = [sortColumns];
            }

            var directionCoefficients = [],
                compareFunctions = [];

            if (directions === undefined) {
                directions = [];
            }

            var getCompareFunction = function (a, knownDataType) {
                // gets data type of column (not necessary if the Grid provides this information)
                var dataType = knownDataType || typeof a;
                var compareFunction;

                switch (dataType) {
                    case 'string':
                    default:
                        compareFunction = new Intl.Collator().compare;
                        break;
                    case 'date':
                    case 'time':
                    case 'datetime':
                    case 'number': 
                    case 'int':
                    case 'float':
                        compareFunction = function (a, b) {
                            return a - b;
                        };
                        break;
                    case 'boolean':
                        compareFunction = function (a, b) {
                            if (a === b) {
                                return 0;
                            }
                            else if (a === false) {
                                return -1;
                            }
                            else {
                                return 1;
                            }
                        };
                        break;
                    case 'object':
                        if (a instanceof Date) {
                            compareFunction = function (a, b) {
                                return a.getTime() - b.getTime();
                            };
                        }
        
                        break;
                }

                return compareFunction;
            }

            for (var i = 0; i < sortColumns.length; i++) {
                if (directions[i] === undefined || directions[i] === 'asc' || directions[i] === 'ascending') {
                    directionCoefficients[i] = 1;
                }
                else {
                    directionCoefficients[i] = -1;
                }

                var value = dataSource[0][sortColumns[i]];

                compareFunctions[i] = getCompareFunction(value, dataTypes[i]);
            }

            if (customSortingCallback) {
                customSortingCallback(dataSource, sortColumns, directions, compareFunctions);
                return;
            }

            dataSource.sort(function (a, b) {
                for (var i = 0; i < sortColumns.length; i++) {
                    var result = compareFunctions[i](a[sortColumns[i]], b[sortColumns[i]]);

                    if (result === 0) {
                        if (sortColumns[i + 1]) {
                            continue;
                        }
                        else if (a._index !== undefined) {
                            // makes sorting stable
                            return (a._index - b._index) * directionCoefficients[i];
                        }

                        return 0;
                    }

                    return result * directionCoefficients[i];
                }

                if (sortColumns.length === 0) {
                    if (a.boundIndex < b.boundIndex) {
                        return -1;
                    }

                    if (a.boundIndex > b.boundIndex) {
                        return 1;
                    }

                    return 0;

                }
            });

            return dataSource;
        },

        this.clearsortdata = function () {
            this.sortcache = {};
            this.sortdata = null;
        }

        this._compare = function (value1, value2, type) {
            var value1 = value1.sortkey;
            var value2 = value2.sortkey;
            if (value1 === undefined) { value1 = null; }
            if (value2 === undefined) { value2 = null; }
            if (value1 === null && value2 === null) {
                return 0;
            }
            if (value1 === null && value2 !== null) {
                return -1;
            }
            if (value1 !== null && value2 === null) {
                return 1;
            }

            if ($.jqx.dataFormat) {
                if (type && type != "") {
                    switch (type) {
                        case "number":
                        case "int":
                        case "float":
                            if (value1 < value2) { return -1; }
                            if (value1 > value2) { return 1; }
                            return 0;
                        case "date":
                        case "time":
                            if (value1 < value2) { return -1; }
                            if (value1 > value2) { return 1; }
                            return 0;
                        case "string":
                        case "text":
                            value1 = String(value1).toLowerCase();
                            value2 = String(value2).toLowerCase();
                            break;
                    }
                }
                else {
                    if ($.jqx.dataFormat.isNumber(value1) && $.jqx.dataFormat.isNumber(value2)) {
                        if (value1 < value2) { return -1; }
                        if (value1 > value2) { return 1; }
                        return 0;
                    }
                    else if ($.jqx.dataFormat.isDate(value1) && $.jqx.dataFormat.isDate(value2)) {
                        if (value1 < value2) { return -1; }
                        if (value1 > value2) { return 1; }
                        return 0;
                    }
                    else if (!$.jqx.dataFormat.isNumber(value1) && !$.jqx.dataFormat.isNumber(value2)) {
                        value1 = String(value1).toLowerCase();
                        value2 = String(value2).toLowerCase();
                    }
                }
            }
            try {
                if (value1 < value2) { return -1; }
                if (value1 > value2) { return 1; }
            }
            catch (error) {
                var er = error;
            }

            return 0;
        };

        this._equals = function (value1, value2) {
            return (this._compare(value1, value2) === 0);
        };
    }

    $.extend($.jqx._jqxGrid.prototype, {
        //[optimize]
        _rendersortcolumn: function () {
            var self = this.that;
            var sortcolumn = this.getsortcolumn();

            if (this.sortmode === "many") {
                this.__columnsbydatafield = new Array();
                var columns = this.getsortcolumns();

                $.each(this.columns.records, function (i, value) {
                    $(this.sortasc).hide();
                    $(this.sortdesc).hide();
                    $(this.sorticon).css("visibility", "hidden");
                    this.element.removeAttribute("sort");
                });

                if (columns.length > 0) {
                    for (var i = 0; i < columns.length; i++) {
                        var column = columns[i];

                        var columnRecord = this._getcolumnbydatafield(column.dataField);

                        columnRecord.element.setAttribute("sort", true);

                        if (self.isMaterialized() || self.isModern()) {
                            $(columnRecord.sorticon).show();
                            $(columnRecord.sorticon).css("visibility", "inherit");

                            $(columnRecord.sorticon).removeClass("ascending");
                            $(columnRecord.sorticon).removeClass("descending");

                            if (column.ascending) {
                                $(columnRecord.sorticon).addClass("ascending");
                            }
                            else {
                                $(columnRecord.sorticon).addClass("descending");
                            }
                        }
                        else {
                            if (column.ascending) {
                                $(columnRecord.sortasc).show();
                                $(columnRecord.sortdesc).hide();
                            }
                            else if (column.ascending === false) {
                                $(columnRecord.sortasc).hide();
                                $(columnRecord.sortdesc).show();
                            }
                        }
                    }
                }

                return;
            }

            if (this.sortdirection) {
                var ariaFunc = function (column, direction) {
                    var sortc = self.getcolumn(column);
                    if (sortc) {
                        if (direction.ascending) {
                            $.jqx.aria(sortc.element, "aria-sort", "ascending");
                        }
                        else if (direction.descending) {
                            $.jqx.aria(sortc.element, "aria-sort", "descending");
                        } else {
                            $.jqx.aria(sortc.element, "aria-sort", "none");
                        }
                    }
                }
                if (this._oldsortinfo) {
                    if (this._oldsortinfo.column) {
                        ariaFunc(this._oldsortinfo.column, { ascending: false, descending: false });
                    }
                }
                ariaFunc(sortcolumn, this.sortdirection);

            }
            this._oldsortinfo = { column: sortcolumn, direction: this.sortdirection };

            if (this.sortdirection) {
                $.each(this.columns.records, function (i, value) {
                    var groupingsortelements = $.data(document.body, "groupsortelements" + this.displayfield);

                    if (sortcolumn == null || this.displayfield != sortcolumn) {
                        $(this.sortasc).hide();
                        $(this.sortdesc).hide();
                        $(this.sorticon).css("visibility", "hidden");
                        $(this.sorticon).removeClass("ascending");
                        $(this.sorticon).removeClass("descending");
                        this.element.removeAttribute('sort');

                        if (groupingsortelements != null) {
                            groupingsortelements.sortasc.hide();
                            groupingsortelements.sortdesc.hide();
                        }
                    }
                    else {
                        if (self.isMaterialized() || self.isModern()) {
                            $(this.sortasc).hide();
                            $(this.sortdesc).hide();
                            $(this.sorticon).show();
                            $(this.sorticon).css("visibility", "inherit");
                            if (groupingsortelements != null) {
                                groupingsortelements.sortasc.hide();
                                groupingsortelements.sortdesc.show();
                            }

                            $(this.sorticon).removeClass("ascending");
                            $(this.sorticon).removeClass("descending");
                            if (self.sortdirection.ascending) {
                                $(this.sorticon).addClass("ascending");
                            }
                            else {
                                $(this.sorticon).addClass("descending");
                            }
                        }
                        else {
                            if (self.sortdirection.ascending) {
                                $(this.sortasc).show();
                                $(this.sortdesc).hide();
                                if (groupingsortelements != null) {
                                    groupingsortelements.sortasc.show();
                                    groupingsortelements.sortdesc.hide();
                                }
                            }
                            else {
                                $(this.sortasc).hide();
                                $(this.sortdesc).show();
                                if (groupingsortelements != null) {
                                    groupingsortelements.sortasc.hide();
                                    groupingsortelements.sortdesc.show();
                                }
                            }
                        }
                        this.element.setAttribute('sort', true);
                    }
                });
            }
        },

        getsortcolumns: function() {
            var that = this;
            var columns = [];

            for (var cacheKey in that.dataview.sortcache) {
                if (cacheKey === "data") {
                    continue;
                }

                columns.push({ dataField: cacheKey, ascending: that.dataview.sortcache[cacheKey].direction });
            }

            if (columns.length === 0) {
                for (var sortcolumn in that.sortcolumns) {
                    var direction = that.sortcolumns[sortcolumn];

                    if (direction !== null) {
                        columns.push({ dataField: sortcolumn, ascending: direction });
                    }
                }

            }

            return columns;
        },

        // gets the sort column.
        getsortcolumn: function () {
            if (this.sortcolumn != undefined) {
                return this.sortcolumn;
            }

            return null;
        },
        // removes the sorting.
        removesort: function () {
            this.sortby(null);
            if (this.sortmode === "many") {
                for (var column in this.sortcolumns) {
                    this.sortby(column, null);
                }
            }
        },

        // sorts by a column.
        sortby: function (datafield, sortdirection, comparer, refresh, checkloading) {
            if (this._loading && checkloading !== false) {
                throw new Error('jqxGrid: ' + this.loadingerrormessage);
                return false;
            }

            // clear the sorting.
            if (datafield == null) {
                sortdirection = null;
                datafield = this.sortcolumn;
            }

            if (datafield != undefined) {
                var self = this.that;
                if (comparer == undefined && self.source.sortcomparer != null) {
                    comparer = self.source.sortcomparer;
                }

                if (sortdirection === undefined) {
                    sortdirection = true;
                }

                if (sortdirection == 'a' || sortdirection == 'asc' || sortdirection == 'ascending' || sortdirection == true) {
                    ascending = true;
                }
                else {
                    ascending = false;
                }

                //var columnbydatafield = self.getcolumn(datafield);
                //if (columnbydatafield == undefined || columnbydatafield == null)
                //    return;

                if (sortdirection != null) {
                    self.sortdirection = { 'ascending': ascending, 'descending': !ascending };
                }
                else {
                    self.sortdirection = { 'ascending': false, 'descending': false };
                }

                if (sortdirection != null) {
                    self.sortcolumn = datafield;
                }
                else {
                    self.sortcolumn = null;
                }

                if (!self.sortcolumns) {
                    self.sortcolumns = [];
                }

                self.sortcolumns[datafield] = sortdirection;

                if (self.source.sort || self.virtualmode) {
                    self.dataview.sortfield = datafield;
                    if (sortdirection == null) {
                        self.dataview.sortfielddirection = "";
                    }
                    else {
                        self.dataview.sortfielddirection = ascending ? "asc" : "desc";
                    }
                    if (self.source.sort && !this._loading) {
                        self.source.sort(datafield, sortdirection, self.sortcolumns);
                        self._raiseEvent(6, { sortinformation: self.getsortinformation() });
                        return;
                    }
                }
                else {
                    self.dataview.sortby(datafield, sortdirection, comparer);
                }

                if (refresh === false) {
                    return;
                }

                // if grouping is enabled, we need to refresh the groups too.
                if (self.groupable && self.groups.length > 0) {
                    self._render(true, false, false);
                    if (self._updategroupheadersbounds && self.showgroupsheader) {
                        self._updategroupheadersbounds();
                    }
                    self._postrender("sort");
                }
                else {
                    if (self.pageable) {
                        self.dataview.updateview();
                    }
                    self._updaterowsproperties();
                    self.rendergridcontent(true);
                    self._postrender("sort");
                }
                self._raiseEvent(6, { sortinformation: self.getsortinformation() });
            }
        },

        _togglesort: function (column) {
            var self = this.that;
            if (this.disabled) {
                return;
            }

            if (this.sortmode === "many") {
                if (column.sortable && self.sortable) {
                    var columns = self.getsortcolumns();
                    var checked = null;

                     
                    for (var i = 0; i < columns.length; i++) {
                        var sortColumn = columns[i];
                        var dataField = column.displayfield;

                        if (dataField === sortColumn.dataField) {
                            checked = sortColumn.ascending;
                            if (self.sorttogglestates > 1) {
                                if (checked == true) {
                                    checked = false;
                                }
                                else {
                                    checked = null;
                                }
                            }
                            else {
                                checked = !checked;
                            }

                            self.sortby(column.displayfield, checked, null);

                            return;
                        }
                    }

                    self.sortby(column.displayfield, true, null);
                }

                return;
            }

            if (column.sortable && self.sortable) {
                var sortinformation = self.getsortinformation();
                var checked = null;
                if (sortinformation.sortcolumn != null && sortinformation.sortcolumn == column.displayfield) {
                    checked = sortinformation.sortdirection.ascending;
                    if (self.sorttogglestates > 1) {
                        if (checked == true) {
                            checked = false;
                        }
                        else {
                            checked = null;
                        }
                    }
                    else {
                        checked = !checked;
                    }
                }
                else {
                    checked = true;
                }

                self.sortby(column.displayfield, checked, null);
            }
        }
    });
})(jqxBaseFramework);


