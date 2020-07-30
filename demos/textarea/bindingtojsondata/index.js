window.Example = {
    updateInnerHtml: function(selectionlog, data) {
        var item = data.item;
        var valueelement = document.createElement("div");
        valueelement.innerText = item.value;
        var labelelement = document.createElement("div");
        labelelement.innerText = item.label;
        selectionlog.innerHTML = "";
        selectionlog.appendChild(labelelement);
        selectionlog.appendChild(valueelement);
    }
};