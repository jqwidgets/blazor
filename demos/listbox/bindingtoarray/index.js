window.Example = {    
    handleSelect: function (element, item) {
        let valueelement = document.createElement("div");
        valueelement.innerText = "Value: " + item.value;
        let labelelement = document.createElement("div");
        labelelement.innerText = "Label: " + item.label;
        element.innerHTML = "";
        element.appendChild(labelelement);
        element.appendChild(valueelement);
    } 
};
