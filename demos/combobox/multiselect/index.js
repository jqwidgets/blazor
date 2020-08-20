window.Example = {
    updateInnerHtml: function(element, items) {
        element.innerHTML = html;

        let selectedItems = "Selected Items: ";
        for (let i = 0; i < items.length; i++) {
            selectedItems += items[i].label;
            if (items.length - 1 !== i) {
                selectedItems += ', ';
            }
        }
        element.innerText = selectedItems;                    
    }
};
