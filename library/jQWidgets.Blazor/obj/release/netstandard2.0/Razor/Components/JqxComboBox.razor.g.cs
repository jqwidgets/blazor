#pragma checksum "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\Components\JqxComboBox.razor" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "0c550f3f90b492f20e1cb557387a492acaa62e29"
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
#line 1 "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\Components\JqxComboBox.razor"
using System.Text.Json;

#line default
#line hidden
    public partial class JqxComboBox : Microsoft.AspNetCore.Components.ComponentBase
    {
        #pragma warning disable 1998
        protected override void BuildRenderTree(Microsoft.AspNetCore.Components.Rendering.RenderTreeBuilder __builder)
        {
            __builder.OpenElement(0, "div");
            __builder.AddAttribute(1, "id", 
#line 4 "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\Components\JqxComboBox.razor"
          componentID

#line default
#line hidden
            );
            __builder.AddContent(2, 
#line 4 "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\Components\JqxComboBox.razor"
                        ChildContent

#line default
#line hidden
            );
            __builder.CloseElement();
        }
        #pragma warning restore 1998
#line 6 "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\Components\JqxComboBox.razor"
       

    [Parameter]
    public object animationType {
        get { return getterProp<object>("animationType"); }
        set { setterProp("animationType", value); }
    }

    [Parameter]
    public bool autoComplete {
        get { return getterProp<bool>("autoComplete"); }
        set { setterProp("autoComplete", value); }
    }

    [Parameter]
    public bool autoOpen {
        get { return getterProp<bool>("autoOpen"); }
        set { setterProp("autoOpen", value); }
    }

    [Parameter]
    public bool autoItemsHeight {
        get { return getterProp<bool>("autoItemsHeight"); }
        set { setterProp("autoItemsHeight", value); }
    }

    [Parameter]
    public bool autoDropDownHeight {
        get { return getterProp<bool>("autoDropDownHeight"); }
        set { setterProp("autoDropDownHeight", value); }
    }

    [Parameter]
    public double closeDelay {
        get { return getterProp<double>("closeDelay"); }
        set { setterProp("closeDelay", value); }
    }

    [Parameter]
    public bool checkboxes {
        get { return getterProp<bool>("checkboxes"); }
        set { setterProp("checkboxes", value); }
    }

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
    public object dropDownHeight {
        get { return getterProp<object>("dropDownHeight"); }
        set { setterProp("dropDownHeight", value); }
    }

    [Parameter]
    public object dropDownWidth {
        get { return getterProp<object>("dropDownWidth"); }
        set { setterProp("dropDownWidth", value); }
    }

    [Parameter]
    public bool enableHover {
        get { return getterProp<bool>("enableHover"); }
        set { setterProp("enableHover", value); }
    }

    [Parameter]
    public bool enableSelection {
        get { return getterProp<bool>("enableSelection"); }
        set { setterProp("enableSelection", value); }
    }

    [Parameter]
    public bool enableBrowserBoundsDetection {
        get { return getterProp<bool>("enableBrowserBoundsDetection"); }
        set { setterProp("enableBrowserBoundsDetection", value); }
    }

    [Parameter]
    public object height {
        get { return getterProp<object>("height"); }
        set { setterProp("height", value); }
    }

    [Parameter]
    public double itemHeight {
        get { return getterProp<double>("itemHeight"); }
        set { setterProp("itemHeight", value); }
    }

    [Parameter]
    public bool multiSelect {
        get { return getterProp<bool>("multiSelect"); }
        set { setterProp("multiSelect", value); }
    }

    [Parameter]
    public double minLength {
        get { return getterProp<double>("minLength"); }
        set { setterProp("minLength", value); }
    }

    [Parameter]
    public double openDelay {
        get { return getterProp<double>("openDelay"); }
        set { setterProp("openDelay", value); }
    }

    [Parameter]
    public double popupZIndex {
        get { return getterProp<double>("popupZIndex"); }
        set { setterProp("popupZIndex", value); }
    }

    [Parameter]
    public string placeHolder {
        get { return getterProp<string>("placeHolder"); }
        set { setterProp("placeHolder", value); }
    }

    [Parameter]
    public bool remoteAutoComplete {
        get { return getterProp<bool>("remoteAutoComplete"); }
        set { setterProp("remoteAutoComplete", value); }
    }

    [Parameter]
    public double remoteAutoCompleteDelay {
        get { return getterProp<double>("remoteAutoCompleteDelay"); }
        set { setterProp("remoteAutoCompleteDelay", value); }
    }

    [Parameter]
    public object renderer {
        get { return getterProp<object>("renderer"); }
        set { setterProp("renderer", value); }
    }

    [Parameter]
    public object renderSelectedItem {
        get { return getterProp<object>("renderSelectedItem"); }
        set { setterProp("renderSelectedItem", value); }
    }

    [Parameter]
    public bool rtl {
        get { return getterProp<bool>("rtl"); }
        set { setterProp("rtl", value); }
    }

    [Parameter]
    public double selectedIndex {
        get { return getterProp<double>("selectedIndex"); }
        set { setterProp("selectedIndex", value); }
    }

    [Parameter]
    public bool showArrow {
        get { return getterProp<bool>("showArrow"); }
        set { setterProp("showArrow", value); }
    }

    [Parameter]
    public bool showCloseButtons {
        get { return getterProp<bool>("showCloseButtons"); }
        set { setterProp("showCloseButtons", value); }
    }

    [Parameter]
    public object searchMode {
        get { return getterProp<object>("searchMode"); }
        set { setterProp("searchMode", value); }
    }

    [Parameter]
    public object search {
        get { return getterProp<object>("search"); }
        set { setterProp("search", value); }
    }

    [Parameter]
    public object source {
        get { return getterProp<object>("source"); }
        set { setterProp("source", value); }
    }

    [Parameter]
    public object scrollBarSize {
        get { return getterProp<object>("scrollBarSize"); }
        set { setterProp("scrollBarSize", value); }
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
    public object validateSelection {
        get { return getterProp<object>("validateSelection"); }
        set { setterProp("validateSelection", value); }
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
    public Action<IDictionary<string, object>> onBindingComplete { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onCheckChange { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onClose { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onChange { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onOpen { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onSelect { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onUnselect { get; set; }

    [Parameter]
    public Action onComponentReady { get; set; }

    [Parameter]
    public RenderFragment ChildContent { get; set; }

    private string[] paramsToBlock = { "onComponentReady", "ChildContent", "onBindingComplete", "onCheckChange", "onClose", "onChange", "onOpen", "onSelect", "onUnselect" };

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

    public bool addItem(object item)
    {
        return getterMethod<bool>("addItem", item);
    }

    public void clearSelection()
    {
        setterMethod("clearSelection");
    }

    public void clear()
    {
        setterMethod("clear");
    }

    public void close()
    {
        setterMethod("close");
    }

    public void checkIndex(double index)
    {
        setterMethod("checkIndex", index);
    }

    public void checkItem(object item)
    {
        setterMethod("checkItem", item);
    }

    public void checkAll()
    {
        setterMethod("checkAll");
    }

    public void destroy()
    {
        setterMethod("destroy");
    }

    public void disableItem(object item)
    {
        setterMethod("disableItem", item);
    }

    public void disableAt(double index)
    {
        setterMethod("disableAt", index);
    }

    public void enableItem(object item)
    {
        setterMethod("enableItem", item);
    }

    public void enableAt(double index)
    {
        setterMethod("enableAt", index);
    }

    public void ensureVisible(double index)
    {
        setterMethod("ensureVisible", index);
    }

    public void focus()
    {
        setterMethod("focus");
    }

    public object getItem(double index)
    {
        return getterMethod<object>("getItem", index);
    }

    public object getItemByValue(string value)
    {
        return getterMethod<object>("getItemByValue", value);
    }

    public object[] getVisibleItems()
    {
        return getterMethod<object[]>("getVisibleItems");
    }

    public object[] getItems()
    {
        return getterMethod<object[]>("getItems");
    }

    public object[] getCheckedItems()
    {
        return getterMethod<object[]>("getCheckedItems");
    }

    public object getSelectedItem()
    {
        return getterMethod<object>("getSelectedItem");
    }

    public object[] getSelectedItems()
    {
        return getterMethod<object[]>("getSelectedItems");
    }

    public double getSelectedIndex()
    {
        return getterMethod<double>("getSelectedIndex");
    }

    public bool insertAt(object item, double index)
    {
        return getterMethod<bool>("insertAt", item, index);
    }

    public bool isOpened()
    {
        return getterMethod<bool>("isOpened");
    }

    public void indeterminateIndex(double index)
    {
        setterMethod("indeterminateIndex", index);
    }

    public void indeterminateItem(object item)
    {
        setterMethod("indeterminateItem", item);
    }

    public void loadFromSelect(string selectTagId)
    {
        setterMethod("loadFromSelect", selectTagId);
    }

    public void open()
    {
        setterMethod("open");
    }

    public bool removeItem(object item)
    {
        return getterMethod<bool>("removeItem", item);
    }

    public bool removeAt(double index)
    {
        return getterMethod<bool>("removeAt", index);
    }

    public void selectIndex(double index)
    {
        setterMethod("selectIndex", index);
    }

    public void selectItem(object item)
    {
        setterMethod("selectItem", item);
    }

    public string searchString()
    {
        return getterMethod<string>("searchString");
    }

    public void updateItem(object item, string itemValue)
    {
        setterMethod("updateItem", item, itemValue);
    }

    public void updateAt(object item, object index)
    {
        setterMethod("updateAt", item, index);
    }

    public void unselectIndex(double index)
    {
        setterMethod("unselectIndex", index);
    }

    public void unselectItem(object item)
    {
        setterMethod("unselectItem", item);
    }

    public void uncheckIndex(double index)
    {
        setterMethod("uncheckIndex", index);
    }

    public void uncheckItem(object item)
    {
        setterMethod("uncheckItem", item);
    }

    public void uncheckAll()
    {
        setterMethod("uncheckAll");
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
            ((IJSInProcessRuntime)JSRuntime).InvokeVoid("jqxBlazor.createComponent", componentID, "jqxComboBox", initialOptions);

            Task.Delay(200).ContinueWith((action) =>
            {
                attachEvents();
                onComponentReady?.Invoke();
            }); 
        }
    }

    private void attachEvents()
    {
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "bindingComplete", "emitComboBoxEvent", DotNetObjectReference.Create(new EventsHandler(onBindingComplete)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "checkChange", "emitComboBoxEvent", DotNetObjectReference.Create(new EventsHandler(onCheckChange)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "close", "emitComboBoxEvent", DotNetObjectReference.Create(new EventsHandler(onClose)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "change", "emitComboBoxEvent", DotNetObjectReference.Create(new EventsHandler(onChange)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "open", "emitComboBoxEvent", DotNetObjectReference.Create(new EventsHandler(onOpen)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "select", "emitComboBoxEvent", DotNetObjectReference.Create(new EventsHandler(onSelect)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "unselect", "emitComboBoxEvent", DotNetObjectReference.Create(new EventsHandler(onUnselect)));
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
        public void emitComboBoxEvent(object e)
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