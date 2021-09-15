import errorImage from '../../img/no_results_found.png';
import styles from './NotFoundView.module.css';

export default function NotFoundView() {
  return (
    <div className={styles.wrapper}>
      <img src={errorImage} width="450" alt="error"></img>
    </div>
  );
}
