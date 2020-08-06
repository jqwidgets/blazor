window.Example = {
    updatePageInfo: function (log, paginginformation) {
        log.innerHTML = '<div style="margin-top: 5px;">Page:' + paginginformation.pagenum + ', Page Size: ' + paginginformation.pagesize + ', Pages Count: ' + paginginformation.pagescount + '</div>'; 
    }
};
