window.Example = {    
    updateInnerHtml: function(element, items) {
        var selection = "Selected Items: ";        
        for (var i = 0; i < items.length; i++) {
            selection += items[i].label + (i < items.length - 1 ? ", " : "");
        }
        
        element.innerText = selection;
    } 
};
