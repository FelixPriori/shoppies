import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import faker from 'faker';
import MovieNominationsApp from '../components/MovieNominationsApp';

const { REACT_APP_OMDB } = process.env;

const server = setupServer(
  rest.get(
    `https://www.omdbapi.com/?apikey=${REACT_APP_OMDB}&type=movie&s=batman`,
    async (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          Search: [
            {
              Title: 'Batman Begins',
              Year: '2005',
              imdbID: 'tt0372784',
              Type: 'movie',
              Poster:
                'https://m.media-amazon.com/images/M/MV5BOTY4YjI2N2MtYmFlMC00ZjcyLTg3YjEtMDQyM2ZjYzQ5YWFkXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
            },
            {
              Title: 'Batman v Superman: Dawn of Justice',
              Year: '2016',
              imdbID: 'tt2975590',
              Type: 'movie',
              Poster:
                'https://m.media-amazon.com/images/M/MV5BYThjYzcyYzItNTVjNy00NDk0LTgwMWQtYjMwNmNlNWJhMzMyXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
            },
            {
              Title: 'Batman',
              Year: '1989',
              imdbID: 'tt0096895',
              Type: 'movie',
              Poster:
                'https://m.media-amazon.com/images/M/MV5BMTYwNjAyODIyMF5BMl5BanBnXkFtZTYwNDMwMDk2._V1_SX300.jpg',
            },
            {
              Title: 'Batman Returns',
              Year: '1992',
              imdbID: 'tt0103776',
              Type: 'movie',
              Poster:
                'https://m.media-amazon.com/images/M/MV5BOGZmYzVkMmItM2NiOS00MDI3LWI4ZWQtMTg0YWZkODRkMmViXkEyXkFqcGdeQXVyODY0NzcxNw@@._V1_SX300.jpg',
            },
          ],
          totalResults: '328',
          Response: 'True',
        }),
      );
    },
  ),
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

test('Searching should display search results', async () => {
  render(<MovieNominationsApp />);

  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    '"Use the search bar to find a movie to nominate"',
  );

  const input = screen.getByLabelText(/search/i);
  userEvent.type(input, 'batman');
  expect(input).toHaveValue('batman');

  await waitForElementToBeRemoved(() => screen.getByRole('alert'));
  await waitForElementToBeRemoved(() => screen.getByRole('status'));

  const movieCard = screen.getByText(/batman begins/i);
  expect(movieCard).toBeInTheDocument();
});

test('if "Response: false", the error message is displayed', async () => {
  const Error = faker.lorem.sentence();

  server.use(
    rest.get(
      `https://www.omdbapi.com/?apikey=${REACT_APP_OMDB}&type=movie&s=a`,
      async (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ Response: 'False', Error }));
      },
    ),
  );

  render(<MovieNominationsApp />);

  const prompt = screen.getByRole('alert');
  expect(prompt.textContent).toMatchInlineSnapshot(
    '"Use the search bar to find a movie to nominate"',
  );

  const input = screen.getByLabelText(/search/i);
  userEvent.type(input, 'a');
  expect(input).toHaveValue('a');

  await waitForElementToBeRemoved(() => screen.getByRole('alert'));
  await waitForElementToBeRemoved(() => screen.getByRole('status'));

  expect(screen.getByRole('alert')).toHaveTextContent(Error);
});

test('if there is an unknown error, the error message is displayed', async () => {
  server.use(
    rest.get(
      `https://www.omdbapi.com/?apikey=${REACT_APP_OMDB}&type=movie&s=a`,
      async (req, res, ctx) => {
        return res(ctx.status(500));
      },
    ),
  );

  render(<MovieNominationsApp />);

  const prompt = screen.getByRole('alert');
  expect(prompt.textContent).toMatchInlineSnapshot(
    '"Use the search bar to find a movie to nominate"',
  );

  const input = screen.getByLabelText(/search/i);
  userEvent.type(input, 'a');
  expect(input).toHaveValue('a');

  await waitForElementToBeRemoved(() => screen.getByRole('alert'));
  await waitForElementToBeRemoved(() => screen.getByRole('status'));

  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    '"Request failed with status code 500"',
  );
});
