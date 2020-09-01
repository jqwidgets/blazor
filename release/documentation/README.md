Blazor lets you build interactive web UIs using C# instead of JavaScript. Blazor apps are composed of reusable web UI components implemented using C#, HTML, and CSS. Blazor can run your client-side C# code directly in the browser, using WebAssembly. Because it's real .NET running on WebAssembly, you can re-use code and libraries from server-side parts of your application.

Prerequisites
.NET Core SDK - This includes everything you need to build and run Blazor WebAssembly apps.

Setup

I. Install templates:

dotnet new -i Microsoft.AspNetCore.Blazor.Templates::3.0.0-preview9.19465.2
II. Create a blazor application:

dotnet new blazorwasm -o jqwidgets-blazor-app

III. Navigate to the application:

cd jqwidgets-blazor-app

IV. Add the jQWidgets.Blazor package:

dotnet add package jQWidgets.Blazor

V. Open _Imports.razor and add the following at the bottom:

@using jQWidgets.Blazor.Components

VI. Open wwwroot/index.html and add the needed styles and scripts. For example if you are going to use JqxBarGauge, the file should look like this:
```
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <title>jqwidgets-blazor-app</title>
        <base href="/" />
 
        <link href="_content/jQWidgets.Blazor/jqwidgets/styles/jqx.base.css">
    </head>
    <body>
        <app>Loading...</app>
 
        <script src="_content/jQWidgets.Blazor/jqwidgets/jqxcore.js"></script>
        <script src="_content/jQWidgets.Blazor/jqwidgets/jqxdraw.js"></script>
        <script src="_content/jQWidgets.Blazor/jqwidgets/jqxbargauge.js"></script>
        <script src="_content/jQWidgets.Blazor/jqxBlazor.js"></script>
 
        <script src="_framework/blazor.webassembly.js"></script>
    </body>
</html>
```
VII. Open Pages/Index.razor and replace the code as follows:
```
<JqxBarGauge 
    width=600 height=600 colorScheme="scheme02"
    max="max" values="values" tooltip="tooltip">
</JqxBarGauge>

@code {
    private int max = 150;
 
    private double[] values = new double[4] { 102, 115, 130, 137 };
 
    private IDictionary<string, bool> tooltip = new Dictionary<string, bool>()
    {
        { "visible", true }
    };
}
``` 
VIII. Start the app and check the result:

dotnet watch run
Events Methods & Properties
I. Events
Below is an example of listening to the JqxBarGauge onDrawEnd event and then doing something with the result:
```
<JqxBarGauge onDrawEnd="onDrawEnd"
    width=600 height=600 values="values">
</JqxBarGauge>

@code {
    private double[] values = new double[4] { 102, 115, 130, 137 };
 
    private void onDrawEnd(IDictionary<string, object> e) 
    {
        @* Do Something... *@
    }
}
 ```
II. Methods & Properties
In order to use methods, first you need to make a reference to the component:
```
<JqxBarGauge @ref="myBarGauge"
    width="350" height="350" values="values">
</JqxBarGauge>

@code {
    JqxBarGauge myBarGauge;
 
    private double[] values = new double[4] { 102, 115, 130, 137 };
 
    protected override void OnAfterRender(bool firstRender)
    {
        if (firstRender)
        {
            double[] newValues = new double[4] { 10, 20, 30, 40 };
            myBarGauge.val(newValues);
        }
    }
}
```
