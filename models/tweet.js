const mongoose = require('mongoose');
const tweetSchema = mongoose.Schema({    
    _id: mongoose.Schema.Types.ObjectId,
    tweetId: mongoose.Schema.Types.String,
    name: mongoose.Schema.Types.String,
    text: mongoose.Schema.Types.String,
    date: {type: mongoose.Schema.Types.Date, required: true},
    favorites: {type: mongoose.Schema.Types.Number, required: false},
    replies: {type: mongoose.Schema.Types.Number, required: false},
    retweets: {type: mongoose.Schema.Types.Number, required: false},
});

module.exports = mongoose.model("Tweet", tweetSchema);