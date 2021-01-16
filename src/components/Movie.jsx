import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { ReactComponent as TrophyIcon } from '../assets/trophy-outline.svg';
import { ReactComponent as AddIcon } from '../assets/add-outline.svg';
import { ReactComponent as SadIcon } from '../assets/sad-outline.svg';
import { ReactComponent as RemoveIcon } from '../assets/close-outline.svg';
import {
  MovieWrapper,
  MovieCard,
  MovieDetails,
  ButtonsContainer,
  TrophyContainer,
  FallbackPoster,
} from '../styles/styled-components';

function MoviePoster({ img, title }) {
  return img === 'N/A' ? (
    <FallbackPoster>
      <SadIcon />
      <p>Image unavailable</p>
    </FallbackPoster>
  ) : (
    <img src={img} alt={title} />
  );
}

MoviePoster.propTypes = {
  img: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

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
        <MoviePoster img={poster} title={title} />

        <MovieDetails>
          <h3>{title}</h3>

          <h4>{year}</h4>
        </MovieDetails>

        <ButtonsContainer>
          {!isNominationList && (
            <Button disabled={nominated} onClick={() => onAdd(movieId)}>
              <AddIcon />
            </Button>
          )}
          {nominated && (
            <>
              <Button onClick={() => onRemove(movieId)}>
                <RemoveIcon />
              </Button>
              <TrophyContainer>
                <TrophyIcon />
              </TrophyContainer>
            </>
          )}
        </ButtonsContainer>
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

Movie.defaultProps = {
  nominated: false,
  isNominationList: false,
};

export default Movie;
