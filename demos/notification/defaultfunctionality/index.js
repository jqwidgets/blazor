window.Example = {
    setTimeString: function () {
        let date = new Date();
        let minutes = date.getMinutes();
        let minutesString = '';
        if (minutes < 10) {
            minutesString = "0" + minutes;
        } else {
            minutesString = "" + minutes;
        }
        let seconds = date.getSeconds();
        let secondsString = '';
        if (seconds < 10) {
            secondsString = "0" + seconds;
        } else {
            secondsString = "" + seconds;
        }
        let timeSpan = document.getElementById('currentTime');
        timeSpan.innerText = date.getHours() + ":" + minutesString + ":" + secondsString;
    }   
};
