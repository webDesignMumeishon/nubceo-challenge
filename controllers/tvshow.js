const {Movie, Director, Genre, Actor, Episode, Tvshow} = require('../db')
const {Op} = require('sequelize')


module.exports = {
    postTvshow: async (req, res) => {

        const [director, created] = await Director.findOrCreate({
            where: {name: req.body.director}
        })

        Tvshow.findOne({
            where: {
                title: {
                    [Op.iLike]: req.body.title
                }
            },
        })
        .then(show => {
            if(!show){
                return Tvshow.create({
                    title: req.body.title
                })
            }
            else{
                throw new Error("Tv Show already exists")
            }
        })
        .then(show => {
            return show.setDirector(director)
        })
        .then( async show => {
            for(let i of req.body.actors){
                let addNewActor = await Actor.findOrCreate({
                    where: {name: i}
                })
                await show.addActors(addNewActor[0])
            }
            return show
        })
        .then(show => {
            return res.status(201).json(show)
        })
        .catch(err => {
            console.log(err);
            return res.status(400).json({error: err.message, success: false})
        })
    },

    getTvshows: (req, res) => {
        Tvshow.findAll({
            include: [
                {
                    model: Actor
                }
            ]
        })
        .then(r => {
            return res.json(r)
        })
    }
}