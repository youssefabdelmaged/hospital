const mongoose = require('mongoose')

const schema = mongoose.Schema

const ReviewsSchema = new schema({
    name:{type:String},
    rating:
    {
        type:Number,
        required:[true, 'please enter rating'],
        default:0,
        min:[1,'please enter rating ,min 1 '],
        max:[5,'please enter rating ,max 5']
    },
    comment:{type:String},
    user:
    {
        type:schema.Types.ObjectId,
        ref:'User'
    },
    doctor:
    {
        type:schema.Types.ObjectId,
        ref:'Doctor'
    },
    time:{type:String}
})
  
module.exports = mongoose.model('Reviews',ReviewsSchema)