window.Example = {
    updateInnerHtml: function(selectionLog, checkedLog, item, items) {
        selectionLog.innerHTML = "<div>Label: " + item.label + "</div>";
        selectionLog.innerHTML += "<div>Value: " + item.value + "</div>";
        selectionLog.innerHTML += "<div>Checked: " + item.checked + "</div>";

        checkedLog.innerHTML = '';
        for (let i = 0; i < items.length; i++) {
            checkedLog.innerHTML += items[i].label + ', ';
        }
    }
};
