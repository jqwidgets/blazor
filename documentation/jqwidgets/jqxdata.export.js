﻿/* tslint:disable */
/* eslint-disable */
(function ($) {
    var ArrayExporter = (function () {

        var exportModules = {},
            data, dataFields, styles, exporter, stylesArray, hierarchy, exportFormat, filename;

        function exportData(exporter, data, dataFields, styles, hierarchy, exportFormat, filename) {
            this.hierarchy = hierarchy;
            this.exportFormat = exportFormat;
            this.filename = filename;

            exporter.beginFile(filename);
            exportHeader(exporter);
            exportContent(exporter);
            exporter.endFile(filename);
            return exporter.getFile();
        }

        function exportHeader(exporter) {
            var exportHeaders = true;
            $.each(dataFields, function () {
                if (this.hidden) {
                    exportHeaders = false;
                    return false;
                }
            });

            exporter.beginHeader(exportHeaders);
            var index = 0;
            for (var cellContent in dataFields) {
                if (dataFields[cellContent].columnsDataFields) {
                    cellContent = dataFields[cellContent].columnsDataFields[index].displayfield;
                }
                var style = getHeaderStyle(cellContent, dataFields[cellContent]);
                exporter.appendHeaderCell(dataFields[cellContent], cellContent, style, exportHeaders, index);
                index++;
            }
            exporter.endHeader(exportHeaders);
        }

        function exportContent(exporter) {
            exporter.beginBody();
            if (this.hierarchy) {
                var exporHierarchy = function (data) {
                    for (var i = 0; i < data.length; i += 1) {
                        if (data[i] !== undefined) {
                            exporter.beginRow(data[i].level);
                            exportRow(exporter, data[i], i, true);
                            if (data[i].records) {
                                exporter.beginRows(data[i].level);
                                exporHierarchy(data[i].records);
                                exporter.endRows(data[i].level);
                            }
                            exporter.endRow(data[i].level);
                        }
                    }
                }
                exporHierarchy(data);
                exporter.endBody();
                return;
            }

            for (var i = 0; i < data.length; i += 1) {
                if (data[i] !== undefined) {
                    exportRow(exporter, data[i], i);
                }
            }
            exporter.endBody();
        }

        function exportRow(exporter, data, rowId, hierarchy) {
            var style;
            if (hierarchy != true) {
                exporter.beginRow();
            }
            var indx = 0;
            for (var column in dataFields) {
                if (dataFields[column].columnsDataFields) {
                    column = dataFields[column].columnsDataFields[indx].displayfield;
                }

                style = getRowCellStyle(rowId, column);
                if (style) {
                    if (style.level != undefined) {
                        if (style.index - 1 > data.level && style.index - 1 < style.maxLevel) {
                            indx++;
                            continue;
                        }
                    }
                    if (style.maxLevel != undefined) {
                        if (style.index - 1 == style.maxLevel) {
                            style = $.extend({}, style);
                            style.merge = style.maxLevel - data.level - 1;
                        }
                    }
                }
                if (data.level != undefined && data.label != undefined) {
                    if (this.exportFormat === "xml" || this.exportFormat === "json") {
                        var dataGroup = {};
                        dataGroup['text'] = "group";
                        exporter.appendBodyCell(data.label, dataGroup, style, data, indx, "group");
                        break;
                    }
                }

                if (data.hasOwnProperty(column)) {
                    exporter.appendBodyCell(data[column], dataFields[column], style, data, indx);
                }
                else {
                    exporter.appendBodyCell("", dataFields[column], style, data, indx);
                }
                indx++;
            }
            if (hierarchy != true) {
                exporter.endRow();
            }
        }

        function getHeaderStyle(columnName, dataField) {
            if (dataField.style) {
                return styles[dataField.style];
            }

            var rowStyles = getStylesArray();
            if (rowStyles.length > 0) {
                return rowStyles[0].style;
            }
            return null;
        }

        function getStylesArray() {
            if (!stylesArray) {
                stylesArray = new Array();
                $.each(styles, function (index, value) {
                    stylesArray[stylesArray.length] = { name: index, style: value };
                });
            }

            return stylesArray;
        }

        function getRowCellStyle(rowId, column) {
            var dataField = dataFields[column];
            if (dataField) {
                if (dataField.customCellStyles) {
                    var customStyle = dataField.customCellStyles[rowId];
                    if (customStyle) {
                        return styles[customStyle];
                    }
                }

                if (dataField.cellStyle) {
                    if (dataField.cellAltStyle) {
                        var styleId = rowId % 2;
                        if (styleId == 0)
                            return styles[dataField.cellStyle];
                        return styles[dataField.cellAltStyle];
                    }
                    return styles[dataField.cellStyle];
                }
                else {
                    var rowStyles = getStylesArray();
                    if (rowStyles.length > 0) {
                        var styleId = rowId % (rowStyles.length - 1);
                        var style = rowStyles[styleId + 1].style;
                        return style;
                    }
                }
            }
            return null;
        }

        function createHiddenInput(value, name, form) {
            var input = document.createElement('input');
            input.name = name;
            input.value = value;
            input.type = 'hidden';
            form.appendChild(input);
            return input;
        }

        function createHiddenTextArea(value, name, form) {
            var textArea = document.createElement('textarea');
            textArea.name = name;
            textArea.value = value;
            //      textArea.type = 'hidden';
            form.appendChild(textArea);
            return textArea;
        }

        function createForm(filename, format, content, exportServer, charset) {
            var form = document.createElement('form');
            createHiddenInput(filename, 'filename', form);
            createHiddenInput(format, 'format', form);
            createHiddenTextArea(content, 'content', form);
            if (exportServer == undefined || exportServer == '') {
                if (window && window.location.toString().indexOf('jqwidgets.com') >= 0) {
                    exportServer = 'https://jqwidgets.com/export_server/dataexport.php';
                }
                else {
                    exportServer = 'http://jquerygrid.net/export_server/dataexport.php';
                }
            }

            form.action = exportServer;
            form.method = 'post';
            if (charset) {
                form.acceptCharset = charset;
            }

            document.body.appendChild(form);
            return form;
        }

        exporter = function (inputData, inputDataFields, inputStyles, exportServer, hierarchy, exportFormat) {
            if (!(this instanceof ArrayExporter)) {
                return new ArrayExporter(inputData, inputDataFields, inputStyles, hierarchy, exportFormat);
            }
            data = inputData;
            dataFields = inputDataFields;
            styles = inputStyles;

            this.exportTo = function (format, hierarchy, exportFormat, filename) {
                format = format.toString().toLowerCase();
                var module = exportModules[format];
                if (typeof module === 'undefined') {
                    throw 'You can\'t export to ' + format + ' format.';
                }
                if (format === "pdf" && filename == undefined) {
                    var table = this.exportTo(format, hierarchy, format, "pdf");
                    if (!$.jqx.pdfExport) {
                        $.jqx.pdfExport =
                        {
                            orientation: "portrait",
                            paperSize: "a4"
                        }
                    }

                    var doc = new pdfDataExport($.jqx.pdfExport.orientation, 'pt', $.jqx.pdfExport.paperSize);
                    doc.cellInitialize();
                    var headerCells = $(table).find('th');
                    var tableRows = $(table).find('tr');
                    var rows = 0;
                    doc.setFontSize(13 * 72 / 96);
                    var totalWidth = 595;
                    switch ($.jqx.pdfExport.paperSize) {
                        case "legal":
                            var totalWidth = 612;
                            if ($.jqx.pdfExport.orientation !== "portrait") {
                                totalWidth = 1008;
                            }
                            break;
                        case "letter":
                            var totalWidth = 612;
                            if ($.jqx.pdfExport.orientation !== "portrait") {
                                totalWidth = 792;
                            }
                            break;
                        case "a3":
                            var totalWidth = 841;
                            if ($.jqx.pdfExport.orientation !== "portrait") {
                                totalWidth = 1190;
                            }
                            break;
                        case "a4":
                            var totalWidth = 595;
                            if ($.jqx.pdfExport.orientation !== "portrait") {
                                totalWidth = 842;
                            }
                            break;
                        case "a5":
                            var totalWidth = 420;
                            if ($.jqx.pdfExport.orientation !== "portrait") {
                                totalWidth = 595;
                            }
                            break
                    }
                    totalWidth -= 20;
                    var totalColumnsWidth = 0;
                    var columnWidths = [];
                    $.each(headerCells, function (index) {
                        var width = parseInt(this.style.width);
                        if (isNaN(width)) {
                            width = 25;
                        }
                        var widthPoints = width * 72 / 96;
                        columnWidths[index] = widthPoints;
                        totalColumnsWidth += widthPoints;
                    });
                    if (totalColumnsWidth > totalWidth) {
                        $.each(columnWidths, function (index) {
                            columnWidths[index] = (columnWidths[index] / totalColumnsWidth) * 100;
                            columnWidths[index] = columnWidths[index] * totalWidth / 100;
                        });
                    }

                    $.each(headerCells, function (index) {
                        var widthPoints = columnWidths[index];
                        var heightPoints = 25 * 72 / 96;
                        var textDimension = doc.getTextDimensions($(this).html());
                        var cellText = $(this).html();
                        if (textDimension.w + 3 > widthPoints) {
                            var splitText = doc.splitTextToSize(cellText, widthPoints - 3);
                            var newText = splitText[0];
                            if (newText.length > 3) {
                                cellText = newText.substring(0, newText.length - 3) + "...";
                            }
                            else cellText = newText.substring(0, 1) + "...";
                            var splitText = doc.splitTextToSize(cellText, widthPoints - 3);
                            var newText = splitText[0];
                            if (newText != cellText) {
                                cellText = newText;
                            }
                        }
                        doc.cell(10, 10, widthPoints, heightPoints, cellText, rows);
                    });

                    rows++;
                    $.each(tableRows, function (index) {
                        if (index === 0) return true;
                        var rowCells = $(this).children();
                        var isTreeGrid = rowCells.length > headerCells.length;
                        if (isTreeGrid) {
                            var mergeLength = rowCells.length - headerCells.length;
                            var cellText = "";
                            var widthPoints = columnWidths[0];
                            var heightPoints = 25 * 72 / 96;
                            for (var i = 0; i <= mergeLength; i++) {
                                var cellHTML = rowCells[i].innerHTML;
                                if (cellHTML === "+" || cellHTML === "-") cellHTML = cellHTML + " ";
                                if (cellHTML === "&nbsp;") cellHTML = "   ";
                                cellText += cellHTML;
                            }
                            var textDimension = doc.getTextDimensions(cellText);
                            if (textDimension.w + 3 > widthPoints) {
                                var splitText = doc.splitTextToSize(cellText, widthPoints - 3);
                                var newText = splitText[0];
                                if (newText.length > 3) {
                                    cellText = newText.substring(0, newText.length - 3) + "...";
                                }
                                else cellText = newText.substring(0, 1) + "...";
                                var splitText = doc.splitTextToSize(cellText, widthPoints - 3);
                                var newText = splitText[0];
                                if (newText != cellText) {
                                    cellText = newText;
                                }
                            }

                            doc.cell(10, 10, widthPoints, heightPoints, cellText, rows);
                            for (var i = mergeLength + 1; i < rowCells.length; i++) {
                                var index = i - mergeLength;
                                var widthPoints = columnWidths[index];
                                var heightPoints = 25 * 72 / 96;
                                var cellText = $(rowCells[i]).html();
                                var textDimension = doc.getTextDimensions($(rowCells[i]).html());
                                if (textDimension.w + 3 > widthPoints) {
                                    var splitText = doc.splitTextToSize(cellText, widthPoints - 3);
                                    var newText = splitText[0];
                                    if (newText.length > 3) {
                                        cellText = newText.substring(0, newText.length - 3) + "...";
                                    }
                                    else cellText = newText.substring(0, 1) + "...";
                                    var splitText = doc.splitTextToSize(cellText, widthPoints - 3);
                                    var newText = splitText[0];
                                    if (newText != cellText) {
                                        cellText = newText;
                                    }
                                }
                                doc.cell(10, 10, widthPoints, heightPoints, cellText, rows);
                            }
                            rows++;
                            return true;
                        }

                        $.each(rowCells, function (index) {
                            var widthPoints = columnWidths[index];
                            var heightPoints = 25 * 72 / 96;
                            var cellText = $(this).html();
                            var textDimension = doc.getTextDimensions($(this).html());
                            if (textDimension.w + 3 > widthPoints) {
                                var splitText = doc.splitTextToSize(cellText, widthPoints - 3);
                                var newText = splitText[0];
                                if (newText.length > 3) {
                                    cellText = newText.substring(0, newText.length - 3) + "...";
                                }
                                else cellText = newText.substring(0, 1) + "...";
                                var splitText = doc.splitTextToSize(cellText, widthPoints - 3);
                                var newText = splitText[0];
                                if (newText != cellText) {
                                    cellText = newText;
                                }
                            }
                            doc.cell(10, 10, widthPoints, heightPoints, cellText, rows);
                        }
                        );
                        rows++;
                    });
                    if ($.jqx.browser.msie && $.jqx.browser.version < 10) {
                        throw new Error("PDF export requires a browser with HTML5 support");
                        return;
                    }

                    return doc;
                }

                return exportData(module, data, dataFields, styles, hierarchy, exportFormat, filename);
            };

            this.exportToFile = function (format, filename, exportServer, charset, hierarchy) {
                if (format === "pdf") {
                    var table = this.exportTo(format, hierarchy, format, filename);
                    if (!$.jqx.pdfExport) {
                        $.jqx.pdfExport =
                        {
                            orientation: "portrait",
                            paperSize: "a4"
                        }
                    }

                    var doc = new pdfDataExport($.jqx.pdfExport.orientation, 'pt', $.jqx.pdfExport.paperSize);
                    if (charset == "utf-8" || charset == "UTF-8") {
                        doc.setFont("courier", "normal");
                    }

                    doc.cellInitialize();
                    var headerCells = $(table).find('th');
                    var tableRows = $(table).find('tr');
                    var rows = 0;
                    doc.setFontSize(13 * 72 / 96);
                    var totalWidth = 595;
                    switch ($.jqx.pdfExport.paperSize) {
                        case "legal":
                            var totalWidth = 612;
                            if ($.jqx.pdfExport.orientation !== "portrait") {
                                totalWidth = 1008;
                            }
                            break;
                        case "letter":
                            var totalWidth = 612;
                            if ($.jqx.pdfExport.orientation !== "portrait") {
                                totalWidth = 792;
                            }
                            break;
                        case "a3":
                            var totalWidth = 841;
                            if ($.jqx.pdfExport.orientation !== "portrait") {
                                totalWidth = 1190;
                            }
                            break;
                        case "a4":
                            var totalWidth = 595;
                            if ($.jqx.pdfExport.orientation !== "portrait") {
                                totalWidth = 842;
                            }
                            break;
                        case "a5":
                            var totalWidth = 420;
                            if ($.jqx.pdfExport.orientation !== "portrait") {
                                totalWidth = 595;
                            }
                            break
                    }
                    totalWidth -= 20;
                    var totalColumnsWidth = 0;
                    var columnWidths = [];
                    $.each(headerCells, function (index) {
                        var width = parseInt(this.style.width);
                        if (isNaN(width)) {
                            width = 25;
                        }
                        var widthPoints = width * 72 / 96;
                        columnWidths[index] = widthPoints;
                        totalColumnsWidth += widthPoints;
                    });
                    if (totalColumnsWidth > totalWidth) {
                        $.each(columnWidths, function (index) {
                            columnWidths[index] = (columnWidths[index] / totalColumnsWidth) * 100;
                            columnWidths[index] = columnWidths[index] * totalWidth / 100;
                        });
                    }

                    $.each(headerCells, function (index) {
                        var widthPoints = columnWidths[index];
                        var heightPoints = 25 * 72 / 96;
                        var textDimension = doc.getTextDimensions($(this).html());
                        var cellText = $(this).html();
                        if (textDimension.w + 3 > widthPoints) {
                            var splitText = doc.splitTextToSize(cellText, widthPoints - 3);
                            var newText = splitText[0];
                            if (newText.length > 3) {
                                cellText = newText.substring(0, newText.length - 3) + "...";
                            }
                            else cellText = newText.substring(0, 1) + "...";
                            var splitText = doc.splitTextToSize(cellText, widthPoints - 3);
                            var newText = splitText[0];
                            if (newText != cellText) {
                                cellText = newText;
                            }
                        }
                        doc.cell(10, 10, widthPoints, heightPoints, cellText, rows);
                    });

                    rows++;
                    $.each(tableRows, function (index) {
                        if (index === 0) return true;
                        var rowCells = $(this).children();
                        var isTreeGrid = rowCells.length > headerCells.length;
                        if (isTreeGrid) {
                            var mergeLength = rowCells.length - headerCells.length;
                            var cellText = "";
                            var widthPoints = columnWidths[0];
                            var heightPoints = 25 * 72 / 96;
                            for (var i = 0; i <= mergeLength; i++) {
                                var cellHTML = rowCells[i].innerHTML;
                                if (cellHTML === "+" || cellHTML === "-") cellHTML = cellHTML + " ";
                                if (cellHTML === "&nbsp;") cellHTML = "   ";
                                cellText += cellHTML;
                            }
                            var textDimension = doc.getTextDimensions(cellText);
                            if (textDimension.w + 3 > widthPoints) {
                                var splitText = doc.splitTextToSize(cellText, widthPoints - 3);
                                var newText = splitText[0];
                                if (newText.length > 3) {
                                    cellText = newText.substring(0, newText.length - 3) + "...";
                                }
                                else cellText = newText.substring(0, 1) + "...";
                                var splitText = doc.splitTextToSize(cellText, widthPoints - 3);
                                var newText = splitText[0];
                                if (newText != cellText) {
                                    cellText = newText;
                                }
                            }
         
                            doc.cell(10, 10, widthPoints, heightPoints, cellText, rows);
                            for (var i = mergeLength + 1; i < rowCells.length; i++) {
                                var index = i - mergeLength;
                                var widthPoints = columnWidths[index];
                                var heightPoints = 25 * 72 / 96;
                                var cellText = $(rowCells[i]).html();
                                if (cellText === "&nbsp;") cellText = "   ";
                            
                                var textDimension = doc.getTextDimensions($(rowCells[i]).html());
                                if (textDimension.w + 3 > widthPoints) {
                                    var splitText = doc.splitTextToSize(cellText, widthPoints - 3);
                                    var newText = splitText[0];
                                    if (newText.length > 3) {
                                        cellText = newText.substring(0, newText.length - 3) + "...";
                                    }
                                    else cellText = newText.substring(0, 1) + "...";
                                    var splitText = doc.splitTextToSize(cellText, widthPoints - 3);
                                    var newText = splitText[0];
                                    if (newText != cellText) {
                                        cellText = newText;
                                    }
                                }
                                doc.cell(10, 10, widthPoints, heightPoints, cellText, rows);
                            }
                            rows++;
                            return true;
                        }

                        $.each(rowCells, function (index) {
                            var widthPoints = columnWidths[index];
                            var heightPoints = 25 * 72 / 96;
                            var cellText = $(this).html();
                            if (cellText === "&nbsp;") cellText = "   ";

                            var textDimension = doc.getTextDimensions($(this).html());
                            if (textDimension.w + 3 > widthPoints) {
                                var splitText = doc.splitTextToSize(cellText, widthPoints - 3);
                                var newText = splitText[0];
                                if (newText.length > 3) {
                                    cellText = newText.substring(0, newText.length - 3) + "...";
                                }
                                else cellText = newText.substring(0, 1) + "...";
                                var splitText = doc.splitTextToSize(cellText, widthPoints - 3);
                                var newText = splitText[0];
                                if (newText != cellText) {
                                    cellText = newText;
                                }
                            }
                            doc.cell(10, 10, widthPoints, heightPoints, cellText, rows);
                        }
                        );
                        rows++;
                    });
                    if ($.jqx.browser.msie && $.jqx.browser.version < 10) {
                        throw new Error("PDF export requires a browser with HTML5 support");
                        return;
                    }

                    doc.save(filename + ".pdf");
                    return;
                }

                var content = this.exportTo(format, hierarchy, format, filename),
                    form = createForm(filename, format, content, exportServer, charset);
                form.submit();
                document.body.removeChild(form);
            };

            this.exportToLocalFile = function (format, filename, hierarchy, exportFormat) {
                var content = this.exportTo(format, hierarchy, exportFormat);
                document.location.href = 'data:application/octet-stream;filename=' + filename + ',' + encodeURIComponent(content);
            };

        };

        exporter.extend = function (exportFormat, exporter) {
            if (exporter instanceof $.jqx.dataAdapter.DataExportModuleBase) {
                exportModules[exportFormat] = exporter;
            } else {
                throw 'The module ' + exportFormat + ' is not instance of DataExportModuleBase.';
            }
        };

        return exporter;

    }());

    $.jqx.dataAdapter.ArrayExporter = ArrayExporter;

})(jqxBaseFramework);


