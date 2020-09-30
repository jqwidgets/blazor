#pragma checksum "C:\inetpub\wwwroot\blazor\dev-project\App.razor" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "a4c23db16242500782da4b57b4c7aaa81dc2a580"
// <auto-generated/>
#pragma warning disable 1591
#pragma warning disable 0414
#pragma warning disable 0649
#pragma warning disable 0169

namespace blazor_web
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Components;
#nullable restore
#line 1 "C:\inetpub\wwwroot\blazor\dev-project\_Imports.razor"
using System.Net.Http;

#line default
#line hidden
#nullable disable
#nullable restore
#line 2 "C:\inetpub\wwwroot\blazor\dev-project\_Imports.razor"
using Microsoft.AspNetCore.Components.Forms;

#line default
#line hidden
#nullable disable
#nullable restore
#line 3 "C:\inetpub\wwwroot\blazor\dev-project\_Imports.razor"
using Microsoft.AspNetCore.Components.Routing;

#line default
#line hidden
#nullable disable
#nullable restore
#line 4 "C:\inetpub\wwwroot\blazor\dev-project\_Imports.razor"
using Microsoft.AspNetCore.Components.Web;

#line default
#line hidden
#nullable disable
#nullable restore
#line 5 "C:\inetpub\wwwroot\blazor\dev-project\_Imports.razor"
using Microsoft.JSInterop;

#line default
#line hidden
#nullable disable
#nullable restore
#line 6 "C:\inetpub\wwwroot\blazor\dev-project\_Imports.razor"
using blazor_web;

#line default
#line hidden
#nullable disable
#nullable restore
#line 7 "C:\inetpub\wwwroot\blazor\dev-project\_Imports.razor"
using jQWidgets.Blazor.Components;

#line default
#line hidden
#nullable disable
    public partial class App : Microsoft.AspNetCore.Components.ComponentBase
    {
        #pragma warning disable 1998
        protected override void BuildRenderTree(Microsoft.AspNetCore.Components.Rendering.RenderTreeBuilder __builder)
        {
        }
        #pragma warning restore 1998
#nullable restore
#line 5 "C:\inetpub\wwwroot\blazor\dev-project\App.razor"
       

    IDictionary<string, object> source = new Dictionary<string, object>()
    {
        { 
            "dataFields",
            new Dictionary<string, string>[]
            {
                new Dictionary<string, string>() { { "name", "firstname" }, { "type", "string" } },
                new Dictionary<string, string>() { { "name", "lastname" }, { "type", "string" } },
                new Dictionary<string, string>() { { "name", "productname" }, { "type", "string" } },
                new Dictionary<string, string>() { { "name", "quantity" }, { "type", "number" } },
                new Dictionary<string, string>() { { "name", "price" }, { "type", "number" } },
                new Dictionary<string, string>() { { "name", "total" }, { "type", "number" } }
            }
        },
        { "datatype", "array" },
        { "localdata", generateData(200) }
    };

    IDictionary<string, object>[] columns = new Dictionary<string, object>[]
    {
        new Dictionary<string, object>() 
        {
            { "text", "Name" }, { "datafield", "firstname" }, { "width", 120 }
        },
        new Dictionary<string, object>() 
        {
            { "text", "Last Name" }, { "datafield", "lastname" }, { "width", 120 }
        },
        new Dictionary<string, object>() 
        {
            { "text", "Product" }, { "datafield", "productname" }, { "width", 180 }
        },
        new Dictionary<string, object>() 
        {
            { "text", "Quantity" }, { "datafield", "quantity" }, { "width", 80 }, { "cellalign", "right" }
        },
        new Dictionary<string, object>() 
        {
            { "text", "Unit Price" }, { "datafield", "price" }, { "width", 90 }, { "cellalign", "right" }, { "cellsformat", "c2" }
        },
        new Dictionary<string, object>() 
        {
            { "text", "Total" }, { "datafield", "total" }, { "cellsalign", "right" }, { "cellsformat", "c2" }
        }
    };

    public static IList<IDictionary<string, object>> generateData(int number)
    {
        IList<IDictionary<string, object>> data = new List<IDictionary<string, object>>();

        string[] firstNames = new string[] { "Andrew", "Nancy", "Shelley", "Regina", "Yoshi", "Antoni", "Mayumi", "Ian", "Peter", "Lars", "Petra", "Martin", "Sven", "Elio", "Beate", "Cheryl", "Michael", "Guylene" };
        string[] lastNames = new string[] { "Fuller", "Davolio", "Burke", "Murphy", "Nagase", "Saavedra", "Ohno", "Devling", "Wilson", "Peterson", "Winkler", "Bein", "Petersen", "Rossi", "Vileid", "Saylor", "Bjorn", "Nodier" };
        string[] productNames = new string[] { "Black Tea", "Green Tea", "Caffe Espresso", "Doubleshot Espresso", "Caffe Latte", "White Chocolate Mocha", "Cramel Latte", "Caffe Americano", "Cappuccino", "Espresso Truffle", "Espresso con Panna", "Peppermint Mocha Twist" };
        double[] priceValues = new double[] { 2.25, 1.5, 3.0, 3.3, 4.5, 3.6, 3.8, 2.5, 5.0, 1.75, 3.25, 4.0 };

        Random random = new Random();
        for (int i = 0; i < number; i++)
        {
           
            Dictionary<string, object> row = new Dictionary<string, object>();
            int productIndex = random.Next(0, productNames.Count());    
            double price = priceValues[productIndex];
            int quantity = random.Next(1, 100);

            row.Add("firstname", firstNames[random.Next(0, firstNames.Length)]);
            row.Add("lastname", lastNames[random.Next(0, lastNames.Length)]);
            row.Add("productname", productNames[random.Next(0, productNames.Length)]);
            row.Add("price", price);
            row.Add("quantity", quantity);
            row.Add("total", price * quantity);

            data.Add(row);
        }

        return data;
    }

#line default
#line hidden
#nullable disable
    }
}
#pragma warning restore 1591