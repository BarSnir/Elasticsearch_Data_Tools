module.exports = {
    getLoggerTime(){
        const today = new Date(),
        h = today.getHours(),
        m = today.getMinutes(),
        s = today.getSeconds(),
        n = today.getMilliseconds();
        return `${h}:${m}:${s}:${n}`;
    }
}