const User = require('../model/users')
const Doctor = require('../model/doctor')
const bcrypt = require('bcryptjs') //for hash password
const jwt = require('jsonwebtoken') // for create token
const {validationResult} = require('express-validator') 
const cloud = require('../middleware/cloudinary')
const fs = require('fs')
const moment = require('moment')

/*
    describe To regirster the doctor
*/
exports.registerDoctor = async(userData,req,roles,res,next)=>
    {
        try
        {
            const files = req.files

                //Get the validation Error
            const errors = validationResult(req)
            if(!errors.isEmpty())
                {
                    return res.status(422).json({
                        errors:errors.array()
                    });
                }
            if(!files.license) 
                {

                    return res.json({message:'please upload the license',status:422})  

                }
            if(!files.photo) 
                {   

                    return res.json({message:'please upload the photo',status:422})
                }



            const emailFound = await User.findOne({email:userData.email})
            if(emailFound)
            {
                return res.json({message:'this email already exists',status:422})  
            }
            if(userData.password !== userData.confirmPassword)
            {
                return res.json({message:'password is incorrect',status:422})
            }
               //to ensure that path belogs to that filed 
            const licencePath = req.files.license[0].path
            const photoPath = req.files.photo[0].path
    
            //to upload in cloudinary
            const license = await cloud.uploads(licencePath)
            const photo = await cloud.uploads(photoPath)

            //to save url cludinary inro db
            userData.license = license.url
            userData.photo = photo.url
            userData.photoId = photo.id
            userData.licenseId = license.id

                // Get the hashed password
            const password = await bcrypt.hash(userData.password,12)

            //convert birthdate to age befor saving to db
            const date = moment(new Date(), 'DD-MM-YYYY')
            const bithdate = moment(userData.birthDate, 'DD-MM-YYYY')
            userData.birthDate =moment(date).diff(moment(bithdate), 'years') 
  
                // create a new user
            const newUser = new Doctor({...userData,password,roles})
            await newUser.save()

            //deleted photo from uploads file
           fs.unlinkSync(req.files.license[0].path)
           fs.unlinkSync(req.files.photo[0].path)

            // create a token and sent into header
            //const token = jwt.sign({email:newUser.email,userId:newUser._id},'thisispowersecertkey',{expiresIn:'7d'})
            return res.status(201).json({message: "registration is done wecame to DocBook",DocId:newUser._id})
        }
        catch(error) //technical error handling
        {
            if(!error.statuscode)
            {
                error.statuscode = 500
            }
            next(error)
        }
    }
/*
    describe To regirster the user
*/
exports.registerUser = async(userData,req,roles,res,next)=>
    {
        try
        {
                //Get the validation Error
         
                const errors = validationResult(req)
                if(!errors.isEmpty())
                    {
                        return res.status(422).json({
                            errors:errors.array()
                        });
                    }


            const emailFound = await User.findOne({email:userData.email})
            if(emailFound)
            {
                return res.json({message:"this email already exists",status:422})  
            }
            if(userData.password !== userData.confirmPassword)
            {
                return res.json({message:'password is incorrect',status:422})
            }
                // Get the hashed password
            const password = await bcrypt.hash(userData.password,12)
             //convert birthdate to age befor saving to db
             const date = moment(new Date(), 'yyyy-mm-dd')
             const bithdate = moment(userData.birthDate, 'yyyy-mm-dd')
             userData.birthDate =moment(date).diff(moment(bithdate), 'years') 
                // create a new user
            const newUser = new User({...userData,password,roles})
            await newUser.save()
                // create a token and sent into header
            return res.status(201).json({message:"registration is done wecame to DocBook",userId:newUser._id})
        }
        catch(error) //technical error handling
        {
            if(!error.statuscode)
            {
                error.statuscode = 500
            }
            next(error)
        }
    }
/*

/*
    describe To regirster the admin
*/
exports.registerAdmin = async(userData,req,roles,res,next)=>
    {
        try
        {
                //Get the validation Error
         
                const errors = validationResult(req)
                if(!errors.isEmpty())
                    {
                        return res.status(422).json({
                            errors:errors.array()
                        });
                    }



            const emailFound = await User.findOne({email:userData.email})
            if(emailFound)
            {
                return res.json({message:"this email already exists",status:422})  
            }
            if(userData.password !== userData.confirmPassword)
            {
                return res.json({message:'password is incorrect',status:422})
            }
                // Get the hashed password
            const password = await bcrypt.hash(userData.password,12)
                // create a new user
            const newUser = new User({...userData,password,roles})
            await newUser.save()
                // create a token and sent into header
            return res.status(201).json({message: "registration is done wecame to DocBook",userId:newUser._id})
        }
        catch(error) //technical error handling
        {
            if(!error.statuscode)
            {
                error.statuscode = 500
            }
            next(error)
        }
    }



/*
    describe To Login the user ( DOCTOR, USER)
*/
exports.login = async (userData,roles,res,next,join) =>
{
    try
    {
        const doctor = await Doctor.findOne({email:userData.email})
        let {password} = userData
            // First Check if the email is in the database
        const user = await User.findOne({email:userData.email})
        if(!user) //if no technical error but not found user
            {
                return res.json({message:'Error of Email',status:422})
            }
            // We will check the role
        if(user.roles != roles) 
            {
                return res.json({message: "Please be sure to register",status:403});
            } 
            // That means user is existing and trying to signin fro the right portal

                 //this is check to stricked unverfied doctor until accept or reject 
        if(user.isverfied === join) 
        {
            return res.status(403).json({message: "this account is not authorized "});
        } 
       
            // Now check for the password
        const isMatch = await bcrypt.compare(password,user.password)      
        if(!isMatch)
        {
            return res.json({message:'Error Of Password',status:422}) 
        }
            // Sign in the token 
        const token = jwt.sign(
            {
                email: user.email,
                userName:user.userName,
                userId: user._id.toString(),
                role: user.roles
            },
            process.env.SECRET_JWT,
            {expiresIn:process.env.EXPIRE_JWT}
        )
         return res.status(200)
        .json(
            {
                message:"registration is done wecame to DocBook",
                userId:user._id.toString(),
                role:user.roles,
                token:token
            })

    }
    catch(error) //technical error handling
        {
            if(!error.statuscode)
            {
                error.statuscode = 500
            }
            next(error)
        }
}

