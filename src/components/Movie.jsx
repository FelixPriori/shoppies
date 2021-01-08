import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { Button } from 'reactstrap';
import { ReactComponent as Trophy } from '../assets/trophy-outline.svg';
import { ReactComponent as Add } from '../assets/add-outline.svg';
import { ReactComponent as Remove } from '../assets/close-outline.svg';

function Movie(props) {
  const {
    Poster,
    Title,
    Year,
    handleClick,
    nominated,
    isNominationList,
  } = props;
  return (
    <Wrapper>
      <div className="movie-card">
        <img src={Poster} alt={Title} />
        <h3>{Title}</h3>
        <h4>{Year}</h4>
        <div className="button-container">
          {!isNominationList && (
            <Button disabled={nominated} onClick={() => handleClick(props)}>
              <Add />
            </Button>
          )}
          {(nominated || isNominationList) && (
            <Button onClick={() => handleClick(props)}>
              <Remove />
            </Button>
          )}
          {(nominated || isNominationList) && (
            <div className="trophy">
              <Trophy />
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
}

Movie.propTypes = {
  Title: PropTypes.string.isRequired,
  Year: PropTypes.string.isRequired,
  Poster: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
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
