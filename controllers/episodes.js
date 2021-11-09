const {Movie, Director, Genre, Actor, Episode, Tvshow, Season} = require('../db')
const {Op} = require('sequelize')

module.exports = {
    postOneEpisode: async (req, res) => {


        if(!req.body.title.length || !req.body.season || !req.body.tvshow.length){
            return res.status(400).json({message: "Missing parameters", success: false})
        }

        let director;
        //here is checked if the tvshow provided is in the database.
        const tvshow = await Tvshow.findOne({
            where: {
                title: {
                    //This is to check with case insensitive
                    [Op.iLike]: req.body.tvshow
                }
            },
            include:{
                model: Director
            }
        })
        
        //If the tvshow does not exist, then the episode cannot be added to the database
        if(!tvshow) return res.json({message: "The Tvshow does not exists", success: false})

        //In case the tvshow exists, here it is checked if the director was passed in the body
        //If the director was not passed, for the episode the director of the tvshow will be assigned
        if(!req.body.director.length){
            director = tvshow.director
        }
        //If the director was passed, he will be assigned(and create if he doesn't exist) to the episode row
        else{
            [director] = await Director.findOrCreate({
                where: {name: req.body.director}
            })
        }
  
        //here a new episode is created, if it doesn't exist yet
        Episode.findOrCreate({
            where: {title: req.body.title},
            defaults:{
                seasonId: req.body.season
            }
        })
        //episode[1]: indicates if the episode was created(true)
        .then(episode => {
            if(!episode[1]) throw new Error("Episode already exists")
            //episode[0] is the new created episode. And with the setTvshow method is adding the Tvshow fk
            return episode[0].setTvshow(tvshow)
        })
        //Here adds the director fk
        .then(episode => {
            return episode.setDirector(director)
        })
        //Final result returned to the client
        .then(episode => {
            return res.json({data:episode, success: true})
        })
        .catch(err => {
            console.log(err);
            res.status(201).json(err.message)
        })
    },

    getOneEpisode: (req, res) => {
        const {title} = req.query
        Episode.findOne({
            where: {
                title: {
                    //This is to check with case insensitive
                    [Op.iLike]: title
                }
            },
            attributes: ["title"],
            include: [
                {
                    model: Tvshow,
                    attributes: ["title"],
                    include: [
                        {
                        model: Actor,
                        attributes: ["name"]
                        },
                        {
                            model: Director,
                            attributes: ["name"]
                        }
                    ]
                },
                {
                    model: Season,
                    attributes: ["title"]
                },
                {
                    model: Director,
                    attributes: ["name"]
                },

            ]
        })
        .then(episode => {
            if(!episode) return res.json({message: "The episode was not found", success: false})
            return res.json({data: episode, success: true})
        })
        .catch(err => {
            return res.status(400).json({error: err, success: false})
        })
    }
}