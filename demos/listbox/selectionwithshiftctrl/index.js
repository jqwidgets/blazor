window.Example = {    
    updateInnerHtml: function(element, items) {
        let selection = "Selected Items: ";        
        for (let i = 0; i < items.length; i++) {
            selection += items[i].label + (i < items.length - 1 ? ", " : "");
        }
        
        element.innerText = selection;
    } 
};
