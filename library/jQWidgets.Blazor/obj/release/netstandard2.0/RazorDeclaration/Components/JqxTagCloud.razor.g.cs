#pragma checksum "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\Components\JqxTagCloud.razor" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "2ec96d66d866c7767a8a1960a6f12ff9bd9e9492"
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
#line 1 "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\Components\JqxTagCloud.razor"
using System.Text.Json;

#line default
#line hidden
    public partial class JqxTagCloud : Microsoft.AspNetCore.Components.ComponentBase
    {
        #pragma warning disable 1998
        protected override void BuildRenderTree(Microsoft.AspNetCore.Components.Rendering.RenderTreeBuilder __builder)
        {
        }
        #pragma warning restore 1998
#line 6 "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\Components\JqxTagCloud.razor"
       

    [Parameter]
    public object alterTextCase {
        get { return getterProp<object>("alterTextCase"); }
        set { setterProp("alterTextCase", value); }
    }

    [Parameter]
    public bool disabled {
        get { return getterProp<bool>("disabled"); }
        set { setterProp("disabled", value); }
    }

    [Parameter]
    public double displayLimit {
        get { return getterProp<double>("displayLimit"); }
        set { setterProp("displayLimit", value); }
    }

    [Parameter]
    public string displayMember {
        get { return getterProp<string>("displayMember"); }
        set { setterProp("displayMember", value); }
    }

    [Parameter]
    public bool displayValue {
        get { return getterProp<bool>("displayValue"); }
        set { setterProp("displayValue", value); }
    }

    [Parameter]
    public object fontSizeUnit {
        get { return getterProp<object>("fontSizeUnit"); }
        set { setterProp("fontSizeUnit", value); }
    }

    [Parameter]
    public object height {
        get { return getterProp<object>("height"); }
        set { setterProp("height", value); }
    }

    [Parameter]
    public string maxColor {
        get { return getterProp<string>("maxColor"); }
        set { setterProp("maxColor", value); }
    }

    [Parameter]
    public double maxFontSize {
        get { return getterProp<double>("maxFontSize"); }
        set { setterProp("maxFontSize", value); }
    }

    [Parameter]
    public double maxValueToDisplay {
        get { return getterProp<double>("maxValueToDisplay"); }
        set { setterProp("maxValueToDisplay", value); }
    }

    [Parameter]
    public string minColor {
        get { return getterProp<string>("minColor"); }
        set { setterProp("minColor", value); }
    }

    [Parameter]
    public double minFontSize {
        get { return getterProp<double>("minFontSize"); }
        set { setterProp("minFontSize", value); }
    }

    [Parameter]
    public double minValueToDisplay {
        get { return getterProp<double>("minValueToDisplay"); }
        set { setterProp("minValueToDisplay", value); }
    }

    [Parameter]
    public bool rtl {
        get { return getterProp<bool>("rtl"); }
        set { setterProp("rtl", value); }
    }

    [Parameter]
    public object sortBy {
        get { return getterProp<object>("sortBy"); }
        set { setterProp("sortBy", value); }
    }

    [Parameter]
    public object sortOrder {
        get { return getterProp<object>("sortOrder"); }
        set { setterProp("sortOrder", value); }
    }

    [Parameter]
    public object source {
        get { return getterProp<object>("source"); }
        set { setterProp("source", value); }
    }

    [Parameter]
    public object tagRenderer {
        get { return getterProp<object>("tagRenderer"); }
        set { setterProp("tagRenderer", value); }
    }

    [Parameter]
    public bool takeTopWeightedItems {
        get { return getterProp<bool>("takeTopWeightedItems"); }
        set { setterProp("takeTopWeightedItems", value); }
    }

    [Parameter]
    public string textColor {
        get { return getterProp<string>("textColor"); }
        set { setterProp("textColor", value); }
    }

    [Parameter]
    public string urlBase {
        get { return getterProp<string>("urlBase"); }
        set { setterProp("urlBase", value); }
    }

    [Parameter]
    public string urlMember {
        get { return getterProp<string>("urlMember"); }
        set { setterProp("urlMember", value); }
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
    public Action<IDictionary<string, object>> onItemClick { get; set; }

    [Parameter]
    public Action onComponentReady { get; set; }

    [Parameter]
    public RenderFragment ChildContent { get; set; }

    private string[] paramsToBlock = { "onComponentReady", "ChildContent", "onBindingComplete", "onItemClick" };

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

    public double findTagIndex(string tag)
    {
        return getterMethod<double>("findTagIndex", tag);
    }

    public object[] getHiddenTagsList()
    {
        return getterMethod<object[]>("getHiddenTagsList");
    }

    public object[] getRenderedTags()
    {
        return getterMethod<object[]>("getRenderedTags");
    }

    public object[] getTagsList()
    {
        return getterMethod<object[]>("getTagsList");
    }

    public void hideItem(double index)
    {
        setterMethod("hideItem", index);
    }

    public void insertAt(double index, object item)
    {
        setterMethod("insertAt", index, item);
    }

    public void removeAt(double index)
    {
        setterMethod("removeAt", index);
    }

    public void updateAt(double index, object item)
    {
        setterMethod("updateAt", index, item);
    }

    public void showItem(double index)
    {
        setterMethod("showItem", index);
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
            ((IJSInProcessRuntime)JSRuntime).InvokeVoid("jqxBlazor.createComponent", componentID, "jqxTagCloud", initialOptions);

            Task.Delay(200).ContinueWith((action) =>
            {
                attachEvents();
                onComponentReady?.Invoke();
            }); 
        }
    }

    private void attachEvents()
    {
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "bindingComplete", "emitTagCloudEvent", DotNetObjectReference.Create(new EventsHandler(onBindingComplete)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "itemClick", "emitTagCloudEvent", DotNetObjectReference.Create(new EventsHandler(onItemClick)));
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
        public void emitTagCloudEvent(object e)
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