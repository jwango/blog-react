import Times from '../../public/static/icons/times-solid.svg';
import ExclamationTriangle from '../../public/static/icons/exclamation-triangle-solid.svg';
import styles from './icon.module.scss';

export const IconNames = {
  TIMES: 'times',
  EXCLAMATION_TRIANGLE: 'exclamation-triangle'
};

const iconMap = {
  [IconNames.TIMES]: Times,
  [IconNames.EXCLAMATION_TRIANGLE]: ExclamationTriangle
};

function Icon({ name, baseline=false }) {
  const SelectedComponent = iconMap[name];
  if (!SelectedComponent) { return null; }

  let classes = [ styles['svg-icon'] ];
  if (baseline) {
    classes.push(styles['svg-baseline']);
  }

  return (
    <span className={classes.join(' ')}>
      <SelectedComponent></SelectedComponent>
    </span>
  );
}

export default Icon;