const User = require('../model/users')
const Doctor = require('../model/doctor')
const moment = require('moment')

const {body} = require('express-validator')

 // validate the user

exports.signupUserValidation =()=>
{
    return[
        body('userName','username is required ') // validate the username
        .trim().notEmpty(),

        body('email','please enter a vaild email ')
        .isEmail().normalizeEmail().trim()
        .custom((value,{req})=>{
            return Doctor.findOne({email:value})  // validate the email
            .then(userDoc => {
                if (userDoc) 
                {
                   return Promise.reject('this email already exists')
                }})
    })
    ]
}

 // validate the doctor

exports.signupDocotrValidation =()=>
{
 return [
    body('email','please enter a vaild email ')
        .isEmail().normalizeEmail().trim()
        .custom((value,{req})=>{
            return Doctor.findOne({email:value})  // validate the email
            .then(userDoc => {
                if (userDoc) 
                {
                   return Promise.reject('this email already exists')
                }})
    }),
    // validate the password
    body('password',' minlength is 8') 
        .isLength({min:8}).trim(),
        body('confirmPassword')
        .custom((value,{req})=>
        {
            if(value !== req.body.password)
            {
                throw new Error ('password is incorrect')
            }else{
                return true
            }
        }),
    body('userName','username is required ') // validate the username
        .trim().notEmpty(),
    body('phone','please enter a valid phone ') // validate the phone
       .isNumeric().trim().isLength({'max':11})
       .custom((value,{req})=>{
        return Doctor.findOne({phone:req.body.phone})
        .then(userPhone =>
            {
                if(userPhone)
                {
                    return Promise.reject('this phone already exists')
                }
            })
   })
]
}

//validate the updateprofile

exports.updateProfileUser =()=>
{
   return[
    body('email','please enter a vaild email')
    .optional({nullable:true})
    .isEmail().normalizeEmail().trim()
    .custom((value,{req})=>{
        return User.findOne({email:value})  // validate the email
        .then(userDoc => {
            if (userDoc) 
            {
               return Promise.reject('this email already exists')
            }})
    }),
    body('phone','please enter a valid phone') // validate the phone
       .optional({nullable:true})
       .isNumeric().trim().isLength({'max':11})
       .custom((value,{req})=>{
        return User.findOne({phone:req.body.phone})
        .then(userPhone =>
            {
                if(userPhone)
                {
                    return Promise.reject('this phone already exists')
                }
            })
        }),
        body('birthDate','please enter a correct birthdate') // validate the birthDate
        .optional({nullable:true})
   ]
}
