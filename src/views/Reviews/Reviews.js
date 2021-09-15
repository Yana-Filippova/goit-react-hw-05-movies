import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ErrorComponent from '../../components/Error';
import apiService from '../../services/apiService';
import LoaderComponent from '../../components/Loader';
import Status from '../../services/status';
import ShowMore from 'react-simple-show-more';
import styles from './Reviews.module.css';

export default function Reviews() {
  const { movieId } = useParams();
  const [reviews, setReviews] = useState(null);
  const [status, setStatus] = useState(Status.IDLE);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiService
      .getMovieReview(movieId)
      .then(results => {
        if (results.length === 0) {
          setStatus(Status.IDLE);
          return;
        }
        setReviews(results);
        setStatus(Status.RESOLVED);
      })
      .catch(error => {
        setError(error);
        setStatus(Status.REJECTED);
      });
  }, [movieId, error]);

  return (
    <>
      {status === Status.PENDING && <LoaderComponent />}

      {status === Status.REJECTED && <ErrorComponent message={error} />}

      {status === Status.RESOLVED && (
        <ul className={styles.review}>
          {reviews.map(review => (
            <li key={review.id} className={styles.item}>
              <h2 className={styles.author}>{review.author}</h2>
              <p>
                <ShowMore
                  text={review.content}
                  length={700}
                  showMoreLabel=" Show more >>"
                  showLessLabel=" Show less <<"
                  style={{
                    cursor: 'pointer',
                    color: 'rgba(238, 138, 16, 0.952)',
                    fontWeight: 'bold',
                  }}
                />
              </p>
            </li>
          ))}
        </ul>
      )}
      {status === Status.IDLE && (
        <p>
          <i>We don't have any reviews for this movie.</i>
        </p>
      )}
      {status === Status.REJECTED && <p>{error.message}</p>}
    </>
  );
}
