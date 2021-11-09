# Instructions
1) Clone the repository into a local directory<br/>
2) npm install ---> to install all dependencies<br/>
3) Create a database called nubceo in your Postgres account<br/>
4) Create an .env file and add the following properties:<br/>
  DB_USER=your_postgres_user_account<br/>
  DB_PASSWORD=your_postgres_user_password<br/>
  DB_HOST=localhost:5432<br/>
5) npm start. You are ready to go<br/>


## Functionality

Endpoints:
* Endpoints for authentication using JWT.<br/>
**POST /api/user**: Here we pass in the body an email and password to create a new user, it can have any format, there are no constraints.<br/>
{
   "email": "user@mail.com",
   "passwordInput": password
}<br/>
**GET /api/user/log**: To Log in we pass in the body the information of the registered user. The endpoint returns two tokens:
  1) token: this is the access token with limited duration length
  2) refreshToken: this is the token that we are going to use to refresh de token and keep getting access.
  NOTE: to access all the other endpoints (movies, episodes, tvshows) we need to pass the generated token in the header with the key: x-access-token<br/>
  x-access-token: token_value<br/>

  **POST /api/user/token**: Here in the body we need to pass the refreshToken obtained from **/api/user/log**. We will get another new token to regain access to the routes. The new token is our new one to access differents routes.<br/>
  {
   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjM2NDY1MDQwfQ.RzWlJ-z2jYTrVNFia6kOQSY2xdOBlOStnnIyLbi8bwI"
  }
  <br/>

  **DELETE /api/user/logout**: The token is passed in the body, as a result, the token is removed from the database and a complete new token has to be created in the /api/user/log<br/>
  {
   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjM2NDY1MDQwfQ.RzWlJ-z2jYTrVNFia6kOQSY2xdOBlOStnnIyLbi8bwI"
  }


* Endpoint for retrieving movies.<br/>
  **GET /api/movies**: If we don't pass any query all the movies loaded in the database will be retrieved. We need to pass the token (gotten from api/user/log) to have access to the routes<br/>
  Queries:<br/>
  1) /api/movies?title=name_of_movie: we can filter the movies by name<br/>
  2) /api/movies?year=year_of_movie: we can filter the movies by year<br/>
  3) /api/movies?genre=genre_of_movie: we can filter the movies by genre. NOTE: available genres-> ["Action", "Fiction", "Narrative", "Thriller", "Romantic", "Fantasy", "Parody", "Horror", "Drama", "Mystery"]<br/>
  4) /api/movies?order=ASC or DESC: we can order the movies names by ASC order or DESC<br/>

* Endpoint for retrieving the information (director included) of a specific episode of a TV Show<br/>
**GET /api/episodes?title=episode_name**: This is the endpoint to look for a particular episode. We need to pass the title by query. It is a case insensitive search. NOTE: we get two directors, they can be different or not, depending if the particular episode was directed by another director besides the tvshow main one.<br/>

* Endpoint for adding a new object.
**POST /api/movies**: in the body we pass the following information
{<br/>
  "title": string,<br/>
  "year": integer,<br/>
  "genre": string. It can only be one of the following (it is sensitive): ["Action", "Fiction", "Narrative", "Thriller", "Romantic", "Fantasy", "Parody", "Horror", "Drama", "Mystery"]<br/>
  "director": string<br/>
  "actors": array of strings<br/>
}<br/>

**POST /api/tvshow**: in the body we pass the following information. NOTE: to created an episode we first need to create a tvshow<br/>
{<br/>
    "title": string,<br/>
    "director": string. This will crate or not a director and set the pk of it in the directorId<br/>
    "actors": Array of strings<br/>
}<br/>

**POST /api/episode**: once we have the tvshow created we can create an episode of it<br/>
{<br/>
    "title": string,<br/>
    "director": "", ----> this can be empty or not. If it is empty it will set as director the one of the tvshow.<br/>
    "season": integer,<br/>
    "tvshow": string. The tvshow has to be in the database, otherwise the episode can't be created<br/>
}<br/>


### Model
<img src="./Diagram.png">
