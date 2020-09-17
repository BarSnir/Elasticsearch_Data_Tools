module.exports = {
    getLoggerTime(){
        const today = new Date(),
        h = today.getHours(),
        m = today.getMinutes(),
        s = today.getSeconds(),
        n = today.getMilliseconds();
        return `${h}:${m}:${s}:${n}`;
    },
    getCurrentDate(){
        const today = new Date(),
        y = today.getUTCFullYear()
        m = today.getMonth()+1;
        d = today.getDate();
        return `${m}-${d}-${y}`;
    },
    isDurationExceed(date){
        const date1 = new Date(date); 
        const date2 = new Date(this.getCurrentDate()); 
        let Difference_In_Time = date2.getTime() - date1.getTime(); 
        Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 
        return Difference_In_Days >= process.env.KEEP_QUERY_DURATION_DAYS;
    }
}