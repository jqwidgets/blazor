window.Example = {
    updateInnerHtmlSelected: function(element, item) {
        element.innerHTML += "<div style='margin-top: 5px;'>Selected: " + item.label + "</div>";
    },
    updateInnerHtmlUnselected: function(element, item) {
        element.innerHTML += "<div style='margin-top: 5px;'>Unselected: " + item.label + "</div>";
    }
};