(function ($) {

    //Defines common interface for all modules used for exportation
    var DataExportModuleBase = function () {

        this.formatData = function (data, type, formatString, localization) {
            if (type === 'date') {
                var tmpdate = "";
                if (typeof data === 'string') {
                    tmpdate = $.jqx.dataFormat.tryparsedate(data);
                    data = tmpdate;
                }
                if (data === "" || data === null) return "";
                tmpdate = $.jqx.dataFormat.formatdate(data, formatString, localization);
                if ((tmpdate && tmpdate.toString() == "NaN") || tmpdate == null) return "";
                data = tmpdate;
            } else if (type === 'number' || type === 'float' || type === 'int' || type == 'integer') {
                if (data === "" || data === null) return "";

                if (!isNaN(new Number(data))) {
                    var tmpdata = $.jqx.dataFormat.formatnumber(data, formatString, localization);
                    if (tmpdata.toString() == "NaN") return "";
                    else data = tmpdata;
                }
            } else {
                data = data;
            }
            if (data === null) return "";
            return data;
        };

        this.getFormat = function (dataOptions) {
            var formatString = dataOptions ? dataOptions['formatString'] : "";
            var localization = dataOptions ? dataOptions['localization'] : "";
            var dataType = 'string';
            dataType = dataOptions ? dataOptions['type'] : 'string';

            if (dataType == 'number' || dataType == 'float') {
                if (!formatString) formatString = 'f2';
            }
            if (dataType == 'int' || dataType == 'integer') {
                if (!formatString) formatString = 'n0';
            }
            if (dataType == 'date') {
                if (!formatString) formatString = 'd';
            }
            return { type: dataType, formatString: formatString, localization: localization };
        };

        this.beginFile = function () {
            throw 'Not implemented!';
        };

        this.beginHeader = function () {
            throw 'Not implemented!';
        };

        this.appendHeaderCell = function () {
            throw 'Not implemented!';
        };

        this.endHeader = function () {
            throw 'Not implemented!';
        };

        this.beginBody = function () {
            throw 'Not implemented!';
        };

        this.beginRow = function () {
            throw 'Not implemented!';
        };

        this.beginRows = function () {
            throw 'Not implemented!';
        };

        this.endRows = function () {
            throw 'Not implemented!';
        };

        this.appendBodyCell = function () {
            throw 'Not implemented!';
        };

        this.endRow = function () {
            throw 'Not implemented!';
        };

        this.endBody = function () {
            throw 'Not implemented!';
        };

        this.endFile = function () {
            throw 'Not implemented!';
        };

        this.getFile = function () {
            throw 'Not implemented!';
        };
    }

    $.jqx.dataAdapter.DataExportModuleBase = DataExportModuleBase;

})(jqxBaseFramework);

//Extending the exporter with TSV and CSV exporters
(function ($) {

    //Value exporter. This object is common prototype for TSV and CVS.
    var SvExporter = function (inValueSeparator) {

        var file, valueSeparator, hasHeader;
        var rowIndex = 0;
        var me = this;

        this.beginFile = function () {
            file = '';
        };

        this.beginHeader = function () {
        };

        this.appendHeaderCell = function (data, fieldName, style, exportHeader, index) {
            if (style) {
                if (style.level != undefined) {
                    if (index < style.maxLevel) {
                        return;
                    }
                    else if (index === style.maxLevel) {
                        if (exportHeader) {
                            appendCell(data.text);
                        }
                        for (var i = 0; i < style.maxLevel; i++) {
                            appendCell("");
                        }
                        return;
                    }
                }
            }

            hasHeader = exportHeader;
            if (exportHeader) {
                appendCell(data.text);
            }
        };

        this.endHeader = function () {
            this.endRow();
        };

        this.beginBody = function () {
            rowIndex = 0;
        };

        this.beginRow = function () {
            if ((rowIndex > 0) || (rowIndex == 0 && hasHeader)) {
                file += '\n';
            }
            rowIndex++;
        };

        this.appendBodyCell = function (data, dataType, style, row, index) {
            if (style) {
                if (style.maxLevel != undefined) {
                    if (index === style.maxLevel) {
                        appendCell(data, dataType);
                        for (var i = 0; i < style.maxLevel-row.level-1; i++) {
                            appendCell("", dataType);
                        }
                        return;
                    }
                }
            }
            appendCell(data, dataType);
        };

        this.endRow = function () {
            file = file.substring(0, file.length - 1);
        };

        this.endBody = function () {
        };

        this.endFile = function () {
        };

        this.getFile = function () {
            return file;
        };

        function prepareData(data, dataOptions) {
            if (dataOptions) {
                var format = me.getFormat(dataOptions);
                data = me.formatData(data, format.type, format.formatString, format.localization);
            }
            data = '"' + data + '"';
            return data;
        };

        function appendCell(data, dataOptions) {
            data = prepareData(data, dataOptions);
            file += data + inValueSeparator;
        };

    };

    SvExporter.prototype = new $.jqx.dataAdapter.DataExportModuleBase();

    var CsvExporter = function () { };
    CsvExporter.prototype = new SvExporter(',');

    var TsvExporter = function () { };
    TsvExporter.prototype = new SvExporter('\t');

    $.jqx.dataAdapter.ArrayExporter.extend('csv', new CsvExporter());
    $.jqx.dataAdapter.ArrayExporter.extend('tsv', new TsvExporter());

})(jqxBaseFramework);

//Extending the exporter with HTML exporter
(function ($) {

    var HtmlExporter = function () {
        var isPDF = false;
        var file;
        var hasHeader;
        var rowIndex = 0;

        this.setPDF = function () {
            isPDF = true;
        };

        this.beginFile = function (filename) {
            if (isPDF || filename == undefined) {
                file = '<table style="empty-cells: show;" cellspacing="0" cellpadding="2">';
            }
            else {
                file = '<html>\n\t<head>\n\t\t<title></title>\n' +
					   '\t\t<meta http-equiv=Content-type content=\"text/html; charset=UTF-8\">\n\t</head>\n\t<body>\n' +
					   '\t\t<table style="empty-cells: show;" cellspacing="0" cellpadding="2">';
            }
        };

        this.beginHeader = function () {
            if (isPDF) {
                file += '\n\t<thead><tr>';
            }
            else {
                file += '\n\t\t\t<thead>';
            }
        };

        this.appendHeaderCell = function (data, fieldName, style, exportHeader) {
            hasHeader = exportHeader;
            if (!exportHeader) return;

            if (isPDF) {
                file += '\n\t\t\t\t<th style="' + buildStyle(style) + '">' + data.text + '</th>';
            }
            else {
                if (style.disabled) return;
           
                if (style.merge) {
                    if (data.width) {
                        file += '\n\t\t\t\t<th colspan=' + (1+style.merge) + ' style="width: ' + data.width + 'px; ' + buildStyle(style) + '">' + data.text + '</th>';
                    }
                    else {
                        file += '\n\t\t\t\t<th colspan=' + (1 + style.merge) + ' style="' + buildStyle(style) + '">' + data.text + '</th>';
                    }
                }
                else
                {
                    if (data.width) {
                        file += '\n\t\t\t\t<th style="width: ' + data.width + 'px; ' + buildStyle(style) + '">' + data.text + '</th>';
                    }
                    else {
                        file += '\n\t\t\t\t<th style="' + buildStyle(style) + '">' + data.text + '</th>';
                    }
                }
            }
        };

        this.endHeader = function () {
            if (isPDF) {
                file += '\n\t</tr></thead>';
            }
            else {
                file += '\n\t\t\t</thead>';
            }
        };

        this.beginBody = function () {
            if (isPDF) {
                file += '\n\t<tbody>';
            }
            else {
                file += '\n\t\t\t<tbody>';
            }
            rowIndex = 0;
        };

        this.beginRow = function () {
            if (isPDF) {
                file += '\n\t<tr>';
            }
            else {
                file += '\n\t\t\t\t<tr>';
            }
            rowIndex++;
        };

        this.appendBodyCell = function (data, dataOptions, style) {
            var format = this.getFormat(dataOptions);
            if (data === "") data = "&nbsp;";
            if (isPDF) {
                if (rowIndex == 1 && !hasHeader) {
                    file += '\n\t\t\t\t\t<td style="' + buildStyle(style) + ' border-top-width: 1px;">' + this.formatData(data, format.type, format.formatString, format.localization) + '</td>';
                }
                else {
                    file += '\n\t\t\t\t\t<td style="' + buildStyle(style) + '">' + this.formatData(data, format.type, format.formatString, format.localization) + '</td>';
                }    
            }
            else {
                if (style.merge) {
                    if (rowIndex == 1 && !hasHeader) {
                        file += '\n\t\t\t\t\t<td colspan=' + (1+style.merge) + ' style="' + buildStyle(style) + ' border-top-width: 1px;">' + this.formatData(data, format.type, format.formatString, format.localization) + '</td>';
                    }
                    else {
                        file += '\n\t\t\t\t\t<td colspan=' + (1 + style.merge) + ' style="' + buildStyle(style) + '">' + this.formatData(data, format.type, format.formatString, format.localization) + '</td>';
                    }
                }
                else {
                    if (rowIndex == 1 && !hasHeader) {
                        file += '\n\t\t\t\t\t<td style="' + buildStyle(style) + ' border-top-width: 1px;">' + this.formatData(data, format.type, format.formatString, format.localization) + '</td>';
                    }
                    else {
                        file += '\n\t\t\t\t\t<td style="' + buildStyle(style) + '">' + this.formatData(data, format.type, format.formatString, format.localization) + '</td>';
                    }
                }
            }
        };

        this.endRow = function () {
            if (isPDF) {
                file += '\n\t</tr>';
            }
            else {
                file += '\n\t\t\t\t</tr>';
            }
        };

        this.endBody = function () {
            if (isPDF) {
                file += '\n\t</tbody>';
            }
            else {
                file += '\n\t\t\t</tbody>';
            }
        };

        this.endFile = function (filename) {
            if (isPDF || filename == undefined) {
                file += '\n</table>';
            }
            else {
                file += '\n\t\t</table>\n\t</body>\n</html>\n';
            }
        };

        this.getFile = function () {
            return file;
        };

        function buildStyle(styles) {
            var result = '';
            for (var style in styles) {
                if (styles.hasOwnProperty(style)) {
                    if (isPDF && style == 'font-size') {
                        styles[style] = '100%';
                    }
                    result += style + ':' + styles[style] + ';';
                }
            }
            return result;
        }
    }

    HtmlExporter.prototype = new $.jqx.dataAdapter.DataExportModuleBase();

    var TableExporter = function () { };
    TableExporter.prototype = new HtmlExporter();

    var PDFExporter = function () { };
    PDFExporter.prototype = new HtmlExporter();
    var exporter = new PDFExporter();
  
    $.jqx.dataAdapter.ArrayExporter.extend('html', new TableExporter());
    $.jqx.dataAdapter.ArrayExporter.extend('pdf', exporter);

})(jqxBaseFramework);

