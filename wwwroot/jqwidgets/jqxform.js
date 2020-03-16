/* tslint:disable */
/* eslint-disable */

(function ($) {

    $.jqx.jqxWidget("jqxForm", "", {});

    $.extend($.jqx._jqxForm.prototype, {
        defineInstance: function () {
            var settings = {
                padding: { left: 5, top: 5, right: 5, bottom: 5 },
                backgroundColor: '#F5F5F5',
                borderColor: '#E5E5E5',
                value: {},
                template: [
                    {
                        type: 'text',
                        label: 'TextBox 1'
                    },
                    {
                        type: 'text',
                        label: 'TextBox 2'
                    },
                ]
            };

            $.extend(true, this, settings);
        },

        createInstance: function (args) {
            var self = this;
            self._isInitialized = false;

            var host = self.host;
            host.addClass(self.toThemeProperty('jqx-widget'));

            self._renderAndInit();

            this._setValue(this.value);
            this._prevValue = this._getValue();

            self._isInitialized = true;
        }, // createInstance

        destroy: function () {
            this._destroyElements();

            this.host.removeData();
            this.host.remove();
            delete this.host;
            delete this.set;
            delete this.get;
            delete this.call;
            delete this.element;
        },

        _destroyElements: function () {
            for (var i = 0; i < this.template.length; i++) {
                if ($.isArray(this.template[i].columns)) {
                    for (var j = 0; j < this.template[i].columns.length; j++) {
                        var id = i + "_" + j;
                        this._getComponentById(id).off();
                        this.host.find('#rowWrap_el_' + id).remove();
                    }
                }

                this._getComponentById(i).off();
                this._getComponentLabelById(i).off();
                this._getComponentLabelById(i).removeData();
                this.host.find('#rowWrap_el_' + i).remove();
            }

            this.host.find('#formWrap').remove();
        },

        val: function (newVal) {
            if (undefined == newVal)
                return this._getValue();
            else
                this._setValue(newVal);
        },

        _onChangeHandler: function (e) {
            if (!this.isInitialized || this._suppressEvents)
                return;

            var newVal = this._getValue();

            if (this._prevValue && JSON.stringify(newVal) == JSON.stringify(this._prevValue))
                return;

            var event = new $.Event('formDataChange');

            event.args = {
                value: newVal,
                previousValue: this._prevValue
            };

            event.owner = this;
            var result = this.host.trigger(event);

            if (event.cancel)
                this._setValue(this._prevValue);
            else {
                this._prevValue = newVal;
            }

            return result;
        },

        _onButtonClick: function (owner, tool) {
            if (!this.isInitialized)
                return;

            var event = new $.Event('buttonClick');

            event.args = {
                name: tool.name,
                text: owner.val()
            };

            event.owner = this;
            var result = this.host.trigger(event);

            return result;
        },

        submit: function (action, target, method) {
            var self = this;

            var submitValue = self._getValue(true);

            var html = "<form id='jqx_fromToSubmit'";
            if (action) {
                html += ' action="' + action + '"';
            }
            if (target) {
                html += ' target="' + target + '"';
            }

            if (method && method.toString().toLowerCase() === 'get')
                html += ' method="GET"';
            else
                html += ' method="POST"';

            html += ">";
            for (var i = 0; i < submitValue.length; i++) {
                var inputValue = submitValue[i].value;
                var tool = submitValue[i].tool;

                var submitName = tool.name;
                if (submitName == undefined)
                    submitName = tool.id;
                if (submitName == undefined)
                    submitName = tool.bind;


                if (tool.type == 'button' || tool.type == 'label') {
                    if (!tool.submit || tool.submit == false)
                        continue;
                }

                if (tool.submit == false)
                    continue;

                if (submitName !== undefined) {
                    html += '<input type="hidden" ';

                    html += ' name="' + submitName + '"';

                    html += ' value="' + inputValue + '"';

                    html += ">";
                }
            }

            html += "</form>";

            self.host.find('#formSubmit').html(html);

            self.host.find('#jqx_fromToSubmit').submit();
        },

        _getValue: function (getSubmitFields) {
            var val = {};
            var submitValue = [];

            for (var i = 0; i < this.template.length; i++) {
                var tool = this.template[i];
                var toolId = "el_" + i;

                if ($.isArray(tool.columns)) {
                    for (var j = 0; j < tool.columns.length; j++) {
                        var childTool = tool.columns[j];
                        var childToolId = toolId + "." + j;

                        if (childTool.type == 'option' && childTool.component != 'jqxDropDownList') {
                            var currentPropertyValue = this._radioGroupGetValue(childTool, childToolId);
                            if (childTool.bind == undefined) {
                            }
                            else
                                this._setObjectProperty(val, childTool.bind, currentPropertyValue);

                            if (getSubmitFields)
                                submitValue.push({ tool: childTool, value: currentPropertyValue });
                            continue;
                        }

                        var childComponent = this._getComponentById(i + "_" + j);
                        var currentValue = childComponent.val();
                        if (currentValue === undefined)
                            currentValue = null;

                        if (childTool.bind == undefined) {
                        }
                        else
                            this._setObjectProperty(val, childTool.bind, currentValue);

                        if (getSubmitFields)
                            submitValue.push({ tool: childTool, value: currentValue });
                    }
                    continue;
                }

                if (tool.type == 'option' && tool.component != 'jqxDropDownList') {
                    var currentPropertyValue = this._radioGroupGetValue(tool, toolId);

                    if (tool.bind == undefined) {
                    }
                    else {
                        this._setObjectProperty(val, tool.bind, currentPropertyValue);
                    }

                    if (getSubmitFields)
                        submitValue.push({ tool: tool, value: currentPropertyValue });

                    continue;
                }

                var component = this._getComponentById(i);
                var currentValue = component.val();
                if (currentValue === undefined)
                    currentValue = null;

                if (tool.bind == undefined) {
                }
                else {
                    this._setObjectProperty(val, tool.bind, currentValue);
                }

                if (getSubmitFields)
                    submitValue.push({ tool: tool, value: currentValue });

            }

            if (getSubmitFields)
                return submitValue;

            return $.extend({}, this._prevValue, val);
        },

        _getObjectProperty: function (obj, propertyName) {
            if (typeof (obj) !== 'object' || obj === undefined || propertyName === undefined || propertyName == '')
                return obj;

            var parts = propertyName.split('.');

            var val = obj;
            for (var b = 0; b < parts.length; b++) {
                val = val[parts[b]];
            }

            return val;
        },

        _setObjectProperty: function (obj, propertyName, value) {
            if (undefined === obj)
                return;

            if (undefined == propertyName || propertyName == '') {
                obj = value;
                return;
            }

            var parts = propertyName.split('.');

            var b = 0;

            while (b < parts.length - 1) {
                if (undefined == obj[parts[b]]) {
                    obj[parts[b]] = {};
                }
                b++;
            }

            obj[parts[b]] = value;
        },

        _setValue: function (val) {
            this._suppressEvents = true;

            for (var i = 0; i < this.template.length; i++) {
                var tool = this.template[i];
                var toolId = "el_" + i;

                var boundValue = undefined;

                if ($.isArray(tool.columns)) {
                    for (var j = 0; j < tool.columns.length; j++) {
                        var childTool = tool.columns[j];
                        var childToolId = toolId + "." + j;

                        if (!childTool.bind)
                            continue;

                        boundValue = this._getObjectProperty(val, childTool.bind);
                        if (childTool.type == 'option' && childTool.component != 'jqxDropDownList') {
                            this._radioGroupSetValue(childTool, childToolId, boundValue);
                            continue;
                        }

                        var childComponent = this._getComponentById(i + "_" + j);
                        if (val !== undefined)
                            childComponent.val(boundValue);
                    }
                    continue;
                }

                if (!tool.bind)
                    continue;

                boundValue = this._getObjectProperty(val, tool.bind);

                if (tool.type == 'option' && tool.component != 'jqxDropDownList') {
                    this._radioGroupSetValue(tool, toolId, boundValue);
                    continue;
                }

                var component = this._getComponentById(i);

                if (tool.type == 'label') {
                    component.html(boundValue);
                    continue;
                }

                if (val !== undefined)
                    component.val(boundValue);
            }

            this._prevValue = val;

            this._suppressEvents = false;
        },

        _radioGroupGetValue: function (tool, toolId) {
            for (var i = 0; i < tool.options.length; i++) {
                var optionId = toolId + "_option_" + i;
                var el = this.host.find("#" + optionId);
                if (el.length > 0) {
                    var val = el.jqxRadioButton('val');
                    if (val == true) {
                        if (tool.options[i].value !== undefined)
                            return tool.options[i].value;

                        return tool.options[i].label;
                    }
                }
            }

            return undefined;
        },

        _radioGroupSetValue: function (tool, toolId, val) {
            for (var i = 0; i < tool.options.length; i++) {
                if (tool.options[i].value !== undefined) {
                    if (val !== tool.options[i].value)
                        continue;
                }
                else {
                    if (val !== tool.options[i].label)
                        continue;
                }

                var optionId = toolId + "_option_" + i;
                var el = this.host.find("#" + optionId);
                if (el.length > 0)
                    el.jqxRadioButton('val', true);
            }
        },

        _getToolStyle: function (tool) {
            var style = 'display: block;';
            var pos = ['left', 'right', 'top', 'bottom'];

            if (tool.height)
                style += 'height: ' + tool.height + ';';

            if (tool.valign !== undefined)
                style += 'vertical-align: ' + tool.valign + ';';
            else
                style += 'vertical-align: middle;'

            return style;
        },

        _getAlignMargin: function (tool, property) {
            if (!tool || !tool[property])
                return '';

            var pos = ['left', 'right', 'top', 'bottom'];
            var margin = {};
            var style = '';


            if (tool[property]) {
                margin = {};

                if (tool[property] == 'left') {
                    margin.left = '0px';
                    margin.right = 'auto';
                }
                else if (tool[property] == 'right') {
                    margin.left = 'auto';
                    margin.right = '0px';
                }
                else {
                    margin.left = 'auto';
                    margin.right = 'auto';
                }
            }

            if (margin) {
                for (var i in pos) {
                    if (margin[pos[i]])
                        style += 'margin-' + pos[i] + ': ' + margin[pos[i]] + ';';
                }
            }

            return style;
        },

        _getPaddingAndMarginStyle: function (tool, isLabel) {
            var style = '';
            var pos = ['left', 'right', 'top', 'bottom'];

            var paddingPropertyName = isLabel ? 'labelpadding' : 'padding';
            var marginPropertyName = isLabel ? 'labelmargin' : 'margin';

            var padding = $.extend({ left: 5, top: 5, right: 5, bottom: 5 }, tool[paddingPropertyName]);
            for (var i in padding)
                padding[i] = !isNaN(padding[i]) ? padding[i] : parseFloat(padding[i].toString());

            var margin = tool[marginPropertyName];

            if (padding) {
                for (var i in pos) {
                    if (padding[pos[i]])
                        style += 'padding-' + pos[i] + ': ' + padding[pos[i]] + 'px;';
                }
            }
            if (margin) {
                for (var i in pos) {
                    if (margin[pos[i]])
                        style += 'margin-' + pos[i] + ': ' + margin[pos[i]] + ';';
                }
            }

            return style;
        },


        _getToolLabelStyle: function (tool) {
            var style = 'display:block;';
            var pos = ['left', 'right', 'top', 'bottom'];

            if (tool.labelheight !== undefined)
                style += 'height: ' + tool.labelheight + ';';
            else
                style += 'height: 100%;';

            if (tool.labelvalign !== undefined)
                style += 'vertical-align: ' + tool.labelvalign + ';';
            else if (tool.valign !== undefined)
                style += 'vertical-align: ' + tool.valign + ';';
            else
                style += 'vertical-align: middle;'

            return style;
        },

        _renderAndInit: function () {
            var html = this._createTemplateHtml();
            this.host.append(html);

            this._initTools();
        },

        refresh: function (initialRefresh) {
            var self = this;
            if (!self._isInitialized || initialRefresh === true)
                return;

            var val = self.val();
            self._destroyElements();

            self._renderAndInit();

            self._prevValue = val;

            self.val(val);
        },

        _createTemplateHtml: function () {
            var groups = this.groups;

            var paddingStyle =
                'padding-left: ' + parseFloat(this.padding.left) + 'px;' +
                'padding-right: ' + parseFloat(this.padding.right) + 'px;' +
                'padding-top: ' + parseFloat(this.padding.top) + 'px;' +
                'padding-bottom: ' + parseFloat(this.padding.bottom) + 'px;';

            // begin form
            var html = "<table id='formWrap' style='background-color: " + this.backgroundColor + "; width: 100%; white-space: nowrap; border: 1px solid " + this.borderColor + ";" + paddingStyle + "' cellpadding='0' cellspacing='0'><div id='formSubmit' style='display:hidden;'><div>";

            var tools = this.template;

            for (var i = 0; i < tools.length; i++) {
                var toolId = "el_" + i;
                var tool = this.template[i];
                var template = this._getToolTemplate(tool, toolId);

                html += template;
            }

            // end form
            html += "</table>";

            return html;
        },

        _beginRow: function (id, height, valign) {
            if (undefined === height)
                height = 'auto';

            if (valign)
                valign = "valign='" + valign + "'";
            else
                valign = "";

            var row = "<tr style='width: 100%; height: " + height + ";' id='rowWrap_" + id + "'" + " " + valign + ">";
            row += "<td style='width: 100%;'><table style='width: 100%; white-space: nowrap; border: 0px;' cellspacing='0' cellpadding='0'><tr style='width: 100%'>";
            return row;
        },

        _endRow: function () {
            return "<td style='width: auto; background: transparent;'> </tr></table></td></tr>";
        },

        _beginColumn: function (width, style) {
            if (!style)
                style = '';

            if (undefined === width)
                width = 'auto';

            var template = "<td style='width:" + width + "; background: transparent;'>";
            template += "<div style='display:block; overflow: visible; width: 100%; background: transparent;'>";

            return template;
        },

        _endColumn: function () {
            return "</div></td>";
        },

        _splitLabelToolWidth: function (tool, isInsideColumn) {
            var toolWidth = isInsideColumn ? 'auto' : tool.columnwidth;
            var labelWidth = tool.labelwidth;

            var toolPadding = $.extend({ left: 5, top: 5, right: 5, bottom: 5 }, tool.padding);
            var labelPadding = $.extend({ left: 5, top: 5, right: 5, bottom: 5 }, tool.labelpadding);
            for (var i in toolPadding)
                toolPadding[i] = !isNaN(toolPadding[i]) ? toolPadding[i] : parseFloat(toolPadding[i].toString());

            for (var i in labelPadding)
                labelPadding[i] = !isNaN(labelPadding[i]) ? labelPadding[i] : parseFloat(labelPadding[i].toString());

            if (tool.label == '' || tool.label == undefined) {
                labelWidth = 0;
                labelPadding = { left: 0, right: 0, top: 0, bottom: 0 };
            }

            if (tool.labelposition == 'top' || tool.labelposition == 'bottom') {
                if (undefined === labelWidth)
                    labelWidth = toolWidth;
                if (undefined === toolWidth)
                    toolWidth = labelWidth;

                if (toolWidth && toolWidth.toString().indexOf('%') != -1 && labelWidth && labelWidth.toString().indexOf('%') != -1) {
                    toolWidth = labelWidth = Math.max(parseFloat(toolWidth), parseFloat(labelWidth)) + '%';
                }
                if (toolWidth && toolWidth.toString().indexOf('%') == -1 && labelWidth && labelWidth.toString().indexOf('%') == -1) {
                    toolWidth = labelWidth = Math.max(parseFloat(toolWidth), parseFloat(labelWidth)) + 'px';
                }

                return [labelWidth, toolWidth]
            }

            // handle left/right positioning
            if (labelWidth === undefined) {
                if (toolWidth !== undefined && toolWidth !== 'auto') {
                    return ['auto', toolWidth];
                }
                else {
                    if (tool.labelposition == 'right') {
                        if (tool.align == 'right' || tool.align == 'center' || tool.align == 'middle')
                            return ['auto', '100%'];

                        return ['100%', 'auto'];
                    }

                    return ['auto', '100%'];
                }
            }
            else if (labelWidth.toString().indexOf('%') !== -1) {
                labelWidth = parseFloat(labelWidth);
                if (toolWidth !== undefined) {
                    if (toolWidth.toString().indexOf('%') !== -1) {
                        toolWidth = parseFloat(toolWidth);
                        return [Math.min(100, labelWidth) + '%', Math.min(toolWidth, 100 - labelWidth) + '%'];
                    }
                    else {
                        toolWidth = parseFloat(toolWidth);
                        return [Math.min(100, labelWidth) + '%', toolWidth];
                    }
                }

                return [Math.min(100, labelWidth) + '%', Math.max(0, 100 - labelWidth) + '%'];
            }
            else {
                labelWidth = parseFloat(labelWidth) + labelPadding.left + labelPadding.right;
                if (toolWidth == undefined)
                    return [labelWidth + 'px', 'calc(100% - ' + labelWidth + 'px)'];

                return [labelWidth + 'px', toolWidth];
            }
        },

        _getToolTemplate: function (toolObject, id, optionIndex, isInsideColumn) {
            var tool = {};
            for (p in toolObject)
                tool[p.toLowerCase()] = toolObject[p];

            if ($.isArray(tool.columns) && isNaN(optionIndex)) {

                var str = this._beginRow(id, tool.rowheight || 'auto');

                for (var i = 0; i < tool.columns.length; i++) {
                    var innerTemplate = this._getToolTemplate(tool.columns[i], (id + "_" + i), undefined, true);

                    var width = 'auto';
                    if (tool.columns[i].columnWidth !== undefined)
                        width = tool.columns[i].columnWidth;
                    else if (tool.columns[i].width !== undefined)
                        width = tool.columns[i].width;

                    str += this._beginColumn(width);
                    str += "<table cellspacing='0' cellpadding='0' style='width: 100%; white-space: nowrap; border: 0px;'>" + innerTemplate + "</table>";
                    str += this._endColumn();
                }
                str += this._endRow();
                return str;
            }

            if (tool.type == 'option' && tool.component != 'jqxDropDownList') {
                if (isNaN(optionIndex)) {
                    var template = this._beginRow(id, tool.rowheight || 'auto', tool.valign);

                    for (var i = 0; i < tool.options.length; i++) {
                        var innerTemplate = this._getToolTemplate(tool, (id + "_option_" + i), i, true);

                        if (tool.optionslayout == 'horizontal') {
                            var width = 100 / Math.max(1, tool.options.length) + '%';
                            if (tool.columnwidth)
                                width = tool.columnwidth;

                            template += this._beginColumn(width);
                            template += "<table cellspacing='0' cellpadding='0' style='width: 100%; white-space: nowrap; border: 0px;'>" + innerTemplate + "</table>";
                            template += this._endColumn();
                        }
                        else
                            template += innerTemplate;
                    }

                    template += this._endRow();
                    return template;
                }
            }

            var labelPosition = tool.labelposition
            var label = tool.label;

            var optionLabel = '';

            if (tool.type == 'option' && tool.component != 'jqxDropDownList' && !isNaN(optionIndex)) {
                var optionLabel = tool.options[optionIndex].label;
                label = optionLabel;
            }

            if (label === undefined)
                label = '';

            var template = '';

            var labelStyle = this._getToolLabelStyle(tool) + this._getPaddingAndMarginStyle(tool, true);
            var toolstyle = this._getToolStyle(tool) + this._getPaddingAndMarginStyle(tool, false);

            var className = '';

            var align = this._getAlignMargin(tool, 'align');

            var labelAlign = 'text-align: left;';
            if (tool.labelalign == 'center' || tool.labelalign == 'middle')
                labelAlign = 'text-align: center';
            else if (tool.labelalign == 'right')
                labelAlign = 'text-align: right';

            var inputAlign = 'text-align: left;';
            if (tool.align == 'center' || tool.align == 'middle')
                inputAlign = 'text-align: center';
            else if (tool.align == 'right')
                inputAlign = 'text-align: right';

            // get the label and tool width portions
            var widths = this._splitLabelToolWidth(tool, isInsideColumn);


            var labelContent = label;

            if (tool.required) {
                var required = "<span class='" + className + "' style='color:red;'>*</span>";
                if (tool.requiredposition) {
                    if (tool.requiredposition.toLowerCase() == 'left')
                        labelContent = required + ' ' + label;
                    else
                        labelContent = label + ' ' + required;
                }
                else
                    labelContent = label + ' ' + required;
            }

            var labelCursor = '';
            if (tool.type == 'boolean' || (tool.type == 'option' && !isNaN(optionIndex))) {
                labelCursor += '; cursor: pointer;';
            }

            var tdLabel = "<div class='" + className + "' style='" + labelStyle + "'><div style='" + labelAlign + labelCursor + ";' id='" + 'label_' + id + "'>" + labelContent + "</div></div>";

            var tdStyle = (tool.info !== undefined && tool.infoposition != 'left') ? 'margin-left: -3px;' : 'margin-right: -3px;'
            var tdInfo = "<div style='" + tdStyle + "' class='" + this.toThemeProperty('jqx-info-icon') + "' title='" + tool.info + "'></div>";

            var tdComponent = "<div style='background: transparent;" + toolstyle + "'><div style='width: auto; height: auto; " + align + "' id='" + id + "'></div></div>";

            if (tool.type == 'text' || tool.type == 'button')
                tdComponent = "<div style='background: transparent;" + toolstyle + inputAlign + "'><input style='width: auto; height: auto; " + align + "' id='" + id + "' type='" + tool.type + "'/></div>";
                //tdComponent = "<div style='background: transparent;" + toolstyle + inputAlign + "'><input id='" + id + "' type='" + tool.type + "'/></div>";
            else if (tool.type == 'password')
                tdComponent = "<div style='background: transparent;" + toolstyle + inputAlign + "'><input type='password' style='width: auto; height: auto; " + align + "' id='" + id + "'/></div>";
            if (tool.type == 'option' && tool.component != 'jqxDropDownList' && !isNaN(optionIndex)) {
                var width = tool.width;
                if (width === undefined)
                    width = '15px';

                widths = [tool.labelwidth || 'auto', width];
                if (tool.labelposition && (tool.labelposition == 'top' || tool.labelposition == 'bottom')) {
                    widths = ['100%', '100%'];
                }

                tdComponent = "<div style='background: transparent;" + toolstyle + align + inputAlign + "'><div style='width: " + width + "; height: 100%; " + align + inputAlign + ";' id='" + id + "'></div></div>";
            }

            if (tool.info !== undefined && tool.info !== '') {
                if (tool.infoposition == 'left')
                    tdComponent = "<table cellspacing='0' cellpadding='0' style='border: 0px; white-space: nowrap;" + align + "'><tr><td>" + tdInfo + "</td><td>" + tdComponent + "</td></tr></table>";
                else
                    tdComponent = "<table cellspacing='0' cellpadding='0' style='border: 0px; white-space: nowrap;" + align + "'><tr><td>" + tdComponent + "</td><td>" + tdInfo + "</td></tr></table>";
            }

            if (labelPosition == 'right') {
                template += this._beginRow(id, tool.rowheight || 'auto', tool.valign);
                template += this._beginColumn(widths[1]);
                template += tdComponent;
                if (label != '') {
                    template += this._endColumn();
                    template += this._beginColumn(widths[0]);
                    template += tdLabel;
                }
                template += this._endColumn();
                template += this._endRow();
            }
            else if (labelPosition == 'top') {
                template += this._beginRow(id, tool.rowheight || 'auto', tool.valign);
                template += this._beginColumn(tool.columnwidth);
                if (label != '') {
                    template += tdLabel;
                }
                template += tdComponent;
                template += this._endColumn();
                template += this._endRow();
            }
            else if (labelPosition == 'bottom') {
                template += this._beginRow(id, tool.rowheight || 'auto', tool.valign);
                template += this._beginColumn(tool.columnwidth);
                template += tdComponent;
                if (label != '') {
                    template += tdLabel;
                }
                template += this._endColumn();
                template += this._endRow();
            }
            else {
                template += this._beginRow(id, tool.rowheight || 'auto', tool.valign);
                if (label != '') {
                    template += this._beginColumn(widths[0]);
                    template += tdLabel;
                    template += this._endColumn();
                }

                template += this._beginColumn(widths[1]);
                template += tdComponent;
                template += this._endColumn();
                template += this._endRow();
            }



            return template;
        },

        _initTools: function (tools, idPrefix) {
            var template = tools || this.template;

            if (undefined == idPrefix)
                idPrefix = '';

            for (var i = 0; i < template.length; i++) {
                var tool = template[i];
                if ($.isArray(tool.columns)) {
                    this._initTools(tool.columns, i + "_");
                    continue;
                }

                var id = idPrefix + i;

                switch (tool.type) {
                    case 'color':
                        this._initColorTool(id);
                        break;
                    case 'option':
                        if (tool.component == 'jqxDropDownList')
                            this._initOptionToolDropDownList(id);
                        else
                            this._initOptionTool(id);
                        break;
                    case 'dropdownlist':
                        this._initOptionToolDropDownList(id);
                        break;
                    case 'number':
                        this._initNumberTool(id);
                        break;
                    case 'boolean': case 'checkbox':
                        this._initBooleanTool(id);
                        break;
                    case 'text':
                        this._initTextTool(id);
                        break;
                    case 'password':
                        this._initPasswordTool(id);
                        break;
                    case 'label':
                        this._initLabelTool(id);
                        break;
                    case 'date': case 'time': case 'datetime':
                        this._initDateTimeTool(id);
                        break;
                    case 'button':
                        this._initButtonTool(id);
                        break;
                    case 'custom':
                        this._initCustomTool(id);
                        break;
                }

                if (tool.visible === false)
                    this._showhideComponent(undefined, id, false);

                if (tool.theme)
                    this._setToolTheme(tool, id);
            }
        },

        _setToolTheme: function (tool, id) {
            var component = this._getComponentById(id);

            var theme = tool.theme || this.theme;

            switch (tool.type) {
                case 'option':
                    if (tool.component == 'jqxDropDownList')
                        component.jqxDropDownList('theme', theme);
                    break;
                case 'number':
                    component.jqxNumberInput('theme', theme);
                    break;
                case 'text':
                    component.jqxInput('theme', theme);
                    break;
                case 'password':
                    component.jqxPasswordInput('theme', theme);
                    break;
            }
        },

        _initOptionTool: function (toolId) {
            var self = this;

            var id = "el_" + toolId;

            var tool = self._getTool(toolId);

            for (var i = 0; i < tool.options.length; i++) {
                var optionId = id + "_option_" + i;
                var el = self.host.find("#" + optionId);
                if (el.length > 0)
                    el.jqxRadioButton({width:25, theme: self.theme, groupName: 'group_' + toolId }).on('change', function (event) { self._onChangeHandler(event); });

                var inputLabel = self.host.find('#label_' + optionId);
                inputLabel.data('el', el);
                inputLabel.on('mousedown', function (event) {
                    var el = $(this).data('el');
                    el.jqxRadioButton('toggle');
               });

            }
        },

        _initOptionToolDropDownList: function (toolId) {
            var self = this;

            var id = "el_" + toolId;

            var tool = self._getTool(toolId);

            var dropDownList = this.host.find("#" + id);

            var itemTemplateStart = "<div style=\"height: 20px;\"></div>";

            var source = [];

            if (tool.options && $.isArray(tool.options)) {
                for (var i = 0; i < tool.options.length; i++)
                    source.push(tool.options[i]);
            }

            if (tool.init)
                tool.init(dropDownList);
            else {
                var width = isNaN(parseFloat(tool.width)) ? 'auto' : tool.width;

                if (tool.width && tool.width.toString().indexOf('%') != -1 && tool.columnwidth === undefined)
                    width = '100%';

                var height = isNaN(parseFloat(tool.height)) ? '30px' : tool.height;
                dropDownList.jqxDropDownList({ theme: self.theme, width: width || 'auto', autoDropDownHeight: true, height: height, enableBrowserBoundsDetection: true, source: source, selectedIndex: 0 });
            }


            dropDownList.on('change', function (event) {
                self._onChangeHandler(event);
            });
        },

        _initNumberTool: function (toolId) {
            var self = this;

            var id = "el_" + toolId;

            var tool = self._getTool(toolId);

            var numberInput = this.host.find("#" + id);

            if (tool.init)
                tool.init(numberInput);
            else {
                var width = isNaN(parseFloat(tool.width)) ? 'auto' : tool.width;
                var height = isNaN(parseFloat(tool.height)) ? '30px' : tool.height;

                numberInput.jqxNumberInput({ theme: self.theme, width: width, height: height, inputMode: 'simple' });
            }

            numberInput.on('change', function (event) { self._onChangeHandler(event); });
        },

        _initBooleanTool: function (toolId) {
            var self = this;

            var id = "el_" + toolId;

            var tool = self._getTool(toolId);

            var booleanInput = this.host.find("#" + id);

            if (tool.init)
                tool.init(booleanInput);
            else {
                var width = isNaN(parseFloat(tool.width)) ? 'auto' : tool.width;
                var height = isNaN(parseFloat(tool.height)) ? '30px' : tool.height;

                var isThreeState = tool.isThreeState == true;

                if (tool.component === undefined || tool.component == 'jqxCheckBox') {
                    booleanInput.jqxCheckBox({ theme: self.theme, width: width, height: height, hasThreeStates: isThreeState });
                }
                else {
                    return;
                }
            }

            booleanInput.on('change', function (event) { self._onChangeHandler(event); });

            var booleanInputLabel = self.host.find('#label_' + id);
            booleanInputLabel.on('mousedown', function (event) {
                var val = self.host.find('#' + id).val();
                self.host.find('#' + id).val(!val);
            });
        },



        _initTextTool: function (toolId) {
            var self = this;

            var id = "el_" + toolId;

            var tool = self._getTool(toolId);

            var input = this.host.find("#" + id);

            if (tool.init)
                tool.init(input);
            else {
                var width = isNaN(parseFloat(tool.width)) ? 'auto' : tool.width;
                var height = isNaN(parseFloat(tool.height)) ? '30px' : tool.height;

                input.jqxInput({ theme: self.theme, width: width, height: height });
            }

            input.on('change', function (event) { self._onChangeHandler(event); });
        },

        _initLabelTool: function (toolId) {
            var self = this;

            var id = "el_" + toolId;

            var tool = self._getTool(toolId);

            var element = this.host.find("#" + id);

            if (tool.render && $.isFunction(tool.render)) {
                var html = tool.render();
                element.html(html || '');
            }
        },

        _getTool: function (toolId) {
            var self = this;

            var parts = toolId.split('_');
            var parentTool = self.template[parts[0]];
            if (parts[1]) {
                if ($.isArray(parentTool.columns) && parentTool.columns.length > parts[1])
                    return parentTool.columns[parts[1]];

                return undefined;
            }

            return parentTool;
        },

        _initCustomTool: function (toolId) {
            var self = this;

            var id = "el_" + toolId;

            var tool = self._getTool(toolId);

            var toolElement = this.host.find("#" + id);

            if (tool.init)
                tool.init(toolElement);
        },

        _initButtonTool: function (toolId) {
            var self = this;

            var id = "el_" + toolId;

            var tool = self._getTool(toolId);

            var button = this.host.find("#" + id);

            if (tool.init)
                tool.init(button);
            else {
                var width = isNaN(parseFloat(tool.width)) ? 'auto' : tool.width;
                var height = isNaN(parseFloat(tool.height)) ? '30px' : tool.height;

                button.jqxButton({ theme: self.theme, width: width, height: height });
                button.val(tool.text === undefined ? 'Button' : tool.text);
            }

            this.host.find("#" + id).on('click', function (event) {
                self._onButtonClick(button, tool);
            }
            );
        },


        _initPasswordTool: function (toolId) {
            var self = this;

            var id = "el_" + toolId;

            var tool = self._getTool(toolId);

            var input = this.host.find("#" + id);
     //       input.css({ 'padding-left': 0, 'padding-right': 0 });

            if (tool.init)
                tool.init(input);
            else {
                var width = isNaN(parseFloat(tool.width)) ? 'auto' : tool.width;
                var height = isNaN(parseFloat(tool.height)) ? '25px' : tool.height;

                input.jqxPasswordInput({ theme: self.theme, width: width, height: height });
            }

            input.on('change', function (event) { self._onChangeHandler(event); });
        },

        _initDateTimeTool: function (toolId) {
            var self = this;

            var id = "el_" + toolId;

            var tool = self._getTool(toolId);

            var input = this.host.find("#" + id);
    //        input.css({ 'padding-left': 0, 'padding-right': 0 });

            if (tool.init)
                tool.init(input);
            else {
                var width = isNaN(parseFloat(tool.width)) ? 'auto' : tool.width;
                var height = isNaN(parseFloat(tool.height)) ? '30px' : tool.height;

                var formatString = tool.formatString;
                if (!formatString) {
                    if (tool.type == 'time')
                        formatString = 'hh mm ss tt';
                    else if (tool.type == 'date')
                        formatString = 'MM/dd/yyyy';
                    else
                        formatString = 'MM/dd/yyyy hh:mm:ss tt';

                }

                input.jqxDateTimeInput({ theme: self.theme, width: width, height: height, formatString: formatString, showTimeButton: tool.type != 'date', showCalendarButton: tool.type != 'time' });
            }

            input.on('valueChanged', function (event) { self._onChangeHandler(event); });
        },

        getComponentByName: function (name) {
            if (!$.isArray(this.template))
                return undefined;

            for (var i = 0; i < this.template.length; i++) {
                if (this.template[i].name == name)
                    return this._getComponentById(i);

                if ($.isArray(this.template[i].columns)) {
                    for (var j = 0; j < this.template[i].columns.length; j++) {
                        if (this.template[i].columns[j].name == name)
                            return this._getComponentById(i + "_" + j);
                    }

                }
            }

            return undefined;
        },

        _getComponentById: function (id) {
            var component = this.host.find('#el_' + id);

            return component;
        },

        _getComponentLabelById: function (id) {
            var component = this.host.find('#label_el_' + id);

            return component;
        },

        hideComponent: function(name)
        {
            this._showhideComponent(name, undefined, false);
        },

        showComponent: function (name) {
            this._showhideComponent(name, undefined, true);
        },

        _showhideComponent: function (name, id, show)
        {
            if (!$.isArray(this.template))
                return;

            var index = '';
            if (id === undefined) {
                for (var i = 0; i < this.template.length; i++) {
                    if (this.template[i].name == name) {
                        index = i;
                        break;
                    }
                    if ($.isArray(this.template[i].columns)) {
                        for (var j = 0; j < this.template[i].length; j++) {
                            if (this.template[i].columns[j].name == name) {
                                index = i + "_" + j;
                                break;
                            }
                        }
                    }
                }
            }
            else
            {
                index = id;
            }

            if (index != '') {
                var toolWrapper = this.host.find('#rowWrap_el_' + index);
                if (toolWrapper && toolWrapper.length != 0) {
                    if (show)
                        toolWrapper.show();
                    else
                        toolWrapper.hide();
                }
            }
        }
    });

})(jqxBaseFramework);






