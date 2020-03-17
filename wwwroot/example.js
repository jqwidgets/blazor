window.Example = {
    buildColumns: function() {
        const columns =  [
            {
                text: 'First Name2', datafield: 'firstName', width: 100,
                createwidget: "createwidget",
                initwidget: function (row, column, value, htmlElement) {
                    console.log(row, column, value, htmlElement);
                }
            },
            { text: 'Last Name', datafield: 'lastName', width: 200 }
        ];

        return columns;
    },

    
    initwidget: function(row, column, value, htmlElement) {
        console.log(row, column, value, htmlElement);
    },
    test: function(source) {
        return new jqx.dataadapter(source);
    },

    updateInnerHtml: function(a, b) {
        console.log(a, b);
    } 
};

function createwidget(row, column, value, htmlElement) {
    console.log(row, column, value, htmlElement);
}

//JSRuntime.InvokeAsync<object>("Example.test", source);