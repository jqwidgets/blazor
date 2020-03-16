#pragma checksum "/Users/ivozhulev/git/jqwidgets-blazor/Shared/JqxPivotgrid.razor" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "cc710047d8835bf78c4ee36a3e769ded73816e96"
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
#line 1 "/Users/ivozhulev/git/jqwidgets-blazor/Shared/JqxPivotgrid.razor"
using System.Text.Json;

#line default
#line hidden
#nullable disable
    public partial class JqxPivotgrid : Microsoft.AspNetCore.Components.ComponentBase
    {
        #pragma warning disable 1998
        protected override void BuildRenderTree(Microsoft.AspNetCore.Components.Rendering.RenderTreeBuilder __builder)
        {
        }
        #pragma warning restore 1998
#nullable restore
#line 6 "/Users/ivozhulev/git/jqwidgets-blazor/Shared/JqxPivotgrid.razor"
       
    [Parameter]
    public object source {
        get { return getterProp<object>("source"); }
        set { setterProp("source", value); }
    }

    [Parameter]
    public object localization {
        get { return getterProp<object>("localization"); }
        set { setterProp("localization", value); }
    }

    [Parameter]
    public bool scrollBarsEnabled {
        get { return getterProp<bool>("scrollBarsEnabled"); }
        set { setterProp("scrollBarsEnabled", value); }
    }

    [Parameter]
    public bool selectionEnabled {
        get { return getterProp<bool>("selectionEnabled"); }
        set { setterProp("selectionEnabled", value); }
    }

    [Parameter]
    public bool multipleSelectionEnabled {
        get { return getterProp<bool>("multipleSelectionEnabled"); }
        set { setterProp("multipleSelectionEnabled", value); }
    }

    [Parameter]
    public bool treeStyleRows {
        get { return getterProp<bool>("treeStyleRows"); }
        set { setterProp("treeStyleRows", value); }
    }

    [Parameter]
    public bool autoResize {
        get { return getterProp<bool>("autoResize"); }
        set { setterProp("autoResize", value); }
    }

    [Parameter]
    public object itemsRenderer {
        get { return getterProp<object>("itemsRenderer"); }
        set { setterProp("itemsRenderer", value); }
    }

    [Parameter]
    public object cellsRenderer {
        get { return getterProp<object>("cellsRenderer"); }
        set { setterProp("cellsRenderer", value); }
    }

    [Parameter]
    public object options {
        set { setOptions(value); }
    }

    [Parameter]
    public Action<IDictionary<string, object>> onPivotitemexpanding { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onPivotitemexpanded { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onPivotitemcollapsing { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onPivotitemcollapsed { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onSortchanging { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onSortchanged { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onSortremoving { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onSortremoved { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onPivotitemselectionchanged { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onPivotcellmousedown { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onPivotcellmouseup { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onPivotcellclick { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onPivotcelldblclick { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onPivotitemmousedown { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onPivotitemmouseup { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onPivotitemclick { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onPivotitemdblclick { get; set; }

    [Parameter]
    public RenderFragment ChildContent { get; set; }

    private string[] paramsToBlock = { "ChildContent", "onPivotitemexpanding", "onPivotitemexpanded", "onPivotitemcollapsing", "onPivotitemcollapsed", "onSortchanging", "onSortchanged", "onSortremoving", "onSortremoved", "onPivotitemselectionchanged", "onPivotcellmousedown", "onPivotcellmouseup", "onPivotcellclick", "onPivotcelldblclick", "onPivotitemmousedown", "onPivotitemmouseup", "onPivotitemclick", "onPivotitemdblclick" };

    private IDictionary<string, string> paramsToChange = new Dictionary<string, string>
    {
        { "isChecked", "checked" },
        { "isReadonly", "readonly" },
        { "isDecimal", "decimal" }
    };

    private bool shouldSetters;

    private string componentID;

    private IDictionary<string, object> initialOptions = new Dictionary<string, object>();

    public object getInstance()
    {
        return getterMethod<object>("getInstance");
    }

    public void refresh()
    {
        setterMethod("refresh");
    }

    public object getPivotRows()
    {
        return getterMethod<object>("getPivotRows");
    }

    public object getPivotColumns()
    {
        return getterMethod<object>("getPivotColumns");
    }

    public object getPivotCells()
    {
        return getterMethod<object>("getPivotCells");
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
            ((IJSInProcessRuntime)JSRuntime).InvokeVoid("jqxBlazor.createComponent", componentID, "jqxPivotGrid", initialOptions);
            attachEvents();
        }
    }

    private void attachEvents()
    {
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "pivotitemexpanding", "emitPivotGridEvent", DotNetObjectReference.Create(new EventsHandler(onPivotitemexpanding)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "pivotitemexpanded", "emitPivotGridEvent", DotNetObjectReference.Create(new EventsHandler(onPivotitemexpanded)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "pivotitemcollapsing", "emitPivotGridEvent", DotNetObjectReference.Create(new EventsHandler(onPivotitemcollapsing)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "pivotitemcollapsed", "emitPivotGridEvent", DotNetObjectReference.Create(new EventsHandler(onPivotitemcollapsed)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "sortchanging", "emitPivotGridEvent", DotNetObjectReference.Create(new EventsHandler(onSortchanging)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "sortchanged", "emitPivotGridEvent", DotNetObjectReference.Create(new EventsHandler(onSortchanged)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "sortremoving", "emitPivotGridEvent", DotNetObjectReference.Create(new EventsHandler(onSortremoving)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "sortremoved", "emitPivotGridEvent", DotNetObjectReference.Create(new EventsHandler(onSortremoved)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "pivotitemselectionchanged", "emitPivotGridEvent", DotNetObjectReference.Create(new EventsHandler(onPivotitemselectionchanged)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "pivotcellmousedown", "emitPivotGridEvent", DotNetObjectReference.Create(new EventsHandler(onPivotcellmousedown)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "pivotcellmouseup", "emitPivotGridEvent", DotNetObjectReference.Create(new EventsHandler(onPivotcellmouseup)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "pivotcellclick", "emitPivotGridEvent", DotNetObjectReference.Create(new EventsHandler(onPivotcellclick)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "pivotcelldblclick", "emitPivotGridEvent", DotNetObjectReference.Create(new EventsHandler(onPivotcelldblclick)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "pivotitemmousedown", "emitPivotGridEvent", DotNetObjectReference.Create(new EventsHandler(onPivotitemmousedown)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "pivotitemmouseup", "emitPivotGridEvent", DotNetObjectReference.Create(new EventsHandler(onPivotitemmouseup)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "pivotitemclick", "emitPivotGridEvent", DotNetObjectReference.Create(new EventsHandler(onPivotitemclick)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "pivotitemdblclick", "emitPivotGridEvent", DotNetObjectReference.Create(new EventsHandler(onPivotitemdblclick)));
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
        public void emitPivotGridEvent(object e)
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
