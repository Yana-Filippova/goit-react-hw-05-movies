import { useState, useEffect, Suspense, lazy } from 'react';
import {
  NavLink,
  useParams,
  useRouteMatch,
  Switch,
  Route,
  useHistory,
  useLocation,
} from 'react-router-dom';

import apiService from '../../services/apiService';
import Status from '../../services/status';
import LoaderComponent from '../../components/Loader';
import ErrorComponent from '../../components/Error';
import noPhoto from '../../img/no_image.jpg';
import styles from './MovieDetailsPage.module.css';

const Cast = lazy(() => import('../Cast' /* webpackChunkName: "cast"*/));
const Reviews = lazy(() =>
  import('../Reviews' /* webpackChunkName: "reviews"*/),
);

export default function MovieDetailsPage() {
  const history = useHistory();
  const location = useLocation();
  const [movie, setMovie] = useState(null);
  const { movieId } = useParams();
  const { url, path } = useRouteMatch();
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(Status.IDLE);

  useEffect(() => {
    setStatus(Status.PENDING);
    apiService
      .getMovieById(movieId)
      .then(data => {
        setMovie(data);
        setStatus(Status.RESOLVED);
      })
      .catch(error => {
        console.log(error);
        setError('Something went wrong. Please try again.');
        setStatus(Status.REJECTED);
      });
  }, [movieId, error]);

  const onGoBack = () => {
    history.push(location?.state?.from?.location ?? '/movies');
  };

  return (
    <>
      {status === Status.PENDING && <LoaderComponent />}

      {status === Status.REJECTED && <ErrorComponent />}

      {status === Status.RESOLVED && (
        <>
          <button type="button" className={styles.button} onClick={onGoBack}>
            &#8656;&ensp; Go back
          </button>
          <div className={styles.movies}>
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                  : noPhoto
              }
              alt={movie.title}
              width="250"
            />
            <div className={styles.about}>
              <h1 className={styles.mainTitle}>{movie.title} </h1>
              <p className={styles.score}>
                User Score: {movie.vote_average * 10}%
              </p>
              <h3 className={styles.title}>
                Overview
                <span className={styles.description}>{movie.overview}</span>
              </h3>
              {movie.genres && (
                <>
                  <h3 className={styles.title}>Genres</h3>
                  <ul className={styles.genre}>
                    {movie.genres.map(genre => (
                      <li key={genre.id}>{genre.name}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          <nav className={styles.navigation}>
            <p className={styles.information}>Additional information</p>

            <NavLink
              to={{
                pathname: `${url}/cast`,
                state: { from: { location } },
              }}
              className={styles.link}
              activeClassName={styles.activeLink}
            >
              Cast
            </NavLink>

            <NavLink
              to={{
                pathname: `${url}/reviews`,
                state: { from: { location } },
              }}
              className={styles.link}
              activeClassName={styles.activeLink}
            >
              Reviews
            </NavLink>
          </nav>

          <Suspense fallback={<LoaderComponent />}>
            <Switch>
              <Route path={`${path}/cast`}>
                {status === Status.RESOLVED && <Cast />}
              </Route>

              <Route path={`${path}/reviews`}>
                {status === Status.RESOLVED && <Reviews />}
              </Route>
            </Switch>
          </Suspense>
        </>
      )}
    </>
  );
}
