import PropTypes from 'prop-types';
import Icon, { IconNames } from '../icon/icon.component';

function ErrorView({ error }) {
  if (!error) {
    return null;
  }
  return <h4><Icon name={IconNames.EXCLAMATION_TRIANGLE} baseline={true}></Icon>&nbsp;{error.message}</h4>
}

ErrorView.propTypes = { error: PropTypes.object }

export default ErrorView;