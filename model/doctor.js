const mongoose = require('mongoose')
const user = require('../model/users')
const Schema = mongoose.Schema
const doctor = new Schema(
    {
        photo:{type:String},
        photoId:{
            type:String,
            default:null,
        },
        city:{
            type:String,
        },
        region:{
            type:String,
            default:null,
        },
        license:{type:String},
        licenseId:{type:String,
            default:null,
        },
        isverfied:{
            type:Boolean,
            default:false},
        specialty: {type:String,
            default:null
        },
        title:{type:String,
            default:null,},
        price:{type:Number,
            default:null,},
        aboutme:{type:String,
            default:null},
        online:{type:Boolean,default:false},
        
        calender:
        {
            type:[Schema.Types.ObjectId],
            ref:"Calender"
        },
        teleCalender:
        {
            type:[Schema.Types.ObjectId],
            ref:"TeleCalender"
        },

        reviews:
        {
            type:[Schema.Types.ObjectId],
            ref:'Reviews'
        },
        raiting:
        {
            type:Number,
            default:0
        },
        numReviews:
        {
            type:Number,
            default:0
        },
        complaints:
        {
            type:[Schema.Types.ObjectId],
            ref:'Complaints'
        },
        complaintsMode:
        {
            type:Boolean,
            default:false
        },



    },{discriminatorKey:'role'}
)
module.exports = user.discriminator ('Doctor',doctor)

