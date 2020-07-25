import moment from 'moment';

/**
 * Class used to manupilate dates across the frontend
 */
class DateHelper {
    /**
     * Formats the date into the format commonly used on the frontend
     * @param {Date} dateToFormat The date to be formatted
     * @returns {String} String format of the date
     */
    static formatDateFromUI(dateToFormat) {
        return moment.utc(dateToFormat).format('YY-MM-DD');
    }
}

export default DateHelper;