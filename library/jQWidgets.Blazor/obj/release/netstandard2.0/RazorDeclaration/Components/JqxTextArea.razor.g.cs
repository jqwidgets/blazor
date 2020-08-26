#pragma checksum "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\Components\JqxTextArea.razor" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "278cd28d50de420af22cd6aaa2369498ecf0579f"
// <auto-generated/>
#pragma warning disable 1591
#pragma warning disable 0414
#pragma warning disable 0649
#pragma warning disable 0169

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
#line 1 "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\Components\JqxTextArea.razor"
using System.Text.Json;

#line default
#line hidden
    public partial class JqxTextArea : Microsoft.AspNetCore.Components.ComponentBase
    {
        #pragma warning disable 1998
        protected override void BuildRenderTree(Microsoft.AspNetCore.Components.Rendering.RenderTreeBuilder __builder)
        {
        }
        #pragma warning restore 1998
#line 6 "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\Components\JqxTextArea.razor"
       

    [Parameter]
    public bool disabled {
        get { return getterProp<bool>("disabled"); }
        set { setterProp("disabled", value); }
    }

    [Parameter]
    public string displayMember {
        get { return getterProp<string>("displayMember"); }
        set { setterProp("displayMember", value); }
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
    public double items {
        get { return getterProp<double>("items"); }
        set { setterProp("items", value); }
    }

    [Parameter]
    public double maxLength {
        get { return getterProp<double>("maxLength"); }
        set { setterProp("maxLength", value); }
    }

    [Parameter]
    public double minLength {
        get { return getterProp<double>("minLength"); }
        set { setterProp("minLength", value); }
    }

    [Parameter]
    public bool opened {
        get { return getterProp<bool>("opened"); }
        set { setterProp("opened", value); }
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
    public string query {
        get { return getterProp<string>("query"); }
        set { setterProp("query", value); }
    }

    [Parameter]
    public object renderer {
        get { return getterProp<object>("renderer"); }
        set { setterProp("renderer", value); }
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
    public double scrollBarSize {
        get { return getterProp<double>("scrollBarSize"); }
        set { setterProp("scrollBarSize", value); }
    }

    [Parameter]
    public object searchMode {
        get { return getterProp<object>("searchMode"); }
        set { setterProp("searchMode", value); }
    }

    [Parameter]
    public object source {
        get { return getterProp<object>("source"); }
        set { setterProp("source", value); }
    }

    [Parameter]
    public string theme {
        get { return getterProp<string>("theme"); }
        set { setterProp("theme", value); }
    }

    [Parameter]
    public string valueMember {
        get { return getterProp<string>("valueMember"); }
        set { setterProp("valueMember", value); }
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
    public Action<IDictionary<string, object>> onSelect { get; set; }

    [Parameter]
    public Action onComponentReady { get; set; }

    [Parameter]
    public RenderFragment ChildContent { get; set; }

    private string[] paramsToBlock = { "onComponentReady", "ChildContent", "onChange", "onClose", "onOpen", "onSelect" };

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

    public void destroy()
    {
        setterMethod("destroy");
    }

    public void focus()
    {
        setterMethod("focus");
    }

    public void refresh()
    {
        setterMethod("refresh");
    }

    public void render()
    {
        setterMethod("render");
    }

    public void selectAll()
    {
        setterMethod("selectAll");
    }

    public string val()
    {
        return getterMethod<string>("val");
    }

    public void val(string value)
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
            ((IJSInProcessRuntime)JSRuntime).InvokeVoid("jqxBlazor.createComponent", componentID, "jqxTextArea", initialOptions);

            Task.Delay(200).ContinueWith((action) =>
            {
                attachEvents();
                onComponentReady?.Invoke();
            }); 
        }
    }

    private void attachEvents()
    {
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "change", "emitTextAreaEvent", DotNetObjectReference.Create(new EventsHandler(onChange)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "close", "emitTextAreaEvent", DotNetObjectReference.Create(new EventsHandler(onClose)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "open", "emitTextAreaEvent", DotNetObjectReference.Create(new EventsHandler(onOpen)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "select", "emitTextAreaEvent", DotNetObjectReference.Create(new EventsHandler(onSelect)));
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
        public void emitTextAreaEvent(object e)
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
