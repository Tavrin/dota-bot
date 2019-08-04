var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    avatar:{
        type: String,
        required: true
    },
    steamId: {
        type: Number
    },
    signupDate:{
      type: Date,
      default: Date.now
    }
})

module.exports = mongoose.model("User", UserSchema);