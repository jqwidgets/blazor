window.Example = {
    updateInnerHtml: function (element, item) {
        element.innerHTML = "<div>Value: " + item.value + "</div>" +
            "<div>Label: " + item.label + "</div>";

        console.log(item);
    },
    setCookie: function (item, index) {
        var cookieName = "jqxDropDownList_jqxWidget";
        console.log(item, index, document.cookie);
        // Clear old value of the cookie
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";

        var date = new Date();
        var daysToExpire = 1;
        date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
        // document.cookie = cookieName + "=" + cookieValue + "; expires=" + date.toGMTString();

        document.cookie = cookieName + "=" + index + "; expires=" + date.toGMTString();
        console.log("document.cookie", document.cookie);
        

    },
    getCookie: function (name) {
        var cookieName = "jqxDropDownList_jqxWidget";
        console.log("getCookie", document.cookie, name);

        var name = cookieName + "=";
        var unitsArray = document.cookie.split(';');
        console.log(unitsArray);
        
        for (var i = 0; i < unitsArray.length; i++) {
            var temp = unitsArray[i].trim();
            if (temp.indexOf(name) == 0) {
                var result = temp.substring(name.length, temp.length);
                console.log(result);
                return result;
            }
        }

        return null;

        // return document.cookie;
    },
    testFunction: function (variable) {
        console.log("testFunction() - variable:", variable);
        console.log(jqx);


        return "Result testFunction - ТУК ЩЕ ВЪРНА РЕЗУЛТАТА ОТ XML файла";
    },
    readTextFile: function (file) {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    var allText = rawFile.responseText;
                    // alert(allText);
                    console.log(1881, allText);
                }
            }
        }

        rawFile.send(null);
    },
    WriteCookie: function (name, value, days) {
        var expires;
        console.log(2112, arguments);

        // if (days) {
        //     var date = new Date();
        //     date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        //     expires = "; expires=" + date.toGMTString();
        // }
        // else {
        //     expires = "";
        // }

        // document.cookie = name + "=" + value + expires + "; path=/";
    }
};
