window.Example = {
    updateFilterInfo: function (log, filterinfo) {
        log.innerHTML = "";
        for (let i = 0; i < filterinfo.length; i += 1) {
            let eventData = 'Filter Column: ' + filterinfo[i].filtercolumntext;
            log.innerHTML += ('<div style="margin-top: 5px;">' + eventData + '</div>');
        }        
    }
};
