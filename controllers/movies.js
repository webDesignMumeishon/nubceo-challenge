
// const genres = ["Action", "Fiction", "Narrative", "Thriller", "Romantic", "Fantasy", "Parody", "Horror", "Drama", "Mystery"]
const {Movie, Director, Genre, Actor} = require('../db')

//object to set the fk in the genreId of the table movies
const moviesGenres = {
    Action: 1,
    Fiction: 2,
    Narrative: 3,
    Thriller: 4,
    Romantic: 5,
    Fantasy: 6,
    Parody: 7,
    Horror: 8,
    Drama:9,
    Mystery: 10,
}


module.exports = {
    postNewMovie: async (req, res) => {

        const [director, created] = await Director.findOrCreate({
            where: {name: req.body.director}
        })

        Movie.findOrCreate({
            where: {title: req.body.title},
            defaults:{
                year: req.body.year,
                genreId: moviesGenres[req.body.genre]
            }
        })
        .then(movie => {
            if(!movie[1]) throw new Error("Movie already exists")
            return movie[0].setDirector(director)
        })
        .then( async movie => {
            for(let i of req.body.actors){
                //looping through the array to add the actors into the database if they no exist yet
                let addNewActor = await Actor.findOrCreate({
                    where: {name: i}
                })
                await movie.addActors(addNewActor[0])
            }
            return movie
        })
        .then(movie => {
            return res.json(movie)
        })
        .catch(err => {
            console.log(err);
            res.status(201).json(err.message)
        })
    },

    getAllMovies: (req, res) => {
        //These are the variables to filter/order the movies. Initially is empty, if it keeps empty the 
        //endpoint will return all the movies
        let movieFiltering = {}
        let genreFiltering = {}
        let orderTitle = [] 

        if(req.query.title?.length > 0){
            movieFiltering = {title: req.query.title}
        }
        else if(req.query.year?.length > 0){
            movieFiltering = {year: Number(req.query.year)}
        }

        if(req.query.genre?.length > 0){
            genreFiltering = {name: req.query.genre}
        }

        if(req.query.order === "ASC" || req.query.order === "DESC"){
            orderTitle = [["title", req.query.order]]
        }

        Movie.findAll({
            //filtering movies by title or year
            where: movieFiltering,
            //Ordering the movies by ASC or DESC
            order: orderTitle,
            attributes: ["title", "year"],
            include: [
            {
              model: Actor,
              attributes: ["name"]
            },
            {
                model: Director,
                attributes: ["name"]
            },
            {
                model: Genre,
                //filtering movies by genre
                where: genreFiltering,
                attributes: ["name"]
            },

        ]
        })
        .then(movies => {
            return res.json(movies)
        })
        .catch(err =>{
            return res.status(400).json({message:err.message, success: false})
        })
    }
}