export const getMovies = ({ Search }) =>
  Search.map((movie) => ({
    title: movie.Title,
    poster: movie.Poster,
    movieId: movie.imdbID,
    year: movie.Year,
  }));

export const isMovieNominated = (nominations, movie) =>
  Boolean(
    nominations.find((nomination) => movie.movieId === nomination.movieId),
  );
