export default class Utils {
    static formatDate(timestamp, dateonly) {
        var date = new Date(timestamp);
        if (dateonly) {
            return date.getDate() + '/' + (date.getMonth() + 1);
        } else {
            return date.getDate() + '/' + (date.getMonth() + 1) + ' '
                + date.getHours() + ':' + ("0" + date.getMinutes()).substr(-2);
        }
    }

    static formatInterval(interval) {
        var hours = Math.floor(interval / 3600);
        var days = Math.floor(hours / 8);
        return ((days) ? days + 'd ' : '') + (hours - 8 * days) + 'h';
    }
}