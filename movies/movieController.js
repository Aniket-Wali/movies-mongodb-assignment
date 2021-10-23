// importing the movies model 
const Movies = require('../model/movies');

// show internal error message to the client
const errorMessage = () => {
    res.status(404).json({
        success : false,
        message : "Some Internal Error occured !!"
    });
}

// auth middleware for authenticating users for updating and deleting movies
const authMiddleware = (req, res, next) => {
    try {
        const {authID} = req.params;
        // checking for hardcoded authID
        authID == "135721" ?  next()  : 
                res.status(401).json({
                    success : false,
                    message : "Unauthoried Access !!"
                });
    } catch (e) {
        console.log(e);
        errorMessage();
    }
}

// return the whole list of movies
const getMoviesList = async (req, res) => {
    try{
        const moviesList = await Movies.find({});
        res.status(200).json(moviesList);
    } catch (e) {
        console.log(e);
        errorMessage();
    }
};

// add a new movie in the database
const addMovie = async (req, res) => {
    try{
        const { title, year, runtime, genres,
                 imdbID, ratings, directors, actors, posterUrl } = req.body;

        if(!(title && imdbID))  
            res.status(400).json({  success : false, message : "All Fields are Required"});
        
        const isRecordExist = await Movies.findOne({ "imdbID" : imdbID });
        
        if(isRecordExist)
            res.status(409).json({ 
                success : false,
                message : `Movie ALready Exist with same IMDB ID : ${imdbID}`
            });
        else {
            const newMovieRecord = await Movies.create({
                title, year, runtime, genres,
                 imdbID, ratings, directors, actors,posterUrl
            });
            newMovieRecord.save();
            errorMessage();
        }
            
    } catch (e) {
        console.log(e);
        errorMessage();
    }
}

// Update existing movie on the basis of IMDB ID
const updateMovieByID = async (req, res) => {
    try{
        const { imdbID } = req.params;
        const parsedData = req.body;
        const data = await Movies.findOneAndUpdate({imdbID}, parsedData, { new : true });
        const {_doc} = data;

        data ? res.status(200).json({
            success : true,
            message : "Movie Updated Successfully :)",
            movie: _doc 
        }) : res.status(404).json({
            success : false,
            messgae : `Movie not found with IMDB ID : ${imdbID}`
        });

    } catch (e) {
        console.log(e);
        errorMessage();
    }
}

// delete existing movie on the basis of IMDB ID
const deleteMovieById = async (req, res) => {
    try{
        const { imdbID } = req.params;
        const deletedMovie = await Movies.findOneAndDelete({imdbID});

        deletedMovie ? res.status(200).json({
            success : true,
            message : `Movie with IMDB ID ${imdbID} deleted successfully`,
        })  : res.status(404).json({
            success : false,
            message : `Movie with IMDB ID ${imdbID} not found`
        })

    } catch (e) {
        console.log(e);
        errorMessage();
    }
}

// group by rating to find count of movies per rating in DESC order
const getMoviesByRatings = async (req, res) => {
    try{
        const {_rating} = req.params;
        const pipeline = [
            {
                $match : {
                    ratings : { $gt : _rating }
                }
            },
            {
                $group : {
                    _id : null,
                    movies : { $push : '$title' },
                    releasedYear : { $push : "$year" },
                    imdbRatings : { $push : "$ratings" },
                    total : {$sum : 1}
                }
            },
            {
                $project : {
                    _id : 0,
                    result : {
                        $concat : [ {$toString : '$total' }, ' movies greater than rating ', {$toString : _rating}]
                    },
                    movies : "$movies",
                    imdbRatings: "$imdbRatings",
                    year : "$releasedYear"
                }
            },
        ]

        const items = await Movies.aggregate(pipeline);

        res.json(items);

    } catch (e) {
        console.log(e);
        errorMessage();
    }
}

module.exports = {
    authMiddleware,
    getMoviesList,
    addMovie,
    updateMovieByID,
    deleteMovieById,
    getMoviesByRatings
}