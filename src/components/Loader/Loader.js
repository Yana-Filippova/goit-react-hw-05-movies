import Loader from 'react-loader-spinner';
import styles from './Loader.module.css';

export default function LoaderComponent() {
  return (
    <Loader
      className={styles.loader}
      type="Grid"
      color="#fff"
      height={80}
      width={80}
      timeout={4000}
    />
  );
}
