'use strict';

const widgetNames = [
    'JqxBarGauge', 'JqxBulletChart', 'JqxButtonGroup', 'JqxButtons', 'JqxCalendar', 'JqxChart', 'JqxCheckBox',
    'JqxColorPicker', 'JqxComboBox', 'JqxComplexInput', 'JqxDataTable', 'JqxDateTimeInput', 'JqxDocking',
    'JqxDockingLayout', 'JqxDockPanel', 'JqxDragDrop', 'JqxDraw', 'JqxDropDownButton', 'JqxDropDownList',
    'JqxEditor', 'JqxExpander', 'JqxFileUpload', 'JqxForm', 'JqxFormattedInput', 'JqxGauge', 'JqxGrid',
    'JqxInput', 'JqxKanban', 'JqxKnob', 'JqxLayout', 'JqxLinearGauge', 'JqxLinkButton', 'JqxListBox',
    'JqxListMenu', 'JqxLoader', 'JqxMaskedInput', 'JqxMenu', 'JqxNavBar', 'JqxNavigationBar',
    'JqxNotification', 'JqxNumberInput', 'JqxPanel', 'JqxPasswordInput', 'JqxPivotDesigner',
    'JqxPivotGrid', 'JqxPopover', 'JqxProgressBar', 'JqxRadioButton', 'JqxRangeSelector',
    'JqxRating', 'JqxRepeatButton', 'JqxResponsivePanel', 'JqxRibbon', 'JqxScheduler',
    'JqxScrollBar', 'JqxScrollView', 'JqxSlider', 'JqxSortable', 'JqxSplitter',
    'JqxSwitchButton', 'JqxTabs', 'JqxTagCloud', 'JqxToggleButton', 'JqxTextArea',
    'JqxToolBar', 'JqxToolTip', 'JqxTree', 'JqxTreeGrid', 'JqxTreeMap',
    'JqxValidator', 'JqxWindow', 'JqxHeatMap', 'JqxTimePicker'
];

(function init() {
    for (const name of widgetNames) {
        const inFile = `json/${name}.json`;
        const outFile = `../library/jqwidgets-blazor/Components/${name}.razor`;

        processJSON(inFile, outFile);
    }
})();

function getTemplate(widgetName) {
    let template = '<div id="@componentID">@ChildContent</div>';

    if (widgetName === 'JqxButton' || widgetName === 'JqxToggleButton') {
        template = '<button id="@componentID">@ChildContent</button>';
    }
    else if (widgetName === 'JqxComplexInput') {
        template = '<div id="@componentID" style="display: inline-flex;"><input><div>@ChildContent</div></div>';
    }
    else if (widgetName === 'JqxDateTimeInput' || widgetName === 'JqxMaskedInput' || widgetName === 'JqxNumberInput') {
        template = '<input id="@componentID">';
    }
    else if (widgetName === 'JqxInput') {
        template = '<input id="@componentID" type="text" >';
    }
    else if (widgetName === 'JqxFormattedInput') {
        template = '<div id="@componentID"><input type="text"><div></div><div></div></div>';
    }
    else if (widgetName === 'JqxPasswordInput') {
        template = '<input id="@componentID" type="password">';
    }

    return template;
}

// width/height
function getDataType(widgetName, type) {
    if (type &&
        type.indexOf(widgetName) === -1 &&
        type.indexOf('=>') === -1 &&
        type.indexOf('enum') === -1 &&
        type.indexOf('date') === -1 &&
        type.indexOf('Date') === -1) {
        type = type
            .toLowerCase()
            .replace(/int/g, 'double')
            .replace(/number/g, 'double')
            .replace(/boolean/g, 'bool')
            .replace(/any/g, 'object')
            .replace(/none/g, 'void');

        if (type.indexOf('array') !== -1 || type.indexOf('[') !== -1) {
            if (type.indexOf('|') !== -1) {
                return 'object[]';
            }

            if (type.indexOf('string') !== -1) {
                return 'string[]';
            }

            if (type.indexOf('double') !== -1) {
                return 'double[]';
            }

            if (type.indexOf('bool') !== -1) {
                return 'bool[]';
            }

            return 'object[]';
        }

        if (type.indexOf('|') !== -1) {
            return 'object';
        }

        return type;
    }

    return 'object';
}

