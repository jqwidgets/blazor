window.Example = {    
    handleCheckChange: function (eventsLog, checkedItemsLog, item, items) {
        if (item.checked) {
            eventsLog.innerText = "Checked: " + args.label;
        } else {
            eventsLog.innerText = "Unchecked: " + args.label;
        }

        let checkedItems = "";     
        for (let i = 0; i < items.length; i++) {
            const element = items[i];
            if (i < items.length - 1) {
                checkedItems += element.label + ", ";
            } else {
                checkedItems += element.label;
            }
        }

        checkedItemsLog.innerHTML = "<div>" + checkedItems + "</div>";
    } 
};
