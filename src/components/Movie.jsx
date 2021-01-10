import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { ReactComponent as Trophy } from '../assets/trophy-outline.svg';
import { ReactComponent as Add } from '../assets/add-outline.svg';
import { ReactComponent as Remove } from '../assets/close-outline.svg';
import { ReactComponent as Sad } from '../assets/sad-outline.svg';
import {
  MovieWrapper,
  MovieCard,
  FallbackPoster,
  ButtonContainer,
  TrophyContainer,
} from '../styles/styled-components';

function Movie({
  poster,
  title,
  year,
  onAdd,
  onRemove,
  nominated,
  isNominationList,
  movieId,
}) {
  return (
    <MovieWrapper>
      <MovieCard>
        {poster === 'N/A' ? (
          <FallbackPoster>
            <Sad />
            <p>Image unavailable</p>
          </FallbackPoster>
        ) : (
          <img src={poster} alt={title} />
        )}
        <h3>{title}</h3>
        <h4>{year}</h4>
        <ButtonContainer>
          {!isNominationList && (
            <Button disabled={nominated} onClick={() => onAdd(movieId)}>
              <Add />
            </Button>
          )}
          {(nominated || isNominationList) && (
            <>
              <Button onClick={() => onRemove(movieId)}>
                <Remove />
              </Button>
              <TrophyContainer>
                <Trophy />
              </TrophyContainer>
            </>
          )}
        </ButtonContainer>
      </MovieCard>
    </MovieWrapper>
  );
}

Movie.propTypes = {
  title: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  poster: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  movieId: PropTypes.string.isRequired,
  nominated: PropTypes.bool,
  isNominationList: PropTypes.bool,
};

export default Movie;
