window.Example = {
    setCookie: function (index, name) {
        var cookieName = name;
        // Clear old value of the cookie
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";        
        var date = new Date();
        var daysToExpire = 1;
        date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
        document.cookie = cookieName + "=" + index + "; expires=" + date.toGMTString();
    },
    getCookie: function (name) {
        name += "=";        
        var unitsArray = document.cookie.split(';');
        for (var i = 0; i < unitsArray.length; i++) {
            var temp = unitsArray[i].trim();
            if (temp.indexOf(name) == 0) {
                var result = temp.substring(name.length, temp.length);
                return result;
            }
        }

        return "0";
    }
};
