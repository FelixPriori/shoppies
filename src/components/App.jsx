import { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import axios from 'axios';
import * as _ from 'lodash';
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
  const [{ movies, searchTerm, nominated, status }, setState] = useState({
    movies: {},
    searchTerm: '',
    nominated: [],
    status: 'idle',
  });

  const searchMovie = () => {
    if (searchTerm === '') return;
    setState((prevState) => {
      return { ...prevState, status: 'pending' };
    });
    const { REACT_APP_OMDB } = process.env;
    const url = `https://www.omdbapi.com/?apikey=${REACT_APP_OMDB}&type=movie&s=${searchTerm}`;
    axios
      .get(url)
      .then(({ data }) =>
        setState((prevState) => {
          return { ...prevState, movies: data, status: 'resolved' };
        }),
      )
      .catch((error) => {
        console.error(error);
        setState((prevState) => {
          return { ...prevState, status: 'rejected' };
        });
      });
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchMovie();
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [searchTerm]);

  const handleClear = () =>
    setState((prevState) => {
      return { ...prevState, searchTerm: '', status: 'idle' };
    });

  const handleChange = (event) =>
    setState((prevState) => {
      return { ...prevState, searchTerm: event.target.value };
    });

  const handleClick = (selected) => {
    const exists = nominated.find((movie) => selected.imdbID === movie.imdbID);
    if (exists) {
      const nominatedMovies = nominated.filter(
        (movie) => movie.imdbID !== selected.imdbID,
      );
      setState((prevState) => {
        return { ...prevState, nominated: nominatedMovies };
      });
    } else {
      if (nominated.length >= 5)
        setState((prevState) => {
          return { ...prevState, status: 'error' };
        });
      else
        setState((prevState) => {
          return { ...prevState, nominated: [...nominated, selected] };
        });
    }
  };

  return (
    <Wrapper>
      <Container>
        <header className="header">
          <h1>The Shoppies</h1>
        </header>
        <div className="separator" />
        <Row>
          <Col>
            <FormWrapper>
              <FormGroup>
                <Label htmlFor="searchTerm">
                  Search for movies to nominate
                </Label>
                <Input
                  type="text"
                  id="searchTerm"
                  onChange={handleChange}
                  value={searchTerm}
                />
              </FormGroup>
              <Button type="button" onClick={handleClear} color="outline">
                Clear Search
              </Button>
            </FormWrapper>
          </Col>
          <Col>
            <MessageWrapper>
              <p>Pick up to five movies that you wish to nominate</p>
            </MessageWrapper>
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
                {!_.isEmpty(movies) &&
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
      </Container>
    </Wrapper>
  );
}

export default App;

const Wrapper = styled.div`
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 5rem;
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

const MessageWrapper = styled.section`
  padding: 3em 0;
  text-align: right;
`;
