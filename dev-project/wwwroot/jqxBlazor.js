const instances = { };

window.jqxBlazor = {
    generateID: function() {
        return JQXLite.generateID();
    },
    createComponent: function(id, name, options) {
        if (options.options) {
            options = { ...options, ...options.options };
            delete options.options;
        }

        instances[id] = new window[name]('#' + id, options);
    },
    setOptions: function(id, options) {
        instances[id].setOptions(options);
    },
    getOptions: function(params) {
        return params;
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
            return instances[id][name](...args);
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
