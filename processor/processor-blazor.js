`use strict`;

const fs = require(`fs`);

const widgets = [
    `JqxBarGauge`, `JqxBulletChart`, `JqxButtonGroup`, `JqxButtons`, `JqxCalendar`, `JqxChart`, `JqxCheckBox`,
    `JqxColorPicker`, `JqxComboBox`, `JqxComplexInput`, `JqxDataTable`, `JqxDateTimeInput`, `JqxDocking`,
    `JqxDockingLayout`, `JqxDockPanel`, `JqxDragDrop`, `JqxDraw`, `JqxDropDownButton`, `JqxDropDownList`,
    `JqxEditor`, `JqxExpander`, `JqxFileUpload`, `JqxForm`, `JqxFormattedInput`, `JqxGauge`, `JqxGrid`,
    `JqxInput`, `JqxKanban`, `JqxKnob`, `JqxLayout`, `JqxLinearGauge`, `JqxLinkButton`, `JqxListBox`,
    `JqxListMenu`, `JqxLoader`, `JqxMaskedInput`, `JqxMenu`, `JqxNavBar`, `JqxNavigationBar`,
    `JqxNotification`, `JqxNumberInput`, `JqxPanel`, `JqxPasswordInput`, `JqxPivotDesigner`,
    `JqxPivotGrid`, `JqxPopover`, `JqxProgressBar`, `JqxRadioButton`, `JqxRangeSelector`,
    `JqxRating`, `JqxRepeatButton`, `JqxResponsivePanel`, `JqxRibbon`, `JqxScheduler`,
    `JqxScrollBar`, `JqxScrollView`, `JqxSlider`, `JqxSortable`, `JqxSplitter`,
    `JqxSwitchButton`, `JqxTabs`, `JqxTagCloud`, `JqxToggleButton`, `JqxTextArea`,
    `JqxToolBar`, `JqxToolTip`, `JqxTree`, `JqxTreeGrid`, `JqxTreeMap`,
    `JqxValidator`, `JqxWindow`, `JqxHeatMap`, `JqxTimePicker`
];

const widgetsWithDynamicMarkup = [
    `jqxformattedinput`
];

(function() {
    console.log('\x1b[32m%s\x1b[0m', '--------------------------------------');
    console.log('\x1b[32m%s\x1b[0m', '   START GENERATING LIBRARY AND API!  ');
    console.log('\x1b[32m%s\x1b[0m', '--------------------------------------');

    for (let widgetName of widgets) {
        const inFile = `json/${widgetName}.json`;

        if (widgetName === 'JqxButtons') {
            widgetName = 'JqxButton';
        }

        const outFile = `../library/jqwidgets-blazor/Components/${widgetName}.razor`;

        const { propertiesForAPI, eventsForAPI, methodsForAPI } = generateLibrary(inFile, outFile);

        generateAPI(widgetName, propertiesForAPI, eventsForAPI, methodsForAPI);
    }

    console.log('\x1b[32m%s\x1b[0m', '--------------------------------------');
    console.log('\x1b[32m%s\x1b[0m', '   DONE GENERATING LIBRARY AND API!   ');
    console.log('\x1b[32m%s\x1b[0m', '--------------------------------------');
})();

