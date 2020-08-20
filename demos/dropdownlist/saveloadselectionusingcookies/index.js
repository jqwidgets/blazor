window.Example = {
    setCookie: function (index, name) {
        let cookieName = name;
        let date = new Date();
        let daysToExpire = 1;

        // Clear old value of the cookie
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        // Set a new content of the cookie
        date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
        document.cookie = cookieName + "=" + index + "; expires=" + date.toGMTString();
    },
    getCookie: function (name) {
        name += "=";        
        let unitsArray = document.cookie.split(';');
        for (let i = 0; i < unitsArray.length; i++) {
            let temp = unitsArray[i].trim();
            if (temp.indexOf(name) == 0) {
                let result = temp.substring(name.length, temp.length);
                return result;
            }
        }

        return "0";
    }
};
