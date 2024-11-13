const mongoose = require('mongoose');

const {Schema} = mongoose;

const resetTokenSchema = Schema({
    token: String,
    email: String
},
{timestamps: true}

);

module.exports = mongoose.model('ResetToken', resetTokenSchema, 'reset token');