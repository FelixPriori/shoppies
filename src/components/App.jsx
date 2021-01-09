import { useState, useEffect } from 'react';
import { useLocalNominations } from '../hooks/useLocalNominations';
import styled from 'styled-components/macro';
import axios from 'axios';
import { isEmpty } from 'lodash';
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

function App() {
  const [nominated, setNominated] = useLocalNominations([]);
  const [{ movies, searchTerm, status }, setState] = useState({
    movies: {},
    searchTerm: '',
    status: 'idle',
  });

  const searchMovie = () => {
    if (searchTerm === '') return;
    setState((prevState) => ({ ...prevState, status: 'pending' }));
    const { REACT_APP_OMDB } = process.env;
    const url = `https://www.omdbapi.com/?apikey=${REACT_APP_OMDB}&type=movie&s=${searchTerm}`;
    axios
      .get(url)
      .then(({ data }) =>
        setState((prevState) => ({
          ...prevState,
          movies: data,
          status: 'resolved',
        })),
      )
      .catch((error) => {
        console.error(error);
        setState((prevState) => ({ ...prevState, status: 'rejected' }));
      });
  };

  useEffect(() => {
    // waits 500ms before searching to prevent spamming the api
    const timeOutId = setTimeout(() => {
      searchMovie();
    }, 200);
    return () => clearTimeout(timeOutId);
  }, [searchTerm]);

  const handleClear = () =>
    setState((prevState) => ({ ...prevState, searchTerm: '', status: 'idle' }));

  const onSearchTermChange = (searchTerm) =>
    setState((prevState) => ({ ...prevState, searchTerm }));

  const handleClick = (id) => {
    const exists = nominated.find((movie) => movie.imdbID === id);
    if (exists) {
      const nominatedMovies = nominated.filter((movie) => movie.imdbID !== id);
      setNominated(nominatedMovies);
    } else {
      if (nominated.length >= 5) return;
      else {
        const selected = movies.Search.find((movie) => movie.imdbID === id);
        setNominated([...nominated, selected]);
      }
    }
  };

  return (
    <Wrapper>
      <header className="header">
        <h1>The Shoppies</h1>
      </header>
      <div className="separator" />
      <Row>
        <Col>
          <FormWrapper>
            <FormGroup>
              <Label htmlFor="searchTerm">Search for movies to nominate</Label>
              <Input
                type="text"
                id="searchTerm"
                onChange={(e) => onSearchTermChange(e.target.value)}
                value={searchTerm}
              />
            </FormGroup>
            <Button type="button" onClick={handleClear} color="outline">
              Clear Search
            </Button>
          </FormWrapper>
        </Col>
        <Col className="rules">
          <div className="card bg-light">
            <div className="card-body">
              <h3>Instructions</h3>
              <ul>
                <li>Use the search bar to search for your favourite films</li>
                <li>
                  Pick films that you think should be nominated for a Shoppy
                  Award
                </li>
                <li>You add up to 5 films to the nominations list</li>
              </ul>
            </div>
          </div>
        </Col>
      </Row>
      <div className="separator" />
      <section className="movie-lists">
        <div className="search-results">
          <h2>Search Results</h2>
          {status === 'pending' && <Spinner color="dark" />}
          {status === 'rejected' && (
            <div className="card text-white bg-danger" role="alert">
              <div className="card-body">
                <p className="card-text">
                  There was a problem with your search
                </p>
              </div>
            </div>
          )}
          {status === 'idle' && (
            <div className="card bg-light">
              <div className="card-body">
                <p className="card-text">
                  Use the search bar to find a movie to nominate
                </p>
              </div>
            </div>
          )}
          {status === 'resolved' && movies.Error && (
            <div className="card text-white bg-danger" role="alert">
              <div className="card-body">
                <p className="card-text">No movies matching your search</p>
              </div>
            </div>
          )}
          {status === 'resolved' && (
            <MovieList>
              {!isEmpty(movies) &&
                movies.Search?.map((currentMovie) => {
                  const exists = nominated.find(
                    (movie) => currentMovie.imdbID === movie.imdbID,
                  );
                  return (
                    <Movie
                      key={currentMovie.imdbID}
                      handleClick={handleClick}
                      nominated={Boolean(exists)}
                      {...currentMovie}
                    />
                  );
                })}
            </MovieList>
          )}
        </div>
        <div className="nominated-list">
          <h2>{`Your Nominations (${nominated?.length}/5)`}</h2>
          {nominated?.length === 5 && (
            <div className="card text-white bg-success">
              <div className="card-body">
                <p className="card-text">Thank you for your nominations!</p>
              </div>
            </div>
          )}
          <MovieList nominated>
            {nominated?.map((movie) => (
              <Movie
                key={movie.imdbID}
                handleClick={handleClick}
                nominated
                isNominationList
                {...movie}
              />
            ))}
          </MovieList>
        </div>
      </section>
    </Wrapper>
  );
}

export default App;

const Wrapper = styled(Container)`
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 5rem;
  }

  .rules {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .movie-lists {
    display: flex;
    padding: 3em 0;

    .search-results {
      flex: 1 1 50%;
    }
    .nominated-list {
      flex: 1 1 50%;
      text-align: right;
    }
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
  `}
`;

const FormWrapper = styled.section`
  padding: 3em 0;
  max-width: 350px;
`;
