const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Calendar = new Schema({

        weekday:{
            type:String,
            enum:
            [
                "Monday",
                "Tuesday",
                "Wednesday",
               "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ],
            required:true
        },
        startAt:
        {
            type:String,
            required:true
        },
        endAt:
        {
            type:String,
            required:true
        },
        duration:
        {
            type:Number,
            enum:[30,60]
        },
        doctor:
        {
            type:Schema.Types.ObjectId,
            ref:"Doctor",
            required:true
        }
},{discriminatorKey:'calender'})
module.exports = mongoose.model('Calender',Calendar)