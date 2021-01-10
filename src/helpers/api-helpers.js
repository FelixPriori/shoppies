export const getMovies = ({ Search }) =>
  Search.map((movie) => ({
    title: movie.Title,
    poster: movie.Poster,
    movieId: movie.imdbID,
    year: movie.Year,
  }));
