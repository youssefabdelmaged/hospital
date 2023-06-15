const Doctor = require('../model/doctor')
const User = require('../model/users')
const appointments = require('../model/appointment')
const moment = require('moment')
const cloud = require('../middleware/cloudinary')
const fs = require('fs')
const {validationResult} = require('express-validator') 
const bcrypt = require('bcryptjs') //for hash password


exports.getProfile = async(req,res,next)=>
{
    const docId = req.params.doctorId

    try
    {
        const spesficDoc = await Doctor
        .findById(docId)
        .select('userName title photo price aboutme location  birthDate specialty calender teleCalender reviews raiting numReviews city region gender')
        .populate('teleCalender','weekday startAt endAt duration')
        .populate('reviews','-user')
        if(!spesficDoc)
        {
            return res.status(404).json({message:'this id  incorrect '})
        }        
        return res.status(200).json(spesficDoc)
    }
    catch(error)
    {
        if(!error.statuscode)
        {
            error.statuscode = 500
        }
        next(error)
    }
}

exports.getDoctorPhoto = async(req,res,next)=>
{
    const docId = req.params.doctorId
    try
    {
        const spesficDoc = await Doctor
        .findById(docId).select('photo')
        return res.status(200).json(spesficDoc)
    }
    catch(error)
    {
        if(!error.statuscode)
        {
            error.statuscode=500
        }
        next(error)
    }
}

exports.updatePhoto = async(req,res,next)=>
{
    try
    {
        const spesficDoc = await Doctor
        .findById(req.params.doctorId).select('photo photoId')
        if(!spesficDoc)
        {
            return res.status(404).json({message:"not available"})
        }
        if(!req.file)
        {
            return res.status(404).json({message:'please upload the photo'})
          
        }
        await cloud.destroy(spesficDoc.photoId);
        const photoPath = req.file.path
        const photoUploaderCloudinary = await cloud.uploads(photoPath)

        spesficDoc.photo = photoUploaderCloudinary.url
        spesficDoc.photoId = photoUploaderCloudinary.id
        await spesficDoc.save()
        fs.unlinkSync(photoPath)
        return res.status(200).json({message:"ok update successfully",
        photo:spesficDoc.photo,photoId:spesficDoc.id})
    }
    catch(error)
    {
        if(!error.statuscode)
        {
            error.statuscode=500
        }
        next(error)
    }
}

exports.updatedPassword = async(req,res,next)=>
{
    try
    {
        const user = await User.findById(req.params.doctorId)
        if(req.body.password !== req.body.confirmPassword)
        {
              
            return res.json({message:'password is incorrect',status:422})      
        }
        user.password = await bcrypt.hash(req.body.password,12)
        await user.save()
        return res.status(200).json({message:'ok update of password'})
    }
    catch(error)
    {
        if(!error.statuscode)
        {
            error.statuscode = 500
        }
        next(error)
    }
}

exports.updateProfile =async(req,res,next)=>
{
    try
    {

        const errors = validationResult(req)
            if(!errors.isEmpty())
                {
                    return res.status(422).json({
                        errors:errors.array()
                    });
                }
        
        let userProfile = await User.findByIdAndUpdate({_id:req.params.doctorId},{$set:req.body})
        .select('userName email phone birthDate roles')
        if(userProfile.roles[0] =="doctor")
        {
            userProfile = await Doctor.findByIdAndUpdate({_id:req.params.doctorId},{$set:req.body})
            .select('userName email phone aboutme birthDate title price location specialty city region')
        }
        if(req.body.birthDate)
        {
            const date = moment(new Date(), 'DD-MM-YYYY')
            const bithdate = moment(req.body.birthDate, 'DD-MM-YYYY')
            userProfile.birthDate =moment(date).diff(moment(bithdate), 'years')
            await userProfile.save()
        }




        const afterUpdated = await User.findById(req.params.doctorId)
        .select('userName email phone aboutme birthDate title price location specialty city region')
        return res.status(200).json({message:'ok update successfully',afterUpdated})
    }
    catch(error)
    {
        if(!error.statuscode)
        {
            error.statuscode = 500
        }
        next(error)
    }
} 



exports.getReservationDay = async(req,res,next)=>
{
    const time = req.body.time
    const doctor = req.body.doctorId
    const reservation = await appointments
    .find({
        "doctor":doctor,
        "time":moment(time).format("YYYY-MM-DD")})
    .populate('patient','userName gender birthDate')
    if(!time)
    {
        return res.status(401).json({message:'please enter correct time'})
    }
    try
    {
        return res.status(200).json(reservation)
    }
    catch(error)
    {
        if(!error.statuscode)
        {
            error.statuscode = 500
        }
        next(error)
    }
}

exports.getAllReservation = async(req,res,next)=>
{
    const getAllReservation =  await appointments
    .find({"doctor":req.body.doctorId})
    .populate('patient','userName gender birthDate')
    try
    {
        return res.status(200).json(getAllReservation)
    }
    catch(error)
    {
        if(!error.statuscode)
        {
            error.statuscode = 500
        }
        next(error)
    }
}

exports.getReservationDayById = async(req,res,next)=>
{
    const status = req.body.status
    const appid =req.params.id 
    const reservationDayById = await appointments
    .findById(appid)
    .populate('patient','userName gender birthDate')
    .populate('doctor','userName')
    if(!reservationDayById)
    {
        return res.status(401).json({message:'not found'})
    }
    try
    {
        if(status === true)
        {
            reservationDayById.reservationStatus  = true
            reservationDayById.save()
            return res.status(200).json({message:'examination done'})
        }
        if(status === false)
        {
            return res.json({message:'late'})
        }
        else
        {
            return res.json(reservationDayById)
        }
    }
    catch(error)
    {
        if(!error.statuscode)
        {
            error.statuscode = 500
        }
        next(error)
    }
}

exports.deleteReservation= async(req,res,next)=>
{
    const appid =req.params.id
    try
    {
        await appointments.findByIdAndRemove(appid)
        return res.status(200).json({message:'ok delete appointment'})
    }
    catch(error)
    {
        if(!error.statuscode)
        {
            error.statuscode = 500
        }
        next(error)
    }
}


