window.Example = {
    handleSelect: function (updating, item, element) {
        element.value = item.value;
    },
    handleChange: function (selectComponent, items, value) {
        for (let i = 0; i < items.length; i++) {
            const element = items[i];
            if (element.value === value) {
                return element.index;
            }
        }
    }
};
