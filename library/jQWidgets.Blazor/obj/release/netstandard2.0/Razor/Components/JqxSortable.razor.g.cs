#pragma checksum "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\Components\JqxSortable.razor" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "cc16b306511f43ebec4ad787904df55ca8014649"
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
#line 1 "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\Components\JqxSortable.razor"
using System.Text.Json;

#line default
#line hidden
    public partial class JqxSortable : Microsoft.AspNetCore.Components.ComponentBase
    {
        #pragma warning disable 1998
        protected override void BuildRenderTree(Microsoft.AspNetCore.Components.Rendering.RenderTreeBuilder __builder)
        {
            __builder.OpenElement(0, "div");
            __builder.AddAttribute(1, "id", 
#line 4 "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\Components\JqxSortable.razor"
          componentID

#line default
#line hidden
            );
            __builder.AddContent(2, 
#line 4 "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\Components\JqxSortable.razor"
                        ChildContent

#line default
#line hidden
            );
            __builder.CloseElement();
        }
        #pragma warning restore 1998
#line 6 "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\Components\JqxSortable.razor"
       

    [Parameter]
    public string appendTo {
        get { return getterProp<string>("appendTo"); }
        set { setterProp("appendTo", value); }
    }

    [Parameter]
    public object axis {
        get { return getterProp<object>("axis"); }
        set { setterProp("axis", value); }
    }

    [Parameter]
    public string cancel {
        get { return getterProp<string>("cancel"); }
        set { setterProp("cancel", value); }
    }

    [Parameter]
    public object connectWith {
        get { return getterProp<object>("connectWith"); }
        set { setterProp("connectWith", value); }
    }

    [Parameter]
    public object containment {
        get { return getterProp<object>("containment"); }
        set { setterProp("containment", value); }
    }

    [Parameter]
    public string cursor {
        get { return getterProp<string>("cursor"); }
        set { setterProp("cursor", value); }
    }

    [Parameter]
    public object cursorAt {
        get { return getterProp<object>("cursorAt"); }
        set { setterProp("cursorAt", value); }
    }

    [Parameter]
    public double delay {
        get { return getterProp<double>("delay"); }
        set { setterProp("delay", value); }
    }

    [Parameter]
    public bool disabled {
        get { return getterProp<bool>("disabled"); }
        set { setterProp("disabled", value); }
    }

    [Parameter]
    public double distance {
        get { return getterProp<double>("distance"); }
        set { setterProp("distance", value); }
    }

    [Parameter]
    public bool dropOnEmpty {
        get { return getterProp<bool>("dropOnEmpty"); }
        set { setterProp("dropOnEmpty", value); }
    }

    [Parameter]
    public bool forceHelperSize {
        get { return getterProp<bool>("forceHelperSize"); }
        set { setterProp("forceHelperSize", value); }
    }

    [Parameter]
    public bool forcePlaceholderSize {
        get { return getterProp<bool>("forcePlaceholderSize"); }
        set { setterProp("forcePlaceholderSize", value); }
    }

    [Parameter]
    public double[] grid {
        get { return getterProp<double[]>("grid"); }
        set { setterProp("grid", value); }
    }

    [Parameter]
    public object handle {
        get { return getterProp<object>("handle"); }
        set { setterProp("handle", value); }
    }

    [Parameter]
    public object helper {
        get { return getterProp<object>("helper"); }
        set { setterProp("helper", value); }
    }

    [Parameter]
    public string items {
        get { return getterProp<string>("items"); }
        set { setterProp("items", value); }
    }

    [Parameter]
    public object opacity {
        get { return getterProp<object>("opacity"); }
        set { setterProp("opacity", value); }
    }

    [Parameter]
    public object placeholderShow {
        get { return getterProp<object>("placeholderShow"); }
        set { setterProp("placeholderShow", value); }
    }

    [Parameter]
    public object revert {
        get { return getterProp<object>("revert"); }
        set { setterProp("revert", value); }
    }

    [Parameter]
    public bool scroll {
        get { return getterProp<bool>("scroll"); }
        set { setterProp("scroll", value); }
    }

    [Parameter]
    public double scrollSensitivity {
        get { return getterProp<double>("scrollSensitivity"); }
        set { setterProp("scrollSensitivity", value); }
    }

    [Parameter]
    public double scrollSpeed {
        get { return getterProp<double>("scrollSpeed"); }
        set { setterProp("scrollSpeed", value); }
    }

    [Parameter]
    public object tolerance {
        get { return getterProp<object>("tolerance"); }
        set { setterProp("tolerance", value); }
    }

    [Parameter]
    public double zIndex {
        get { return getterProp<double>("zIndex"); }
        set { setterProp("zIndex", value); }
    }

    [Parameter]
    public object options { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onActivate { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onBeforeStop { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onChange { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onDeactivate { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onOut { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onOver { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onReceive { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onRemove { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onSort { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onStart { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onStop { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onUpdate { get; set; }

    [Parameter]
    public Action onComponentReady { get; set; }

    [Parameter]
    public RenderFragment ChildContent { get; set; }

    private string[] paramsToBlock = { "onComponentReady", "ChildContent", "onActivate", "onBeforeStop", "onChange", "onDeactivate", "onOut", "onOver", "onReceive", "onRemove", "onSort", "onStart", "onStop", "onUpdate" };

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

    private IDictionary<string, object> initialOptions = new Dictionary<string, object>();

    public void cancelMethod()
    {
        setterMethod("cancelMethod");
    }

    public void destroy()
    {
        setterMethod("destroy");
    }

    public void disable()
    {
        setterMethod("disable");
    }

    public void enable()
    {
        setterMethod("enable");
    }

    public void refresh()
    {
        setterMethod("refresh");
    }

    public void refreshPositions()
    {
        setterMethod("refreshPositions");
    }

    public string serialize(object obj)
    {
        return getterMethod<string>("serialize", obj);
    }

    public object[] toArray()
    {
        return getterMethod<object[]>("toArray");
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
            ((IJSInProcessRuntime)JSRuntime).InvokeVoid("jqxBlazor.createComponent", componentID, "jqxSortable", initialOptions);

            Task.Delay(200).ContinueWith((action) =>
            {
                attachEvents();
                onComponentReady?.Invoke();
            }); 
        }
    }

    private void attachEvents()
    {
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "activate", "emitSortableEvent", DotNetObjectReference.Create(new EventsHandler(onActivate)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "beforeStop", "emitSortableEvent", DotNetObjectReference.Create(new EventsHandler(onBeforeStop)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "change", "emitSortableEvent", DotNetObjectReference.Create(new EventsHandler(onChange)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "deactivate", "emitSortableEvent", DotNetObjectReference.Create(new EventsHandler(onDeactivate)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "out", "emitSortableEvent", DotNetObjectReference.Create(new EventsHandler(onOut)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "over", "emitSortableEvent", DotNetObjectReference.Create(new EventsHandler(onOver)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "receive", "emitSortableEvent", DotNetObjectReference.Create(new EventsHandler(onReceive)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "remove", "emitSortableEvent", DotNetObjectReference.Create(new EventsHandler(onRemove)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "sort", "emitSortableEvent", DotNetObjectReference.Create(new EventsHandler(onSort)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "start", "emitSortableEvent", DotNetObjectReference.Create(new EventsHandler(onStart)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "stop", "emitSortableEvent", DotNetObjectReference.Create(new EventsHandler(onStop)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "update", "emitSortableEvent", DotNetObjectReference.Create(new EventsHandler(onUpdate)));
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
        public void emitSortableEvent(object e)
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
        [global::Microsoft.AspNetCore.Components.InjectAttribute] private IJSRuntime JSRuntime { get; set; }
    }
}
#pragma warning restore 1591