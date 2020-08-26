#pragma checksum "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\Components\JqxListMenu.razor" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "37d9ad1ccbf0b21099e6bd0c1d87f94cc32e222b"
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
#line 1 "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\Components\JqxListMenu.razor"
using System.Text.Json;

#line default
#line hidden
    public partial class JqxListMenu : Microsoft.AspNetCore.Components.ComponentBase
    {
        #pragma warning disable 1998
        protected override void BuildRenderTree(Microsoft.AspNetCore.Components.Rendering.RenderTreeBuilder __builder)
        {
        }
        #pragma warning restore 1998
#line 6 "C:\inetpub\wwwroot\blazor\library\jQWidgets.Blazor\Components\JqxListMenu.razor"
       

    [Parameter]
    public bool alwaysShowNavigationArrows {
        get { return getterProp<bool>("alwaysShowNavigationArrows"); }
        set { setterProp("alwaysShowNavigationArrows", value); }
    }

    [Parameter]
    public object animationType {
        get { return getterProp<object>("animationType"); }
        set { setterProp("animationType", value); }
    }

    [Parameter]
    public object animationDuration {
        get { return getterProp<object>("animationDuration"); }
        set { setterProp("animationDuration", value); }
    }

    [Parameter]
    public bool autoSeparators {
        get { return getterProp<bool>("autoSeparators"); }
        set { setterProp("autoSeparators", value); }
    }

    [Parameter]
    public object backLabel {
        get { return getterProp<object>("backLabel"); }
        set { setterProp("backLabel", value); }
    }

    [Parameter]
    public bool disabled {
        get { return getterProp<bool>("disabled"); }
        set { setterProp("disabled", value); }
    }

    [Parameter]
    public bool enableScrolling {
        get { return getterProp<bool>("enableScrolling"); }
        set { setterProp("enableScrolling", value); }
    }

    [Parameter]
    public object filterCallback {
        get { return getterProp<object>("filterCallback"); }
        set { setterProp("filterCallback", value); }
    }

    [Parameter]
    public object height {
        get { return getterProp<object>("height"); }
        set { setterProp("height", value); }
    }

    [Parameter]
    public object headerAnimationDuration {
        get { return getterProp<object>("headerAnimationDuration"); }
        set { setterProp("headerAnimationDuration", value); }
    }

    [Parameter]
    public object placeHolder {
        get { return getterProp<object>("placeHolder"); }
        set { setterProp("placeHolder", value); }
    }

    [Parameter]
    public bool readOnly {
        get { return getterProp<bool>("readOnly"); }
        set { setterProp("readOnly", value); }
    }

    [Parameter]
    public bool rtl {
        get { return getterProp<bool>("rtl"); }
        set { setterProp("rtl", value); }
    }

    [Parameter]
    public bool roundedCorners {
        get { return getterProp<bool>("roundedCorners"); }
        set { setterProp("roundedCorners", value); }
    }

    [Parameter]
    public bool showNavigationArrows {
        get { return getterProp<bool>("showNavigationArrows"); }
        set { setterProp("showNavigationArrows", value); }
    }

    [Parameter]
    public bool showFilter {
        get { return getterProp<bool>("showFilter"); }
        set { setterProp("showFilter", value); }
    }

    [Parameter]
    public bool showHeader {
        get { return getterProp<bool>("showHeader"); }
        set { setterProp("showHeader", value); }
    }

    [Parameter]
    public bool showBackButton {
        get { return getterProp<bool>("showBackButton"); }
        set { setterProp("showBackButton", value); }
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
    public Action onComponentReady { get; set; }

    [Parameter]
    public RenderFragment ChildContent { get; set; }

    private string[] paramsToBlock = { "onComponentReady", "ChildContent" };

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

    public void back()
    {
        setterMethod("back");
    }

    public void changePage(object Item)
    {
        setterMethod("changePage", Item);
    }

    public void destroy()
    {
        setterMethod("destroy");
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
            ((IJSInProcessRuntime)JSRuntime).InvokeVoid("jqxBlazor.createComponent", componentID, "jqxListMenu", initialOptions);

            Task.Delay(200).ContinueWith((action) =>
            {
                attachEvents();
                onComponentReady?.Invoke();
            }); 
        }
    }

    private void attachEvents()
    {
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



#line default
#line hidden
        [global::Microsoft.AspNetCore.Components.InjectAttribute] private IJSRuntime JSRuntime { get; set; }
    }
}
#pragma warning restore 1591
