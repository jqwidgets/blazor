window.Example = {
    changeContent: function (x, y) {
        var element = document.elementFromPoint(x, y).parentNode;
        var content = document.getElementById("content");
        
        if (element.nodeName == "DIV" || element.nodeName == "SPAN") {
            content.innerHTML = "<div style='margin: 4px;'>" + element.innerText + "</div>";
        }

        if (element.nodeName == "SPAN" && element.className == "special") {
            var spans = element.getElementsByTagName("SPAN");
            content.innerHTML = "<div style='margin: 4px;'>" + spans[0].innerText + "</div>";
        }
    }
};
