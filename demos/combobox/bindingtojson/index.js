window.Example = {
    updateInnerHtml: function(element, item) {
        element.innerHTML = "<div>Value: " + item.value + "</div>" +
            "<div>Label: " + item.label + "</div>";
    }
};