function generateLibrary(inFile, outFile) {
    const data = fs.readFileSync(inFile);

    if (!data) {
        console.log(`No data available!`);

        return;
    }

    let outData = ``;
    const obj = JSON.parse(data);
    const widget = obj[`widget`].name;
    const widgetToLowerCase = widget.toLowerCase();
    const widgetWithoutJqx = widget.slice(3);
    const isWidgetWithDynamicMarkup = widgetsWithDynamicMarkup.indexOf(widgetToLowerCase) !== -1;

    const propertiesForAPI = [];
    const eventsForAPI = [];
    const methodsForAPI = [];

    outData += `@using System.Text.Json;\n`;
    outData += `@inject IJSRuntime JSRuntime;\n\n`;
    
    if (isWidgetWithDynamicMarkup) {
        outData += `@((MarkupString)componentMarkup)`;
    } else {
        outData += getMarkup(widget);
    }

    outData += `\n\n`;

    outData += `@code {\n\n`;

    let paramsToBlock = `    private string[] paramsToBlock = { "onComponentReady", "ChildContent", `;
    // Start Widget Properties
    const forbiddenPropertieNames = {
        checked: { okName: `isChecked` },
        readonly: { okName: `isReadonly` },
        decimal: { okName: `isDecimal` },
        onDragEnd: { okName: `dragEnd` },
        onDrag: { okName: `drag` },
        onDragStart: { okName: `dragStart` },
        onTargetDrop: { okName: `targetDrop` },
        onDropTargetEnter: { okName: `dropTargetEnter` },
        onDropTargetLeave: { okName: `dropTargetLeave` },
    };

    for (const property of obj.properties) {
        const jsonDataType = property.ts_dataType ? property.ts_dataType : property.dataType;
        const dataType = getDataType(widgetWithoutJqx, jsonDataType);
        let propertyNameValidated = property.name;

        if (forbiddenPropertieNames[property.name]) {
            propertyNameValidated = forbiddenPropertieNames[property.name].okName;
        }

        outData += `    [Parameter]\n`;
        outData += `    public ${dataType} ${propertyNameValidated} {\n`;
        outData += `        get { return getterProp<${dataType}>("${property.name}"); }\n`;
        outData += `        set { setterProp("${property.name}", value); }\n`;
        outData += `    }\n\n`;

        const description = property.description ? getApiDescription(property.description) : '';

        propertiesForAPI.push({
            name: propertyNameValidated,
            type: dataType,
            description
        })
    }

    outData += `    [Parameter]\n`;
    outData += `    public object options { get; set; }\n\n`;

    if (obj.events) {
        for (const event of obj.events) {
            let eventNameWithOn = `on` + event.name.charAt(0).toUpperCase() + event.name.slice(1);

            paramsToBlock += `"${eventNameWithOn}", `;
    
            outData += `    [Parameter]\n`;
            outData += `    public Action<IDictionary<string, object>> ${eventNameWithOn} { get; set; }\n\n`;

            const description = event.description ? getApiDescription(event.description) : '';

            eventsForAPI.push({
                name: eventNameWithOn,
                description
            })
        }
    }
    // End Widget Properties


    // Start Internal Properties
    outData += `    [Parameter]\n`;
    outData += `    public Action onComponentReady { get; set; }\n\n`;

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

    if (isWidgetWithDynamicMarkup) {
        outData += `    private string componentMarkup;\n\n`;
    }

    outData += `    private IDictionary<string, object> initialOptions = new Dictionary<string, object>();\n\n`;
    // End Internal Properties


    // Start Widget Methods
    if (obj.methods) {
        const forbiddenAgrumentNames = {
            checked: { okName: `isChecked` },
            object: { okName: `obj` },
            event: { okName: `e` }
        };

        const methodsWithCustomImplementation = {
            jqxformattedinput: [`val`]
        };
        const methodsWhichAreBothGettersAndSetters = [ `val` ];

        for (const method of obj.methods) {
            if (methodsWithCustomImplementation[widgetToLowerCase] && methodsWithCustomImplementation[widgetToLowerCase].indexOf(method.name) !== -1) {
                outData += getMethodsWithCustomImplementation(widgetToLowerCase, method.name);
            } else {
                const jsonDataType = method.ts_returnDataType ? method.ts_returnDataType : method.returnDataType;
                const dataType = getDataType(widgetWithoutJqx, jsonDataType);
                let methodArguments = ``;
                let methodArgumentsNames = `, `;
        
                if (method.arguments) {
                    for (const argument of method.arguments) {
                        let argumentNameValidated = argument.name;
    
                        if (argument.name.toLowerCase() === `none`) {
                            break;
                        }

                        if (forbiddenAgrumentNames[argument.name]) {
                            argumentNameValidated = forbiddenAgrumentNames[argument.name].okName;
                        }
        
                        const jsonDataType = argument.ts_dataType ? argument.ts_dataType : argument.dataType;
                        const dataType = getDataType(widgetWithoutJqx, jsonDataType);
        
                        methodArguments += `${dataType} ${argumentNameValidated}, `;
                        methodArgumentsNames += `${argumentNameValidated}, `;
                    }
                }
        
                methodArguments = methodArguments.slice(0, methodArguments.length - 2);
                methodArgumentsNames = methodArgumentsNames.slice(0, methodArgumentsNames.length - 2);

                const description = method.description ? getApiDescription(method.description) : '';

                if (methodsWhichAreBothGettersAndSetters.indexOf(method.name) !== -1) {
                    outData += `    public ${dataType} ${method.name}()\n`;
                    outData += `    {\n`;
                    outData += `        return getterMethod<${dataType}>("${method.name}");\n`;
                    outData += `    }\n\n`;

                    outData += `    public void ${method.name}(${methodArguments})\n`;
                    outData += `    {\n`;
                    outData += `        setterMethod("${method.name}"${methodArgumentsNames});\n`;
                    outData += `    }\n\n`;

                    methodsForAPI.push({
                        name: method.name,
                        type: `<span style="color: #0b559b">[SET]</span> void <span style="color: #0b559b">[GET]</span> ${dataType}`,
                        arguments: `<span style="color: #0b559b">[SET]</span> (${methodArguments}) <span style="color: #0b559b">[GET]</span> ()`,
                        description
                    });
                } else {
                    if (dataType !== `void`) {
                        outData += `    public ${dataType} ${method.name}(${methodArguments})\n`;
                        outData += `    {\n`;
                        outData += `        return getterMethod<${dataType}>("${method.name}"${methodArgumentsNames});\n`;
                        outData += `    }\n\n`;

                        methodsForAPI.push({
                            name: method.name,
                            type: `${dataType}`,
                            arguments: `(${methodArguments})`,
                            description
                        });
                    }
            
                    if (dataType === `void`) {
                        outData += `    public void ${method.name}(${methodArguments})\n`;
                        outData += `    {\n`;
                        outData += `        setterMethod("${method.name}"${methodArgumentsNames});\n`;
                        outData += `    }\n\n`;

                        methodsForAPI.push({
                            name: method.name,
                            type: `void`,
                            arguments: `(${methodArguments})`,
                            description
                        });
                    }
                }
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
    if (isWidgetWithDynamicMarkup) {
        outData += `        getMarkup();\n`;
    }
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
    outData += `            ((IJSInProcessRuntime)JSRuntime).InvokeVoid("jqxBlazor.createComponent", componentID, "${widget}", initialOptions);\n\n`;
    outData += `            Task.Delay(200).ContinueWith((action) =>\n`;
    outData += `            {\n`;
    outData += `                attachEvents();\n`;
    outData += `                onComponentReady?.Invoke();\n`;
    outData += `            }); \n`;
    outData += `        }\n`;
    outData += `    }\n\n`;
    
    outData += `    private void attachEvents()\n`;
    outData += `    {\n`;
    if (obj.events) {
        for (const event of obj.events) {
            let eventNameWithOn = `on` + event.name.charAt(0).toUpperCase() + event.name.slice(1);

            outData += `        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "${event.name}", "emit${widgetWithoutJqx}Event", DotNetObjectReference.Create(new EventsHandler(${eventNameWithOn})));\n`; 
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

    outData += `    private T getterMethod<T>(string name, params object[] args)\n`;
    outData += `    {\n`;
    outData += `        shouldSetters = false;\n`;
    outData += `        return ((IJSInProcessRuntime)JSRuntime).Invoke<T>("jqxBlazor.manageMethods", componentID, name, args);\n`;
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
        outData += `        public void emit${widgetWithoutJqx}Event(object e)\n`;
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

    if (isWidgetWithDynamicMarkup) {
        outData += getDynamicMarkup(widgetToLowerCase);
    }
    // End Internal Methods

    outData += `\n}\n`;

    // create library file
    fs.writeFileSync(outFile, outData, `utf8`);

    console.log('\x1b[34m%s\x1b[36m\%s\x1b[0m', '[Library] ', widgetWithoutJqx);

    return { propertiesForAPI, eventsForAPI, methodsForAPI };
};

function getMarkup(widget) {
    let markup;

    switch (widget) {
        case `jqxbutton` || `jqxtogglebutton`:
            markup = `<button id="@componentID">@ChildContent</button>`;
            break;
        case `jqxcomplexinput`:
            markup = `<div id="@componentID"><input><div>@ChildContent</div></div>`;
            break;
        case `jqxdatetimeinput` || `jqxmaskedinput` || `jqxnumberinput`:
            markup = `<input id="@componentID">`;
            break;
        case `jqxinput`:
            markup = `<input id="@componentID">`;
            break;
        case `jqxpasswordinput`:
            markup = `<input id="@componentID" type="password">`;
            break;
        default:
            markup = `<div id="@componentID">@ChildContent</div>`;
    }

    return markup;
}

function getDynamicMarkup(widget) {
    let outData = '';

    if (widget === 'jqxformattedinput') {
        outData += `    private void getMarkup()\n`;
        outData += `    {\n`;
        outData += `        object rtl;\n`;
        outData += `        initialOptions.TryGetValue("rtl", out rtl);\n\n`;
        outData += `        object dropDown;\n`;
        outData += `        initialOptions.TryGetValue("dropDown", out dropDown);\n\n`;
        outData += `        object spinButtons;\n`;
        outData += `        initialOptions.TryGetValue("spinButtons", out spinButtons);\n\n`;
        outData += `        if ((bool)rtl && (bool)dropDown && (bool)spinButtons)\n`;
        outData += `        {\n`;
        outData += `            componentMarkup = "<div id='" + componentID + "'><div></div><div></div><input></div>";\n`;
        outData += `            return;\n`;
        outData += `        }\n\n`;
        outData += `        if (!(bool)rtl && (bool)dropDown && (bool)spinButtons)\n`;
        outData += `        {\n`;
        outData += `            componentMarkup = "<div id='" + componentID + "'><input><div></div><div></div></div>";\n`;
        outData += `            return;\n`;
        outData += `        }\n\n`;
        outData += `        if (((bool)rtl && (bool)dropDown) || ((bool)rtl && (bool)spinButtons))\n`;
        outData += `        {\n`;
        outData += `            componentMarkup = "<div id='" + componentID + "'><div></div><input></div>";\n`;
        outData += `            return;\n`;
        outData += `        }\n\n`;
        outData += `        if ((!(bool)rtl && (bool)dropDown) || (!(bool)rtl && (bool)spinButtons))\n`;
        outData += `        {\n`;
        outData += `            componentMarkup = "<div id='" + componentID + "'><input><div></div></div>";\n`;
        outData += `            return;\n`;
        outData += `        }\n\n`;
        outData += `        componentMarkup = "<div id='" + componentID + "'><input></div>";\n`;
        outData += `    }\n`;
    }

    return outData;
}

function getDataType(widget, type) {
    type = type.toLowerCase();

    if (!type ||
        type.indexOf(widget.toLowerCase()) !== -1 || // interfaces
        type.indexOf(`|`) !== -1 || // union types are not supported in C#
        type.indexOf(`=>`) !== -1 ||
        type.indexOf(`enum`) !== -1) {

        return `object`;
    }

    type = type
        .replace(/int/g, `double`)
        .replace(/number/g, `double`)
        .replace(/boolean/g, `bool`)
        .replace(/date/g, `DateTime`)
        .replace(/any/g, `object`)
        .replace(/none/g, `void`);

    if (type.indexOf(`array`) !== -1 || type.indexOf(`[`) !== -1) {
        if (type.indexOf(`string`) !== -1) {
            return `string[]`;
        }

        if (type.indexOf(`double`) !== -1) {
            return `double[]`;
        }

        if (type.indexOf(`bool`) !== -1) {
            return `bool[]`;
        }

        if (type.indexOf(`DateTime`) !== -1) {
            return `DateTime[]`;
        }

        return `object[]`;
    }

    return type;
}

function getMethodsWithCustomImplementation(widget, method) {
    let outData = '';

    if (widget === 'jqxformattedinput' && method === 'val') {
        outData += `    public object val()\n`;
        outData += `    {\n`;
        outData += `        return getterMethod<object>("val");\n`;
        outData += `    }\n\n`;

        outData += `    public object val(string value)\n`;
        outData += `    {\n`;
        outData += `        return getterMethod<object>("val", value);\n`;
        outData += `    }\n\n`;

        outData += `    public void val(int value)\n`;
        outData += `    {\n`;
        outData += `        setterMethod("val", value);\n`;
        outData += `    }\n\n`;
    }

    return outData;
}

function generateAPI(widgetName, propertiesForAPI, eventsForAPI, methodsForAPI) {
    let outData = getApiSkeleton(widgetName);
    const { properties, rowIndexProperties } = getApiProperties(propertiesForAPI, 0);
    const { events, rowIndexEvents } = getApiEvents(eventsForAPI, rowIndexProperties);
    const { methods, rowIndexMethods } = getApiMethods(methodsForAPI, rowIndexEvents);

    outData = outData
        .replace('{{ properties }}', properties)
        .replace('{{ events }}', events)
        .replace('{{ methods }}', methods);

    const widgetWithoutJqx = widgetName.slice(3);
    const outFile = `../release/api/blazor-${widgetWithoutJqx.toLowerCase()}-api.htm`;

    // create api file
    fs.writeFileSync(outFile, outData, `utf8`);

    console.log('\x1b[35m%s\x1b[36m\%s\x1b[0m', '  [API]   ', widgetWithoutJqx);
}

function getApiSkeleton(widgetName) {
    return `<!DOCTYPE html>
<html lang="en">

    <head>
        <title>Blazor ${widgetName} API Reference</title>
        <meta name="description" content="API Reference Documentation for the Blazor ${widgetName} User Interface Component" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="stylesheet" href="../styles/site.css" media="screen" />
        <link rel= "stylesheet" href="../styles/jqx.apireference.css" media= "screen" />

        <script type="text/javascript" src="../scripts/jquery-1.11.1.min.js"></script>
        <script type="text/javascript" src="../scripts/jqx.apireference.js"></script>
        <script type="text/javascript" src="../scripts/format.js"></script>
        <script type="text/javascript" src="../scripts/toggle.js"></script>

        <script type="text/javascript">
            var _gaq = _gaq || [];
            _gaq.push(['_setAccount', 'UA- 25803467 - 1']);
            _gaq.push(['_trackPageview']);
            (function () {
                var ga = document.createElement('script');
                ga.type = 'text/javascript';
                ga.async = true;
                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(ga, s);
            })();
        </script>
    </head>

    <body>
        <div id="pageTop" class="top"></div>

        <div id="pageDocumentation">
            <div id="properties">

                <table class="documentation-table">
                    <tbody>

                        <tr>
                            <td colspan="3" style="width: 100%">
                                <h2 class="documentation-top-header">
                                    Properties
                                </h2>
                            </td>
                        </tr>

                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                        </tr>

                        {{ properties }}

                        <tr>
                            <td colspan="3" style="width: 100%">
                                <h2 class="documentation-top-header">
                                    Events
                                </h2>
                            </td>
                        </tr>

                        {{ events }}

                        <tr>
                            <td colspan="3" style="width: 100%">
                                <h2 class="documentation-top-header">
                                    Methods
                                </h2>
                            </td>
                        </tr>

                        <tr>
                            <th>Name</th>
                            <th>Arguments</th>
                            <th>Return Type</th>
                        </tr>

                        {{ methods }}

                    </tbody>
                </table>
           
            </div>
        </div>

    	<div id="pageBottom" class="bottom"></div>
    </body>

</html>
`;
}

function getApiProperties(propertiesForAPI, rowIndexProperties) {
    const template =
`
                        <tr>
                            <td class="documentation-option-type-click">
                                <span id="propertiesSpan{{ rowIndexProperties }}">{{ name }}</span>
                            </td>
                            <td>
                                <span>{{ type }}</span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3" style="width: 100%">

                            <div class="documentation-option-description property-content" style="display: none;">
                                <p>{{ description }}</p>
                            </div>

                            </td>
                        </tr>
`;

    let properties = '';

    for (const property of propertiesForAPI) {
        properties += template
            .replace('{{ rowIndexProperties }}', rowIndexProperties)
            .replace('{{ name }}', property.name)
            .replace('{{ type }}', property.type)
            .replace('{{ description }}', property.description);

            rowIndexProperties++;
    }

    return { properties, rowIndexProperties };
}

function getApiEvents(eventsForAPI, rowIndexEvents) {
    const template =
`
                        <tr>
                            <td class="documentation-option-type-click">
                                <span id="propertiesSpan{{ rowIndexEvents }}">{{ name }}</span>
                            </td>
                            <td>
                                <span>Event</span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3" style="width: 100%">

                            <div class="documentation-option-description property-content" style="display: none;">
                                <p>{{ description }}</p>
                            </div>

                            </td>
                        </tr>
`;

    let events = '';

    for (const event of eventsForAPI) {
        events += template
            .replace('{{ rowIndexEvents }}', rowIndexEvents)
            .replace('{{ name }}', event.name)
            .replace('{{ description }}', event.description);

            rowIndexEvents++;
    }


    return { events, rowIndexEvents };
}

function getApiMethods(methodsForAPI, rowIndexMethods) {
    const template =
`
                        <tr>
                            <td class="documentation-option-type-click">
                                <span id="propertiesSpan{{ rowIndexMethods }}">{{ name }}</span>
                            </td>
                            <td>
                                <span>{{ arguments }}</span>
                            </td>
                            <td>
                                <span>{{ type }}</span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3" style="width: 100%">

                            <div class="documentation-option-description property-content" style="display: none;">
                                <p>{{ description }}</p>
                            </div>

                            </td>
                        </tr>
`;
    let methods = '';

    for (const method of methodsForAPI) {
            methods += template
            .replace('{{ rowIndexMethods }}', rowIndexMethods)
            .replace('{{ name }}', method.name)
            .replace('{{ type }}', method.type)
            .replace('{{ arguments }}', method.arguments)
            .replace('{{ description }}', method.description);

            rowIndexMethods++;
    }

    return { methods, rowIndexMethods };
}

function getApiDescription(description) {
    if (description.match(/Code examples/)) {
        return description.substring(0, description.indexOf('Code examples'));
    }

    return description;
}
