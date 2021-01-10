import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { Button } from 'reactstrap';
import { ReactComponent as Trophy } from '../assets/trophy-outline.svg';
import { ReactComponent as Add } from '../assets/add-outline.svg';
import { ReactComponent as Remove } from '../assets/close-outline.svg';
import { ReactComponent as Sad } from '../assets/sad-outline.svg';

function Movie({
  poster,
  title,
  year,
  add,
  remove,
  nominated,
  isNominationList,
  movieId,
}) {
  return (
    <Wrapper>
      <div className="movie-card">
        {poster === 'N/A' ? (
          <div className="unavailable">
            <Sad />
            <p>Image unavailable</p>
          </div>
        ) : (
          <img src={poster} alt={title} />
        )}
        <h3>{title}</h3>
        <h4>{year}</h4>
        <div className="button-container">
          {!isNominationList && (
            <Button disabled={nominated} onClick={() => add(movieId)}>
              <Add />
            </Button>
          )}
          {(nominated || isNominationList) && (
            <>
              <Button onClick={() => remove(movieId)}>
                <Remove />
              </Button>
              <div className="trophy">
                <Trophy />
              </div>
            </>
          )}
        </div>
      </div>
    </Wrapper>
  );
}

Movie.propTypes = {
  title: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  poster: PropTypes.string.isRequired,
  remove: PropTypes.func.isRequired,
  add: PropTypes.func.isRequired,
  movieId: PropTypes.string.isRequired,
  nominated: PropTypes.bool,
  isNominationList: PropTypes.bool,
};

export default Movie;

const Wrapper = styled.li`
  list-style-type: none;

  .movie-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 225px;
    margin: 1em;
    padding: 1.5em;
    border: 1.5px solid #a8a8a8;
    box-shadow: 2px 2px 0 0 #a8a8a8;
    border-radius: 25px;
    background-color: #fff;

    img {
      width: 175px;
      border-radius: 15px;
    }

    .unavailable {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 175px;
      height: 243px;
      border: 1px solid #a8a8a8;
      border-radius: 15px;

      svg {
        height: 50px;
        width: 50px;
      }
    }

    h3,
    h4 {
      width: 100%;
    }

    .button-container {
      display: flex;
      justify-content: space-between;
      width: 100%;

      button,
      .trophy {
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 32px;
        width: 32px;
        border-radius: 50%;

        svg {
          height: 24px;
          width: 24px;
        }
      }

      button {
        background-color: white;
        border: 1.5px solid black;
        svg {
          color: black;
        }
      }

      .trophy {
        svg {
          color: gold;
        }
      }
    }
  }
`;
