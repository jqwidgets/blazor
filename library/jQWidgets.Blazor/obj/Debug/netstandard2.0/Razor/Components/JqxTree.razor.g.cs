#pragma checksum "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\Components\JqxTree.razor" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "672c5757ad4787239cf5036d9396b7d68572f26e"
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
#line 1 "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\Components\JqxTree.razor"
using System.Text.Json;

#line default
#line hidden
    public partial class JqxTree : Microsoft.AspNetCore.Components.ComponentBase
    {
        #pragma warning disable 1998
        protected override void BuildRenderTree(Microsoft.AspNetCore.Components.Rendering.RenderTreeBuilder __builder)
        {
            __builder.OpenElement(0, "div");
            __builder.AddAttribute(1, "id", 
#line 4 "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\Components\JqxTree.razor"
          componentID

#line default
#line hidden
            );
            __builder.AddContent(2, 
#line 4 "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\Components\JqxTree.razor"
                        ChildContent

#line default
#line hidden
            );
            __builder.CloseElement();
        }
        #pragma warning restore 1998
#line 6 "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\Components\JqxTree.razor"
       

    [Parameter]
    public double animationShowDuration {
        get { return getterProp<double>("animationShowDuration"); }
        set { setterProp("animationShowDuration", value); }
    }

    [Parameter]
    public double animationHideDuration {
        get { return getterProp<double>("animationHideDuration"); }
        set { setterProp("animationHideDuration", value); }
    }

    [Parameter]
    public bool allowDrag {
        get { return getterProp<bool>("allowDrag"); }
        set { setterProp("allowDrag", value); }
    }

    [Parameter]
    public bool allowDrop {
        get { return getterProp<bool>("allowDrop"); }
        set { setterProp("allowDrop", value); }
    }

    [Parameter]
    public bool checkboxes {
        get { return getterProp<bool>("checkboxes"); }
        set { setterProp("checkboxes", value); }
    }

    [Parameter]
    public object dragStart {
        get { return getterProp<object>("dragStart"); }
        set { setterProp("dragStart", value); }
    }

    [Parameter]
    public object dragEnd {
        get { return getterProp<object>("dragEnd"); }
        set { setterProp("dragEnd", value); }
    }

    [Parameter]
    public bool disabled {
        get { return getterProp<bool>("disabled"); }
        set { setterProp("disabled", value); }
    }

    [Parameter]
    public string easing {
        get { return getterProp<string>("easing"); }
        set { setterProp("easing", value); }
    }

    [Parameter]
    public bool enableHover {
        get { return getterProp<bool>("enableHover"); }
        set { setterProp("enableHover", value); }
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
    public bool incrementalSearch {
        get { return getterProp<bool>("incrementalSearch"); }
        set { setterProp("incrementalSearch", value); }
    }

    [Parameter]
    public bool keyboardNavigation {
        get { return getterProp<bool>("keyboardNavigation"); }
        set { setterProp("keyboardNavigation", value); }
    }

    [Parameter]
    public bool rtl {
        get { return getterProp<bool>("rtl"); }
        set { setterProp("rtl", value); }
    }

    [Parameter]
    public object source {
        get { return getterProp<object>("source"); }
        set { setterProp("source", value); }
    }

    [Parameter]
    public double toggleIndicatorSize {
        get { return getterProp<double>("toggleIndicatorSize"); }
        set { setterProp("toggleIndicatorSize", value); }
    }

    [Parameter]
    public object toggleMode {
        get { return getterProp<object>("toggleMode"); }
        set { setterProp("toggleMode", value); }
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
    public object options { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onAdded { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onCheckChange { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onCollapse { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onDragStart { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onDragEnd { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onExpand { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onItemClick { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onRemoved { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onSelect { get; set; }

    [Parameter]
    public Action onComponentReady { get; set; }

    [Parameter]
    public RenderFragment ChildContent { get; set; }

    private string[] paramsToBlock = { "onComponentReady", "ChildContent", "onAdded", "onCheckChange", "onCollapse", "onDragStart", "onDragEnd", "onExpand", "onItemClick", "onRemoved", "onSelect" };

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

    public void addBefore(object item, string id)
    {
        setterMethod("addBefore", item, id);
    }

    public void addAfter(object item, string id)
    {
        setterMethod("addAfter", item, id);
    }

    public void addTo(object item, object id)
    {
        setterMethod("addTo", item, id);
    }

    public void clear()
    {
        setterMethod("clear");
    }

    public void checkAll()
    {
        setterMethod("checkAll");
    }

    public void checkItem(object item, bool isChecked)
    {
        setterMethod("checkItem", item, isChecked);
    }

    public void collapseAll()
    {
        setterMethod("collapseAll");
    }

    public void collapseItem(object item)
    {
        setterMethod("collapseItem", item);
    }

    public void destroy()
    {
        setterMethod("destroy");
    }

    public void disableItem(object item)
    {
        setterMethod("disableItem", item);
    }

    public void ensureVisible(object item)
    {
        setterMethod("ensureVisible", item);
    }

    public void enableItem(object item)
    {
        setterMethod("enableItem", item);
    }

    public void enableAll()
    {
        setterMethod("enableAll");
    }

    public void expandAll()
    {
        setterMethod("expandAll");
    }

    public void expandItem(object item)
    {
        setterMethod("expandItem", item);
    }

    public void focus()
    {
        setterMethod("focus");
    }

    public object getCheckedItems()
    {
        return getterMethod<object>("getCheckedItems");
    }

    public object getUncheckedItems()
    {
        return getterMethod<object>("getUncheckedItems");
    }

    public object getItems()
    {
        return getterMethod<object>("getItems");
    }

    public object getItem(object element)
    {
        return getterMethod<object>("getItem", element);
    }

    public object getSelectedItem()
    {
        return getterMethod<object>("getSelectedItem");
    }

    public object getPrevItem(object item)
    {
        return getterMethod<object>("getPrevItem", item);
    }

    public object getNextItem(object item)
    {
        return getterMethod<object>("getNextItem", item);
    }

    public object hitTest(double left, double top)
    {
        return getterMethod<object>("hitTest", left, top);
    }

    public void removeItem(object item)
    {
        setterMethod("removeItem", item);
    }

    public void render()
    {
        setterMethod("render");
    }

    public void refresh()
    {
        setterMethod("refresh");
    }

    public void selectItem(object item)
    {
        setterMethod("selectItem", item);
    }

    public void uncheckAll()
    {
        setterMethod("uncheckAll");
    }

    public void uncheckItem(object item)
    {
        setterMethod("uncheckItem", item);
    }

    public void updateItem(object item, object newItem)
    {
        setterMethod("updateItem", item, newItem);
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
            ((IJSInProcessRuntime)JSRuntime).InvokeVoid("jqxBlazor.createComponent", componentID, "jqxTree", initialOptions);

            Task.Delay(200).ContinueWith((action) =>
            {
                attachEvents();
                onComponentReady?.Invoke();
            }); 
        }
    }

    private void attachEvents()
    {
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "added", "emitTreeEvent", DotNetObjectReference.Create(new EventsHandler(onAdded)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "checkChange", "emitTreeEvent", DotNetObjectReference.Create(new EventsHandler(onCheckChange)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "collapse", "emitTreeEvent", DotNetObjectReference.Create(new EventsHandler(onCollapse)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "dragStart", "emitTreeEvent", DotNetObjectReference.Create(new EventsHandler(onDragStart)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "dragEnd", "emitTreeEvent", DotNetObjectReference.Create(new EventsHandler(onDragEnd)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "expand", "emitTreeEvent", DotNetObjectReference.Create(new EventsHandler(onExpand)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "itemClick", "emitTreeEvent", DotNetObjectReference.Create(new EventsHandler(onItemClick)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "removed", "emitTreeEvent", DotNetObjectReference.Create(new EventsHandler(onRemoved)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "select", "emitTreeEvent", DotNetObjectReference.Create(new EventsHandler(onSelect)));
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
        public void emitTreeEvent(object e)
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
