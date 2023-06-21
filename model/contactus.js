const mongoose = require('mongoose')
const schema = mongoose.Schema

const contactus = new schema({
    details:
    {
        type:String
    },
    userName :{
        type:String,
        required:[true,"username is required "],
    },
 
    
    email: {type:String,
        required:[true,"email is required "],
    }
    
},{timestamps:true})
module.exports = mongoose.model('Contactus',contactus)