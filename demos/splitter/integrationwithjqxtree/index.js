window.Example = {
    changeContent: function(x, y, contentElement) {
        var element = document.elementFromPoint(x, y).parentNode;
        if (element.localName == "span" || element.localName == "div") {
            contentElement.innerText = element.innerText;
        }
    }
};