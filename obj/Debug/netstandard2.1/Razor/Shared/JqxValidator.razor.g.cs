#pragma checksum "/Users/ivozhulev/git/jqwidgets-blazor/Shared/JqxValidator.razor" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "47acba91a32b8038a289cffc78337397ddf9d7eb"
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
#line 1 "/Users/ivozhulev/git/jqwidgets-blazor/Shared/JqxValidator.razor"
using System.Text.Json;

#line default
#line hidden
#nullable disable
    public partial class JqxValidator : Microsoft.AspNetCore.Components.ComponentBase
    {
        #pragma warning disable 1998
        protected override void BuildRenderTree(Microsoft.AspNetCore.Components.Rendering.RenderTreeBuilder __builder)
        {
            __builder.OpenElement(0, "div");
            __builder.AddAttribute(1, "id", 
#nullable restore
#line 4 "/Users/ivozhulev/git/jqwidgets-blazor/Shared/JqxValidator.razor"
          componentID

#line default
#line hidden
#nullable disable
            );
            __builder.AddContent(2, 
#nullable restore
#line 4 "/Users/ivozhulev/git/jqwidgets-blazor/Shared/JqxValidator.razor"
                        ChildContent

#line default
#line hidden
#nullable disable
            );
            __builder.CloseElement();
        }
        #pragma warning restore 1998
#nullable restore
#line 6 "/Users/ivozhulev/git/jqwidgets-blazor/Shared/JqxValidator.razor"
       
    [Parameter]
    public bool arrow {
        get { return getterProp<bool>("arrow"); }
        set { setterProp("arrow", value); }
    }

    [Parameter]
    public object animation {
        get { return getterProp<object>("animation"); }
        set { setterProp("animation", value); }
    }

    [Parameter]
    public double animationDuration {
        get { return getterProp<double>("animationDuration"); }
        set { setterProp("animationDuration", value); }
    }

    [Parameter]
    public bool closeOnClick {
        get { return getterProp<bool>("closeOnClick"); }
        set { setterProp("closeOnClick", value); }
    }

    [Parameter]
    public bool focus {
        get { return getterProp<bool>("focus"); }
        set { setterProp("focus", value); }
    }

    [Parameter]
    public object hintType {
        get { return getterProp<object>("hintType"); }
        set { setterProp("hintType", value); }
    }

    [Parameter]
    public object onError {
        get { return getterProp<object>("onError"); }
        set { setterProp("onError", value); }
    }

    [Parameter]
    public object onSuccess {
        get { return getterProp<object>("onSuccess"); }
        set { setterProp("onSuccess", value); }
    }

    [Parameter]
    public string position {
        get { return getterProp<string>("position"); }
        set { setterProp("position", value); }
    }

    [Parameter]
    public object rules {
        get { return getterProp<object>("rules"); }
        set { setterProp("rules", value); }
    }

    [Parameter]
    public bool rtl {
        get { return getterProp<bool>("rtl"); }
        set { setterProp("rtl", value); }
    }

    [Parameter]
    public object options {
        set { setOptions(value); }
    }

    [Parameter]
    public Action<IDictionary<string, object>> onValidationError { get; set; }

    [Parameter]
    public Action<IDictionary<string, object>> onValidationSuccess { get; set; }

    [Parameter]
    public RenderFragment ChildContent { get; set; }

    private string[] paramsToBlock = { "ChildContent", "onValidationError", "onValidationSuccess" };

    private IDictionary<string, string> paramsToChange = new Dictionary<string, string>
    {
        { "isChecked", "checked" },
        { "isReadonly", "readonly" },
        { "isDecimal", "decimal" }
    };

    private bool shouldSetters;

    private string componentID;

    private IDictionary<string, object> initialOptions = new Dictionary<string, object>();

    public void hideHint(string id)
    {
        setterMethod("hideHint", id);
    }

    public void hide()
    {
        setterMethod("hide");
    }

    public void updatePosition()
    {
        setterMethod("updatePosition");
    }

    public void validate(object htmlElement)
    {
        setterMethod("validate", htmlElement);
    }

    public void validateInput(string id)
    {
        setterMethod("validateInput", id);
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
            ((IJSInProcessRuntime)JSRuntime).InvokeVoid("jqxBlazor.createComponent", componentID, "jqxValidator", initialOptions);
            attachEvents();
        }
    }

    private void attachEvents()
    {
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "validationError", "emitValidatorEvent", DotNetObjectReference.Create(new EventsHandler(onValidationError)));
        ((IJSInProcessRuntime)JSRuntime).Invoke<object>("jqxBlazor.manageEvents", componentID, "validationSuccess", "emitValidatorEvent", DotNetObjectReference.Create(new EventsHandler(onValidationSuccess)));
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
        public void emitValidatorEvent(object e)
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
