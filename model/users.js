const mongoose = require('mongoose')

const schema = mongoose.Schema

const patientSchema = new schema(
    {
        userName :{
            type:String,
            required:[true,"username is required "],
        },
     
        
        email: {type:String,
            required:[true,"email is required "],},

        password: {type:String,
            minlength:[8,' minlength is 8'],
        },

        phone: {type:String,
            maxlength:[11,'please enter a valid phone '],
         },

        gender:{type:String},

        address:{type:String},
        maritalstatus:{type:String},
        allergies:{type:String},
        blood:{type:String},
        smoking:{type:String},
        height:{type:String},
        weight:{type:String},
        photo:{type:String},
        photoId:{type:String},

        birthDate:{type:String},
        roles:{
            type: [String],
            enum: ['user' , 'doctor' ,'admin' ],
            default: ['user']
        },
    }, { timestamps:true },{discriminatorKey:'role'},{ typeKey: '$type' })

module.exports = mongoose.model('User',patientSchema)






