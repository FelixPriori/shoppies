import { useState, useEffect } from 'react';
import { useLocalNominations } from '../hooks/useLocalNominations';
import axios from 'axios';
import {
  Button,
  Label,
  Input,
  FormGroup,
  Container,
  Spinner,
} from 'reactstrap';
import Movie from './Movie';
import { getMovies, isMovieNominated } from '../helpers/helpers';
import {
  Header,
  Dashboard,
  Separator,
  Search,
  Instructions,
  SearchResults,
  NominationsList,
  MovieLists,
  MovieList,
} from '../styles/styled-components';
import { apiUrl } from '../externalMovieApi';

function MovieNominationsApp() {
  const [nominations, setNominations] = useLocalNominations([]);
  const [{ movies, searchTerm, status, error }, setState] = useState({
    movies: {},
    searchTerm: '',
    status: 'idle',
    error: '',
  });

  const searchMovie = () => {
    if (searchTerm === '') return;
    setState((prevState) => ({ ...prevState, status: 'pending' }));
    const url = `${apiUrl}&s=${searchTerm}`;
    axios
      .get(url)
      .then(({ data }) => {
        if (data.Response === 'True') {
          const movies = getMovies(data);
          setState((prevState) => ({
            ...prevState,
            movies,
            status: 'resolved',
            error: '',
          }));
        } else {
          setState((prevState) => ({
            ...prevState,
            error: data.Error || '',
            status: 'rejected',
          }));
        }
      })
      .catch((error) => {
        console.error(error);
        setState((prevState) => ({
          ...prevState,
          error: error.message || '',
          status: 'rejected',
        }));
      });
  };

  useEffect(() => {
    // waits 200ms before searching to prevent spamming the api
    const timeOutId = setTimeout(() => {
      searchMovie();
    }, 200);
    return () => clearTimeout(timeOutId);
  }, [searchTerm]);

  const onClearSearch = () =>
    setState((prevState) => ({
      ...prevState,
      searchTerm: '',
      status: 'idle',
      error: '',
    }));

  const onSearchTermChange = (searchTerm) =>
    setState((prevState) => ({ ...prevState, searchTerm }));

  const onAddNomination = (movieId) => {
    if (nominations.length >= 5) return;
    const selected = movies.find((movie) => movie.movieId === movieId);
    setNominations([...nominations, selected]);
  };

  const onRemoveNomination = (movieId) => {
    const nominatedMovies = nominations.filter(
      (movie) => movie.movieId !== movieId,
    );
    setNominations(nominatedMovies);
  };

  return (
    <Container>
      <Header>
        <h1>The Shoppies</h1>
      </Header>

      <Separator />

      <Dashboard>
        <Search sm="6">
          <FormGroup>
            <Label htmlFor="searchTerm">Search</Label>
            <Input
              type="text"
              id="searchTerm"
              onChange={(e) => onSearchTermChange(e.target.value)}
              value={searchTerm}
            />
          </FormGroup>
          <Button type="button" onClick={onClearSearch} color="outline">
            Clear Search
          </Button>
        </Search>
        <Instructions sm="6">
          <div className="card bg-light">
            <div className="card-body">
              <h3>Instructions</h3>
              <ul>
                <li>Use the search bar to search for your favourite films</li>
                <li>
                  Pick films that you think should be nominated for a Shoppy
                  Award
                </li>
                <li>You can add up to 5 films to the nominations list</li>
              </ul>
            </div>
          </div>
        </Instructions>
      </Dashboard>

      <Separator />

      <MovieLists>
        <SearchResults>
          <h2>Search Results</h2>
          {status === 'pending' && <Spinner color="dark" />}
          {status === 'idle' && (
            <div className="card bg-light" role="alert">
              <div className="card-body">
                <p className="card-text">
                  Use the search bar to find a movie to nominate
                </p>
              </div>
            </div>
          )}
          {status === 'rejected' && error && (
            <div className="card text-white bg-danger" role="alert">
              <div className="card-body">
                <p className="card-text">{error}</p>
              </div>
            </div>
          )}
          {status === 'rejected' && !error && (
            <div className="card text-white bg-danger" role="alert">
              <div className="card-body">
                <p className="card-text">
                  There was a problem with your search
                </p>
              </div>
            </div>
          )}
          {status === 'resolved' && (
            <MovieList>
              {movies.map((movie) => (
                <Movie
                  key={movie.movieId}
                  onAdd={onAddNomination}
                  onRemove={onRemoveNomination}
                  nominated={isMovieNominated(nominations, movie)}
                  {...movie}
                />
              ))}
            </MovieList>
          )}
        </SearchResults>

        <NominationsList>
          <h2>{`Your Nominations (${nominations?.length}/5)`}</h2>
          {nominations?.length === 5 && (
            <div className="card text-white bg-success">
              <div className="card-body">
                <p className="card-text">Thank you for your nominations!</p>
              </div>
            </div>
          )}
          {nominations?.length > 0 && (
            <MovieList nominated>
              {nominations.map((movie) => (
                <Movie
                  key={movie.movieId}
                  onAdd={onAddNomination}
                  onRemove={onRemoveNomination}
                  nominated
                  isNominationList
                  {...movie}
                />
              ))}
            </MovieList>
          )}
        </NominationsList>
      </MovieLists>
    </Container>
  );
}

export default MovieNominationsApp;
