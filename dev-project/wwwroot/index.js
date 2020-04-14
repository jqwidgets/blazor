window.Example = {
    updateInnerHtml: function (selectionlog, checkedItemsLog, item, items) {
        selectionlog.innerHTML = "<div>Label: " + item.label + "</div>" +
            "<div>Value: " + item.value + "</div>" +
            "<div>Checked: " + item.checked + "</div>";
        var result = "";     
        for (let i = 0; i < items.length; i++) {
            const element = items[i];
            result += items[i].label + ", ";
        }

        result = result.substring(0, result.length - 2);
        checkedItemsLog.innerHTML = "<div>" + result + "</div>";        
    }
};
