#pragma checksum "/Users/ivozhulev/git/jqwidgets-blazor/Shared/JqxDatetimeinput.razor" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "eab0f7e6f340c96276be5d4c0571e31d5188985b"
// <auto-generated/>
#pragma warning disable 1591
#pragma warning disable 0414
#pragma warning disable 0649
#pragma warning disable 0169

namespace blazor_web.Shared
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Components;
#nullable restore
#line 1 "/Users/ivozhulev/git/jqwidgets-blazor/_Imports.razor"
using System.Net.Http;

#line default
#line hidden
#nullable disable
#nullable restore
#line 2 "/Users/ivozhulev/git/jqwidgets-blazor/_Imports.razor"
using Microsoft.AspNetCore.Components.Forms;

#line default
#line hidden
#nullable disable
#nullable restore
#line 3 "/Users/ivozhulev/git/jqwidgets-blazor/_Imports.razor"
using Microsoft.AspNetCore.Components.Routing;

#line default
#line hidden
#nullable disable
#nullable restore
#line 4 "/Users/ivozhulev/git/jqwidgets-blazor/_Imports.razor"
using Microsoft.AspNetCore.Components.Web;

#line default
#line hidden
#nullable disable
#nullable restore
#line 5 "/Users/ivozhulev/git/jqwidgets-blazor/_Imports.razor"
using Microsoft.JSInterop;

#line default
#line hidden
#nullable disable
#nullable restore
#line 6 "/Users/ivozhulev/git/jqwidgets-blazor/_Imports.razor"
using blazor_web;

#line default
#line hidden
#nullable disable
#nullable restore
#line 7 "/Users/ivozhulev/git/jqwidgets-blazor/_Imports.razor"
using blazor_web.Shared;

#line default
#line hidden
#nullable disable
#nullable restore
#line 1 "/Users/ivozhulev/git/jqwidgets-blazor/Shared/JqxDatetimeinput.razor"
using System.Text.Json;

