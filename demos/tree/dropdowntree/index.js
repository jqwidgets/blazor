window.Example = {
    changeContent: function (x, y) {
        var element = document.elementFromPoint(x, y).parentNode;
        
        return element.innerText;
    }
};
