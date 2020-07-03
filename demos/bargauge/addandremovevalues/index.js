window.Example = {
    logSum: function (log, items) {

        let sum = 0;
        for (let i = 0; i < items.length; i++) {
            sum += +(items[i].value);
        }
        log.innerHTML = '<strong>Summary calories: ' + sum + '</strong>';
    }
};
