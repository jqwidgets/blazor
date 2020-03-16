#pragma checksum "/Users/ivozhulev/git/jqwidgets-blazor/Shared/JqxCheckbox.razor" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "fd88c5ac37465af79b27954d669e20c310e1808d"
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
#line 1 "/Users/ivozhulev/git/jqwidgets-blazor/Shared/JqxCheckbox.razor"
using System.Text.Json;

#line default
#line hidden
#nullable disable
    public partial class JqxCheckbox : Microsoft.AspNetCore.Components.ComponentBase
    {
        #pragma warning disable 1998
        protected override void BuildRenderTree(Microsoft.AspNetCore.Components.Rendering.RenderTreeBuilder __builder)
        {
        }
        #pragma warning restore 1998
#nullable restore
#line 6 "/Users/ivozhulev/git/jqwidgets-blazor/Shared/JqxCheckbox.razor"
       
    [Parameter]
    public double animationShowDelay {
        get { return getterProp<double>("animationShowDelay"); }
        set { setterProp("animationShowDelay", value); }
    }

    [Parameter]
    public double animationHideDelay {
        get { return getterProp<double>("animationHideDelay"); }
        set { setterProp("animationHideDelay", value); }
    }

    [Parameter]
    public object boxSize {
        get { return getterProp<object>("boxSize"); }
        set { setterProp("boxSize", value); }
    }

    [Parameter]
    public object isChecked {
        get { return getterProp<object>("checked"); }
        set { setterProp("checked", value); }
    }

    [Parameter]
    public bool disabled {
        get { return getterProp<bool>("disabled"); }
        set { setterProp("disabled", value); }
    }

    [Parameter]
    public bool enableContainerClick {
        get { return getterProp<bool>("enableContainerClick"); }
        set { setterProp("enableContainerClick", value); }
    }

    [Parameter]
    public string groupName {
        get { return getterProp<string>("groupName"); }
        set { setterProp("groupName", value); }
    }

    [Parameter]
    public object height {
        get { return getterProp<object>("height"); }
        set { setterProp("height", value); }
    }

    [Parameter]
    public bool hasThreeStates {
        get { return getterProp<bool>("hasThreeStates"); }
        set { setterProp("hasThreeStates", value); }
    }

    [Parameter]
    public bool locked {
        get { return getterProp<bool>("locked"); }
        set { setterProp("locked", value); }
    }

    [Parameter]
    public bool rtl {
        get { return getterProp<bool>("rtl"); }
        set { setterProp("rtl", value); }
    }

    [Parameter]
    public string theme {
        get { return getterProp<string>("theme"); }
        set { setterProp("theme", value); }
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
    public Action<IDictionary<string, object>> onChecked { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onChange { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onIndeterminate { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onUnchecked { get; set; }

    [Parameter]
    public RenderFragment ChildContent { get; set; }

    private string[] paramsToBlock = { "ChildContent", "onChecked", "onChange", "onIndeterminate", "onUnchecked" };

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

    public void disable()
    {
        setterMethod("disable");
    }

    public void destroy()
    {
        setterMethod("destroy");
    }

    public void enable()
    {
        setterMethod("enable");
    }

    public void focus()
    {
        setterMethod("focus");
    }

    public void indeterminate()
    {
        setterMethod("indeterminate");
    }

    public void render()
    {
        setterMethod("render");
    }

    public void toggle()
    {
        setterMethod("toggle");
    }

    public void uncheck()
    {
        setterMethod("uncheck");
    }

    public bool val()
    {
        return getterMethod<bool>("val");
    }

    public void val(bool value)
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
            ((IJSInProcessRuntime)JSRuntime).InvokeVoid("jqxBlazor.createComponent", componentID, "jqxCheckBox", initialOptions);
            attachEvents();
        }
    }

    private void attachEvents()
    {
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "checked", "emitCheckBoxEvent", DotNetObjectReference.Create(new EventsHandler(onChecked)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "change", "emitCheckBoxEvent", DotNetObjectReference.Create(new EventsHandler(onChange)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "indeterminate", "emitCheckBoxEvent", DotNetObjectReference.Create(new EventsHandler(onIndeterminate)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "unchecked", "emitCheckBoxEvent", DotNetObjectReference.Create(new EventsHandler(onUnchecked)));
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
        public void emitCheckBoxEvent(object e)
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
