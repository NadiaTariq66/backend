const mongoose = require('mongoose');

const {Schema} = mongoose;

const accessTokenSchema = Schema({
    token: {type: String, required: true}
},
{timestamps: true}

);

module.exports = mongoose.model('AccessToken', accessTokenSchema, 'access token');