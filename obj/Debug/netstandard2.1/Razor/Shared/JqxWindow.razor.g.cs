#pragma checksum "/Users/ivozhulev/git/jqwidgets-blazor/Shared/JqxWindow.razor" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "2b115fddd7fc315f3cffe5f7b3be49053f7aff2a"
// <auto-generated/>
#pragma warning disable 1591
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
#line 1 "/Users/ivozhulev/git/jqwidgets-blazor/Shared/JqxWindow.razor"
using System.Text.Json;

#line default
#line hidden
#nullable disable
    public partial class JqxWindow : Microsoft.AspNetCore.Components.ComponentBase
    {
        #pragma warning disable 1998
        protected override void BuildRenderTree(Microsoft.AspNetCore.Components.Rendering.RenderTreeBuilder __builder)
        {
            __builder.OpenElement(0, "div");
            __builder.AddAttribute(1, "id", 
#nullable restore
#line 4 "/Users/ivozhulev/git/jqwidgets-blazor/Shared/JqxWindow.razor"
          componentID

#line default
#line hidden
#nullable disable
            );
            __builder.AddContent(2, 
#nullable restore
#line 4 "/Users/ivozhulev/git/jqwidgets-blazor/Shared/JqxWindow.razor"
                        ChildContent

#line default
#line hidden
#nullable disable
            );
            __builder.CloseElement();
        }
        #pragma warning restore 1998
#nullable restore
#line 6 "/Users/ivozhulev/git/jqwidgets-blazor/Shared/JqxWindow.razor"
       
    [Parameter]
    public bool autoOpen {
        get { return getterProp<bool>("autoOpen"); }
        set { setterProp("autoOpen", value); }
    }

    [Parameter]
    public object animationType {
        get { return getterProp<object>("animationType"); }
        set { setterProp("animationType", value); }
    }

    [Parameter]
    public bool collapsed {
        get { return getterProp<bool>("collapsed"); }
        set { setterProp("collapsed", value); }
    }

    [Parameter]
    public double collapseAnimationDuration {
        get { return getterProp<double>("collapseAnimationDuration"); }
        set { setterProp("collapseAnimationDuration", value); }
    }

    [Parameter]
    public string content {
        get { return getterProp<string>("content"); }
        set { setterProp("content", value); }
    }

    [Parameter]
    public double closeAnimationDuration {
        get { return getterProp<double>("closeAnimationDuration"); }
        set { setterProp("closeAnimationDuration", value); }
    }

    [Parameter]
    public double closeButtonSize {
        get { return getterProp<double>("closeButtonSize"); }
        set { setterProp("closeButtonSize", value); }
    }

    [Parameter]
    public object closeButtonAction {
        get { return getterProp<object>("closeButtonAction"); }
        set { setterProp("closeButtonAction", value); }
    }

    [Parameter]
    public object cancelButton {
        get { return getterProp<object>("cancelButton"); }
        set { setterProp("cancelButton", value); }
    }

    [Parameter]
    public object dragArea {
        get { return getterProp<object>("dragArea"); }
        set { setterProp("dragArea", value); }
    }

    [Parameter]
    public bool draggable {
        get { return getterProp<bool>("draggable"); }
        set { setterProp("draggable", value); }
    }

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
    public object initContent {
        get { return getterProp<object>("initContent"); }
        set { setterProp("initContent", value); }
    }

    [Parameter]
    public bool isModal {
        get { return getterProp<bool>("isModal"); }
        set { setterProp("isModal", value); }
    }

    [Parameter]
    public object keyboardCloseKey {
        get { return getterProp<object>("keyboardCloseKey"); }
        set { setterProp("keyboardCloseKey", value); }
    }

    [Parameter]
    public bool keyboardNavigation {
        get { return getterProp<bool>("keyboardNavigation"); }
        set { setterProp("keyboardNavigation", value); }
    }

    [Parameter]
    public object minHeight {
        get { return getterProp<object>("minHeight"); }
        set { setterProp("minHeight", value); }
    }

    [Parameter]
    public object maxHeight {
        get { return getterProp<object>("maxHeight"); }
        set { setterProp("maxHeight", value); }
    }

    [Parameter]
    public object minWidth {
        get { return getterProp<object>("minWidth"); }
        set { setterProp("minWidth", value); }
    }

    [Parameter]
    public object maxWidth {
        get { return getterProp<object>("maxWidth"); }
        set { setterProp("maxWidth", value); }
    }

    [Parameter]
    public object modalOpacity {
        get { return getterProp<object>("modalOpacity"); }
        set { setterProp("modalOpacity", value); }
    }

    [Parameter]
    public double modalZIndex {
        get { return getterProp<double>("modalZIndex"); }
        set { setterProp("modalZIndex", value); }
    }

    [Parameter]
    public double modalBackgroundZIndex {
        get { return getterProp<double>("modalBackgroundZIndex"); }
        set { setterProp("modalBackgroundZIndex", value); }
    }

    [Parameter]
    public object okButton {
        get { return getterProp<object>("okButton"); }
        set { setterProp("okButton", value); }
    }

    [Parameter]
    public object position {
        get { return getterProp<object>("position"); }
        set { setterProp("position", value); }
    }

    [Parameter]
    public bool rtl {
        get { return getterProp<bool>("rtl"); }
        set { setterProp("rtl", value); }
    }

    [Parameter]
    public bool resizable {
        get { return getterProp<bool>("resizable"); }
        set { setterProp("resizable", value); }
    }

    [Parameter]
    public double showAnimationDuration {
        get { return getterProp<double>("showAnimationDuration"); }
        set { setterProp("showAnimationDuration", value); }
    }

    [Parameter]
    public bool showCloseButton {
        get { return getterProp<bool>("showCloseButton"); }
        set { setterProp("showCloseButton", value); }
    }

    [Parameter]
    public bool showCollapseButton {
        get { return getterProp<bool>("showCollapseButton"); }
        set { setterProp("showCollapseButton", value); }
    }

    [Parameter]
    public string theme {
        get { return getterProp<string>("theme"); }
        set { setterProp("theme", value); }
    }

    [Parameter]
    public string title {
        get { return getterProp<string>("title"); }
        set { setterProp("title", value); }
    }

    [Parameter]
    public object width {
        get { return getterProp<object>("width"); }
        set { setterProp("width", value); }
    }

    [Parameter]
    public double zIndex {
        get { return getterProp<double>("zIndex"); }
        set { setterProp("zIndex", value); }
    }

    [Parameter]
    public object options {
        set { setOptions(value); }
    }

    [Parameter]
    public Action<IDictionary<string, object>> onClose { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onCollapse { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onExpand { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onMoving { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onMoved { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onOpen { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onResizing { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onResized { get; set; }

    [Parameter]
    public RenderFragment ChildContent { get; set; }

    private string[] paramsToBlock = { "ChildContent", "onClose", "onCollapse", "onExpand", "onMoving", "onMoved", "onOpen", "onResizing", "onResized" };

    private IDictionary<string, string> paramsToChange = new Dictionary<string, string>
    {
        { "isChecked", "checked" },
        { "isReadonly", "readonly" },
        { "isDecimal", "decimal" }
    };

    private bool shouldSetters;

    private string componentID;

    private IDictionary<string, object> initialOptions = new Dictionary<string, object>();

    public void bringToFront()
    {
        setterMethod("bringToFront");
    }

    public void close()
    {
        setterMethod("close");
    }

    public void collapse()
    {
        setterMethod("collapse");
    }

    public void closeAll()
    {
        setterMethod("closeAll");
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

    public bool isOpen()
    {
        return getterMethod<bool>("isOpen");
    }

    public void move(double top, double left)
    {
        setterMethod("move", top, left);
    }

    public void open()
    {
        setterMethod("open");
    }

    public void hide()
    {
        setterMethod("hide");
    }

    public void resize(double top, double left)
    {
        setterMethod("resize", top, left);
    }

    public void setTitle(string title)
    {
        setterMethod("setTitle", title);
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
            ((IJSInProcessRuntime)JSRuntime).InvokeVoid("jqxBlazor.createComponent", componentID, "jqxWindow", initialOptions);
            attachEvents();
        }
    }

    private void attachEvents()
    {
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "close", "emitWindowEvent", DotNetObjectReference.Create(new EventsHandler(onClose)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "collapse", "emitWindowEvent", DotNetObjectReference.Create(new EventsHandler(onCollapse)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "expand", "emitWindowEvent", DotNetObjectReference.Create(new EventsHandler(onExpand)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "moving", "emitWindowEvent", DotNetObjectReference.Create(new EventsHandler(onMoving)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "moved", "emitWindowEvent", DotNetObjectReference.Create(new EventsHandler(onMoved)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "open", "emitWindowEvent", DotNetObjectReference.Create(new EventsHandler(onOpen)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "resizing", "emitWindowEvent", DotNetObjectReference.Create(new EventsHandler(onResizing)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "resized", "emitWindowEvent", DotNetObjectReference.Create(new EventsHandler(onResized)));
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
        public void emitWindowEvent(object e)
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
