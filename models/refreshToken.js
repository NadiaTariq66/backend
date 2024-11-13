const mongoose = require('mongoose');

const {Schema} = mongoose;

const refreshTokenSchema = Schema({
    token: {type: String, required: true},
},
{timestamps: true}

);

module.exports = mongoose.model('RefreshToken', refreshTokenSchema, 'refresh tokens');