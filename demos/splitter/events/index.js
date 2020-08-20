window.Example = {
    displayEvent: function (panel, type, e) {
        
        let eventData = "Event: " + type;
        eventData += ", Panel 1: " + e.panels[0].size;
        eventData += ", Panel 2: " + e.panels[1].size;
        
        panel.innerHTML += '<div class="item" style="margin-top: 5px;">' + eventData + '</div>'; 
    }
};
