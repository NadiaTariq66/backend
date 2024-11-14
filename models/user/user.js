const joi = require("joi");
const mongoose = require("mongoose");

const {Schema} = mongoose;

const userSchema= new Schema(
    {
        userName:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true
        }


})

module.exports= mongoose.model ("users", userSchema, "user");