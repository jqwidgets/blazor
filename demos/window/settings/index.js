window.Example = {
    getCoordinates: function (selector) {
        var element = document.querySelector(selector);

        return (element.offsetTop + ";" + element.offsetLeft);
    },
    getValue: function (selector) {
        var element = document.querySelector(selector);

        return element.value;
    }
};
