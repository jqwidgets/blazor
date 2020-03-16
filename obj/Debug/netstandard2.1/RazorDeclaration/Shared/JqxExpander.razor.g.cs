#pragma checksum "/Users/ivozhulev/git/jqwidgets-blazor/Shared/JqxExpander.razor" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "346127ea4bc6c08a7909acf17f3c3287633178bb"
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
#line 1 "/Users/ivozhulev/git/jqwidgets-blazor/Shared/JqxExpander.razor"
using System.Text.Json;

#line default
#line hidden
#nullable disable
    public partial class JqxExpander : Microsoft.AspNetCore.Components.ComponentBase
    {
        #pragma warning disable 1998
        protected override void BuildRenderTree(Microsoft.AspNetCore.Components.Rendering.RenderTreeBuilder __builder)
        {
        }
        #pragma warning restore 1998
#nullable restore
#line 6 "/Users/ivozhulev/git/jqwidgets-blazor/Shared/JqxExpander.razor"
       
    [Parameter]
    public object animationType {
        get { return getterProp<object>("animationType"); }
        set { setterProp("animationType", value); }
    }

    [Parameter]
    public object arrowPosition {
        get { return getterProp<object>("arrowPosition"); }
        set { setterProp("arrowPosition", value); }
    }

    [Parameter]
    public double collapseAnimationDuration {
        get { return getterProp<double>("collapseAnimationDuration"); }
        set { setterProp("collapseAnimationDuration", value); }
    }

    [Parameter]
    public bool disabled {
        get { return getterProp<bool>("disabled"); }
        set { setterProp("disabled", value); }
    }

    [Parameter]
    public bool expanded {
        get { return getterProp<bool>("expanded"); }
        set { setterProp("expanded", value); }
    }

    [Parameter]
    public double expandAnimationDuration {
        get { return getterProp<double>("expandAnimationDuration"); }
        set { setterProp("expandAnimationDuration", value); }
    }

    [Parameter]
    public object height {
        get { return getterProp<object>("height"); }
        set { setterProp("height", value); }
    }

    [Parameter]
    public object headerPosition {
        get { return getterProp<object>("headerPosition"); }
        set { setterProp("headerPosition", value); }
    }

    [Parameter]
    public object initContent {
        get { return getterProp<object>("initContent"); }
        set { setterProp("initContent", value); }
    }

    [Parameter]
    public bool rtl {
        get { return getterProp<bool>("rtl"); }
        set { setterProp("rtl", value); }
    }

    [Parameter]
    public bool showArrow {
        get { return getterProp<bool>("showArrow"); }
        set { setterProp("showArrow", value); }
    }

    [Parameter]
    public string theme {
        get { return getterProp<string>("theme"); }
        set { setterProp("theme", value); }
    }

    [Parameter]
    public object toggleMode {
        get { return getterProp<object>("toggleMode"); }
        set { setterProp("toggleMode", value); }
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
    public Action<IDictionary<string, object>> onCollapsing { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onCollapsed { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onExpanding { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onExpanded { get; set; }

    [Parameter]
    public RenderFragment ChildContent { get; set; }

    private string[] paramsToBlock = { "ChildContent", "onCollapsing", "onCollapsed", "onExpanding", "onExpanded" };

    private IDictionary<string, string> paramsToChange = new Dictionary<string, string>
    {
        { "isChecked", "checked" },
        { "isReadonly", "readonly" },
        { "isDecimal", "decimal" }
    };

    private bool shouldSetters;

    private string componentID;

    private IDictionary<string, object> initialOptions = new Dictionary<string, object>();

    public void collapse()
    {
        setterMethod("collapse");
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

    public void expand()
    {
        setterMethod("expand");
    }

    public void focus()
    {
        setterMethod("focus");
    }

    public string getContent()
    {
        return getterMethod<string>("getContent");
    }

    public string getHeaderContent()
    {
        return getterMethod<string>("getHeaderContent");
    }

    public void invalidate()
    {
        setterMethod("invalidate");
    }

    public void refresh()
    {
        setterMethod("refresh");
    }

    public void render()
    {
        setterMethod("render");
    }

    public void setHeaderContent(string headerContent)
    {
        setterMethod("setHeaderContent", headerContent);
    }

    public void setContent(string content)
    {
        setterMethod("setContent", content);
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
            ((IJSInProcessRuntime)JSRuntime).InvokeVoid("jqxBlazor.createComponent", componentID, "jqxExpander", initialOptions);
            attachEvents();
        }
    }

    private void attachEvents()
    {
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "collapsing", "emitExpanderEvent", DotNetObjectReference.Create(new EventsHandler(onCollapsing)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "collapsed", "emitExpanderEvent", DotNetObjectReference.Create(new EventsHandler(onCollapsed)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "expanding", "emitExpanderEvent", DotNetObjectReference.Create(new EventsHandler(onExpanding)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "expanded", "emitExpanderEvent", DotNetObjectReference.Create(new EventsHandler(onExpanded)));
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
        public void emitExpanderEvent(object e)
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
