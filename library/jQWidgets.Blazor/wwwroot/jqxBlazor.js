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

        if (options.id) {
            delete options.id;
        }

        options = checkForIsoStrings(options);

        options = checkForDataAdapterNeed(options);

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

function checkForIsoStrings(options) {
    for (let [key, value] of Object.entries(options)) {
        if (typeof value !== 'string') {
            continue;
        }

        const dateRegexp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
        const matches = value.match(dateRegexp);

        if (matches) {
            options[key] = new Date(value);
        }
    }

    return options;
}

function checkForDataAdapterNeed(options) {
    if (options.source && options.source.dataFields) {
        options.source = new jqx.dataAdapter(options.source);
    }

    if (options.resources && options.resources.dataFields) {
        options.resources = new jqx.dataAdapter(options.resources);
    }

    if (options.source && options.source.dataSource) {
        options.source = new jqx.pivot(
            new jqx.dataAdapter(options.source.dataSource),
            options.source.options
        );
    }

    return options;
}