//Exporting to XLS format (MS Office Excel 2003)
(function ($) {

    var ExcelExporter = function () {

        var header, content, headerFields, headerStyles, existingStyles, styleCounter,
            styleBuilder = {

                style: '',

                stylesMap: {
                    'font': {
                        'color': 'Color',
                        'font-family': 'FontName',
                        'font-style': 'Italic',
                        'font-weight': 'Bold'
                    },
                    'interior': {
                        'background-color': 'Color',
                        'background': 'Color'
                    },
                    'alignment': {
                        'left': 'Left',
                        'center': 'Center',
                        'right': 'Right'
                    }
                },

                startStyle: function (styleName) {
                    this.style += '\n\t\t<Style ss:ID="' + styleName + '" ss:Name="' + styleName + '">';
                },

                buildAlignment: function (styles) {
                    if (styles['text-align']) {
                        var alignment = this.stylesMap['alignment'][styles['text-align']];
                        if (!alignment) {
                            alignment = "Left";
                        }
                        var style = '\n\t\t\t<Alignment ss:Vertical="Bottom" ss:Horizontal="' + alignment + '"/>';
                        this.style += style;
                    }
                },

                buildBorder: function (styles) {
                    if (styles['border-color']) {
                        var border = '\n\t\t\t<Borders>';
                        var bottomBorder = '\n\t\t\t\t<Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="' + styles['border-color'] + '"/>';
                        var leftBorder = '\n\t\t\t\t<Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="' + styles['border-color'] + '"/>';
                        var rightBorder = '\n\t\t\t\t<Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="' + styles['border-color'] + '"/>';
                        var topBorder = '\n\t\t\t\t<Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="' + styles['border-color'] + '"/>';

                        border += bottomBorder;
                        border += leftBorder;
                        border += rightBorder;
                        border += topBorder;
                        border += '\n\t\t\t</Borders>';
                        this.style += border;
                    }
                },

                buildFont: function (styles) {
                    var map = this.stylesMap['font'],
                        font = '\n\t\t\t<Font ';
                    for (var prop in map) {
                        if (typeof styles[prop] !== 'undefined') {
                            if (prop === 'font-style' && styles[prop].toString().toLowerCase() === 'italic') {
                                font += 'ss:Italic="1" ';
                            } else if (prop === 'font-weight' && styles[prop].toString().toLowerCase() === 'bold') {
                                font += 'ss:Bold="1" ';
                            } else if (prop === 'color') {
                                font += 'ss:' + map[prop] + '="' + styles[prop] + '" ';
                            }
                        }
                    }
                    font += '/>';
                    this.style += font;
                },

                buildInterior: function (styles) {
                    var map = this.stylesMap['interior'],
                        interior = '\n\t\t\t<Interior ';
                    var hasInterior = false;
                    for (var prop in map) {
                        if (typeof styles[prop] !== 'undefined') {
                            interior += 'ss:' + map[prop] + '="' + styles[prop] + '" ';
                            hasInterior = true;
                        }
                    }
                    if (hasInterior)
                        interior += 'ss:Pattern="Solid"';

                    interior += '/>';
                    this.style += interior;
                },

                buildFormat: function (styles) {
                    if (styles['dataType'] == 'number' || styles['dataType'] == 'float' || styles['dataType'] == 'int' || styles['dataType'] == 'integer') {
                        var formatString = styles['formatString'];
                        if (formatString == "" || formatString.indexOf('n') != -1 || formatString.indexOf('N') != -1) {
                            this.style += '\n\t\t\t<NumberFormat ss:Format="0"/>';
                        }
                        else if (formatString == "f" || formatString == "F" || formatString == "D" || formatString.indexOf('d') != -1) {
                            this.style += '\n\t\t\t<NumberFormat ss:Format="#,##0.00_);[Red]\(#,##0.00\)"/>';
                        }
                        else if (formatString.indexOf('p') != -1 || formatString.indexOf('P') != -1) {
                            this.style += '\n\t\t\t<NumberFormat ss:Format="Percent"/>';
                        }
                        else if (formatString.indexOf('c') != -1 || formatString.indexOf('C') != -1) {
                            if (styles['currencysymbol'] && parseInt(styles['currencysymbol'].charCodeAt(0)) == 8364)
                            {
                                 this.style += '\n\t\t\t<NumberFormat ss:Format="Euro Currency"/>';
                            }
                            else
                            {
                                this.style += '\n\t\t\t<NumberFormat ss:Format="Currency"/>';
                            }
                        }
                    }
                    else if (styles['dataType'] == 'date') {
                        this.style += '\n\t\t\t<NumberFormat ss:Format="Short Date"/>';
                    }
                },

                closeStyle: function () {
                    this.style += '\n\t\t</Style>';
                },

                toString: function () {
                    var temp = this.style;
                    this.style = '';
                    return temp;
                }
            };

        this.beginFile = function () {
            existingStyles = {};
            styleCounter = 0;
            header = '<?xml version="1.0"?>' +
                            '\n\t<?mso-application progid="Excel.Sheet"?> ' +
                            '\n\t<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" ' +
                            '\n\txmlns:o="urn:schemas-microsoft-com:office:office" ' +
                            '\n\txmlns:x="urn:schemas-microsoft-com:office:excel" ' +
                            '\n\txmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" ' +
                            '\n\txmlns:html="http://www.w3.org/TR/REC-html40"> ' +
                            '\n\t<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"> ' +
                            '\n\t<Version>12.00</Version> ' +
                            '\n\t</DocumentProperties> ' +
                            '\n\t<ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel"> ' +
                            '\n\t<WindowHeight>8130</WindowHeight> ' +
                            '\n\t<WindowWidth>15135</WindowWidth> ' +
                            '\n\t<WindowTopX>120</WindowTopX> ' +
                            '\n\t<WindowTopY>45</WindowTopY> ' +
                            '\n\t<ProtectStructure>False</ProtectStructure> ' +
                            '\n\t<ProtectWindows>False</ProtectWindows> ' +
                            '\n\t</ExcelWorkbook> ' +
                        '\n\t<Styles>';
        };

        this.beginHeader = function () {
            content = '\n\t<Worksheet ss:Name="Sheet1">\n\t\t<Table>';
            headerFields = [];
            headerStyles = [];
        };

        this.appendHeaderCell = function (data, fieldName, style) {
            var width = data.width != undefined ? data.width : data.text.length * 10;
            content += '\n\t\t\t<Column ss:Width="' + width + '"/>';
            headerFields.push(data);
            headerStyles.push(style);
        };

        this.endHeader = function (exportHeader) {
            if (exportHeader) {
                this.beginRow();
                for (var i = 0; i < headerFields.length; i += 1) {
                    if (headerStyles[i].disabled) continue;
                    appendCell.call(this, headerFields[i]['text'], null, headerStyles[i]);
                }
                this.endRow();
            }
        };

        this.beginBody = function () {
        };

        this.beginRow = function (level) {
            if (level != undefined) {
                content += '\n\t\t\t';
                for (var i = 0; i < level; i++) {
                    content += '\t';
                }
                content += '<Row>';
                return;
            }

            content += '\n\t\t\t<Row>';
        };

        this.beginRows = function (level) {
            content += '\n\t\t\t\t<Rows>';
        };

        this.appendBodyCell = function (data, dataType, style, row) {
            appendCell.call(this, data, dataType, style, row);
        };

        this.endRow = function (level) {
            if (level != undefined) {
                content += '\n\t\t\t';
                for (var i = 0; i < level; i++) {
                    content += '\t';
                }
                content += '</Row>';
                return;
            }

            content += '\n\t\t\t</Row>';
        };

        this.endRows = function (level) {
            if (level != undefined) {
                content += '\n\t\t\t';
                for (var i = 0; i < level; i++) {
                    content += '\t';
                }
                content += '</Rows>';
                return;
            }
        };

        this.endBody = function () {
            content += '\n\t\t</Table>';
        };

        this.endFile = function () {
            content += '\n\t</Worksheet>\n</Workbook>';
            header += '\n\t</Styles>';
        };

        this.getFile = function () {
            return header + content;
        };

        function appendCell(data, dataOptions, style, row) {
            var columnType = "String";

            var format = this.getFormat(dataOptions);

            if (data != null && data.toString().substring(0, 3) == "_AG") {
                data = data.toString().substring(3);
                columnType = "String";
            }
            else {
                if (format.type == 'date') {
                    data = this.formatData(data, format.type, format.formatString, format.localization);
                    if (data === null || data === "") {
                        data = "";
                        columnType = "String";
                    }
                }
                if (format.type == 'string') {
                    if (data === null || data === undefined) {
                        data = "";
                    }
                    else {
                        if (data.toString().indexOf('&') >= 0) {
                            data = data.toString().replace(/&/g, '&amp;');
                        }
                        if (data.toString().indexOf('>') >= 0) {
                            data = data.toString().replace(/>/g, '&gt;');
                        }
                        if (data.toString().indexOf('<') >= 0) {
                            data = data.toString().replace(/</g, '&lt;');
                        }
                        if (data.toString().indexOf('"') >= 0) {
                            data = data.toString().replace(/"/g, '&quot;');
                        }
                        if (data.toString().indexOf("'") >= 0) {
                            data = data.toString().replace(/'/g, '&apos;');
                        }
                    }
                }

                if (style.dataType == 'number' || style.dataType == 'float' || style.dataType == 'int' || style.dataType == 'integer') {
                    columnType = "Number";
                    data = parseFloat(data);
                    if (data === null || isNaN(data) || data === "") {
                        data = "";
                        columnType = "String";
                    }
                    if (data && columnType != "String" && data != "") {
                        if (dataOptions && dataOptions.formatString && dataOptions.formatString.indexOf('p') >= 0) {
                            data = data / 100;
                        }
                    }

                    style.currencysymbol = dataOptions.localization.currencysymbol;
                }
            }

            var styleId = getStyleId(style);
            if (style.merge) {
                content += '\n\t\t\t\t<Cell ss:MergeAcross="' + style.merge + '" ss:StyleID="' + styleId + '"><Data ss:Type="' + columnType + '">' + data + '</Data></Cell>';
            }
            else {
                content += '\n\t\t\t\t<Cell ss:StyleID="' + styleId + '"><Data ss:Type="' + columnType + '">' + data + '</Data></Cell>';
            }
        }

        function generateStyleId() {
            styleCounter += 1;
            return 'xls-style-' + styleCounter;
        }

        function findStyle(style) {
            for (var s in existingStyles) {
                if (isSubset(style, existingStyles[s]) && isSubset(existingStyles[s], style)) {
                    return s;
                }
            }
            return undefined;
        }

        function isSubset(first, second) {
            var subset = true;
            for (var p in first) {
                if (first[p] !== second[p]) {
                    subset = false;
                }
            }
            return subset;
        }

        function appendStyle(id, style) {
            styleBuilder.startStyle(id);
            styleBuilder.buildAlignment(style);
            styleBuilder.buildBorder(style);
            styleBuilder.buildFont(style);
            styleBuilder.buildInterior(style);
            styleBuilder.buildFormat(style);
            styleBuilder.closeStyle();
            header += styleBuilder.toString();
        }

        function getStyleId(style) {
            if (!style) {
                return '';
            }
            var id = findStyle(style);
            if (typeof id === 'undefined') {
                id = generateStyleId();
                existingStyles[id] = style;
                appendStyle(id, style);
            }
            return id;
        }
    }

    ExcelExporter.prototype = new $.jqx.dataAdapter.DataExportModuleBase();
    $.jqx.dataAdapter.ArrayExporter.extend('xls', new ExcelExporter());
})(jqxBaseFramework);

//Exporting to XML
(function ($) {

    var XmlExporter = function () {

        var file, headerFields, index;

        this.beginFile = function () {
            file = '<?xml version="1.0" encoding="UTF-8" ?>';
            file += '\n<table>';
        }

        this.beginHeader = function () {
            headerFields = [];
        }

        this.appendHeaderCell = function (data, fieldName) {
            headerFields.push(fieldName);
        }

        this.endHeader = function () {
        }

        this.beginBody = function (data, dataType) {
        }

        this.beginRow = function (level) {
            if (level != undefined) {
                if (this.hierarchy) {
                    file += '\n\t';
                    for (var i = 0; i < level; i++) {
                        file += '\t\t';
                    }
                    file += '<row>';
                    index = 0;
                    return;
                }
            }

            file += '\n\t<row>';
            index = 0;
        }

        this.beginRows = function (level) {
            if (level != undefined) {
                file += '\n\t\t';
                for (var i = 0; i < level; i++) {
                    file += '\t\t';
                }
                file += '<rows>';
                index = 0;
                return;
            }
            file += '\n\t\t<rows>';
        }

        this.appendBodyCell = function (data, dataOptions, style, row, indx, group) {
            var format = this.getFormat(dataOptions);
            data = this.formatData(data, format.type, format.formatString, format.localization);
            if (format.type == "string") {
                if (data.toString().indexOf('&') >= 0) {
                    data = data.toString().replace(/&/g, '&amp;');
                }
                if (data.toString().indexOf('>') >= 0) {
                    data = data.toString().replace(/>/g, '&gt;');
                }
                if (data.toString().indexOf('<') >= 0) {
                    data = data.toString().replace(/</g, '&lt;');
                }
                if (data.toString().indexOf('"') >= 0) {
                    data = data.toString().replace(/"/g, '&quot;');
                }
                if (data.toString().indexOf("'") >= 0) {
                    data = data.toString().replace(/'/g, '&apos;');
                }
            }
            if (row.level != undefined) {
                if (this.hierarchy) {
                    file += '\n\t\t';
                    for (var i = 0; i < row.level; i++) {
                        file += '\t\t';
                    }
                    if (group === undefined) {
                        file += '<' + headerFields[index] + '>' + data + '</' + headerFields[index] + '>';
                    }
                    else {
                        file += '<' + group + '>' + data + '</' + group + '>';
                    }
                }
                else {
                    if (group != undefined) {
                        file += '\n\t\t<' + group + '>' + data + '</' + group + '>';
                    }
                    else {
                        file += '\n\t\t<' + headerFields[index] + '>' + data + '</' + headerFields[index] + '>';
                    }
                }
            }
            else {
                file += '\n\t\t<' + headerFields[index] + '>' + data + '</' + headerFields[index] + '>';
            }
            index++;
        }

        this.endRow = function (level) {
            if (level != undefined) {
                if (this.hierarchy) {
                    file += '\n\t';
                    for (var i = 0; i < level; i++) {
                        file += '\t\t';
                    }

                    file += '</row>';
                    index = 0;
                    return;
                }
            }
            file += '\n\t</row>';
            index = 0;
        }

        this.endRows = function (level) {
            if (level != undefined) {
                file += '\n\t\t';
                for (var i = 0; i < level; i++) {
                    file += '\t\t';
                }
                file += '</rows>';
                index = 0;
                return;
            }
            file += '\n\t\t</rows>';
        }

        this.endBody = function () {
        }

        this.endFile = function () {
            file += '\n</table>';
        }

        this.getFile = function () {
            return file;
        }
    }

    XmlExporter.prototype = new $.jqx.dataAdapter.DataExportModuleBase();
    $.jqx.dataAdapter.ArrayExporter.extend('xml', new XmlExporter());
})(jqxBaseFramework);


//Exporting to JSON
(function ($) {

    var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        meta = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        };

    function quote(string) {
        return '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"';
    }

    function formatNumber(n) {
        return n < 10 ? '0' + n : n;
    }

    function stringifyDate(value) {
        var date;
        if (isFinite(value.valueOf())) {
            date = value.getUTCFullYear() + '-' + formatNumber(value.getUTCMonth() + 1) + '-' +
            formatNumber(value.getUTCDate()) + 'T' + formatNumber(value.getUTCHours()) + ':' +
            formatNumber(value.getUTCMinutes()) + ':' + formatNumber(value.getUTCSeconds()) + 'Z"';
        } else {
            date = 'null';
        }
        return date;
    }

    function stringifyArray(value) {
        var len = value.length,
            partial = [],
            i;
        for (i = 0; i < len; i++) {
            partial.push(str(i, value) || 'null');
        }

        return '[' + partial.join(',') + ']';
    }

    function stringifyObject(value) {
        var partial = [],
            i, v;
        for (i in value) {
            if (Object.prototype.hasOwnProperty.call(value, i)) {
                v = str(i, value);
                if (v) {
                    partial.push(quote(i) + ':' + v);
                }
            }
        }
        return '{' + partial.join(',') + '}';
    }

    function stringifyReference(value) {
        switch (Object.prototype.toString.call(value)) {
            case '[object Date]':
                return stringifyDate(value);
            case '[object Array]':
                return stringifyArray(value);
        }
        return stringifyObject(value);
    }

    function stringifyPrimitive(value, type) {
        switch (type) {
            case 'string':
                return quote(value);
            case 'number':
            case 'float':
            case 'integer':
            case 'int':
                return isFinite(value) ? value : 'null';
            case 'boolean':
                return value;
        }
        return 'null';
    }

    function str(key, holder) {
        var value = holder[key], type = typeof value;

        if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
            value = value.toJSON(key);
            type = typeof value;
        }
        if (/(number|float|int|integer|string|boolean)/.test(type) || (!value && type === 'object')) {
            return stringifyPrimitive(value, type);
        } else {
            return stringifyReference(value);
        }
    }

    function stringify(value) {
        if (window.JSON && typeof window.JSON.stringify === 'function') {
            return window.JSON.stringify(value);
        }

        return str("", { "": value });
    }

    var JsonExporter = function () {
        var me = this;
        this.prepareData = function(data, dataOptions) {
            if (dataOptions) {
                var format = me.getFormat(dataOptions);
                data = me.formatData(data, format.type, format.formatString, format.localization);
            }
            return data;
        }

        var file,
            content,
            currentCell,
            cellHierarchy = [],
            level = 0
        ;

        this.beginFile = function () {
            content = [];
        }

        this.beginHeader = function () {
        }

        this.appendHeaderCell = function (data) {
        }

        this.endHeader = function () {
        }

        this.beginBody = function (data, dataType) {
        }

        this.beginRow = function () {
            if (hierarchy) {
                cellHierarchy[level] = {};
            }
            else {
                currentCell = {};
            }
        }

        this.beginRows = function () {
            cellHierarchy[level].rows = [];
            level++;
            cellHierarchy[level] = {};
        }
        this.endRows = function () {
            level--;
        }

        this.appendBodyCell = function (data, dataType) {
            var text = this.prepareData(data, dataType);
            if (hierarchy) {
                cellHierarchy[level][dataType['text']] = text;
            }
            else {
                currentCell[dataType['text']] = text;
            }
        }

        this.endRow = function () {
            if (hierarchy) {
                if (level == 0) {
                    content.push(cellHierarchy[level]);
                }
                else {
                    cellHierarchy[level-1].rows.push(cellHierarchy[level]);
                }
            }
            else {
                content.push(currentCell);
            }
        }

        this.endBody = function () {
        }

        this.endFile = function () {
            file = stringify(content);
        }

        this.getFile = function () {
            return file;
        }
    }

    JsonExporter.prototype = new $.jqx.dataAdapter.DataExportModuleBase();
    $.jqx.dataAdapter.ArrayExporter.extend('json', new JsonExporter());

})(jqxBaseFramework);


var pdfDataExport = window.jqxPdfDataExport = (function () {
    'use strict';
    if (typeof btoa === 'undefined') {
        window.btoa = function (data) {
            var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
                b64a = b64.split(''),
                o1,
                o2,
                o3,
                h1,
                h2,
                h3,
                h4,
                bits,
                i = 0,
                ac = 0,
                enc = "",
                tmp_arr = [],
                r;

            do {
                o1 = data.charCodeAt(i++);
                o2 = data.charCodeAt(i++);
                o3 = data.charCodeAt(i++);

                bits = o1 << 16 | o2 << 8 | o3;

                h1 = bits >> 18 & 0x3f;
                h2 = bits >> 12 & 0x3f;
                h3 = bits >> 6 & 0x3f;
                h4 = bits & 0x3f;

                tmp_arr[ac++] = b64a[h1] + b64a[h2] + b64a[h3] + b64a[h4];
            } while (i < data.length);

            enc = tmp_arr.join('');
            r = data.length % 3;
            return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
        };
    }

    if (typeof atob === 'undefined') {
        window.atob = function (data) {

            var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
                o1,
                o2,
                o3,
                h1,
                h2,
                h3,
                h4,
                bits,
                i = 0,
                ac = 0,
                dec = "",
                tmp_arr = [];

            if (!data) {
                return data;
            }

            data += '';

            do { // unpack four hexets into three octets using index points in b64
                h1 = b64.indexOf(data.charAt(i++));
                h2 = b64.indexOf(data.charAt(i++));
                h3 = b64.indexOf(data.charAt(i++));
                h4 = b64.indexOf(data.charAt(i++));

                bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

                o1 = bits >> 16 & 0xff;
                o2 = bits >> 8 & 0xff;
                o3 = bits & 0xff;

                if (h3 === 64) {
                    tmp_arr[ac++] = String.fromCharCode(o1);
                } else if (h4 === 64) {
                    tmp_arr[ac++] = String.fromCharCode(o1, o2);
                } else {
                    tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
                }
            } while (i < data.length);
            dec = tmp_arr.join('');
            return dec;
        };
    }

    var getObjectLength = typeof Object.keys === 'function' ?
                function (object) {
                    return Object.keys(object).length;
                } :
                function (object) {
                    var i = 0, e;
                    for (e in object) {
                        if (object.hasOwnProperty(e)) {
                            i++;
                        }
                    }
                    return i;
                },

/**
PubSub implementation

@class
@name PubSub
*/
        PubSub = function (context) {
            /*
            @private
            @fieldOf PubSub
            */
            this.topics = {};
            /**
            Stores what will be `this` within the callback functions.

            @private
            @fieldOf PubSub#
            */
            this.context = context;
            /**
            Allows caller to emit an event and pass arguments to event listeners.
            @public
            @function
            @param topic {String} Name of the channel on which to voice this event
            @param args Any number of arguments you want to pass to the listeners of this event.
            @methodOf PubSub#
            @name publish
            */
            this.publish = function (topic, args) {
                if (this.topics[topic]) {
                    var currentTopic = this.topics[topic],
                        toremove = [],
                        fn,
                        i,
                        l,
                        pair,
                        emptyFunc = function () { };
                    args = Array.prototype.slice.call(arguments, 1);
                    for (i = 0, l = currentTopic.length; i < l; i++) {
                        pair = currentTopic[i]; // this is a [function, once_flag] array
                        fn = pair[0];
                        if (pair[1]) { /* 'run once' flag set */
                            pair[0] = emptyFunc;
                            toremove.push(i);
                        }
                        fn.apply(this.context, args);
                    }
                    for (i = 0, l = toremove.length; i < l; i++) {
                        currentTopic.splice(toremove[i], 1);
                    }
                }
            };
            /**
            Allows listener code to subscribe to channel and be called when data is available
            @public
            @function
            @param topic {String} Name of the channel on which to voice this event
            @param callback {Function} Executable (function pointer) that will be ran when event is voiced on this channel.
            @param once {Boolean} (optional. False by default) Flag indicating if the function is to be triggered only once.
            @returns {Object} A token object that cen be used for unsubscribing.
            @methodOf PubSub#
            @name subscribe
            */
            this.subscribe = function (topic, callback, once) {
                if (!this.topics[topic]) {
                    this.topics[topic] = [[callback, once]];
                } else {
                    this.topics[topic].push([callback, once]);
                }
                return {
                    "topic": topic,
                    "callback": callback
                };
            };
            /**
            Allows listener code to unsubscribe from a channel
            @public
            @function
            @param token {Object} A token object that was returned by `subscribe` method
            @methodOf PubSub#
            @name unsubscribe
            */
            this.unsubscribe = function (token) {
                if (this.topics[token.topic]) {
                    var currentTopic = this.topics[token.topic], i, l;

                    for (i = 0, l = currentTopic.length; i < l; i++) {
                        if (currentTopic[i][0] === token.callback) {
                            currentTopic.splice(i, 1);
                        }
                    }
                }
            };
        };


    /**
    @constructor
    @private
    */
    function pdfDataExport(orientation, unit, format, compressPdf) { /** String orientation, String unit, String format, Boolean compressed */

        // Default parameter values
        if (typeof orientation === 'undefined') {
            orientation = 'p';
        } else {
            orientation = orientation.toString().toLowerCase();
        }
        if (typeof unit === 'undefined') { unit = 'mm'; }
        if (typeof format === 'undefined') { format = 'a4'; }
        if (typeof compressPdf === 'undefined' && typeof zpipe === 'undefined') { compressPdf = false; }

        var format_as_string = format.toString().toLowerCase(),
            version = '0.9.0rc2',
            content = [],
            content_length = 0,
            compress = compressPdf,
            pdfVersion = '1.3', // PDF Version
            pageFormats = { // Size in pt of various paper formats
                'a3': [841.89, 1190.55],
                'a4': [595.28, 841.89],
                'a5': [420.94, 595.28],
                'letter': [612, 792],
                'legal': [612, 1008]
            },
            textColor = '0 g',
            drawColor = '0 G',
            page = 0,
            pages = [],
            objectNumber = 2, // 'n' Current object number
            outToPages = false, // switches where out() prints. outToPages true = push to pages obj. outToPages false = doc builder content
            offsets = [], // List of offsets. Activated and reset by buildDocument(). Pupulated by various calls buildDocument makes.
            fonts = {}, // collection of font objects, where key is fontKey - a dynamically created label for a given font.
            fontmap = {}, // mapping structure fontName > fontStyle > font key - performance layer. See addFont()
            activeFontSize = 16,
            activeFontKey, // will be string representing the KEY of the font as combination of fontName + fontStyle
            lineWidth = 0.200025, // 2mm
            pageHeight,
            pageWidth,
            k, // Scale factor
            documentProperties = { 'title': '', 'subject': '', 'author': '', 'keywords': '', 'creator': '' },
            lineCapID = 0,
            lineJoinID = 0,
            API = {},
            events = new PubSub(API),
            tmp,
            plugin,
            /////////////////////
            // Private functions
            /////////////////////
            // simplified (speedier) replacement for sprintf's %.2f conversion
            f2 = function (number) {
                return number.toFixed(2);
            },
            // simplified (speedier) replacement for sprintf's %.3f conversion
            f3 = function (number) {
                return number.toFixed(3);
            },
            // simplified (speedier) replacement for sprintf's %02d
            padd2 = function (number) {
                var n = (number).toFixed(0);
                if (number < 10) {
                    return '0' + n;
                } else {
                    return n;
                }
            },
            // simplified (speedier) replacement for sprintf's %02d
            padd10 = function (number) {
                var n = (number).toFixed(0);
                if (n.length < 10) {
                    return new Array(11 - n.length).join('0') + n;
                } else {
                    return n;
                }
            },
            out = function (string) {
                if (outToPages) { /* set by beginPage */
                    pages[page].push(string);
                } else {
                    content.push(string);
                    content_length += string.length + 1; // +1 is for '\n' that will be used to join contents of content
                }
            },
            newObject = function () {
                // Begin a new object
                objectNumber++;
                offsets[objectNumber] = content_length;
                out(objectNumber + ' 0 obj');
                return objectNumber;
            },
            putStream = function (str) {
                out('stream');
                out(str);
                out('endstream');
            },
            wPt,
            hPt,
            kids,
            i,
            putPages = function () {
                wPt = pageWidth * k;
                hPt = pageHeight * k;

                // outToPages = false as set in endDocument(). out() writes to content.

                var n, p, arr, uint, i, deflater, adler32;
                for (n = 1; n <= page; n++) {
                    newObject();
                    out('<</Type /Page');
                    out('/Parent 1 0 R');
                    out('/Resources 2 0 R');
                    out('/Contents ' + (objectNumber + 1) + ' 0 R>>');
                    out('endobj');

                    // Page content
                    p = pages[n].join('\n');
                    newObject();
                    if (compress) {
                        arr = [];
                        for (i = 0; i < p.length; ++i) {
                            arr[i] = p.charCodeAt(i);
                        }
                        adler32 = adler32cs.from(p);
                        deflater = new Deflater(6);
                        deflater.append(new Uint8Array(arr));
                        p = deflater.flush();
                        arr = [new Uint8Array([120, 156]), new Uint8Array(p),
                               new Uint8Array([adler32 & 0xFF, (adler32 >> 8) & 0xFF, (adler32 >> 16) & 0xFF, (adler32 >> 24) & 0xFF])];
                        p = '';
                        for (i in arr) {
                            if (arr.hasOwnProperty(i)) {
                                p += String.fromCharCode.apply(null, arr[i]);
                            }
                        }
                        out('<</Length ' + p.length + ' /Filter [/FlateDecode]>>');
                    } else {
                        out('<</Length ' + p.length + '>>');
                    }
                    putStream(p);
                    out('endobj');
                }
                offsets[1] = content_length;
                out('1 0 obj');
                out('<</Type /Pages');
                kids = '/Kids [';
                for (i = 0; i < page; i++) {
                    kids += (3 + 2 * i) + ' 0 R ';
                }
                out(kids + ']');
                out('/Count ' + page);
                out('/MediaBox [0 0 ' + f2(wPt) + ' ' + f2(hPt) + ']');
                out('>>');
                out('endobj');
            },
            putFont = function (font) {
                font.objectNumber = newObject();
                out('<</BaseFont/' + font.PostScriptName + '/Type/Font');
                if (typeof font.encoding === 'string') {
                    out('/Encoding/' + font.encoding);
                }
                out('/Subtype/Type1>>');
                out('endobj');
            },
            putFonts = function () {
                var fontKey;
                for (fontKey in fonts) {
                    if (fonts.hasOwnProperty(fontKey)) {
                        putFont(fonts[fontKey]);
                    }
                }
            },
            putXobjectDict = function () {
                // Loop through images, or other data objects
                events.publish('putXobjectDict');
            },
            putResourceDictionary = function () {
                out('/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]');
                out('/Font <<');
                // Do this for each font, the '1' bit is the index of the font
                var fontKey;
                for (fontKey in fonts) {
                    if (fonts.hasOwnProperty(fontKey)) {
                        out('/' + fontKey + ' ' + fonts[fontKey].objectNumber + ' 0 R');
                    }
                }
                out('>>');
                out('/XObject <<');
                putXobjectDict();
                out('>>');
            },
            putResources = function () {
                putFonts();
                events.publish('putResources');
                // Resource dictionary
                offsets[2] = content_length;
                out('2 0 obj');
                out('<<');
                putResourceDictionary();
                out('>>');
                out('endobj');
                events.publish('postPutResources');
            },
            addToFontDictionary = function (fontKey, fontName, fontStyle) {
                // this is mapping structure for quick font key lookup.
                // returns the KEY of the font (ex: "F1") for a given pair of font name and type (ex: "Arial". "Italic")
                var undef;
                if (fontmap[fontName] === undef) {
                    fontmap[fontName] = {}; // fontStyle is a var interpreted and converted to appropriate string. don't wrap in quotes.
                }
                fontmap[fontName][fontStyle] = fontKey;
            },
            /**
            FontObject describes a particular font as member of an instnace of pdfDataExport

            It's a collection of properties like 'id' (to be used in PDF stream),
            'fontName' (font's family name), 'fontStyle' (font's style variant label)

            @class
            @public
            @property id {String} PDF-document-instance-specific label assinged to the font.
            @property PostScriptName {String} PDF specification full name for the font
            @property encoding {Object} Encoding_name-to-Font_metrics_object mapping.
            @name FontObject
            */
            FontObject = {},
            addFont = function (PostScriptName, fontName, fontStyle, encoding) {
                var fontKey = 'F' + (getObjectLength(fonts) + 1).toString(10),
                    // This is FontObject
                    font = fonts[fontKey] = {
                        'id': fontKey,
                        // , 'objectNumber':   will be set by putFont()
                        'PostScriptName': PostScriptName,
                        'fontName': fontName,
                        'fontStyle': fontStyle,
                        'encoding': encoding,
                        'metadata': {}
                    };

                addToFontDictionary(fontKey, fontName, fontStyle);

                events.publish('addFont', font);

                return fontKey;
            },
            addFonts = function () {

                var HELVETICA = "helvetica",
                    TIMES = "times",
                    COURIER = "courier",
                    NORMAL = "normal",
                    BOLD = "bold",
                    ITALIC = "italic",
                    BOLD_ITALIC = "bolditalic",
                    encoding = 'StandardEncoding',
                    standardFonts = [
                        ['Helvetica', HELVETICA, NORMAL],
                        ['Helvetica-Bold', HELVETICA, BOLD],
                        ['Helvetica-Oblique', HELVETICA, ITALIC],
                        ['Helvetica-BoldOblique', HELVETICA, BOLD_ITALIC],
                        ['Courier', COURIER, NORMAL],
                        ['Courier-Bold', COURIER, BOLD],
                        ['Courier-Oblique', COURIER, ITALIC],
                        ['Courier-BoldOblique', COURIER, BOLD_ITALIC],
                        ['Times-Roman', TIMES, NORMAL],
                        ['Times-Bold', TIMES, BOLD],
                        ['Times-Italic', TIMES, ITALIC],
                        ['Times-BoldItalic', TIMES, BOLD_ITALIC]
                    ],
                    i,
                    l,
                    fontKey,
                    parts;
                for (i = 0, l = standardFonts.length; i < l; i++) {
                    var en = encoding;
              
                    fontKey = addFont(
                        standardFonts[i][0],
                        standardFonts[i][1],
                        standardFonts[i][2],
                        en
                    );

                    // adding aliases for standard fonts, this time matching the capitalization
                    parts = standardFonts[i][0].split('-');
                    addToFontDictionary(fontKey, parts[0], parts[1] || '');
                }

                events.publish('addFonts', { 'fonts': fonts, 'dictionary': fontmap });
            },
            /**

            @public
            @function
            @param text {String}
            @param flags {Object} Encoding flags.
            @returns {String} Encoded string
            */
            to8bitStream = function (text, flags) {

                var i, l, undef, sourceEncoding, encodingBlock, outputEncoding, newtext, isUnicode, ch, bch;

                if (flags === undef) {
                    flags = {};
                }

                sourceEncoding = flags.sourceEncoding ? sourceEncoding : 'Unicode';

                outputEncoding = flags.outputEncoding;

                // This 'encoding' section relies on font metrics format
                // attached to font objects by, among others,
                // "Willow Systems' standard_font_metrics plugin"
                // see pdfDataExport.plugin.standard_font_metrics.js for format
                // of the font.metadata.encoding Object.
                // It should be something like
                //   .encoding = {'codePages':['WinANSI....'], 'WinANSI...':{code:code, ...}}
                //   .widths = {0:width, code:width, ..., 'fof':divisor}
                //   .kerning = {code:{previous_char_code:shift, ..., 'fof':-divisor},...}
                if ((flags.autoencode || outputEncoding) &&
                        fonts[activeFontKey].metadata &&
                        fonts[activeFontKey].metadata[sourceEncoding] &&
                        fonts[activeFontKey].metadata[sourceEncoding].encoding
                        ) {
                    encodingBlock = fonts[activeFontKey].metadata[sourceEncoding].encoding;

                    // each font has default encoding. Some have it clearly defined.
                    if (!outputEncoding && fonts[activeFontKey].encoding) {
                        outputEncoding = fonts[activeFontKey].encoding;
                    }

                    // Hmmm, the above did not work? var's try again, in different place.
                    if (!outputEncoding && encodingBlock.codePages) {
                        outputEncoding = encodingBlock.codePages[0]; // var's say, first one is the default
                    }

                    if (typeof outputEncoding === 'string') {
                        outputEncoding = encodingBlock[outputEncoding];
                    }
                    // we want output encoding to be a JS Object, where
                    // key = sourceEncoding's character code and
                    // value = outputEncoding's character code.
                    if (outputEncoding) {
                        isUnicode = false;
                        newtext = [];
                        for (i = 0, l = text.length; i < l; i++) {
                            ch = outputEncoding[text.charCodeAt(i)];
                            if (ch) {
                                newtext.push(
                                    String.fromCharCode(ch)
                                );
                            } else {
                                newtext.push(
                                    text[i]
                                );
                            }

                            // since we are looping over chars anyway, might as well
                            // check for residual unicodeness
                            if (newtext[i].charCodeAt(0) >> 8) { /* more than 255 */
                                isUnicode = true;
                            }
                        }
                        text = newtext.join('');
                    }
                }

                i = text.length;
                // isUnicode may be set to false above. Hence the triple-equal to undefined
                while (isUnicode === undef && i !== 0) {
                    if (text.charCodeAt(i - 1) >> 8) { /* more than 255 */
                        isUnicode = true;
                    }
                    i--;
                }
                if (!isUnicode) {
                    return text;
                } else {
                    newtext = flags.noBOM ? [] : [254, 255];
                    for (i = 0, l = text.length; i < l; i++) {
                        ch = text.charCodeAt(i);
                        bch = ch >> 8; // divide by 256
                        if (bch >> 8) { /* something left after dividing by 256 second time */
                            throw new Error("Character at position " + i.toString(10) + " of string '" + text + "' exceeds 16bits. Cannot be encoded into UCS-2 BE");
                        }
                        newtext.push(bch);
                        newtext.push(ch - (bch << 8));
                    }
                    return String.fromCharCode.apply(undef, newtext);
                }
            },
            // Replace '/', '(', and ')' with pdf-safe versions
            pdfEscape = function (text, flags) {
                // doing to8bitStream does NOT make this PDF display unicode text. For that
                // we also need to reference a unicode font and embed it - royal pain in the rear.

                // There is still a benefit to to8bitStream - PDF simply cannot handle 16bit chars,
                // which JavaScript Strings are happy to provide. So, while we still cannot display
                // 2-byte characters property, at least CONDITIONALLY converting (entire string containing)
                // 16bit chars to (USC-2-BE) 2-bytes per char + BOM streams we ensure that entire PDF
                // is still parseable.
                // This will allow immediate support for unicode in document properties strings.
                return to8bitStream(text, flags).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
            },
            putInfo = function () {
                out('/Producer (pdfDataExport ' + version + ')');
                if (documentProperties.title) {
                    out('/Title (' + pdfEscape(documentProperties.title) + ')');
                }
                if (documentProperties.subject) {
                    out('/Subject (' + pdfEscape(documentProperties.subject) + ')');
                }
                if (documentProperties.author) {
                    out('/Author (' + pdfEscape(documentProperties.author) + ')');
                }
                if (documentProperties.keywords) {
                    out('/Keywords (' + pdfEscape(documentProperties.keywords) + ')');
                }
                if (documentProperties.creator) {
                    out('/Creator (' + pdfEscape(documentProperties.creator) + ')');
                }
                var created = new Date();
                out('/CreationDate (D:' +
                    [
                        created.getFullYear(),
                        padd2(created.getMonth() + 1),
                        padd2(created.getDate()),
                        padd2(created.getHours()),
                        padd2(created.getMinutes()),
                        padd2(created.getSeconds())
                    ].join('') +
                    ')'
                    );
            },
            putCatalog = function () {
                out('/Type /Catalog');
                out('/Pages 1 0 R');
                // @TODO: Add zoom and layout modes
                out('/OpenAction [3 0 R /FitH null]');
                out('/PageLayout /OneColumn');
                events.publish('putCatalog');
            },
            putTrailer = function () {
                out('/Size ' + (objectNumber + 1));
                out('/Root ' + objectNumber + ' 0 R');
                out('/Info ' + (objectNumber - 1) + ' 0 R');
            },
            beginPage = function () {
                page++;
                // Do dimension stuff
                outToPages = true;
                pages[page] = [];
            },
            _addPage = function () {
                beginPage();
                // Set line width
                out(f2(lineWidth * k) + ' w');
                // Set draw color
                out(drawColor);
                // resurrecting non-default line caps, joins
                if (lineCapID !== 0) {
                    out(lineCapID.toString(10) + ' J');
                }
                if (lineJoinID !== 0) {
                    out(lineJoinID.toString(10) + ' j');
                }
                events.publish('addPage', { 'pageNumber': page });
            },
            /**
            Returns a document-specific font key - a label assigned to a
            font name + font type combination at the time the font was added
            to the font inventory.

            Font key is used as label for the desired font for a block of text
            to be added to the PDF document stream.
            @private
            @function
            @param fontName {String} can be undefined on "falthy" to indicate "use current"
            @param fontStyle {String} can be undefined on "falthy" to indicate "use current"
            @returns {String} Font key.
            */
            getFont = function (fontName, fontStyle) {
                var key, undef;

                if (fontName === undef) {
                    fontName = fonts[activeFontKey].fontName;
                }
                if (fontStyle === undef) {
                    fontStyle = fonts[activeFontKey].fontStyle;
                }

                try {
                    key = fontmap[fontName][fontStyle]; // returns a string like 'F3' - the KEY corresponding tot he font + type combination.
                } catch (e) {
                    key = undef;
                }
                if (!key) {
                    throw new Error("Unable to look up font label for font '" + fontName + "', '" + fontStyle + "'. Refer to getFontList() for available fonts.");
                }

                return key;
            },
            buildDocument = function () {

                outToPages = false; // switches out() to content
                content = [];
                offsets = [];

                // putHeader()
                out('%PDF-' + pdfVersion);

                putPages();

                putResources();

                // Info
                newObject();
                out('<<');
                putInfo();
                out('>>');
                out('endobj');

                // Catalog
                newObject();
                out('<<');
                putCatalog();
                out('>>');
                out('endobj');

                // Cross-ref
                var o = content_length, i;
                out('xref');
                out('0 ' + (objectNumber + 1));
                out('0000000000 65535 f ');
                for (i = 1; i <= objectNumber; i++) {
                    out(padd10(offsets[i]) + ' 00000 n ');
                }
                // Trailer
                out('trailer');
                out('<<');
                putTrailer();
                out('>>');
                out('startxref');
                out(o);
                out('%%EOF');

                outToPages = true;

                return content.join('\n');
            },
            getStyle = function (style) {
                // see Path-Painting Operators of PDF spec
                var op = 'S'; // stroke
                if (style === 'F') {
                    op = 'f'; // fill
                } else if (style === 'FD' || style === 'DF') {
                    op = 'B'; // both
                }
                return op;
            },

            /**
            Generates the PDF document.
            Possible values:
                datauristring (alias dataurlstring) - Data-Url-formatted data returned as string.
                datauri (alias datauri) - Data-Url-formatted data pushed into current window's location (effectively reloading the window with contents of the PDF).

            If `type` argument is undefined, output is raw body of resulting PDF returned as a string.

            @param {String} type A string identifying one of the possible output types.
            @param {Object} options An object providing some additional signalling to PDF generator.
            @function
            @returns {pdfDataExport}
            @methodOf pdfDataExport#
            @name output
            */
            output = function (type, options) {
                var undef, data, length, array, i, blob;
                switch (type) {
                    case undef:
                        return buildDocument();
                    case 'save':
                        if (navigator.getUserMedia) {
                            if (window.URL === undefined) {
                                return API.output('dataurlnewwindow');
                            } else if (window.URL.createObjectURL === undefined) {
                                return API.output('dataurlnewwindow');
                            }
                        }
                        data = buildDocument();

                        // Need to add the file to BlobBuilder as a Uint8Array
                        length = data.length;
                        array = new Uint8Array(new ArrayBuffer(length));

                        for (i = 0; i < length; i++) {
                            array[i] = data.charCodeAt(i);
                        }

                        blob = new Blob([array], { type: "application/pdf" });

                        saveAs(blob, options);
                        break;
                    case 'datauristring':
                    case 'dataurlstring':
                        return 'data:application/pdf;base64,' + btoa(buildDocument());
                    case 'datauri':
                    case 'dataurl':
                        document.location.href = 'data:application/pdf;base64,' + btoa(buildDocument());
                        break;
                    case 'dataurlnewwindow':
                        window.open('data:application/pdf;base64,' + btoa(buildDocument()));
                        break;
                    default:
                        throw new Error('Output type "' + type + '" is not supported.');
                }
                // @TODO: Add different output options
            };

        if (unit === 'pt') {
            k = 1;
        } else if (unit === 'mm') {
            k = 72 / 25.4;
        } else if (unit === 'cm') {
            k = 72 / 2.54;
        } else if (unit === 'in') {
            k = 72;
        } else {
            throw ('Invalid unit: ' + unit);
        }

        // Dimensions are stored as user units and converted to points on output
        if (pageFormats.hasOwnProperty(format_as_string)) {
            pageHeight = pageFormats[format_as_string][1] / k;
            pageWidth = pageFormats[format_as_string][0] / k;
        } else {
            try {
                pageHeight = format[1];
                pageWidth = format[0];
            } catch (err) {
                throw ('Invalid format: ' + format);
            }
        }

        if (orientation === 'p' || orientation === 'portrait') {
            orientation = 'p';
            if (pageWidth > pageHeight) {
                tmp = pageWidth;
                pageWidth = pageHeight;
                pageHeight = tmp;
            }
        } else if (orientation === 'l' || orientation === 'landscape') {
            orientation = 'l';
            if (pageHeight > pageWidth) {
                tmp = pageWidth;
                pageWidth = pageHeight;
                pageHeight = tmp;
            }
        } else {
            throw ('Invalid orientation: ' + orientation);
        }



        //---------------------------------------
        // Public API

        /*
        Object exposing internal API to plugins
        @public
        */
        API.internal = {
            'pdfEscape': pdfEscape,
            'getStyle': getStyle,
            /**
            Returns {FontObject} describing a particular font.
            @public
            @function
            @param fontName {String} (Optional) Font's family name
            @param fontStyle {String} (Optional) Font's style variation name (Example:"Italic")
            @returns {FontObject}
            */
            'getFont': function () { return fonts[getFont.apply(API, arguments)]; },
            'getFontSize': function () { return activeFontSize; },
            'btoa': btoa,
            'write': function (string1, string2, string3, etc) {
                out(
                    arguments.length === 1 ? string1 : Array.prototype.join.call(arguments, ' ')
                );
            },
            'getCoordinateString': function (value) {
                return f2(value * k);
            },
            'getVerticalCoordinateString': function (value) {
                return f2((pageHeight - value) * k);
            },
            'collections': {},
            'newObject': newObject,
            'putStream': putStream,
            'events': events,
            // ratio that you use in multiplication of a given "size" number to arrive to 'point'
            // units of measurement.
            // scaleFactor is set at initialization of the document and calculated against the stated
            // default measurement units for the document.
            // If default is "mm", k is the number that will turn number in 'mm' into 'points' number.
            // through multiplication.
            'scaleFactor': k,
            'pageSize': { 'width': pageWidth, 'height': pageHeight },
            'output': function (type, options) {
                return output(type, options);
            }
        };

        /**
        Adds (and transfers the focus to) new page to the PDF document.
        @function
        @returns {pdfDataExport}

        @methodOf pdfDataExport#
        @name addPage
         */
        API.addPage = function () {
            _addPage();
            return this;
        };

        var padz =
[
   "",
   "0",
   "00",
   "000",
   "0000"
];
        var pdfEscape16 = function (text, flags) {
            var ar = ["FEFF"];
            for (var i = 0, l = text.length, t; i < l; ++i) {
                t = text.charCodeAt(i).toString(16).toUpperCase();
                ar.push(padz[4 - t.length], t);
            }
            return ar.join("");
        };

        API.text16 = function (text, x, y, flags) {
            /**
            * Inserts something like this into PDF
            BT
            /F1 16 Tf % Font name + size
            16 TL % How many units down for next line in multiline text
            0 g % color
            28.35 813.54 Td % position
            (line one) Tj
            T* (line two) Tj
            T* (line three) Tj
            ET
            */

            var undef, _first, _second, _third, newtext, str, i;
            // Pre-August-2012 the order of arguments was function(x, y, text, flags)
            // in effort to make all calls have similar signature like
            // function(data, coordinates... , miscellaneous)
            // this method had its args flipped.
            // code below allows backward compatibility with old arg order.
            if (typeof text === 'number') {
                _first = y;
                _second = text;
                _third = x;

                text = _first;
                x = _second;
                y = _third;
            }

            // If there are any newlines in text, we assume
            // the user wanted to print multiple lines, so break the
            // text up into an array. If the text is already an array,
            // we assume the user knows what they are doing.
            if (typeof text === 'string' && text.match(/[\n\r]/)) {
                text = text.split(/\r\n|\r|\n/g);
            }

            if (typeof flags === 'undefined') {
                flags = { 'noBOM': true, 'autoencode': true };
            } else {

                if (flags.noBOM === undef) {
                    flags.noBOM = true;
                }

                if (flags.autoencode === undef) {
                    flags.autoencode = true;
                }

            }
            flags.autoencode = false;
            if (typeof text === 'string') {
                str = pdfEscape16(text, flags);
            } else if (text instanceof Array) { /* Array */
                // we don't want to destroy original text array, so cloning it
                newtext = text.concat();
                // we do array.join('text that must not be PDFescaped")
                // thus, pdfEscape each component separately
                for (i = newtext.length - 1; i !== -1; i--) {
                    newtext[i] = pdfEscape16(newtext[i], flags);
                }
                str = newtext.join("> Tj\nT* <");
            } else {
                throw new Error('Type of text must be string or Array. "' + text + '" is not recognized.');
            }
            // Using "'" ("go next line and render text" mark) would save space but would complicate our rendering code, templates

            // BT .. ET does NOT have default settings for Tf. You must state that explicitely every time for BT .. ET
            // if you want text transformation matrix (+ multiline) to work reliably (which reads sizes of things from font declarations)
            // Thus, there is NO useful, *reliable* concept of "default" font for a page.
            // The fact that "default" (reuse font used before) font worked before in basic cases is an accident
            // - readers dealing smartly with brokenness of jsPDF's markup.
            out(
                'BT\n/' +
                    activeFontKey + ' ' + activeFontSize + ' Tf\n' + // font face, style, size
                      activeFontSize + ' TL\n' + // line spacing
                     textColor +
                    '\n' + f2(x * k) + ' ' + f2((pageHeight - y) * k) + ' Td\n<' +
                    str +
                    '> Tj\nET'
            );

            return this;
        };
        /**
        Adds text to page. Supports adding multiline text when 'text' argument is an Array of Strings.
        @function
        @param {String|Array} text String or array of strings to be added to the page. Each line is shifted one line down per font, spacing settings declared before this call.
        @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
        @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
        @param {Object} flags Collection of settings signalling how the text must be encoded. Defaults are sane. If you think you want to pass some flags, you likely can read the source.
        @returns {pdfDataExport}
        @methodOf pdfDataExport#
        @name text
         */
        API.text = function (text, x, y, flags) {
            /**
             * Inserts something like this into PDF
                BT
                /F1 16 Tf  % Font name + size
                16 TL % How many units down for next line in multiline text
                0 g % color
                28.35 813.54 Td % position
                (line one) Tj
                T* (line two) Tj
                T* (line three) Tj
                ET
            */

            var undef, _first, _second, _third, newtext, str, i;
            if (typeof text === 'number') {
                _first = y;
                _second = text;
                _third = x;

                text = _first;
                x = _second;
                y = _third;
            }

            if (typeof text === 'string' && text.match(/[\n\r]/)) {
                text = text.split(/\r\n|\r|\n/g);
            }

            if (typeof flags === 'undefined') {
                flags = { 'noBOM': true, 'autoencode': true };
            } else {

                if (flags.noBOM === undef) {
                    flags.noBOM = true;
                }

                if (flags.autoencode === undef) {
                    flags.autoencode = true;
                }

            }

            if (typeof text === 'string') {
                str = pdfEscape(text, flags);
            } else if (text instanceof Array) {  /* Array */
                // we don't want to destroy  original text array, so cloning it
                newtext = text.concat();
                // we do array.join('text that must not be PDFescaped")
                // thus, pdfEscape each component separately
                for (i = newtext.length - 1; i !== -1; i--) {
                    newtext[i] = pdfEscape(newtext[i], flags);
                }
                str = newtext.join(") Tj\nT* (");
            } else {
                throw new Error('Type of text must be string or Array. "' + text + '" is not recognized.');
            }
            out(
             'BT\n/' +
                 activeFontKey + ' ' + activeFontSize + ' Tf\n' + // font face, style, size
                 activeFontSize + ' TL\n' + // line spacing
                 textColor +
                 '\n' + f2(x * k) + ' ' + f2((pageHeight - y) * k) + ' Td\n(' +
                 str +
                 ') Tj\nET'
         );
            return this;
        };

        API.line = function (x1, y1, x2, y2) {
            out(
                f2(x1 * k) + ' ' + f2((pageHeight - y1) * k) + ' m ' +
                    f2(x2 * k) + ' ' + f2((pageHeight - y2) * k) + ' l S'
            );
            return this;
        };

        /**
        Adds series of curves (straight lines or cubic bezier curves) to canvas, starting at `x`, `y` coordinates.
        All data points in `lines` are relative to last line origin.
        `x`, `y` become x1,y1 for first line / curve in the set.
        For lines you only need to specify [x2, y2] - (ending point) vector against x1, y1 starting point.
        For bezier curves you need to specify [x2,y2,x3,y3,x4,y4] - vectors to control points 1, 2, ending point. All vectors are against the start of the curve - x1,y1.

        @example .lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 212,110, 10) // line, line, bezier curve, line
        @param {Array} lines Array of *vector* shifts as pairs (lines) or sextets (cubic bezier curves).
        @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
        @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
        @param {Number} scale (Defaults to [1.0,1.0]) x,y Scaling factor for all vectors. Elements can be any floating number Sub-one makes drawing smaller. Over-one grows the drawing. Negative flips the direction.
        @function
        @returns {pdfDataExport}
        @methodOf pdfDataExport#
        @name lines
         */
        API.lines = function (lines, x, y, scale, style) {
            var undef, _first, _second, _third, scalex, scaley, i, l, leg, x2, y2, x3, y3, x4, y4;

            // Pre-August-2012 the order of arguments was function(x, y, lines, scale, style)
            // in effort to make all calls have similar signature like
            //   function(content, coordinateX, coordinateY , miscellaneous)
            // this method had its args flipped.
            // code below allows backward compatibility with old arg order.
            if (typeof lines === 'number') {
                _first = y;
                _second = lines;
                _third = x;

                lines = _first;
                x = _second;
                y = _third;
            }

            style = getStyle(style);
            scale = scale === undef ? [1, 1] : scale;

            // starting point
            out(f3(x * k) + ' ' + f3((pageHeight - y) * k) + ' m ');

            scalex = scale[0];
            scaley = scale[1];
            l = lines.length;
            //, x2, y2 // bezier only. In page default measurement "units", *after* scaling
            //, x3, y3 // bezier only. In page default measurement "units", *after* scaling
            // ending point for all, lines and bezier. . In page default measurement "units", *after* scaling
            x4 = x; // last / ending point = starting point for first item.
            y4 = y; // last / ending point = starting point for first item.

            for (i = 0; i < l; i++) {
                leg = lines[i];
                if (leg.length === 2) {
                    // simple line
                    x4 = leg[0] * scalex + x4; // here last x4 was prior ending point
                    y4 = leg[1] * scaley + y4; // here last y4 was prior ending point
                    out(f3(x4 * k) + ' ' + f3((pageHeight - y4) * k) + ' l');
                } else {
                    // bezier curve
                    x2 = leg[0] * scalex + x4; // here last x4 is prior ending point
                    y2 = leg[1] * scaley + y4; // here last y4 is prior ending point
                    x3 = leg[2] * scalex + x4; // here last x4 is prior ending point
                    y3 = leg[3] * scaley + y4; // here last y4 is prior ending point
                    x4 = leg[4] * scalex + x4; // here last x4 was prior ending point
                    y4 = leg[5] * scaley + y4; // here last y4 was prior ending point
                    out(
                        f3(x2 * k) + ' ' +
                            f3((pageHeight - y2) * k) + ' ' +
                            f3(x3 * k) + ' ' +
                            f3((pageHeight - y3) * k) + ' ' +
                            f3(x4 * k) + ' ' +
                            f3((pageHeight - y4) * k) + ' c'
                    );
                }
            }
            // stroking / filling / both the path
            out(style);
            return this;
        };

        /**
        Adds a rectangle to PDF

        @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
        @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
        @param {Number} w Width (in units declared at inception of PDF document)
        @param {Number} h Height (in units declared at inception of PDF document)
        @param {String} style (Defaults to active fill/stroke style) A string signalling if stroke, fill or both are to be applied.
        @function
        @returns {pdfDataExport}
        @methodOf pdfDataExport#
        @name rect
         */
        API.rect = function (x, y, w, h, style) {
            var op = getStyle(style);
            out([
                f2(x * k),
                f2((pageHeight - y) * k),
                f2(w * k),
                f2(-h * k),
                're',
                op
            ].join(' '));
            return this;
        };

        /**
        Adds a triangle to PDF

        @param {Number} x1 Coordinate (in units declared at inception of PDF document) against left edge of the page
        @param {Number} y1 Coordinate (in units declared at inception of PDF document) against upper edge of the page
        @param {Number} x2 Coordinate (in units declared at inception of PDF document) against left edge of the page
        @param {Number} y2 Coordinate (in units declared at inception of PDF document) against upper edge of the page
        @param {Number} x3 Coordinate (in units declared at inception of PDF document) against left edge of the page
        @param {Number} y3 Coordinate (in units declared at inception of PDF document) against upper edge of the page
        @param {String} style (Defaults to active fill/stroke style) A string signalling if stroke, fill or both are to be applied.
        @function
        @returns {pdfDataExport}
        @methodOf pdfDataExport#
        @name triangle
         */
        API.triangle = function (x1, y1, x2, y2, x3, y3, style) {
            this.lines(
                [
                    [x2 - x1, y2 - y1], // vector to point 2
                    [x3 - x2, y3 - y2], // vector to point 3
                    [x1 - x3, y1 - y3] // closing vector back to point 1
                ],
                x1,
                y1, // start of path
                [1, 1],
                style
            );
            return this;
        };

        /**
        Adds a rectangle with rounded corners to PDF

        @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
        @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
        @param {Number} w Width (in units declared at inception of PDF document)
        @param {Number} h Height (in units declared at inception of PDF document)
        @param {Number} rx Radius along x axis (in units declared at inception of PDF document)
        @param {Number} rx Radius along y axis (in units declared at inception of PDF document)
        @param {String} style (Defaults to active fill/stroke style) A string signalling if stroke, fill or both are to be applied.
        @function
        @returns {pdfDataExport}
        @methodOf pdfDataExport#
        @name roundedRect
        */
        API.roundedRect = function (x, y, w, h, rx, ry, style) {
            var MyArc = 4 / 3 * (Math.SQRT2 - 1);
            this.lines(
                [
                    [(w - 2 * rx), 0],
                    [(rx * MyArc), 0, rx, ry - (ry * MyArc), rx, ry],
                    [0, (h - 2 * ry)],
                    [0, (ry * MyArc), -(rx * MyArc), ry, -rx, ry],
                    [(-w + 2 * rx), 0],
                    [-(rx * MyArc), 0, -rx, -(ry * MyArc), -rx, -ry],
                    [0, (-h + 2 * ry)],
                    [0, -(ry * MyArc), (rx * MyArc), -ry, rx, -ry]
                ],
                x + rx,
                y, // start of path
                [1, 1],
                style
            );
            return this;
        };

        /**
        Adds an ellipse to PDF

        @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
        @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
        @param {Number} rx Radius along x axis (in units declared at inception of PDF document)
        @param {Number} rx Radius along y axis (in units declared at inception of PDF document)
        @param {String} style (Defaults to active fill/stroke style) A string signalling if stroke, fill or both are to be applied.
        @function
        @returns {pdfDataExport}
        @methodOf pdfDataExport#
        @name ellipse
         */
        API.ellipse = function (x, y, rx, ry, style) {
            var op = getStyle(style),
                lx = 4 / 3 * (Math.SQRT2 - 1) * rx,
                ly = 4 / 3 * (Math.SQRT2 - 1) * ry;

            out([
                f2((x + rx) * k),
                f2((pageHeight - y) * k),
                'm',
                f2((x + rx) * k),
                f2((pageHeight - (y - ly)) * k),
                f2((x + lx) * k),
                f2((pageHeight - (y - ry)) * k),
                f2(x * k),
                f2((pageHeight - (y - ry)) * k),
                'c'
            ].join(' '));
            out([
                f2((x - lx) * k),
                f2((pageHeight - (y - ry)) * k),
                f2((x - rx) * k),
                f2((pageHeight - (y - ly)) * k),
                f2((x - rx) * k),
                f2((pageHeight - y) * k),
                'c'
            ].join(' '));
            out([
                f2((x - rx) * k),
                f2((pageHeight - (y + ly)) * k),
                f2((x - lx) * k),
                f2((pageHeight - (y + ry)) * k),
                f2(x * k),
                f2((pageHeight - (y + ry)) * k),
                'c'
            ].join(' '));
            out([
                f2((x + lx) * k),
                f2((pageHeight - (y + ry)) * k),
                f2((x + rx) * k),
                f2((pageHeight - (y + ly)) * k),
                f2((x + rx) * k),
                f2((pageHeight - y) * k),
                'c',
                op
            ].join(' '));
            return this;
        };

        /**
        Adds an circle to PDF

        @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
        @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
        @param {Number} r Radius (in units declared at inception of PDF document)
        @param {String} style (Defaults to active fill/stroke style) A string signalling if stroke, fill or both are to be applied.
        @function
        @returns {pdfDataExport}
        @methodOf pdfDataExport#
        @name circle
         */
        API.circle = function (x, y, r, style) {
            return this.ellipse(x, y, r, r, style);
        };

        /**
        Adds a properties to the PDF document

        @param {Object} A property_name-to-property_value object structure.
        @function
        @returns {pdfDataExport}
        @methodOf pdfDataExport#
        @name setProperties
         */
        API.setProperties = function (properties) {
            // copying only those properties we can render.
            var property;
            for (property in documentProperties) {
                if (documentProperties.hasOwnProperty(property) && properties[property]) {
                    documentProperties[property] = properties[property];
                }
            }
            return this;
        };

        /**
        Sets font size for upcoming text elements.

        @param {Number} size Font size in points.
        @function
        @returns {pdfDataExport}
        @methodOf pdfDataExport#
        @name setFontSize
         */
        API.setFontSize = function (size) {
            activeFontSize = size;
            return this;
        };

        /**
        Sets text font face, variant for upcoming text elements.
        See output of pdfDataExport.getFontList() for possible font names, styles.

        @param {String} fontName Font name or family. Example: "times"
        @param {String} fontStyle Font style or variant. Example: "italic"
        @function
        @returns {pdfDataExport}
        @methodOf pdfDataExport#
        @name setFont
         */
        API.setFont = function (fontName, fontStyle) {
            activeFontKey = getFont(fontName, fontStyle);
            // if font is not found, the above line blows up and we never go further
            return this;
        };

        /**
        Switches font style or variant for upcoming text elements,
        while keeping the font face or family same.
        See output of pdfDataExport.getFontList() for possible font names, styles.

        @param {String} style Font style or variant. Example: "italic"
        @function
        @returns {pdfDataExport}
        @methodOf pdfDataExport#
        @name setFontStyle
         */
        API.setFontStyle = API.setFontType = function (style) {
            var undef;
            activeFontKey = getFont(undef, style);
            // if font is not found, the above line blows up and we never go further
            return this;
        };

        /**
        Returns an object - a tree of fontName to fontStyle relationships available to
        active PDF document.

        @public
        @function
        @returns {Object} Like {'times':['normal', 'italic', ... ], 'arial':['normal', 'bold', ... ], ... }
        @methodOf pdfDataExport#
        @name getFontList
        */
        API.getFontList = function () {
            // TODO: iterate over fonts array or return copy of fontmap instead in case more are ever added.
            var list = {},
                fontName,
                fontStyle,
                tmp;

            for (fontName in fontmap) {
                if (fontmap.hasOwnProperty(fontName)) {
                    list[fontName] = tmp = [];
                    for (fontStyle in fontmap[fontName]) {
                        if (fontmap[fontName].hasOwnProperty(fontStyle)) {
                            tmp.push(fontStyle);
                        }
                    }
                }
            }

            return list;
        };

        /**
        Sets line width for upcoming lines.

        @param {Number} width Line width (in units declared at inception of PDF document)
        @function
        @returns {pdfDataExport}
        @methodOf pdfDataExport#
        @name setLineWidth
         */
        API.setLineWidth = function (width) {
            out((width * k).toFixed(2) + ' w');
            return this;
        };

        /**
        Sets the stroke color for upcoming elements.

        Depending on the number of arguments given, Gray, RGB, or CMYK
        color space is implied.

        When only ch1 is given, "Gray" color space is implied and it
        must be a value in the range from 0.00 (solid black) to to 1.00 (white)
        if values are communicated as String types, or in range from 0 (black)
        to 255 (white) if communicated as Number type.
        The RGB-like 0-255 range is provided for backward compatibility.

        When only ch1,ch2,ch3 are given, "RGB" color space is implied and each
        value must be in the range from 0.00 (minimum intensity) to to 1.00
        (max intensity) if values are communicated as String types, or
        from 0 (min intensity) to to 255 (max intensity) if values are communicated
        as Number types.
        The RGB-like 0-255 range is provided for backward compatibility.

        When ch1,ch2,ch3,ch4 are given, "CMYK" color space is implied and each
        value must be a in the range from 0.00 (0% concentration) to to
        1.00 (100% concentration)

        Because JavaScript treats fixed point numbers badly (rounds to
        floating point nearest to binary representation) it is highly advised to
        communicate the fractional numbers as String types, not JavaScript Number type.

        @param {Number|String} ch1 Color channel value
        @param {Number|String} ch2 Color channel value
        @param {Number|String} ch3 Color channel value
        @param {Number|String} ch4 Color channel value

        @function
        @returns {pdfDataExport}
        @methodOf pdfDataExport#
        @name setDrawColor
         */
        API.setDrawColor = function (ch1, ch2, ch3, ch4) {
            var color;
            if (ch2 === undefined || (ch4 === undefined && ch1 === ch2 === ch3)) {
                // Gray color space.
                if (typeof ch1 === 'string') {
                    color = ch1 + ' G';
                } else {
                    color = f2(ch1 / 255) + ' G';
                }
            } else if (ch4 === undefined) {
                // RGB
                if (typeof ch1 === 'string') {
                    color = [ch1, ch2, ch3, 'RG'].join(' ');
                } else {
                    color = [f2(ch1 / 255), f2(ch2 / 255), f2(ch3 / 255), 'RG'].join(' ');
                }
            } else {
                // CMYK
                if (typeof ch1 === 'string') {
                    color = [ch1, ch2, ch3, ch4, 'K'].join(' ');
                } else {
                    color = [f2(ch1), f2(ch2), f2(ch3), f2(ch4), 'K'].join(' ');
                }
            }

            out(color);
            return this;
        };

        /**
        Sets the fill color for upcoming elements.

        Depending on the number of arguments given, Gray, RGB, or CMYK
        color space is implied.

        When only ch1 is given, "Gray" color space is implied and it
        must be a value in the range from 0.00 (solid black) to to 1.00 (white)
        if values are communicated as String types, or in range from 0 (black)
        to 255 (white) if communicated as Number type.
        The RGB-like 0-255 range is provided for backward compatibility.

        When only ch1,ch2,ch3 are given, "RGB" color space is implied and each
        value must be in the range from 0.00 (minimum intensity) to to 1.00
        (max intensity) if values are communicated as String types, or
        from 0 (min intensity) to to 255 (max intensity) if values are communicated
        as Number types.
        The RGB-like 0-255 range is provided for backward compatibility.

        When ch1,ch2,ch3,ch4 are given, "CMYK" color space is implied and each
        value must be a in the range from 0.00 (0% concentration) to to
        1.00 (100% concentration)

        Because JavaScript treats fixed point numbers badly (rounds to
        floating point nearest to binary representation) it is highly advised to
        communicate the fractional numbers as String types, not JavaScript Number type.

        @param {Number|String} ch1 Color channel value
        @param {Number|String} ch2 Color channel value
        @param {Number|String} ch3 Color channel value
        @param {Number|String} ch4 Color channel value

        @function
        @returns {pdfDataExport}
        @methodOf pdfDataExport#
        @name setFillColor
         */
        API.setFillColor = function (ch1, ch2, ch3, ch4) {
            var color;

            if (ch2 === undefined || (ch4 === undefined && ch1 === ch2 === ch3)) {
                // Gray color space.
                if (typeof ch1 === 'string') {
                    color = ch1 + ' g';
                } else {
                    color = f2(ch1 / 255) + ' g';
                }
            } else if (ch4 === undefined) {
                // RGB
                if (typeof ch1 === 'string') {
                    color = [ch1, ch2, ch3, 'rg'].join(' ');
                } else {
                    color = [f2(ch1 / 255), f2(ch2 / 255), f2(ch3 / 255), 'rg'].join(' ');
                }
            } else {
                // CMYK
                if (typeof ch1 === 'string') {
                    color = [ch1, ch2, ch3, ch4, 'k'].join(' ');
                } else {
                    color = [f2(ch1), f2(ch2), f2(ch3), f2(ch4), 'k'].join(' ');
                }
            }

            out(color);
            return this;
        };

        /**
        Sets the text color for upcoming elements.
        If only one, first argument is given,
        treats the value as gray-scale color value.

        @param {Number} r Red channel color value in range 0-255
        @param {Number} g Green channel color value in range 0-255
        @param {Number} b Blue channel color value in range 0-255
        @function
        @returns {pdfDataExport}
        @methodOf pdfDataExport#
        @name setTextColor
        */
        API.setTextColor = function (r, g, b) {
            if ((r === 0 && g === 0 && b === 0) || (typeof g === 'undefined')) {
                textColor = f3(r / 255) + ' g';
            } else {
                textColor = [f3(r / 255), f3(g / 255), f3(b / 255), 'rg'].join(' ');
            }
            return this;
        };

        /**
        Is an Object providing a mapping from human-readable to
        integer flag values designating the varieties of line cap
        and join styles.

        @returns {Object}
        @fieldOf pdfDataExport#
        @name CapJoinStyles
        */
        API.CapJoinStyles = {
            0: 0,
            'butt': 0,
            'but': 0,
            'bevel': 0,
            1: 1,
            'round': 1,
            'rounded': 1,
            'circle': 1,
            2: 2,
            'projecting': 2,
            'project': 2,
            'square': 2,
            'milter': 2
        };

        /**
        Sets the line cap styles
        See {pdfDataExport.CapJoinStyles} for variants

        @param {String|Number} style A string or number identifying the type of line cap
        @function
        @returns {pdfDataExport}
        @methodOf pdfDataExport#
        @name setLineCap
        */
        API.setLineCap = function (style) {
            var id = this.CapJoinStyles[style];
            if (id === undefined) {
                throw new Error("Line cap style of '" + style + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
            }
            lineCapID = id;
            out(id.toString(10) + ' J');

            return this;
        };

        /**
        Sets the line join styles
        See {pdfDataExport.CapJoinStyles} for variants

        @param {String|Number} style A string or number identifying the type of line join
        @function
        @returns {pdfDataExport}
        @methodOf pdfDataExport#
        @name setLineJoin
        */
        API.setLineJoin = function (style) {
            var id = this.CapJoinStyles[style];
            if (id === undefined) {
                throw new Error("Line join style of '" + style + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
            }
            lineJoinID = id;
            out(id.toString(10) + ' j');

            return this;
        };

        // Output is both an internal (for plugins) and external function
        API.output = output;

        /**
         * Saves as PDF document. An alias of pdfDataExport.output('save', 'filename.pdf')
         * @param  {String} filename The filename including extension.
         *
         * @function
         * @returns {pdfDataExport}
         * @methodOf pdfDataExport#
         * @name save
         */
        API.save = function (filename) {
            API.output('save', filename);
        };

        // applying plugins (more methods) ON TOP of built-in API.
        // this is intentional as we allow plugins to override
        // built-ins
        for (plugin in pdfDataExport.API) {
            if (pdfDataExport.API.hasOwnProperty(plugin)) {
                if (plugin === 'events' && pdfDataExport.API.events.length) {
                    (function (events, newEvents) {

                        // pdfDataExport.API.events is a JS Array of Arrays
                        // where each Array is a pair of event name, handler
                        // Events were added by plugins to the pdfDataExport instantiator.
                        // These are always added to the new instance and some ran
                        // during instantiation.

                        var eventname, handler_and_args, i;

                        for (i = newEvents.length - 1; i !== -1; i--) {
                            // subscribe takes 3 args: 'topic', function, runonce_flag
                            // if undefined, runonce is false.
                            // users can attach callback directly,
                            // or they can attach an array with [callback, runonce_flag]
                            // that's what the "apply" magic is for below.
                            eventname = newEvents[i][0];
                            handler_and_args = newEvents[i][1];
                            events.subscribe.apply(
                                events,
                                [eventname].concat(
                                    typeof handler_and_args === 'function' ?
                                            [handler_and_args] :
                                            handler_and_args
                                )
                            );
                        }
                    }(events, pdfDataExport.API.events));
                } else {
                    API[plugin] = pdfDataExport.API[plugin];
                }
            }
        }

        /////////////////////////////////////////
        // continuing initilisation of pdfDataExport Document object
        /////////////////////////////////////////


        // Add the first page automatically
        addFonts();
        activeFontKey = 'F1';
        _addPage();

        events.publish('initialized');

        return API;
    }

    /**
    pdfDataExport.API is a STATIC property of pdfDataExport class.
    pdfDataExport.API is an object you can add methods and properties to.
    The methods / properties you add will show up in new pdfDataExport objects.
    
    One property is prepopulated. It is the 'events' Object. Plugin authors can add topics, callbacks to this object. These will be reassigned to all new instances of pdfDataExport.
    Examples:
        pdfDataExport.API.events['initialized'] = function(){ 'this' is API object }
        pdfDataExport.API.events['addFont'] = function(added_font_object){ 'this' is API object }
    
    @static
    @public
    @memberOf pdfDataExport
    @name API
    
    @example
        pdfDataExport.API.mymethod = function(){
            // 'this' will be ref to internal API object. see pdfDataExport source
            // , so you can refer to built-in methods like so:
            //     this.line(....)
            //     this.text(....)
        }
        var pdfdoc = new pdfDataExport()
        pdfdoc.mymethod() // <- !!!!!!
    */
    pdfDataExport.API = { 'events': [] };

    return pdfDataExport;
}());

(function (pdfDataExportAPI) {
    'use strict';
    /*jslint browser:true */
    /*global document: false, pdfDataExport */

    var maxLn = 0,
        lnP = 0,
        fontName,
        fontSize,
        fontStyle,
        lastCellPos = { x: undefined, y: undefined, w: undefined, h: undefined, ln: undefined },
        pages = 1,
        newPage = false,
        setLastCellPosition = function (x, y, w, h, ln) {
            lastCellPos = { x: x, y: y, w: w, h: h, ln: ln };
        },
        getLastCellPosition = function () {
            return lastCellPos;
        },
        setMaxLn = function (x) {
            maxLn = x;
        },
        getMaxLn = function () {
            return maxLn;
        },
        setLnP = function (x) {
            lnP = x;
        },
        getLnP = function (x) {
            return lnP;
        };

    pdfDataExportAPI.getTextDimensions = function (txt) {
        fontName = this.internal.getFont().fontName;
        fontSize = this.internal.getFontSize();
        fontStyle = this.internal.getFont().fontStyle;

        // 1 pixel = 0.264583 mm and 1 mm = 72/25.4 point
        var px2pt = 0.264583 * 72 / 25.4,
            dimensions,
            text;

        text = document.createElement('font');
        text.id = "pdfDataExportCell";
        text.style.fontStyle = fontStyle;
        text.style.fontName = fontName;
        text.style.fontSize = fontSize + 'pt';
        text.innerHTML = txt;

        document.body.appendChild(text);

        dimensions = { w: (text.offsetWidth + 1) * px2pt, h: (text.offsetHeight + 1) * px2pt };

        document.body.removeChild(text);

        return dimensions;
    };

    pdfDataExportAPI.cellAddPage = function () {
        this.addPage();
        setLastCellPosition(undefined, undefined, undefined, undefined, undefined);
        newPage = true;
        pages += 1;
        setLnP(1);
    };

    pdfDataExportAPI.cellInitialize = function () {
        maxLn = 0;
        lastCellPos = { x: undefined, y: undefined, w: undefined, h: undefined, ln: undefined };
        pages = 1;
        newPage = false;
        setLnP(0);
    };

    pdfDataExportAPI.cell = function (x, y, w, h, txt, ln) {
        this.lnMod = this.lnMod === undefined ? 0 : this.lnMod;
        if (this.printingHeaderRow !== true && this.lnMod !== 0) {
            ln = ln + this.lnMod;
        }

        if ((((ln * h) + y + (h * 2)) / pages) >= this.internal.pageSize.height && pages === 1 && !newPage) {
            this.cellAddPage();

            if (this.printHeaders && this.tableHeaderRow) {
                this.printHeaderRow(ln);
                this.lnMod += 1;
                ln += 1;
            }
            if (getMaxLn() === 0) {
                setMaxLn(Math.round((this.internal.pageSize.height - (h * 2)) / h));
            }
        } else if (newPage && getLastCellPosition().ln !== ln && getLnP() === getMaxLn()) {
            this.cellAddPage();

            if (this.printHeaders && this.tableHeaderRow) {
                this.printHeaderRow(ln);
                this.lnMod += 1;
                ln += 1;
            }
        }

        var curCell = getLastCellPosition(),
            dim = this.getTextDimensions(txt),
            isNewLn = 1;
        if (curCell.x !== undefined && curCell.ln === ln) {
            x = curCell.x + curCell.w;
        }
        if (curCell.y !== undefined && curCell.y === y) {
            y = curCell.y;
        }
        if (curCell.h !== undefined && curCell.h === h) {
            h = curCell.h;
        }
        if (curCell.ln !== undefined && curCell.ln === ln) {
            ln = curCell.ln;
            isNewLn = 0;
        }
        if (newPage) {
            y = h * (getLnP() + isNewLn);
        } else {
            y = (y + (h * Math.abs(getMaxLn() * pages - ln - getMaxLn())));
        }
        this.rect(x, y, w, h);
        var match = /[а-яА-ЯЁё]/.test(txt);
        if (match) {
            this.text16(txt, x + 3, y + h - 3);
        }
        else {
            this.text(txt, x + 3, y + h - 3);
        }
        setLnP(getLnP() + isNewLn);
        setLastCellPosition(x, y, w, h, ln);
        return this;
    };

    /**
     * Return an array containing all of the owned keys of an Object
     * @type {Function}
     * @return {String[]} of Object keys
     */
    pdfDataExportAPI.getKeys = (typeof Object.keys === 'function')
        ? function (object) {
            if (!object) {
                return [];
            }
            return Object.keys(object);
        }
            : function (object) {
                var keys = [],
                    property;

                for (property in object) {
                    if (object.hasOwnProperty(property)) {
                        keys.push(property);
                    }
                }

                return keys;
            };

    /**
     * Return the maximum value from an array
     * @param array
     * @param comparisonFn
     * @returns {*}
     */
    pdfDataExportAPI.arrayMax = function (array, comparisonFn) {
        var max = array[0],
            i,
            ln,
            item;

        for (i = 0, ln = array.length; i < ln; i += 1) {
            item = array[i];

            if (comparisonFn) {
                if (comparisonFn(max, item) === -1) {
                    max = item;
                }
            } else {
                if (item > max) {
                    max = item;
                }
            }
        }

        return max;
    };

    /**
     * Create a table from a set of data.
     * @param {Object[]} data As array of objects containing key-value pairs
     * @param {String[]} [headers] Omit or null to auto-generate headers at a performance cost
     * @param {Object} [config.printHeaders] True to print column headers at the top of every page
     * @param {Object} [config.autoSize] True to dynamically set the column widths to match the widest cell value
     * @param {Object} [config.autoStretch] True to force the table to fit the width of the page
     */
    pdfDataExportAPI.table = function (data, headers, config) {

        var headerNames = [],
            headerPrompts = [],
            header,
            autoSize,
            printHeaders,
            autoStretch,
            i,
            ln,
            columnMatrix = {},
            columnWidths = {},
            columnData,
            column,
            columnMinWidths = [],
            j,
            tableHeaderConfigs = [],
            model,
            jln,
            func;

        /**
         * @property {Number} lnMod
         * Keep track of the current line number modifier used when creating cells
         */
        this.lnMod = 0;

        if (config) {
            autoSize = config.autoSize || false;
            printHeaders = this.printHeaders = config.printHeaders || true;
            autoStretch = config.autoStretch || true;
        }

        if (!data) {
            throw 'No data for PDF table';
        }

        // Set headers
        if (headers === undefined || (headers === null)) {

            // No headers defined so we derive from data
            headerNames = this.getKeys(data[0]);

        } else if (headers[0] && (typeof headers[0] !== 'string')) {

            // Split header configs into names and prompts
            for (i = 0, ln = headers.length; i < ln; i += 1) {
                header = headers[i];
                headerNames.push(header.name);
                headerPrompts.push(header.prompt);
            }

        } else {
            headerNames = headers;
        }

        if (config.autoSize) {

            // Create Columns Matrix

            func = function (rec) {
                return rec[header];
            };

            for (i = 0, ln = headerNames.length; i < ln; i += 1) {
                header = headerNames[i];

                columnMatrix[header] = data.map(
                    func
                );

                // get header width
                columnMinWidths.push(this.getTextDimensions(headerPrompts[i] || header).w);

                column = columnMatrix[header];

                // get cell widths
                for (j = 0, ln = column.length; j < ln; j += 1) {
                    columnData = column[j];

                    columnMinWidths.push(this.getTextDimensions(columnData).w);
                }

                // get final column width
                columnWidths[header] = pdfDataExportAPI.arrayMax(columnMinWidths);
            }
        }

        // -- Construct the table

        if (config.printHeaders) {

            // Construct the header row
            for (i = 0, ln = headerNames.length; i < ln; i += 1) {
                header = headerNames[i];
                tableHeaderConfigs.push([10, 10, columnWidths[header], 25, String(headerPrompts.length ? headerPrompts[i] : header)]);
            }

            // Store the table header config
            this.setTableHeaderRow(tableHeaderConfigs);

            // Print the header for the start of the table
            this.printHeaderRow(1);
        }

        // Construct the data rows
        for (i = 0, ln = data.length; i < ln; i += 1) {
            model = data[i];

            for (j = 0, jln = headerNames.length; j < jln; j += 1) {
                header = headerNames[j];
                this.cell(10, 10, columnWidths[header], 25, String(model[header]), i + 2);
            }
        }

        return this;
    };

    /**
     * Store the config for outputting a table header
     * @param {Object[]} config
     * An array of cell configs that would define a header row: Each config matches the config used by pdfDataExportAPI.cell
     * except the ln parameter is excluded
     */
    pdfDataExportAPI.setTableHeaderRow = function (config) {
        this.tableHeaderRow = config;
    };

    /**
     * Output the store header row
     * @param lineNumber The line number to output the header at
     */
    pdfDataExportAPI.printHeaderRow = function (lineNumber) {
        if (!this.tableHeaderRow) {
            throw 'Property tableHeaderRow does not exist.';
        }

        var tableHeaderCell,
            tmpArray,
            i,
            ln;

        this.printingHeaderRow = true;

        for (i = 0, ln = this.tableHeaderRow.length; i < ln; i += 1) {

            tableHeaderCell = this.tableHeaderRow[i];
            tmpArray = [].concat(tableHeaderCell);

            this.cell.apply(this, tmpArray.concat(lineNumber));
        }

        this.printingHeaderRow = false;
    };

}(pdfDataExport.API));


; (function (API) {
    'use strict'

    /**
    Returns an array of length matching length of the 'word' string, with each
    cell ocupied by the width of the char in that position.
    
    @function
    @param word {String}
    @param widths {Object}
    @param kerning {Object}
    @returns {Array}
    */
    var getCharWidthsArray = API.getCharWidthsArray = function (text, options) {

        if (!options) {
            options = {}
        }

        var widths = options.widths ? options.widths : this.internal.getFont().metadata.Unicode.widths
        , widthsFractionOf = widths.fof ? widths.fof : 1
        , kerning = options.kerning ? options.kerning : this.internal.getFont().metadata.Unicode.kerning
        , kerningFractionOf = kerning.fof ? kerning.fof : 1

        // console.log("widths, kergnings", widths, kerning)

        var i, l
        , char_code
        , char_width
        , prior_char_code = 0 // for kerning
        , default_char_width = widths[0] || widthsFractionOf
        , output = []

        for (i = 0, l = text.length; i < l; i++) {
            char_code = text.charCodeAt(i)
            output.push(
                (widths[char_code] || default_char_width) / widthsFractionOf +
                (kerning[char_code] && kerning[char_code][prior_char_code] || 0) / kerningFractionOf
            )
            prior_char_code = char_code
        }

        return output
    }
    var getArraySum = function (array) {
        var i = array.length
        , output = 0
        while (i) {
            ; i--;
            output += array[i]
        }
        return output
    }
    /**
    Returns a widths of string in a given font, if the font size is set as 1 point.
    
    In other words, this is "proportional" value. For 1 unit of font size, the length
    of the string will be that much.
    
    Multiply by font size to get actual width in *points*
    Then divide by 72 to get inches or divide by (72/25.6) to get 'mm' etc.
    
    @public
    @function
    @param
    @returns {Type}
    */
    var getStringUnitWidth = API.getStringUnitWidth = function (text, options) {
        return getArraySum(getCharWidthsArray.call(this, text, options))
    }

    /** 
    returns array of lines
    */
    var splitLongWord = function (word, widths_array, firstLineMaxLen, maxLen) {
        var answer = []

        // 1st, chop off the piece that can fit on the hanging line.
        var i = 0
        , l = word.length
        , workingLen = 0
        while (i !== l && workingLen + widths_array[i] < firstLineMaxLen) {
            workingLen += widths_array[i]
            ; i++;
        }
        // this is first line.
        answer.push(word.slice(0, i))

        // 2nd. Split the rest into maxLen pieces.
        var startOfLine = i
        workingLen = 0
        while (i !== l) {
            if (workingLen + widths_array[i] > maxLen) {
                answer.push(word.slice(startOfLine, i))
                workingLen = 0
                startOfLine = i
            }
            workingLen += widths_array[i]
            ; i++;
        }
        if (startOfLine !== i) {
            answer.push(word.slice(startOfLine, i))
        }

        return answer
    }

    // Note, all sizing inputs for this function must be in "font measurement units"
    // By default, for PDF, it's "point".
    var splitParagraphIntoLines = function (text, maxlen, options) {
        // at this time works only on Western scripts, ones with space char
        // separating the words. Feel free to expand.

        if (!options) {
            options = {}
        }

        var spaceCharWidth = getCharWidthsArray(' ', options)[0]

        var words = text.split(' ')

        var line = []
        , lines = [line]
        , line_length = options.textIndent || 0
        , separator_length = 0
        , current_word_length = 0
        , word
        , widths_array

        var i, l, tmp
        for (i = 0, l = words.length; i < l; i++) {
            word = words[i]
            widths_array = getCharWidthsArray(word, options)
            current_word_length = getArraySum(widths_array)

            if (line_length + separator_length + current_word_length > maxlen) {
                if (current_word_length > maxlen) {
                    // this happens when you have space-less long URLs for example.
                    // we just chop these to size. We do NOT insert hiphens
                    tmp = splitLongWord(word, widths_array, maxlen - (line_length + separator_length), maxlen)
                    // first line we add to existing line object
                    line.push(tmp.shift()) // it's ok to have extra space indicator there
                    // last line we make into new line object
                    line = [tmp.pop()]
                    // lines in the middle we apped to lines object as whole lines
                    while (tmp.length) {
                        lines.push([tmp.shift()]) // single fragment occupies whole line
                    }
                    current_word_length = getArraySum(widths_array.slice(word.length - line[0].length))
                } else {
                    // just put it on a new line
                    line = [word]
                }

                // now we attach new line to lines
                lines.push(line)

                line_length = current_word_length
                separator_length = spaceCharWidth

            } else {
                line.push(word)

                line_length += separator_length + current_word_length
                separator_length = spaceCharWidth
            }
        }

        var output = []
        for (i = 0, l = lines.length; i < l; i++) {
            output.push(lines[i].join(' '))
        }
        return output

    }

    /**
    Splits a given string into an array of strings. Uses 'size' value
    (in measurement units declared as default for the pdfDataExport instance)
    and the font's "widths" and "Kerning" tables, where availabe, to
    determine display length of a given string for a given font.
    
    We use character's 100% of unit size (height) as width when Width
    table or other default width is not available.
    
    @public
    @function
    @param text {String} Unencoded, regular JavaScript (Unicode, UTF-16 / UCS-2) string.
    @param size {Number} Nominal number, measured in units default to this instance of pdfDataExport.
    @param options {Object} Optional flags needed for chopper to do the right thing.
    @returns {Array} with strings chopped to size.
    */
    API.splitTextToSize = function (text, maxlen, options) {
        'use strict'

        if (!options) {
            options = {}
        }

        var fsize = options.fontSize || this.internal.getFontSize()
        , newOptions = (function (options) {
            var widths = { 0: 1 }
            , kerning = {}

            if (!options.widths || !options.kerning) {
                var f = this.internal.getFont(options.fontName, options.fontStyle)
                , encoding = 'Unicode'
                // NOT UTF8, NOT UTF16BE/LE, NOT UCS2BE/LE
                // Actual JavaScript-native String's 16bit char codes used.
                // no multi-byte logic here

                if (f.metadata[encoding]) {
                    return {
                        widths: f.metadata[encoding].widths || widths
                        , kerning: f.metadata[encoding].kerning || kerning
                    }
                }
            } else {
                return {
                    widths: options.widths
                    , kerning: options.kerning
                }
            }

            // then use default values
            return {
                widths: widths
                , kerning: kerning
            }
        }).call(this, options)

        // first we split on end-of-line chars
        var paragraphs
        if (text.match(/[\n\r]/)) {
            paragraphs = text.split(/\r\n|\r|\n/g)
        } else {
            paragraphs = [text]
        }

        // now we convert size (max length of line) into "font size units"
        // at present time, the "font size unit" is always 'point'
        // 'proportional' means, "in proportion to font size"
        var fontUnit_maxLen = 1.0 * this.internal.scaleFactor * maxlen / fsize
        // at this time, fsize is always in "points" regardless of the default measurement unit of the doc.
        // this may change in the future?
        // until then, proportional_maxlen is likely to be in 'points'

        // If first line is to be indented (shorter or longer) than maxLen 
        // we indicate that by using CSS-style "text-indent" option.
        // here it's in font units too (which is likely 'points')
        // it can be negative (which makes the first line longer than maxLen)
        newOptions.textIndent = options.textIndent ?
            options.textIndent * 1.0 * this.internal.scaleFactor / fsize :
            0

        var i, l
        , output = []
        for (i = 0, l = paragraphs.length; i < l; i++) {
            output = output.concat(
                splitParagraphIntoLines(
                    paragraphs[i]
                    , fontUnit_maxLen
                    , newOptions
                )
            )
        }

        return output
    }

})(pdfDataExport.API);


; (function (pdfDataExportAPI) {
    'use strict'

    var namespace = 'addImage_'

    var getJpegSize = function (imgData) {
        'use strict'
        var width, height;
        // Verify we have a valid jpeg header 0xff,0xd8,0xff,0xe0,?,?,'J','F','I','F',0x00
        if (!imgData.charCodeAt(0) === 0xff ||
            !imgData.charCodeAt(1) === 0xd8 ||
            !imgData.charCodeAt(2) === 0xff ||
            !imgData.charCodeAt(3) === 0xe0 ||
            !imgData.charCodeAt(6) === 'J'.charCodeAt(0) ||
            !imgData.charCodeAt(7) === 'F'.charCodeAt(0) ||
            !imgData.charCodeAt(8) === 'I'.charCodeAt(0) ||
            !imgData.charCodeAt(9) === 'F'.charCodeAt(0) ||
            !imgData.charCodeAt(10) === 0x00) {
            throw new Error('getJpegSize requires a binary jpeg file')
        }
        var blockLength = imgData.charCodeAt(4) * 256 + imgData.charCodeAt(5);
        var i = 4, len = imgData.length;
        while (i < len) {
            i += blockLength;
            if (imgData.charCodeAt(i) !== 0xff) {
                throw new Error('getJpegSize could not find the size of the image');
            }
            if (imgData.charCodeAt(i + 1) === 0xc0) {
                height = imgData.charCodeAt(i + 5) * 256 + imgData.charCodeAt(i + 6);
                width = imgData.charCodeAt(i + 7) * 256 + imgData.charCodeAt(i + 8);
                return [width, height];
            } else {
                i += 2;
                blockLength = imgData.charCodeAt(i) * 256 + imgData.charCodeAt(i + 1)
            }
        }
    }
    // Image functionality ported from pdf.js
    , putImage = function (img) {
        var objectNumber = this.internal.newObject()
        , out = this.internal.write
        , putStream = this.internal.putStream

        img['n'] = objectNumber

        out('<</Type /XObject')
        out('/Subtype /Image')
        out('/Width ' + img['w'])
        out('/Height ' + img['h'])
        if (img['cs'] === 'Indexed') {
            out('/ColorSpace [/Indexed /DeviceRGB '
                    + (img['pal'].length / 3 - 1) + ' ' + (objectNumber + 1)
                    + ' 0 R]');
        } else {
            out('/ColorSpace /' + img['cs']);
            if (img['cs'] === 'DeviceCMYK') {
                out('/Decode [1 0 1 0 1 0 1 0]');
            }
        }
        out('/BitsPerComponent ' + img['bpc']);
        if ('f' in img) {
            out('/Filter /' + img['f']);
        }
        if ('dp' in img) {
            out('/DecodeParms <<' + img['dp'] + '>>');
        }
        if ('trns' in img && img['trns'].constructor == Array) {
            var trns = '';
            for (var i = 0; i < img['trns'].length; i++) {
                trns += (img[trns][i] + ' ' + img['trns'][i] + ' ');
                out('/Mask [' + trns + ']');
            }
        }
        if ('smask' in img) {
            out('/SMask ' + (objectNumber + 1) + ' 0 R');
        }
        out('/Length ' + img['data'].length + '>>');

        putStream(img['data']);

        out('endobj');
    }
    , putResourcesCallback = function () {
        var images = this.internal.collections[namespace + 'images']
        for (var i in images) {
            putImage.call(this, images[i])
        }
    }
    , putXObjectsDictCallback = function () {
        var images = this.internal.collections[namespace + 'images']
        , out = this.internal.write
        , image
        for (var i in images) {
            image = images[i]
            out(
                '/I' + image['i']
                , image['n']
                , '0'
                , 'R'
            )
        }
    }

    pdfDataExportAPI.addImage = function (imageData, format, x, y, w, h) {
        'use strict'
        if (typeof imageData === 'object' && imageData.nodeType === 1) {
            var canvas = document.createElement('canvas');
            canvas.width = imageData.clientWidth;
            canvas.height = imageData.clientHeight;

            var ctx = canvas.getContext('2d');
            if (!ctx) {
                throw ('addImage requires canvas to be supported by browser.');
            }
            ctx.drawImage(imageData, 0, 0, canvas.width, canvas.height);
            imageData = canvas.toDataURL('image/jpeg');
            format = "JPEG";
        }
        if (format.toUpperCase() !== 'JPEG') {
            throw new Error('addImage currently only supports format \'JPEG\', not \'' + format + '\'');
        }

        var imageIndex
        , images = this.internal.collections[namespace + 'images']
        , coord = this.internal.getCoordinateString
        , vcoord = this.internal.getVerticalCoordinateString;

        // Detect if the imageData is raw binary or Data URL
        if (imageData.substring(0, 23) === 'data:image/jpeg;base64,') {
            imageData = atob(imageData.replace('data:image/jpeg;base64,', ''));
        }

        if (images) {
            // this is NOT the first time this method is ran on this instance of pdfDataExport object.
            imageIndex = Object.keys ?
            Object.keys(images).length :
            (function (o) {
                var i = 0
                for (var e in o) { if (o.hasOwnProperty(e)) { i++ } }
                return i
            })(images)
        } else {
            // this is the first time this method is ran on this instance of pdfDataExport object.
            imageIndex = 0
            this.internal.collections[namespace + 'images'] = images = {}
            this.internal.events.subscribe('putResources', putResourcesCallback)
            this.internal.events.subscribe('putXobjectDict', putXObjectsDictCallback)
        }

        var dims = getJpegSize(imageData);
        var info = {
            w: dims[0],
            h: dims[1],
            cs: 'DeviceRGB',
            bpc: 8,
            f: 'DCTDecode',
            i: imageIndex,
            data: imageData
            // n: objectNumber will be added by putImage code

        };
        images[imageIndex] = info
        if (!w && !h) {
            w = -96;
            h = -96;
        }
        if (w < 0) {
            w = (-1) * info['w'] * 72 / w / this.internal.scaleFactor;
        }
        if (h < 0) {
            h = (-1) * info['h'] * 72 / h / this.internal.scaleFactor;
        }
        if (w === 0) {
            w = h * info['w'] / info['h'];
        }
        if (h === 0) {
            h = w * info['h'] / info['w'];
        }

        this.internal.write(
            'q'
            , coord(w)
            , '0 0'
            , coord(h) // TODO: check if this should be shifted by vcoord
            , coord(x)
            , vcoord(y + h)
            , 'cm /I' + info['i']
            , 'Do Q'
        )

        return this
    }
})(pdfDataExport.API)

; (function (API) {
    'use strict'

    /**
    Uncompresses data compressed into custom, base16-like format. 
    @public
    @function
    @param
    @returns {Type}
    */
    var uncompress = function (data) {

        var decoded = '0123456789abcdef'
        , encoded = 'klmnopqrstuvwxyz'
        , mapping = {}

        for (var i = 0; i < encoded.length; i++) {
            mapping[encoded[i]] = decoded[i]
        }

        var undef
        , output = {}
        , sign = 1
        , stringparts // undef. will be [] in string mode

        , activeobject = output
        , parentchain = []
        , parent_key_pair
        , keyparts = ''
        , valueparts = ''
        , key // undef. will be Truthy when Key is resolved.
        , datalen = data.length - 1 // stripping ending }
        , ch

        i = 1 // stripping starting {

        while (i != datalen) {
            // - { } ' are special.

            ch = data[i]
            i += 1

            if (ch == "'") {
                if (stringparts) {
                    // end of string mode
                    key = stringparts.join('')
                    stringparts = undef
                } else {
                    // start of string mode
                    stringparts = []
                }
            } else if (stringparts) {
                stringparts.push(ch)
            } else if (ch == '{') {
                // start of object
                parentchain.push([activeobject, key])
                activeobject = {}
                key = undef
            } else if (ch == '}') {
                // end of object
                parent_key_pair = parentchain.pop()
                parent_key_pair[0][parent_key_pair[1]] = activeobject
                key = undef
                activeobject = parent_key_pair[0]
            } else if (ch == '-') {
                sign = -1
            } else {
                // must be number
                if (key === undef) {
                    if (mapping.hasOwnProperty(ch)) {
                        keyparts += mapping[ch]
                        key = parseInt(keyparts, 16) * sign
                        sign = +1
                        keyparts = ''
                    } else {
                        keyparts += ch
                    }
                } else {
                    if (mapping.hasOwnProperty(ch)) {
                        valueparts += mapping[ch]
                        activeobject[key] = parseInt(valueparts, 16) * sign
                        sign = +1
                        key = undef
                        valueparts = ''
                    } else {
                        valueparts += ch
                    }
                }
            }
        } // end while

        return output
    }

    // encoding = 'Unicode' 
    // NOT UTF8, NOT UTF16BE/LE, NOT UCS2BE/LE. NO clever BOM behavior
    // Actual 16bit char codes used.
    // no multi-byte logic here

    // Unicode characters to WinAnsiEncoding:
    // {402: 131, 8211: 150, 8212: 151, 8216: 145, 8217: 146, 8218: 130, 8220: 147, 8221: 148, 8222: 132, 8224: 134, 8225: 135, 8226: 149, 8230: 133, 8364: 128, 8240:137, 8249: 139, 8250: 155, 710: 136, 8482: 153, 338: 140, 339: 156, 732: 152, 352: 138, 353: 154, 376: 159, 381: 142, 382: 158}
    // as you can see, all Unicode chars are outside of 0-255 range. No char code conflicts.
    // this means that you can give Win cp1252 encoded strings to pdfDataExport for rendering directly
    // as well as give strings with some (supported by these fonts) Unicode characters and 
    // these will be mapped to win cp1252 
    // for example, you can send char code (cp1252) 0x80 or (unicode) 0x20AC, getting "Euro" glyph displayed in both cases.

    var encodingBlock = {
        'codePages': ['WinAnsiEncoding']
        , 'WinAnsiEncoding': uncompress("{19m8n201n9q201o9r201s9l201t9m201u8m201w9n201x9o201y8o202k8q202l8r202m9p202q8p20aw8k203k8t203t8v203u9v2cq8s212m9t15m8w15n9w2dw9s16k8u16l9u17s9z17x8y17y9y}")
    }
    , encodings = {
        'Unicode': {
            'Courier': encodingBlock
            , 'Courier-Bold': encodingBlock
            , 'Courier-BoldOblique': encodingBlock
            , 'Courier-Oblique': encodingBlock
            , 'Helvetica': encodingBlock
            , 'Helvetica-Bold': encodingBlock
            , 'Helvetica-BoldOblique': encodingBlock
            , 'Helvetica-Oblique': encodingBlock
            , 'Times-Roman': encodingBlock
            , 'Times-Bold': encodingBlock
            , 'Times-BoldItalic': encodingBlock
            , 'Times-Italic': encodingBlock
            //	, 'Symbol'
            //	, 'ZapfDingbats'
        }
    }

    , fontMetrics = {
        'Unicode': {
            // all sizing numbers are n/fontMetricsFractionOf = one font size unit
            // this means that if fontMetricsFractionOf = 1000, and letter A's width is 476, it's
            // width is 476/1000 or 47.6% of its height (regardless of font size)
            // At this time this value applies to "widths" and "kerning" numbers.

            // char code 0 represents "default" (average) width - use it for chars missing in this table.
            // key 'fof' represents the "fontMetricsFractionOf" value

            'Courier-Oblique': uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}")
            , 'Times-BoldItalic': uncompress("{'widths'{k3o2q4ycx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2r202m2n2n3m2o3m2p5n202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5n4l4m4m4m4n4m4o4s4p4m4q4m4r4s4s4y4t2r4u3m4v4m4w3x4x5t4y4s4z4s5k3x5l4s5m4m5n3r5o3x5p4s5q4m5r5t5s4m5t3x5u3x5v2l5w1w5x2l5y3t5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q2l6r3m6s3r6t1w6u1w6v3m6w1w6x4y6y3r6z3m7k3m7l3m7m2r7n2r7o1w7p3r7q2w7r4m7s3m7t2w7u2r7v2n7w1q7x2n7y3t202l3mcl4mal2ram3man3mao3map3mar3mas2lat4uau1uav3maw3way4uaz2lbk2sbl3t'fof'6obo2lbp3tbq3mbr1tbs2lbu1ybv3mbz3mck4m202k3mcm4mcn4mco4mcp4mcq5ycr4mcs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz2w203k6o212m6o2dw2l2cq2l3t3m3u2l17s3x19m3m}'kerning'{cl{4qu5kt5qt5rs17ss5ts}201s{201ss}201t{cks4lscmscnscoscpscls2wu2yu201ts}201x{2wu2yu}2k{201ts}2w{4qx5kx5ou5qx5rs17su5tu}2x{17su5tu5ou}2y{4qx5kx5ou5qx5rs17ss5ts}'fof'-6ofn{17sw5tw5ou5qw5rs}7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qs}3v{17su5tu5os5qs}7p{17su5tu}ck{4qu5kt5qt5rs17ss5ts}4l{4qu5kt5qt5rs17ss5ts}cm{4qu5kt5qt5rs17ss5ts}cn{4qu5kt5qt5rs17ss5ts}co{4qu5kt5qt5rs17ss5ts}cp{4qu5kt5qt5rs17ss5ts}6l{4qu5ou5qw5rt17su5tu}5q{ckuclucmucnucoucpu4lu}5r{ckuclucmucnucoucpu4lu}7q{cksclscmscnscoscps4ls}6p{4qu5ou5qw5rt17sw5tw}ek{4qu5ou5qw5rt17su5tu}el{4qu5ou5qw5rt17su5tu}em{4qu5ou5qw5rt17su5tu}en{4qu5ou5qw5rt17su5tu}eo{4qu5ou5qw5rt17su5tu}ep{4qu5ou5qw5rt17su5tu}es{17ss5ts5qs4qu}et{4qu5ou5qw5rt17sw5tw}eu{4qu5ou5qw5rt17ss5ts}ev{17ss5ts5qs4qu}6z{17sw5tw5ou5qw5rs}fm{17sw5tw5ou5qw5rs}7n{201ts}fo{17sw5tw5ou5qw5rs}fp{17sw5tw5ou5qw5rs}fq{17sw5tw5ou5qw5rs}7r{cksclscmscnscoscps4ls}fs{17sw5tw5ou5qw5rs}ft{17su5tu}fu{17su5tu}fv{17su5tu}fw{17su5tu}fz{cksclscmscnscoscps4ls}}}")
            , 'Helvetica-Bold': uncompress("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}")
            , 'Courier': uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}")
            , 'Courier-BoldOblique': uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}")
            , 'Times-Bold': uncompress("{'widths'{k3q2q5ncx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2l202m2n2n3m2o3m2p6o202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5x4l4s4m4m4n4s4o4s4p4m4q3x4r4y4s4y4t2r4u3m4v4y4w4m4x5y4y4s4z4y5k3x5l4y5m4s5n3r5o4m5p4s5q4s5r6o5s4s5t4s5u4m5v2l5w1w5x2l5y3u5z3m6k2l6l3m6m3r6n2w6o3r6p2w6q2l6r3m6s3r6t1w6u2l6v3r6w1w6x5n6y3r6z3m7k3r7l3r7m2w7n2r7o2l7p3r7q3m7r4s7s3m7t3m7u2w7v2r7w1q7x2r7y3o202l3mcl4sal2lam3man3mao3map3mar3mas2lat4uau1yav3maw3tay4uaz2lbk2sbl3t'fof'6obo2lbp3rbr1tbs2lbu2lbv3mbz3mck4s202k3mcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3rek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3m3u2l17s4s19m3m}'kerning'{cl{4qt5ks5ot5qy5rw17sv5tv}201t{cks4lscmscnscoscpscls4wv}2k{201ts}2w{4qu5ku7mu5os5qx5ru17su5tu}2x{17su5tu5ou5qs}2y{4qv5kv7mu5ot5qz5ru17su5tu}'fof'-6o7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qu}3v{17su5tu5os5qu}fu{17su5tu5ou5qu}7p{17su5tu5ou5qu}ck{4qt5ks5ot5qy5rw17sv5tv}4l{4qt5ks5ot5qy5rw17sv5tv}cm{4qt5ks5ot5qy5rw17sv5tv}cn{4qt5ks5ot5qy5rw17sv5tv}co{4qt5ks5ot5qy5rw17sv5tv}cp{4qt5ks5ot5qy5rw17sv5tv}6l{17st5tt5ou5qu}17s{ckuclucmucnucoucpu4lu4wu}5o{ckuclucmucnucoucpu4lu4wu}5q{ckzclzcmzcnzcozcpz4lz4wu}5r{ckxclxcmxcnxcoxcpx4lx4wu}5t{ckuclucmucnucoucpu4lu4wu}7q{ckuclucmucnucoucpu4lu}6p{17sw5tw5ou5qu}ek{17st5tt5qu}el{17st5tt5ou5qu}em{17st5tt5qu}en{17st5tt5qu}eo{17st5tt5qu}ep{17st5tt5ou5qu}es{17ss5ts5qu}et{17sw5tw5ou5qu}eu{17sw5tw5ou5qu}ev{17ss5ts5qu}6z{17sw5tw5ou5qu5rs}fm{17sw5tw5ou5qu5rs}fn{17sw5tw5ou5qu5rs}fo{17sw5tw5ou5qu5rs}fp{17sw5tw5ou5qu5rs}fq{17sw5tw5ou5qu5rs}7r{cktcltcmtcntcotcpt4lt5os}fs{17sw5tw5ou5qu5rs}ft{17su5tu5ou5qu}7m{5os}fv{17su5tu5ou5qu}fw{17su5tu5ou5qu}fz{cksclscmscnscoscps4ls}}}")
            //, 'Symbol': uncompress("{'widths'{k3uaw4r19m3m2k1t2l2l202m2y2n3m2p5n202q6o3k3m2s2l2t2l2v3r2w1t3m3m2y1t2z1wbk2sbl3r'fof'6o3n3m3o3m3p3m3q3m3r3m3s3m3t3m3u1w3v1w3w3r3x3r3y3r3z2wbp3t3l3m5v2l5x2l5z3m2q4yfr3r7v3k7w1o7x3k}'kerning'{'fof'-6o}}")
            , 'Helvetica': uncompress("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}")
            , 'Helvetica-BoldOblique': uncompress("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}")
            //, 'ZapfDingbats': uncompress("{'widths'{k4u2k1w'fof'6o}'kerning'{'fof'-6o}}")
            , 'Courier-Bold': uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}")
            , 'Times-Italic': uncompress("{'widths'{k3n2q4ycx2l201n3m201o5t201s2l201t2l201u2l201w3r201x3r201y3r2k1t2l2l202m2n2n3m2o3m2p5n202q5t2r1p2s2l2t2l2u3m2v4n2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w4n3x4n3y4n3z3m4k5w4l3x4m3x4n4m4o4s4p3x4q3x4r4s4s4s4t2l4u2w4v4m4w3r4x5n4y4m4z4s5k3x5l4s5m3x5n3m5o3r5p4s5q3x5r5n5s3x5t3r5u3r5v2r5w1w5x2r5y2u5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q1w6r3m6s3m6t1w6u1w6v2w6w1w6x4s6y3m6z3m7k3m7l3m7m2r7n2r7o1w7p3m7q2w7r4m7s2w7t2w7u2r7v2s7w1v7x2s7y3q202l3mcl3xal2ram3man3mao3map3mar3mas2lat4wau1vav3maw4nay4waz2lbk2sbl4n'fof'6obo2lbp3mbq3obr1tbs2lbu1zbv3mbz3mck3x202k3mcm3xcn3xco3xcp3xcq5tcr4mcs3xct3xcu3xcv3xcw2l2m2ucy2lcz2ldl4mdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr4nfs3mft3mfu3mfv3mfw3mfz2w203k6o212m6m2dw2l2cq2l3t3m3u2l17s3r19m3m}'kerning'{cl{5kt4qw}201s{201sw}201t{201tw2wy2yy6q-t}201x{2wy2yy}2k{201tw}2w{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}2x{17ss5ts5os}2y{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}'fof'-6o6t{17ss5ts5qs}7t{5os}3v{5qs}7p{17su5tu5qs}ck{5kt4qw}4l{5kt4qw}cm{5kt4qw}cn{5kt4qw}co{5kt4qw}cp{5kt4qw}6l{4qs5ks5ou5qw5ru17su5tu}17s{2ks}5q{ckvclvcmvcnvcovcpv4lv}5r{ckuclucmucnucoucpu4lu}5t{2ks}6p{4qs5ks5ou5qw5ru17su5tu}ek{4qs5ks5ou5qw5ru17su5tu}el{4qs5ks5ou5qw5ru17su5tu}em{4qs5ks5ou5qw5ru17su5tu}en{4qs5ks5ou5qw5ru17su5tu}eo{4qs5ks5ou5qw5ru17su5tu}ep{4qs5ks5ou5qw5ru17su5tu}es{5ks5qs4qs}et{4qs5ks5ou5qw5ru17su5tu}eu{4qs5ks5qw5ru17su5tu}ev{5ks5qs4qs}ex{17ss5ts5qs}6z{4qv5ks5ou5qw5ru17su5tu}fm{4qv5ks5ou5qw5ru17su5tu}fn{4qv5ks5ou5qw5ru17su5tu}fo{4qv5ks5ou5qw5ru17su5tu}fp{4qv5ks5ou5qw5ru17su5tu}fq{4qv5ks5ou5qw5ru17su5tu}7r{5os}fs{4qv5ks5ou5qw5ru17su5tu}ft{17su5tu5qs}fu{17su5tu5qs}fv{17su5tu5qs}fw{17su5tu5qs}}}")
            , 'Times-Roman': uncompress("{'widths'{k3n2q4ycx2l201n3m201o6o201s2l201t2l201u2l201w2w201x2w201y2w2k1t2l2l202m2n2n3m2o3m2p5n202q6o2r1m2s2l2t2l2u3m2v3s2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v1w3w3s3x3s3y3s3z2w4k5w4l4s4m4m4n4m4o4s4p3x4q3r4r4s4s4s4t2l4u2r4v4s4w3x4x5t4y4s4z4s5k3r5l4s5m4m5n3r5o3x5p4s5q4s5r5y5s4s5t4s5u3x5v2l5w1w5x2l5y2z5z3m6k2l6l2w6m3m6n2w6o3m6p2w6q2l6r3m6s3m6t1w6u1w6v3m6w1w6x4y6y3m6z3m7k3m7l3m7m2l7n2r7o1w7p3m7q3m7r4s7s3m7t3m7u2w7v3k7w1o7x3k7y3q202l3mcl4sal2lam3man3mao3map3mar3mas2lat4wau1vav3maw3say4waz2lbk2sbl3s'fof'6obo2lbp3mbq2xbr1tbs2lbu1zbv3mbz2wck4s202k3mcm4scn4sco4scp4scq5tcr4mcs3xct3xcu3xcv3xcw2l2m2tcy2lcz2ldl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek2wel2wem2wen2weo2wep2weq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr3sfs3mft3mfu3mfv3mfw3mfz3m203k6o212m6m2dw2l2cq2l3t3m3u1w17s4s19m3m}'kerning'{cl{4qs5ku17sw5ou5qy5rw201ss5tw201ws}201s{201ss}201t{ckw4lwcmwcnwcowcpwclw4wu201ts}2k{201ts}2w{4qs5kw5os5qx5ru17sx5tx}2x{17sw5tw5ou5qu}2y{4qs5kw5os5qx5ru17sx5tx}'fof'-6o7t{ckuclucmucnucoucpu4lu5os5rs}3u{17su5tu5qs}3v{17su5tu5qs}7p{17sw5tw5qs}ck{4qs5ku17sw5ou5qy5rw201ss5tw201ws}4l{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cm{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cn{4qs5ku17sw5ou5qy5rw201ss5tw201ws}co{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cp{4qs5ku17sw5ou5qy5rw201ss5tw201ws}6l{17su5tu5os5qw5rs}17s{2ktclvcmvcnvcovcpv4lv4wuckv}5o{ckwclwcmwcnwcowcpw4lw4wu}5q{ckyclycmycnycoycpy4ly4wu5ms}5r{cktcltcmtcntcotcpt4lt4ws}5t{2ktclvcmvcnvcovcpv4lv4wuckv}7q{cksclscmscnscoscps4ls}6p{17su5tu5qw5rs}ek{5qs5rs}el{17su5tu5os5qw5rs}em{17su5tu5os5qs5rs}en{17su5qs5rs}eo{5qs5rs}ep{17su5tu5os5qw5rs}es{5qs}et{17su5tu5qw5rs}eu{17su5tu5qs5rs}ev{5qs}6z{17sv5tv5os5qx5rs}fm{5os5qt5rs}fn{17sv5tv5os5qx5rs}fo{17sv5tv5os5qx5rs}fp{5os5qt5rs}fq{5os5qt5rs}7r{ckuclucmucnucoucpu4lu5os}fs{17sv5tv5os5qx5rs}ft{17ss5ts5qs}fu{17sw5tw5qs}fv{17sw5tw5qs}fw{17ss5ts5qs}fz{ckuclucmucnucoucpu4lu5os5rs}}}")
            , 'Helvetica-Oblique': uncompress("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}")
        }
    };

    /*
    This event handler is fired when a new pdfDataExport object is initialized
    This event handler appends metrics data to standard fonts within
    that pdfDataExport instance. The metrics are mapped over Unicode character
    codes, NOT CIDs or other codes matching the StandardEncoding table of the
    standard PDF fonts.
    Future:
    Also included is the encoding maping table, converting Unicode (UCS-2, UTF-16)
    char codes to StandardEncoding character codes. The encoding table is to be used
    somewhere around "pdfEscape" call.
    */

    API.events.push([
        'addFonts'
        , function (fontManagementObjects) {
            // fontManagementObjects is {
            //	'fonts':font_ID-keyed hash of font objects
            //	, 'dictionary': lookup object, linking ["FontFamily"]['Style'] to font ID
            //}
            var font
            , fontID
            , metrics
            , unicode_section
            , encoding = 'Unicode'
            , encodingBlock

            for (fontID in fontManagementObjects.fonts) {
                if (fontManagementObjects.fonts.hasOwnProperty(fontID)) {
                    font = fontManagementObjects.fonts[fontID]

                    // // we only ship 'Unicode' mappings and metrics. No need for loop.
                    // // still, leaving this for the future.

                    // for (encoding in fontMetrics){
                    // 	if (fontMetrics.hasOwnProperty(encoding)) {

                    metrics = fontMetrics[encoding][font.PostScriptName]
                    if (metrics) {
                        if (font.metadata[encoding]) {
                            unicode_section = font.metadata[encoding]
                        } else {
                            unicode_section = font.metadata[encoding] = {}
                        }

                        unicode_section.widths = metrics.widths
                        unicode_section.kerning = metrics.kerning
                    }
                    // 	}
                    // }
                    // for (encoding in encodings){
                    // 	if (encodings.hasOwnProperty(encoding)) {
                    encodingBlock = encodings[encoding][font.PostScriptName]
                    if (encodingBlock) {
                        if (font.metadata[encoding]) {
                            unicode_section = font.metadata[encoding]
                        } else {
                            unicode_section = font.metadata[encoding] = {}
                        }

                        unicode_section.encoding = encodingBlock
                        if (encodingBlock.codePages && encodingBlock.codePages.length) {
                            font.encoding = encodingBlock.codePages[0]
                        }
                    }
                    // 	}
                    // }
                }
            }
        }
    ]) // end of adding event handler

})(pdfDataExport.API);


