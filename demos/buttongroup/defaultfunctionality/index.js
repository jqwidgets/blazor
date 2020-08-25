window.Example = {
    updateInnerHtml: function(element, index) {
        let value;
       switch (index) {
           case 0: value = 'Left';
                break;
            case 1: value = 'Center';
                break;
            case 2: value = 'Right';
                break;
       }
       element.innerHTML = value;    
    } 
};
