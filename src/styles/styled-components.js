import styled from 'styled-components/macro';
import { Col, Row } from 'reactstrap';

export const Header = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 5rem;
`;

export const Dashboard = styled(Row)``;

export const Separator = styled.div`
  width: 100%;
  border-bottom: 1.5px solid #adb5bd;
`;

export const Search = styled(Col)`
  padding: 3em 1em;
  & > div,
  & > button {
    max-width: 350px;
  }
`;

export const Instructions = styled(Col)`
  padding: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MovieLists = styled(Row)`
  display: flex;
  padding: 3em 0;

  .card {
    margin: 2em 0;
  }
`;

export const SearchResults = styled(Col)`
  flex: 1 1 50%;
`;

export const NominationsList = styled(Col)`
  flex: 1 1 50%;
`;

export const MovieList = styled.ul`
  padding: 0;
  display: flex;
  flex-wrap: wrap;
`;

export const MovieWrapper = styled.li`
  list-style-type: none;
`;

export const MovieCard = styled.div`
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
`;

export const FallbackPoster = styled.div`
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
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  button {
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
`;

export const TrophyContainer = styled.div`
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
    color: gold;
  }
`;
