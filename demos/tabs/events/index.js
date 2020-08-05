window.Example = {
    displayEvent: function (panel, type, info) {
        let eventData = type;

        if (type === 'DragEnd') {
            eventData += ', Drop index: ' + info;
        } else {
            eventData += ': ' + info;  
        }    
              
        panel.innerHTML += '<div style="margin-top: 5px;">' + eventData + '</div>';    
    }
};
