const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const {
    DB_USER, DB_PASSWORD, DB_HOST,
} = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/nubceo`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});

const basename = path.basename(__filename);

const modelDefiners = [];

//Here is read all the files is the models directory and we add them into the modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Connecting all the models with sequelize
modelDefiners.forEach(model => model(sequelize));
// We make uppercase the first letter of each model
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// In sequelize.models tehre are all the models imported as props
// to associate we destructure
const { Movie, Genre, Actor, Director, Tvshow, Episode, Season, User, Token } = sequelize.models;

//Associations
Genre.hasMany(Movie)
Movie.belongsTo(Genre,{
    onDelete: 'CASCADE',
    foreignKey: {
        allowNull: false
    }
})   

Movie.belongsToMany(Actor, { through: 'actor_movies' });
Actor.belongsToMany(Movie, { through: 'actor_movies' });

Director.hasMany(Movie)
Movie.belongsTo(Director,{
    onDelete: 'CASCADE',
    foreignKey: {
        allowNull: false
    }
}) 

Tvshow.belongsToMany(Actor, { through: 'actor_tvshows' });
Actor.belongsToMany(Tvshow, { through: 'actor_tvshows' });

Director.hasMany(Tvshow)
Tvshow.belongsTo(Director,{
    onDelete: 'CASCADE',
    foreignKey: {
        allowNull: false
    }
}) 

Tvshow.hasMany(Episode)
Episode.belongsTo(Tvshow,{
    onDelete: 'CASCADE',
    foreignKey: {
        allowNull: false
    }
}) 

Director.hasMany(Episode)
Episode.belongsTo(Director) 

Season.hasMany(Episode)
Episode.belongsTo(Season) 

Token.hasOne(User)
User.belongsTo(Token) 

sequelize.authenticate()
.then(() => {
    console.log('Connection has been established successfully to NUBCEO database.');
})
.catch(error => {
    console.error(' Unable to connect to the database:', error);
})

module.exports = {
    ...sequelize.models, // importing models sample: const { Product, User } = require('./db.js');
    connection: sequelize,     //importing connection
};