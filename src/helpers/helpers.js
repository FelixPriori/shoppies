export const getMovies = ({ Search }) =>
  Search.map((movie) => ({
    title: movie.Title,
    poster: movie.Poster,
    movieId: movie.imdbID,
    year: movie.Year,
  }));

export const isMovieNominated = (nominated, currentMovie) =>
  Boolean(nominated.find((movie) => currentMovie.movieId === movie.movieId));
