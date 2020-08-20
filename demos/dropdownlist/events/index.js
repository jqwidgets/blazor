window.Example = {
    handleSelect: function (element, item) {        
        element.innerHTML += "<div style='margin-top: 5px;'>Selected: " + item.label + "</div>";
    },
    handleUnselect: function (element, item) {
        element.innerHTML += "<div style='margin-top: 5px;'>Unselected: " + item.label + "</div>";
    }
};
