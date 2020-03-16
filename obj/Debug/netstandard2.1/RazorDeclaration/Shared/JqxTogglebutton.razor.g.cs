#pragma checksum "/Users/ivozhulev/git/jqwidgets-blazor/Shared/JqxTogglebutton.razor" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "1531671f56309152544d16a2071d0e47657bcc26"
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
#line 1 "/Users/ivozhulev/git/jqwidgets-blazor/Shared/JqxTogglebutton.razor"
using System.Text.Json;

#line default
#line hidden
#nullable disable
    public partial class JqxTogglebutton : Microsoft.AspNetCore.Components.ComponentBase
    {
        #pragma warning disable 1998
        protected override void BuildRenderTree(Microsoft.AspNetCore.Components.Rendering.RenderTreeBuilder __builder)
        {
        }
        #pragma warning restore 1998
#nullable restore
#line 6 "/Users/ivozhulev/git/jqwidgets-blazor/Shared/JqxTogglebutton.razor"
       
    [Parameter]
    public bool disabled {
        get { return getterProp<bool>("disabled"); }
        set { setterProp("disabled", value); }
    }

    [Parameter]
    public object height {
        get { return getterProp<object>("height"); }
        set { setterProp("height", value); }
    }

    [Parameter]
    public string imgSrc {
        get { return getterProp<string>("imgSrc"); }
        set { setterProp("imgSrc", value); }
    }

    [Parameter]
    public object imgWidth {
        get { return getterProp<object>("imgWidth"); }
        set { setterProp("imgWidth", value); }
    }

    [Parameter]
    public object imgHeight {
        get { return getterProp<object>("imgHeight"); }
        set { setterProp("imgHeight", value); }
    }

    [Parameter]
    public object imgPosition {
        get { return getterProp<object>("imgPosition"); }
        set { setterProp("imgPosition", value); }
    }

    [Parameter]
    public object roundedCorners {
        get { return getterProp<object>("roundedCorners"); }
        set { setterProp("roundedCorners", value); }
    }

    [Parameter]
    public bool rtl {
        get { return getterProp<bool>("rtl"); }
        set { setterProp("rtl", value); }
    }

    [Parameter]
    public object textPosition {
        get { return getterProp<object>("textPosition"); }
        set { setterProp("textPosition", value); }
    }

    [Parameter]
    public object textImageRelation {
        get { return getterProp<object>("textImageRelation"); }
        set { setterProp("textImageRelation", value); }
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
    public bool toggled {
        get { return getterProp<bool>("toggled"); }
        set { setterProp("toggled", value); }
    }

    [Parameter]
    public object width {
        get { return getterProp<object>("width"); }
        set { setterProp("width", value); }
    }

    [Parameter]
    public string value {
        get { return getterProp<string>("value"); }
        set { setterProp("value", value); }
    }

    [Parameter]
    public object options {
        set { setOptions(value); }
    }

    [Parameter]
    public Action<IDictionary<string, object>> onClick { get; set; }

    [Parameter]
    public RenderFragment ChildContent { get; set; }

    private string[] paramsToBlock = { "ChildContent", "onClick" };

    private IDictionary<string, string> paramsToChange = new Dictionary<string, string>
    {
        { "isChecked", "checked" },
        { "isReadonly", "readonly" },
        { "isDecimal", "decimal" }
    };

    private bool shouldSetters;

    private string componentID;

    private IDictionary<string, object> initialOptions = new Dictionary<string, object>();

    public void check()
    {
        setterMethod("check");
    }

    public void destroy()
    {
        setterMethod("destroy");
    }

    public void focus()
    {
        setterMethod("focus");
    }

    public void render()
    {
        setterMethod("render");
    }

    public void toggle()
    {
        setterMethod("toggle");
    }

    public void unCheck()
    {
        setterMethod("unCheck");
    }

    public string val()
    {
        return getterMethod<string>("val");
    }

    public void val(string value)
    {
        setterMethod("val", value);
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
            ((IJSInProcessRuntime)JSRuntime).InvokeVoid("jqxBlazor.createComponent", componentID, "jqxToggleButton", initialOptions);
            attachEvents();
        }
    }

    private void attachEvents()
    {
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "click", "emitToggleButtonEvent", DotNetObjectReference.Create(new EventsHandler(onClick)));
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
        public void emitToggleButtonEvent(object e)
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
