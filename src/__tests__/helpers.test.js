import faker from 'faker';
import { getMovies, isMovieNominated } from '../helpers/helpers';

const buildMovie = () => ({
  title: faker.lorem.sentence(),
  poster: faker.image.imageUrl(),
  movieId: faker.random.uuid(),
  year: faker.random.number(),
});

const buildSearchData = () => ({
  Title: faker.lorem.sentence(),
  Poster: faker.image.imageUrl(),
  imdbID: faker.random.uuid(),
  Year: faker.random.number(),
});

test('getMovies should take in the Search array and return a new array of objects using that data', () => {
  const searchData = buildSearchData();
  const data = {
    Search: [searchData],
  };
  const received = getMovies(data);
  const expected = [
    {
      title: searchData.Title,
      poster: searchData.Poster,
      movieId: searchData.imdbID,
      year: searchData.Year,
    },
  ];

  expect(received).toEqual(expected);
});

test('isMovieNominated should return true if movieId is found in nominations list', () => {
  const movie1 = buildMovie();
  const movie2 = buildMovie();
  const movie3 = buildMovie();
  const nominations = [movie1, movie2, movie3];
  const received = isMovieNominated(nominations, movie3);
  expect(received).toBe(true);
});

test('isMovieNominated should return false if movieId is not found in nominations list', () => {
  const movie1 = buildMovie();
  const movie2 = buildMovie();
  const movie3 = buildMovie();
  const movie4 = buildMovie();
  const nominations = [movie1, movie2, movie3];
  const received = isMovieNominated(nominations, movie4);
  expect(received).toBe(false);
});