#line default
#line hidden
#nullable disable
    public partial class JqxDatetimeinput : Microsoft.AspNetCore.Components.ComponentBase
    {
        #pragma warning disable 1998
        protected override void BuildRenderTree(Microsoft.AspNetCore.Components.Rendering.RenderTreeBuilder __builder)
        {
        }
        #pragma warning restore 1998
#nullable restore
#line 6 "/Users/ivozhulev/git/jqwidgets-blazor/Shared/JqxDatetimeinput.razor"
       
    [Parameter]
    public object animationType {
        get { return getterProp<object>("animationType"); }
        set { setterProp("animationType", value); }
    }

    [Parameter]
    public bool allowNullDate {
        get { return getterProp<bool>("allowNullDate"); }
        set { setterProp("allowNullDate", value); }
    }

    [Parameter]
    public bool allowKeyboardDelete {
        get { return getterProp<bool>("allowKeyboardDelete"); }
        set { setterProp("allowKeyboardDelete", value); }
    }

    [Parameter]
    public string clearString {
        get { return getterProp<string>("clearString"); }
        set { setterProp("clearString", value); }
    }

    [Parameter]
    public string culture {
        get { return getterProp<string>("culture"); }
        set { setterProp("culture", value); }
    }

    [Parameter]
    public double closeDelay {
        get { return getterProp<double>("closeDelay"); }
        set { setterProp("closeDelay", value); }
    }

    [Parameter]
    public bool closeCalendarAfterSelection {
        get { return getterProp<bool>("closeCalendarAfterSelection"); }
        set { setterProp("closeCalendarAfterSelection", value); }
    }

    [Parameter]
    public object dropDownHorizontalAlignment {
        get { return getterProp<object>("dropDownHorizontalAlignment"); }
        set { setterProp("dropDownHorizontalAlignment", value); }
    }

    [Parameter]
    public object dropDownVerticalAlignment {
        get { return getterProp<object>("dropDownVerticalAlignment"); }
        set { setterProp("dropDownVerticalAlignment", value); }
    }

    [Parameter]
    public bool disabled {
        get { return getterProp<bool>("disabled"); }
        set { setterProp("disabled", value); }
    }

    [Parameter]
    public bool enableBrowserBoundsDetection {
        get { return getterProp<bool>("enableBrowserBoundsDetection"); }
        set { setterProp("enableBrowserBoundsDetection", value); }
    }

    [Parameter]
    public bool enableAbsoluteSelection {
        get { return getterProp<bool>("enableAbsoluteSelection"); }
        set { setterProp("enableAbsoluteSelection", value); }
    }

    [Parameter]
    public double firstDayOfWeek {
        get { return getterProp<double>("firstDayOfWeek"); }
        set { setterProp("firstDayOfWeek", value); }
    }

    [Parameter]
    public string formatString {
        get { return getterProp<string>("formatString"); }
        set { setterProp("formatString", value); }
    }

    [Parameter]
    public object height {
        get { return getterProp<object>("height"); }
        set { setterProp("height", value); }
    }

    [Parameter]
    public object min {
        get { return getterProp<object>("min"); }
        set { setterProp("min", value); }
    }

    [Parameter]
    public object max {
        get { return getterProp<object>("max"); }
        set { setterProp("max", value); }
    }

    [Parameter]
    public double openDelay {
        get { return getterProp<double>("openDelay"); }
        set { setterProp("openDelay", value); }
    }

    [Parameter]
    public string placeHolder {
        get { return getterProp<string>("placeHolder"); }
        set { setterProp("placeHolder", value); }
    }

    [Parameter]
    public double popupZIndex {
        get { return getterProp<double>("popupZIndex"); }
        set { setterProp("popupZIndex", value); }
    }

    [Parameter]
    public bool rtl {
        get { return getterProp<bool>("rtl"); }
        set { setterProp("rtl", value); }
    }

    [Parameter]
    public bool isReadonly {
        get { return getterProp<bool>("readonly"); }
        set { setterProp("readonly", value); }
    }

    [Parameter]
    public bool showFooter {
        get { return getterProp<bool>("showFooter"); }
        set { setterProp("showFooter", value); }
    }

    [Parameter]
    public object selectionMode {
        get { return getterProp<object>("selectionMode"); }
        set { setterProp("selectionMode", value); }
    }

    [Parameter]
    public bool showWeekNumbers {
        get { return getterProp<bool>("showWeekNumbers"); }
        set { setterProp("showWeekNumbers", value); }
    }

    [Parameter]
    public bool showTimeButton {
        get { return getterProp<bool>("showTimeButton"); }
        set { setterProp("showTimeButton", value); }
    }

    [Parameter]
    public bool showCalendarButton {
        get { return getterProp<bool>("showCalendarButton"); }
        set { setterProp("showCalendarButton", value); }
    }

    [Parameter]
    public string theme {
        get { return getterProp<string>("theme"); }
        set { setterProp("theme", value); }
    }

    [Parameter]
    public object template {
        get { return getterProp<object>("template"); }
        set { setterProp("template", value); }
    }

    [Parameter]
    public object textAlign {
        get { return getterProp<object>("textAlign"); }
        set { setterProp("textAlign", value); }
    }

    [Parameter]
    public string todayString {
        get { return getterProp<string>("todayString"); }
        set { setterProp("todayString", value); }
    }

    [Parameter]
    public object value {
        get { return getterProp<object>("value"); }
        set { setterProp("value", value); }
    }

    [Parameter]
    public object width {
        get { return getterProp<object>("width"); }
        set { setterProp("width", value); }
    }

    [Parameter]
    public object options {
        set { setOptions(value); }
    }

    [Parameter]
    public Action<IDictionary<string, object>> onChange { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onClose { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onOpen { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onTextchanged { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onValueChanged { get; set; }

    [Parameter]
    public RenderFragment ChildContent { get; set; }

    private string[] paramsToBlock = { "ChildContent", "onChange", "onClose", "onOpen", "onTextchanged", "onValueChanged" };

    private IDictionary<string, string> paramsToChange = new Dictionary<string, string>
    {
        { "isChecked", "checked" },
        { "isReadonly", "readonly" },
        { "isDecimal", "decimal" }
    };

    private bool shouldSetters;

    private string componentID;

    private IDictionary<string, object> initialOptions = new Dictionary<string, object>();

    public void close()
    {
        setterMethod("close");
    }

    public void destroy()
    {
        setterMethod("destroy");
    }

    public void focus()
    {
        setterMethod("focus");
    }

    public object getRange()
    {
        return getterMethod<object>("getRange");
    }

    public string getText()
    {
        return getterMethod<string>("getText");
    }

    public object getDate()
    {
        return getterMethod<object>("getDate");
    }

    public object getMaxDate()
    {
        return getterMethod<object>("getMaxDate");
    }

    public object getMinDate()
    {
        return getterMethod<object>("getMinDate");
    }

    public void open()
    {
        setterMethod("open");
    }

    public void setRange(object date, object date2)
    {
        setterMethod("setRange", date, date2);
    }

    public void setMinDate(object date)
    {
        setterMethod("setMinDate", date);
    }

    public void setMaxDate(object date)
    {
        setterMethod("setMaxDate", date);
    }

    public void setDate(object date)
    {
        setterMethod("setDate", date);
    }

    public object val()
    {
        return getterMethod<object>("val");
    }

    public void val(object value, object value2)
    {
        setterMethod("val", value, value2);
    }

    public override async Task SetParametersAsync(ParameterView parameters)
    {
        await base.SetParametersAsync(parameters);

        foreach(var parameter in parameters.ToDictionary())
        {
            var key = parameter.Key;
            var value = parameter.Value;

            if (!paramsToBlock.Contains(key))
            {
                if (paramsToChange.ContainsKey(key))
                {
                    key = paramsToChange[key];
                }

                initialOptions[key] = value;
            }
        }

        shouldSetters = true;
    }

    protected override void OnInitialized()
    {
        componentID = ((IJSInProcessRuntime)JSRuntime).Invoke<string>("jqxBlazor.generateID");
    }

    protected override void OnAfterRender(bool firstRender)
    {
        if (firstRender)
        {
            ((IJSInProcessRuntime)JSRuntime).InvokeVoid("jqxBlazor.createComponent", componentID, "jqxDateTimeInput", initialOptions);
            attachEvents();
        }
    }

    private void attachEvents()
    {
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "change", "emitDateTimeInputEvent", DotNetObjectReference.Create(new EventsHandler(onChange)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "close", "emitDateTimeInputEvent", DotNetObjectReference.Create(new EventsHandler(onClose)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "open", "emitDateTimeInputEvent", DotNetObjectReference.Create(new EventsHandler(onOpen)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "textchanged", "emitDateTimeInputEvent", DotNetObjectReference.Create(new EventsHandler(onTextchanged)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "valueChanged", "emitDateTimeInputEvent", DotNetObjectReference.Create(new EventsHandler(onValueChanged)));
    }

    private T getterProp<T>(string name)
    {
        shouldSetters = false;
        return ((IJSInProcessRuntime)JSRuntime).Invoke<T>("jqxBlazor.manageProps", componentID, name);
    }

    private void setterProp(string name, object value)
    {
        if (shouldSetters)
        {
            ((IJSInProcessRuntime)JSRuntime).InvokeVoid("jqxBlazor.manageProps", componentID, name, value);
        }
    }

    private T getterMethod<T>(string name)
    {
        shouldSetters = false;
        return ((IJSInProcessRuntime)JSRuntime).Invoke<T>("jqxBlazor.manageMethods", componentID, name);
    }

    private void setterMethod(string name, params object[] args)
    {
        shouldSetters = false;
        ((IJSInProcessRuntime)JSRuntime).InvokeVoid("jqxBlazor.manageMethods", componentID, name, args);
    }

    private void setOptions(object options)
    {
        shouldSetters = false;
        ((IJSInProcessRuntime)JSRuntime).InvokeVoid("jqxBlazor.setOptions", componentID, options);
    }

    public class EventsHandler
    {
        private Action<IDictionary<string, object>> componentEvent;

        public EventsHandler(Action<IDictionary<string, object>> e)
        {
            componentEvent = e;
        }

        [JSInvokable]
        public void emitDateTimeInputEvent(object e)
        {
            if (componentEvent != null)
            {
                var eventAsJson = JsonSerializer.Serialize(e);
                var eventAsDictionary = JsonSerializer.Deserialize<IDictionary<string, object>>(eventAsJson);

                componentEvent.Invoke(eventAsDictionary);
            }
        }
    }

#line default
#line hidden
#nullable disable
        [global::Microsoft.AspNetCore.Components.InjectAttribute] private IJSRuntime JSRuntime { get; set; }
    }
}
#pragma warning restore 1591
