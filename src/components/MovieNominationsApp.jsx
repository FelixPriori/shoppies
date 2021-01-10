import { useState, useEffect } from 'react';
import { useLocalNominations } from '../hooks/useLocalNominations';
import styled from 'styled-components/macro';
import axios from 'axios';
import {
  Button,
  Label,
  Input,
  FormGroup,
  Container,
  Row,
  Col,
  Spinner,
} from 'reactstrap';
import Movie from './Movie';
import { getMovies, isMovieNominated } from '../helpers/helpers';

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
    const { REACT_APP_OMDB } = process.env;
    const url = `https://www.omdbapi.com/?apikey=${REACT_APP_OMDB}&type=movie&s=${searchTerm}`;
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
      <Row>
        <FormWrapper sm="6">
          <div>
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
          </div>
        </FormWrapper>
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
      </Row>
      <Separator big />
      <MovieLists>
        <SearchResults>
          <h2>Search Results</h2>
          {status === 'pending' && <Spinner color="dark" />}
          {status === 'idle' && (
            <div className="card bg-light">
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
          {status === 'rejected' && (
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
              {movies.map((currentMovie) => (
                <Movie
                  key={currentMovie.movieId}
                  add={onAddNomination}
                  remove={onRemoveNomination}
                  nominated={isMovieNominated(nominations, currentMovie)}
                  {...currentMovie}
                />
              ))}
            </MovieList>
          )}
        </SearchResults>
        <NominatedList>
          <h2>{`Your Nominations (${nominations?.length}/5)`}</h2>
          {nominations?.length === 5 && (
            <div className="card text-white bg-success">
              <div className="card-body">
                <p className="card-text">Thank you for your nominations!</p>
              </div>
            </div>
          )}
          {nominations.length > 0 && (
            <MovieList nominated>
              {nominations?.map((movie) => (
                <Movie
                  key={movie.movieId}
                  add={onAddNomination}
                  remove={onRemoveNomination}
                  nominated
                  isNominationList
                  {...movie}
                />
              ))}
            </MovieList>
          )}
        </NominatedList>
      </MovieLists>
    </Container>
  );
}

export default MovieNominationsApp;

const Header = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 5rem;
`;

const Separator = styled.div`
  width: 100%;
  border-bottom: 1.5px solid #adb5bd;

  ${(props) =>
    props.big &&
    `
    @media (max-width: 577px) {
      display: none;
    }
  `}
`;

const FormWrapper = styled(Col)`
  & > div {
    padding: 3em 0;
    max-width: 350px;
  }
`;

const Instructions = styled(Col)`
  padding: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MovieLists = styled(Row)`
  display: flex;
  padding: 3em 0;

  .card {
    margin: 2em 0;
  }
`;

const SearchResults = styled(Col)`
  flex: 1 1 50%;
`;

const NominatedList = styled(Col)`
  flex: 1 1 50%;
  text-align: right;

  @media (max-width: 544px) {
    text-align: left;
  }
`;

const MovieList = styled.ul`
  padding: 0;
  display: flex;
  flex-wrap: wrap;

  ${(props) =>
    props.nominated &&
    `
    justify-content: flex-end;
    @media (max-width: 544px) {
      text-align: left;
      justify-content: flex-start;
    }
  `}
`;