/*global self */
/*jslint bitwise: true, regexp: true, confusion: true, es5: true, vars: true, white: true,
  plusplus: true */


var saveAs = window.jqxSaveAs = saveAs
  || (navigator.msSaveBlob && navigator.msSaveBlob.bind(navigator))
  || (function (view) {
      "use strict";
      var
            doc = view.document
            // only get URL when necessary in case BlobBuilder.js hasn't overridden it yet
          , get_URL = function () {
              return view.URL || view.webkitURL || view;
          }
          , URL = view.URL || view.webkitURL || view
           , save_link = $("<a></a>")[0]
      //   , save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
          , can_use_save_link = "download" in save_link
          , click = function (node) {
              var event = doc.createEvent("MouseEvents");
              event.initMouseEvent(
                  "click", true, false, view, 0, 0, 0, 0, 0
                  , false, false, false, false, 0, null
              );
              return node.dispatchEvent(event); // false if event was cancelled
          }
          , webkit_req_fs = view.webkitRequestFileSystem
          , req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
          , throw_outside = function (ex) {
              (view.setImmediate || view.setTimeout)(function () {
                  throw ex;
              }, 0);
          }
          , force_saveable_type = "application/octet-stream"
          , fs_min_size = 0
          , deletion_queue = []
          , process_deletion_queue = function () {
              var i = deletion_queue.length;
              while (i--) {
                  var file = deletion_queue[i];
                  if (typeof file === "string") { // file is an object URL
                      URL.revokeObjectURL(file);
                  } else { // file is a File
                      file.remove();
                  }
              }
              deletion_queue.length = 0; // clear queue
          }
          , dispatch = function (filesaver, event_types, event) {
              event_types = [].concat(event_types);
              var i = event_types.length;
              while (i--) {
                  var listener = filesaver["on" + event_types[i]];
                  if (typeof listener === "function") {
                      try {
                          listener.call(filesaver, event || filesaver);
                      } catch (ex) {
                          throw_outside(ex);
                      }
                  }
              }
          }
          , FileSaver = function (blob, name) {
              // First try a.download, then web filesystem, then object URLs
              var
                    filesaver = this
                  , type = blob.type
                  , blob_changed = false
                  , object_url
                  , target_view
                  , get_object_url = function () {
                      var object_url = get_URL().createObjectURL(blob);
                      deletion_queue.push(object_url);
                      return object_url;
                  }
                  , dispatch_all = function () {
                      dispatch(filesaver, "writestart progress write writeend".split(" "));
                  }
                  // on any filesys errors revert to saving with object URLs
                  , fs_error = function () {
                      // don't create more object URLs than needed
                      if (blob_changed || !object_url) {
                          object_url = get_object_url(blob);
                      }
                      if (target_view) {
                          target_view.location.href = object_url;
                      }
                      filesaver.readyState = filesaver.DONE;
                      dispatch_all();
                  }
                  , abortable = function (func) {
                      return function () {
                          if (filesaver.readyState !== filesaver.DONE) {
                              return func.apply(this, arguments);
                          }
                      };
                  }
                  , create_if_not_found = { create: true, exclusive: false }
                  , slice
              ;
              filesaver.readyState = filesaver.INIT;
              if (!name) {
                  name = "download";
              }
              if (can_use_save_link) {
                  object_url = get_object_url(blob);
                  save_link.href = object_url;
                  save_link.download = name;
                  if (click(save_link)) {
                      filesaver.readyState = filesaver.DONE;
                      dispatch_all();
                      return;
                  }
              }
              // Object and web filesystem URLs have a problem saving in Google Chrome when
              // viewed in a tab, so I force save with application/octet-stream
              // http://code.google.com/p/chromium/issues/detail?id=91158
              if (view.chrome && type && type !== force_saveable_type) {
                  slice = blob.slice || blob.webkitSlice;
                  blob = slice.call(blob, 0, blob.size, force_saveable_type);
                  blob_changed = true;
              }
              // Since I can't be sure that the guessed media type will trigger a download
              // in WebKit, I append .download to the filename.
              // https://bugs.webkit.org/show_bug.cgi?id=65440
              if (webkit_req_fs && name !== "download") {
                  name += ".download";
              }
              if (type === force_saveable_type || webkit_req_fs) {
                  target_view = view;
              } else {
                  target_view = view.open();
              }
              if (!req_fs) {
                  fs_error();
                  return;
              }
              fs_min_size += blob.size;
              req_fs(view.TEMPORARY, fs_min_size, abortable(function (fs) {
                  fs.root.getDirectory("saved", create_if_not_found, abortable(function (dir) {
                      var save = function () {
                          dir.getFile(name, create_if_not_found, abortable(function (file) {
                              file.createWriter(abortable(function (writer) {
                                  writer.onwriteend = function (event) {
                                      target_view.location.href = file.toURL();
                                      deletion_queue.push(file);
                                      filesaver.readyState = filesaver.DONE;
                                      dispatch(filesaver, "writeend", event);
                                  };
                                  writer.onerror = function () {
                                      var error = writer.error;
                                      if (error.code !== error.ABORT_ERR) {
                                          fs_error();
                                      }
                                  };
                                  "writestart progress write abort".split(" ").forEach(function (event) {
                                      writer["on" + event] = filesaver["on" + event];
                                  });
                                  writer.write(blob);
                                  filesaver.abort = function () {
                                      writer.abort();
                                      filesaver.readyState = filesaver.DONE;
                                  };
                                  filesaver.readyState = filesaver.WRITING;
                              }), fs_error);
                          }), fs_error);
                      };
                      dir.getFile(name, { create: false }, abortable(function (file) {
                          // delete file if it already exists
                          file.remove();
                          save();
                      }), abortable(function (ex) {
                          if (ex.code === ex.NOT_FOUND_ERR) {
                              save();
                          } else {
                              fs_error();
                          }
                      }));
                  }), fs_error);
              }), fs_error);
          }
          , FS_proto = FileSaver.prototype
          , saveAs = function (blob, name) {
              return new FileSaver(blob, name);
          }
      ;
      FS_proto.abort = function () {
          var filesaver = this;
          filesaver.readyState = filesaver.DONE;
          dispatch(filesaver, "abort");
      };
      FS_proto.readyState = FS_proto.INIT = 0;
      FS_proto.WRITING = 1;
      FS_proto.DONE = 2;

      FS_proto.error =
      FS_proto.onwritestart =
      FS_proto.onprogress =
      FS_proto.onwrite =
      FS_proto.onabort =
      FS_proto.onerror =
      FS_proto.onwriteend =
          null;

      if (view.addEventListener) {
          view.addEventListener("unload", process_deletion_queue, false);
      }
      return saveAs;
  }(self));


; (function (API) {
    'use strict'

    var name = 'pdfDataExport IE Below 9 Shim plugin';
    // Shim in IE6-9 support
    API.output = function (type, options) {

        // If not IE then return early
        return this.internal.output(type, options);

        var filename = 'Output.pdf';
        switch (type) {
            case 'datauristring':
            case 'dataurlstring':
            case 'datauri':
            case 'dataurl':
            case 'dataurlnewwindow':
                if (console)
                console.log(name + ': Data URIs are not supported on IE6-9.');
                break;
            case 'save':
                filename = options;
                break;
        }

        // @TODO: IE shim 


    };



})(pdfDataExport.API)
