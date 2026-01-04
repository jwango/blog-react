import Image from 'next/image';
import styles from './icon.module.scss';

export const IconNames = {
  TIMES: 'times',
  EXCLAMATION_TRIANGLE: 'exclamation-triangle'
};

const iconMap = {
  [IconNames.TIMES]: 'static/icons/times-solid.svg',
  [IconNames.EXCLAMATION_TRIANGLE]: 'static/icons/exclamation-triangle-solid.svg'
};

function Icon({ name, baseline=false }) {
  const iconPath = iconMap[name];
  if (!iconPath) { return null; }

  let classes = [ styles['svg-icon'] ];
  if (baseline) {
    classes.push(styles['svg-baseline']);
  }

  return (
    <span className={classes.join(' ')}>
      <Image src={iconPath} width='16' height='16'></Image>
    </span>
  );
}

export default Icon;