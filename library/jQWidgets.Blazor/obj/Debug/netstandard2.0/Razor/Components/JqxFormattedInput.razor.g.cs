#pragma checksum "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\Components\JqxFormattedInput.razor" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "dc19f5dce409ea7c215bf2187bebeb0b186a582b"
// <auto-generated/>
#pragma warning disable 1591
namespace jQWidgets.Blazor.Components
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Components;
#line 1 "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\_Imports.razor"
using Microsoft.AspNetCore.Components.Web;

#line default
#line hidden
#line 2 "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\_Imports.razor"
using Microsoft.JSInterop;

#line default
#line hidden
#line 1 "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\Components\JqxFormattedInput.razor"
using System.Text.Json;

#line default
#line hidden
    public partial class JqxFormattedInput : Microsoft.AspNetCore.Components.ComponentBase
    {
        #pragma warning disable 1998
        protected override void BuildRenderTree(Microsoft.AspNetCore.Components.Rendering.RenderTreeBuilder __builder)
        {
            __builder.AddContent(0, 
#line 4 "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\Components\JqxFormattedInput.razor"
  (MarkupString)componentMarkup

#line default
#line hidden
            );
        }
        #pragma warning restore 1998
#line 6 "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\Components\JqxFormattedInput.razor"
       

    [Parameter]
    public bool disabled {
        get { return getterProp<bool>("disabled"); }
        set { setterProp("disabled", value); }
    }

    [Parameter]
    public object decimalNotation {
        get { return getterProp<object>("decimalNotation"); }
        set { setterProp("decimalNotation", value); }
    }

    [Parameter]
    public bool dropDown {
        get { return getterProp<bool>("dropDown"); }
        set { setterProp("dropDown", value); }
    }

    [Parameter]
    public object dropDownWidth {
        get { return getterProp<object>("dropDownWidth"); }
        set { setterProp("dropDownWidth", value); }
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
    public bool roundedCorners {
        get { return getterProp<bool>("roundedCorners"); }
        set { setterProp("roundedCorners", value); }
    }

    [Parameter]
    public bool rtl {
        get { return getterProp<bool>("rtl"); }
        set { setterProp("rtl", value); }
    }

    [Parameter]
    public object radix {
        get { return getterProp<object>("radix"); }
        set { setterProp("radix", value); }
    }

    [Parameter]
    public bool spinButtons {
        get { return getterProp<bool>("spinButtons"); }
        set { setterProp("spinButtons", value); }
    }

    [Parameter]
    public double spinButtonsStep {
        get { return getterProp<double>("spinButtonsStep"); }
        set { setterProp("spinButtonsStep", value); }
    }

    [Parameter]
    public object template {
        get { return getterProp<object>("template"); }
        set { setterProp("template", value); }
    }

    [Parameter]
    public string theme {
        get { return getterProp<string>("theme"); }
        set { setterProp("theme", value); }
    }

    [Parameter]
    public bool upperCase {
        get { return getterProp<bool>("upperCase"); }
        set { setterProp("upperCase", value); }
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
    public object options { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onChange { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onClose { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onOpen { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onRadixChange { get; set; }

    [Parameter]
    public Action onComponentReady { get; set; }

    [Parameter]
    public RenderFragment ChildContent { get; set; }

    private string[] paramsToBlock = { "onComponentReady", "ChildContent", "onChange", "onClose", "onOpen", "onRadixChange" };

    private IDictionary<string, string> paramsToChange = new Dictionary<string, string>
    {
        { "isChecked", "checked" },
        { "isReadonly", "readonly" },
        { "isDecimal", "decimal" },
        { "dragEnd", "onDragEnd" },
        { "drag", "onDrag" },
        { "dragStart", "onDragStart" },
        { "targetDrop", "onTargetDrop" },
        { "dropTargetEnter", "onDropTargetEnter" },
        { "dropTargetLeave", "onDropTargetLeave" }
    };

    private bool shouldSetters;

    private string componentID;

    private string componentMarkup;

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

    public void open()
    {
        setterMethod("open");
    }

    public void render()
    {
        setterMethod("render");
    }

    public void refresh()
    {
        setterMethod("refresh");
    }

    public void selectAll()
    {
        setterMethod("selectAll");
    }

    public void selectFirst()
    {
        setterMethod("selectFirst");
    }

    public void selectLast()
    {
        setterMethod("selectLast");
    }

    public object val()
    {
        return getterMethod<object>("val");
    }

    public object val(string value)
    {
        return getterMethod<object>("val", value);
    }

    public void val(int value)
    {
        setterMethod("val", value);
    }

    public IDictionary<string, object> getOptions()
    {
        shouldSetters = false;
        return ((IJSInProcessRuntime)JSRuntime).Invoke<IDictionary<string, object>>("jqxBlazor.getOptions", this);
    }

    public void setOptions(object options)
    {
        shouldSetters = false;
        ((IJSInProcessRuntime)JSRuntime).InvokeVoid("jqxBlazor.setOptions", componentID, options);
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

        getMarkup();
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
            ((IJSInProcessRuntime)JSRuntime).InvokeVoid("jqxBlazor.createComponent", componentID, "jqxFormattedInput", initialOptions);

            Task.Delay(200).ContinueWith((action) =>
            {
                attachEvents();
                onComponentReady?.Invoke();
            }); 
        }
    }

    private void attachEvents()
    {
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "change", "emitFormattedInputEvent", DotNetObjectReference.Create(new EventsHandler(onChange)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "close", "emitFormattedInputEvent", DotNetObjectReference.Create(new EventsHandler(onClose)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "open", "emitFormattedInputEvent", DotNetObjectReference.Create(new EventsHandler(onOpen)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "radixChange", "emitFormattedInputEvent", DotNetObjectReference.Create(new EventsHandler(onRadixChange)));
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

    private T getterMethod<T>(string name, params object[] args)
    {
        shouldSetters = false;
        return ((IJSInProcessRuntime)JSRuntime).Invoke<T>("jqxBlazor.manageMethods", componentID, name, args);
    }

    private void setterMethod(string name, params object[] args)
    {
        shouldSetters = false;
        ((IJSInProcessRuntime)JSRuntime).InvokeVoid("jqxBlazor.manageMethods", componentID, name, args);
    }

    public class EventsHandler
    {
        private Action<IDictionary<string, object>> componentEvent;

        public EventsHandler(Action<IDictionary<string, object>> e)
        {
            componentEvent = e;
        }

        [JSInvokable]
        public void emitFormattedInputEvent(object e)
        {
            if (componentEvent != null)
            {
                var eventAsJson = JsonSerializer.Serialize(e);
                var eventAsDictionary = JsonSerializer.Deserialize<IDictionary<string, object>>(eventAsJson);

                componentEvent.Invoke(eventAsDictionary);
            }
        }
    }
    private void getMarkup()
    {
        object rtl;
        initialOptions.TryGetValue("rtl", out rtl);

        object dropDown;
        initialOptions.TryGetValue("dropDown", out dropDown);

        object spinButtons;
        initialOptions.TryGetValue("spinButtons", out spinButtons);

        if ((bool)rtl && (bool)dropDown && (bool)spinButtons)
        {
            componentMarkup = "<div id='" + componentID + "'><div></div><div></div><input></div>";
            return;
        }

        if (!(bool)rtl && (bool)dropDown && (bool)spinButtons)
        {
            componentMarkup = "<div id='" + componentID + "'><input><div></div><div></div></div>";
            return;
        }

        if (((bool)rtl && (bool)dropDown) || ((bool)rtl && (bool)spinButtons))
        {
            componentMarkup = "<div id='" + componentID + "'><div></div><input></div>";
            return;
        }

        if ((!(bool)rtl && (bool)dropDown) || (!(bool)rtl && (bool)spinButtons))
        {
            componentMarkup = "<div id='" + componentID + "'><input><div></div></div>";
            return;
        }

        componentMarkup = "<div id='" + componentID + "'><input></div>";
    }


#line default
#line hidden
        [global::Microsoft.AspNetCore.Components.InjectAttribute] private IJSRuntime JSRuntime { get; set; }
    }
}
#pragma warning restore 1591