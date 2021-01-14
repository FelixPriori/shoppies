# The Shoppies

Is a challenge project by Shopify and attempted by Felix Rioux Sabourin.

## Prompt

> Shopify has branched out into movie award shows and we need your help. Please build us an app to help manage our movie nominations for the upcoming Shoppies.
>
> ## The Challenge
>
> We need a webpage that can search OMDB for movies, and allow the user to save their favourite films they feel should be up for nomination. When they've selected 5 nominees they should be notified they're finished.
> We'd like a simple to use interface that makes it easy to:
>
> - Search OMDB and display the results (movies only)
> - Add a movie from the search results to our nomination list
> - View the list of films already nominated
> - Remove a nominee from the nomination list

[Click here to view full challenge & requirements](https://docs.google.com/document/d/1AZO0BZwn1Aogj4f3PDNe1mhq8pKsXZxtrG--EIbP_-w/edit?fbclid=IwAR0fYpYakJFioR5_w6Hq1UYagi5P22xdrxTOGfYIKwD9Pj_JK11yCT0iIMc)

## Instructions

### Setup

1. Fork and/or clone project
2. Get a free api key for the [OMDb api](http://www.omdbapi.com/apikey.aspx)
3. Copy `.env.example` to root of project and rename to `.env`
4. Assign your api key to the variable `REACT_APP_OMDB` in your `.env` file

### To start the project in developmnent mode:

```sh
yarn && yarn start
```

### To run tests:

```sh
yarn test
```

### To see the project in production mode:

https://felix-shoppies.netlify.app/

## Extra features

- The nomination list is saved and retrieved from local storage using the custom hook `useLocalNominations`
- Messages are displayed to help guide the user through nomination process
- A counter is displayed above nomination list to help users keep track of how many movies they have already nominated
- In addition to the movie's year and title, the poster is also displayed to the user. In case the poster is unavailable, a fallback image is rendered
- A "Clear Search" button is provided to quickly reset the search terms and clear the search results
- API is called 200ms after the user has finished typing to prevent spamming the endpoint
- API and helper functions are tested in the `src/__tests__/` directory
- The app is responsive and functional on any device size

## Used in this project

### Stack

- [React.js](https://reactjs.org/)
- [Scss](https://sass-lang.com/)
- [Bootstrap](https://getbootstrap.com/)/[Reactstrap](https://reactstrap.github.io/)
- [styled-components](https://styled-components.com/)
- [Axios](https://github.com/axios/axios)
- [Prettier](https://prettier.io/)
- [Eslint](https://eslint.org/)

### Testing

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest](https://jestjs.io/)
- [Faker](http://marak.github.io/faker.js/)
- [MSW](https://mswjs.io/)

### Icons

- [ionicons](https://ionicons.com/)

### API

- [OMDb](http://www.omdbapi.com/)
