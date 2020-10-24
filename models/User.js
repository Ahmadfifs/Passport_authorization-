const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required : true
    },
    data: {
        type:Date,
        defualt: Date.now
    }

})



module.exports = UserSchema;