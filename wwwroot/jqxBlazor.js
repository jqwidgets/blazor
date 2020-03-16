const instances = { };

window.jqxBlazor = {
    generateID: function() {
        return JQXLite.generateID();
    },
    createComponent: function(id, name, options) {
        instances[id] = new window[name]('#' + id, options);
    },
    setOptions: function(id, options) {
        instances[id].setOptions(options);
    },
    manageProps: function(id, name, value) {
        if (id) {
            if (value) {
                instances[id][name] = value;
            } else {
                return instances[id][name];
            }
        }
    },
    manageMethods: function(id, name, args) {
        if (id) {
            if (args) {
                instances[id][name](...args);
            } else {
                return instances[id][name]();
            }
        }
    },
    manageEvents: function(id, eventName, methodName, dotNet) {
        instances[id].on(eventName, event => {
            
            for (const item in event.args) {
                try {
                    JSON.stringify(event.args[item]);
                } catch {
                    event.args[item] = { };
                }
            }

            dotNet.invokeMethod(methodName, event.args);
        });
    }
};
