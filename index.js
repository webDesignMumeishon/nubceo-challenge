const { connection, Genre, Movie, Season } = require( "./db")
const server = require('./app');

const genres = ["Action", "Fiction", "Narrative", "Thriller", "Romantic", "Fantasy", "Parody", "Horror", "Drama", "Mystery"]
const seasons = ["season1", "season2", "season3", "season4", "season5", "season6", "season7", "season8", "season9", "season10"]

// Syncing all the models at once.
// [force flag]
// If a table exists already exists, the method will DROP it and CREATE a new one. 
// If it doesn't exist, a table is just created. 
connection.sync({ force: true }).then(() => {
   server.listen(3000, () => {
      console.log('% listening at 3000'); // eslint-disable-line no-console
      console.log("The table for the User model was just (re)created!");

      //setting up the genre table with all available genres
      genres.forEach(async (g) => {
         await Genre.create({name: g})
      })
      //setting up the season table with all available seasons
      seasons.forEach(async (g) => {
         await Season.create({title: g})
      })

   });
})