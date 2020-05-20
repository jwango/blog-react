import PropTypes from 'prop-types';
import format from 'date-fns/format';
import parse from 'date-fns/parse';

function Time({ dateTime }) {
  if (!dateTime) {
    return null;
  }
  const today = new Date();
  const date = parse(dateTime);
  const dateFormat = date.getFullYear() === today.getFullYear() ? 'MMM D' : 'MMM D, YYYY';
  return <time dateTime={dateTime}>{format(date, dateFormat)}</time>;
}

Time.propTypes = { dateTime: PropTypes.string };

export default Time;