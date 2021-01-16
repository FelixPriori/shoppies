import { useState, useEffect } from 'react';
import { useLocalNominations } from '../hooks/useLocalNominations';
import axios from 'axios';
import {
  Button,
  Input,
  FormGroup,
  Container,
  Spinner,
  Card,
  CardBody,
  CardTitle,
  CardText,
} from 'reactstrap';
import Movie from './Movie';
import { getMovies, isMovieNominated } from '../helpers/helpers';
import {
  Header,
  SearchPanel,
  Separator,
  Search,
  Instructions,
  SearchResults,
  NominationsList,
  MovieLists,
  MovieList,
  Footer,
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
          const movies = getMovies(data.Search);
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
      .catch((error) =>
        setState((prevState) => ({
          ...prevState,
          error: error.message || '',
          status: 'rejected',
        })),
      );
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

      <SearchPanel>
        <Instructions md={{ size: 6, order: 2 }}>
          <Card>
            <CardBody>
              <CardTitle tag="h2">Instructions</CardTitle>
              <ul>
                <li>Use the search bar to search for your favourite films</li>
                <li>
                  Pick films that you think should be nominated for a Shoppy
                  Award
                </li>
                <li>You can add up to 5 films to the nominations list</li>
              </ul>
            </CardBody>
          </Card>
        </Instructions>
        <Search md={{ size: 6, order: 1 }}>
          <Card>
            <CardBody>
              <FormGroup>
                <CardTitle tag="h2" id="searchTitle">
                  Search
                </CardTitle>
                <Input
                  type="text"
                  id="searchTerm"
                  aria-labelledby="searchTitle"
                  onChange={(e) => onSearchTermChange(e.target.value)}
                  value={searchTerm}
                />
                <Button type="button" onClick={onClearSearch} color="outline">
                  Clear Search
                </Button>
              </FormGroup>
            </CardBody>
          </Card>
        </Search>
      </SearchPanel>

      <Separator />

      <MovieLists>
        <SearchResults>
          <h2>Search Results</h2>
          {status === 'pending' && <Spinner color="dark" />}
          {status === 'idle' && (
            <Card role="alert">
              <CardBody>
                <CardText>
                  Use the search bar to find a movie to nominate
                </CardText>
              </CardBody>
            </Card>
          )}
          {status === 'rejected' && error && (
            <Card inverse color="danger" role="alert">
              <CardBody>
                <CardText>{error}</CardText>
              </CardBody>
            </Card>
          )}
          {status === 'rejected' && !error && (
            <Card inverse color="danger" role="alert">
              <CardBody>
                <CardText>There was a problem with your search</CardText>
              </CardBody>
            </Card>
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
            <Card inverse color="success">
              <CardBody>
                <CardText>Thank you for your nominations!</CardText>
              </CardBody>
            </Card>
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

      <Separator />

      <Footer>
        <p>&#169; Felix Rioux Sabourin 2021</p>
      </Footer>
    </Container>
  );
}

export default MovieNominationsApp;