function processJSON(inFile, outFile) {
    const fs = require(`fs`);
    const data = fs.readFileSync(inFile);

    if (!data) {
        console.log(`No data available!`);
        return false;
    }

    let outData = '';
    const obj = JSON.parse(data);
    const widgetName = obj['widget'].name;
    const widgetNameWithoutJqx = widgetName.slice(3);

    outData += `@using System.Text.Json;\n`;
    outData += `@inject IJSRuntime JSRuntime;\n\n`;

    outData += getTemplate(widgetName);
    outData += `\n\n`;

    outData += `@code {\n`;

    let paramsToBlock = '    private string[] paramsToBlock = { "ChildContent", ';
    // Start Widget Properties
    const forbiddenPropertieNames = {
        checked: { okName: 'isChecked' },
        readonly: { okName: 'isReadonly' },
        decimal: { okName: 'isDecimal' },
        onDragEnd: { okName: 'dragEnd' },
        onDrag: { okName: 'drag' },
        onDragStart: { okName: 'dragStart' },
        onTargetDrop: { okName: 'targetDrop' },
        onDropTargetEnter: { okName: 'dropTargetEnter' },
        onDropTargetLeave: { okName: 'dropTargetLeave' },
    };
         
    for (const property of obj.properties) {
        const jsonDataType = property.ts_dataType ? property.ts_dataType : property.dataType;
        const dataType = getDataType(widgetNameWithoutJqx, jsonDataType);
        let propertyNameValidated = property.name;

        if (forbiddenPropertieNames[property.name]) {
            propertyNameValidated = forbiddenPropertieNames[property.name].okName;
        }

        outData += `    [Parameter]\n`;
        outData += `    public ${dataType} ${propertyNameValidated} {\n`;
        outData += `        get { return getterProp<${dataType}>("${property.name}"); }\n`;
        outData += `        set { setterProp("${property.name}", value); }\n`;
        outData += `    }\n\n`;
    }

    outData += `    [Parameter]\n`;
    outData += `    public object options { get; set; }\n\n`;

    if (obj.events) {
        for (const event of obj.events) {
            let eventNameWithOn = 'on' + event.name.charAt(0).toUpperCase() + event.name.slice(1);

            paramsToBlock += `"${eventNameWithOn}", `;
    
            outData += `    [Parameter]\n`;
            outData += `    public Action<IDictionary<string, object>> ${eventNameWithOn} { get; set; }\n\n`;
        }
    }
    // End Widget Properties


    // Start Internal Properties
    outData += `    [Parameter]\n`;
    outData += `    public RenderFragment ChildContent { get; set; }\n\n`;

    paramsToBlock = paramsToBlock.slice(0, paramsToBlock.length - 2);
    outData += paramsToBlock + ` };\n\n`;

    outData += `    private IDictionary<string, string> paramsToChange = new Dictionary<string, string>\n`;
    outData += `    {\n`;
    let index = 0;
    for (const name in forbiddenPropertieNames) {
        if (name) {
            outData += `        { "${forbiddenPropertieNames[name].okName}", "${name}" }`;
        }

        if (index < Object.keys(forbiddenPropertieNames).length - 1) {
            outData += `,`;
        }

        outData += `\n`;
        index++;
    }
    outData += `    };\n\n`;

    outData += `    private bool shouldSetters;\n\n`;

    outData += `    private string componentID;\n\n`;

    outData += `    private IDictionary<string, object> initialOptions = new Dictionary<string, object>();\n\n`;
    // End Internal Properties


    // Start Widget Methods
    if (obj.methods) {
        const forbiddenAgrumentNames = {
            checked: { okName: 'isChecked' },
            object: { okName: 'obj' },
            event: { okName: 'e' }
        };

        for (const method of obj.methods) {
            const jsonDataType = method.ts_returnDataType ? method.ts_returnDataType : method.returnDataType;
            const dataType = getDataType(widgetNameWithoutJqx, jsonDataType);
            let methodArguments = '';
            let methodArgumentsNames = ', ';
    
            if (method.arguments) {
                for (const argument of method.arguments) {
                    let argumentNameValidated = argument.name;

                    if (argument.name.toLowerCase() === 'none') {
                        break;
                    }

                    if (forbiddenAgrumentNames[argument.name]) {
                        argumentNameValidated = forbiddenAgrumentNames[argument.name].okName;
                    }
    
                    const jsonDataType = argument.ts_dataType ? argument.ts_dataType : argument.dataType;
                    const dataType = getDataType(widgetNameWithoutJqx, jsonDataType);
    
                    methodArguments += `${dataType} ${argumentNameValidated}, `;
                    methodArgumentsNames += `${argumentNameValidated}, `;
                }
            }
    
            methodArguments = methodArguments.slice(0, methodArguments.length - 2);
            methodArgumentsNames = methodArgumentsNames.slice(0, methodArgumentsNames.length - 2);
            
            if (dataType !== 'void') {
                outData += `    public ${dataType} ${method.name}()\n`;
                outData += `    {\n`;
                outData += `        return getterMethod<${dataType}>("${method.name}");\n`;
                outData += `    }\n\n`;
            }
    
            if (dataType === 'void' || methodArguments.length !== 0) {
                outData += `    public void ${method.name}(${methodArguments})\n`;
                outData += `    {\n`;
                outData += `        setterMethod("${method.name}"${methodArgumentsNames});\n`;
                outData += `    }\n\n`;
            }
        }
    }

    outData += `    public IDictionary<string, object> getOptions()\n`;
    outData += `    {\n`;
    outData += `        shouldSetters = false;\n`;
    outData += `        return ((IJSInProcessRuntime)JSRuntime).Invoke<IDictionary<string, object>>("jqxBlazor.getOptions", this);\n`;
    outData += `    }\n\n`;

    outData += `    public void setOptions(object options)\n`;
    outData += `    {\n`;
    outData += `        shouldSetters = false;\n`;
    outData += `        ((IJSInProcessRuntime)JSRuntime).InvokeVoid("jqxBlazor.setOptions", componentID, options);\n`;
    outData += `    }\n\n`;
    // End Widget Methods


    // Start Internal Methods
    outData += `    public override async Task SetParametersAsync(ParameterView parameters)\n`;
    outData += `    {\n`;
    outData += `        await base.SetParametersAsync(parameters);\n\n`;
    outData += `        foreach(var parameter in parameters.ToDictionary())\n`;
    outData += `        {\n`;
    outData += `            var key = parameter.Key;\n`;
    outData += `            var value = parameter.Value;\n\n`;
    outData += `            if (!paramsToBlock.Contains(key))\n`;
    outData += `            {\n`;
    outData += `                if (paramsToChange.ContainsKey(key))\n`;
    outData += `                {\n`;
    outData += `                    key = paramsToChange[key];\n`;
    outData += `                }\n\n`;
    outData += `                initialOptions[key] = value;\n`;
    outData += `            }\n`;
    outData += `        }\n\n`;
    outData += `        shouldSetters = true;\n`;
    outData += `    }\n\n`;

    outData += `    protected override void OnInitialized()\n`;
    outData += `    {\n`;
    outData += `        componentID = ((IJSInProcessRuntime)JSRuntime).Invoke<string>("jqxBlazor.generateID");\n`;
    outData += `    }\n\n`;

    outData += `    protected override void OnAfterRender(bool firstRender)\n`;
    outData += `    {\n`;
    outData += `        if (firstRender)\n`;
    outData += `        {\n`;
    outData += `            ((IJSInProcessRuntime)JSRuntime).InvokeVoid("jqxBlazor.createComponent", componentID, "${widgetName}", initialOptions);\n`;
    outData += `            attachEvents();\n`;
    outData += `        }\n`;
    outData += `    }\n\n`;
    
    outData += `    private void attachEvents()\n`;
    outData += `    {\n`;
    if (obj.events) {
        for (const event of obj.events) {
            let eventNameWithOn = 'on' + event.name.charAt(0).toUpperCase() + event.name.slice(1);

            outData += `        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "${event.name}", "emit${widgetNameWithoutJqx}Event", DotNetObjectReference.Create(new EventsHandler(${eventNameWithOn})));\n`; 
        }
    }
    outData += `    }\n\n`;

    outData += `    private T getterProp<T>(string name)\n`;
    outData += `    {\n`;
    outData += `        shouldSetters = false;\n`;
    outData += `        return ((IJSInProcessRuntime)JSRuntime).Invoke<T>("jqxBlazor.manageProps", componentID, name);\n`;
    outData += `    }\n\n`;

    outData += `    private void setterProp(string name, object value)\n`;
    outData += `    {\n`;
    outData += `        if (shouldSetters)\n`;
    outData += `        {\n`;
    outData += `            ((IJSInProcessRuntime)JSRuntime).InvokeVoid("jqxBlazor.manageProps", componentID, name, value);\n`;
    outData += `        }\n`;
    outData += `    }\n\n`;

    outData += `    private T getterMethod<T>(string name)\n`;
    outData += `    {\n`;
    outData += `        shouldSetters = false;\n`;
    outData += `        return ((IJSInProcessRuntime)JSRuntime).Invoke<T>("jqxBlazor.manageMethods", componentID, name);\n`;
    outData += `    }\n\n`;

    outData += `    private void setterMethod(string name, params object[] args)\n`;
    outData += `    {\n`;
    outData += `        shouldSetters = false;\n`;
    outData += `        ((IJSInProcessRuntime)JSRuntime).InvokeVoid("jqxBlazor.manageMethods", componentID, name, args);\n`;
    outData += `    }\n\n`;

    if (obj.events) {
        outData += `    public class EventsHandler\n`;
        outData += `    {\n`;
        outData += `        private Action<IDictionary<string, object>> componentEvent;\n\n`;
        outData += `        public EventsHandler(Action<IDictionary<string, object>> e)\n`;
        outData += `        {\n`;
        outData += `            componentEvent = e;\n`;
        outData += `        }\n\n`;
        outData += `        [JSInvokable]\n`;
        outData += `        public void emit${widgetNameWithoutJqx}Event(object e)\n`;
        outData += `        {\n`;
        outData += `            if (componentEvent != null)\n`;
        outData += `            {\n`;
        outData += `                var eventAsJson = JsonSerializer.Serialize(e);\n`;
        outData += `                var eventAsDictionary = JsonSerializer.Deserialize<IDictionary<string, object>>(eventAsJson);\n\n`;
        outData += `                componentEvent.Invoke(eventAsDictionary);\n`;
        outData += `            }\n`;
        outData += `        }\n`;
        outData += `    }\n`;
    }
    // End Internal Methods

    outData += `}\n`;

    try {
        fs.writeFileSync(outFile, outData, 'utf8');
    } catch (error) {
        console.error(error);
    }

    return true;
};
