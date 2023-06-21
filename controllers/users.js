const User = require('../model/users')
const Doctor = require('../model/doctor')
const appointment = require('../model/appointment')
const {validationResult} = require('express-validator') 
const moment = require('moment')
const bcrypt = require('bcryptjs') //for hash password

exports.getProfilePatient = async(req,res,next)=>
{
    const id = req.params.id
    try
    {
        const profile = await User.findById(id)
        .select('userName email phone  gender birthDate photo roles address maritalstatus allergies blood smoking height weight  notes')
        if(!profile)
        {
            return res.status(404).json({message:'this id  incorrect '})
        }
        if(profile._id.toString()!= id)
        {
            return res.status(404).json({message:'error of validation'})
        }
        return res.status(200).json(profile)
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
        
        let userProfile = await User.findByIdAndUpdate({_id:req.params.id},{$set:req.body})
        .select('userName email phone birthDate roles address maritalstatus allergies blood smoking height weight')
        if(userProfile.roles[0] =="doctor")
        {
            userProfile = await Doctor.findByIdAndUpdate({_id:req.params.id},{$set:req.body})
            .select('userName email phone  address maritalstatus allergies blood smoking height weight birthDate title price location specialty city region')
        }
        if(req.body.birthDate)
        {
            const date = moment(new Date(), 'DD-MM-YYYY')
            const bithdate = moment(req.body.birthDate, 'DD-MM-YYYY')
            userProfile.birthDate =moment(date).diff(moment(bithdate), 'years')
            await userProfile.save()
        }
        const afterUpdated = await User.findById(req.params.id)
        .select('userName email phone birthDate address maritalstatus allergies blood smoking height weight title price location specialty city region')
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
exports.updatedPassword = async(req,res,next)=>
{
    try
    {
        const user = await User.findById(req.params.id)
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
exports.deleteProfile = async(req,res,next)=>
{
    try
    {
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user)
        {
            return res.status(404).json({message:"not available"})
        }
        return res.json({message:'ok delete account'})
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
    const appointments = await appointment
    .find({ patient:req.userId})
    .populate('doctor','userName photo location')
    .select('-reservationPlace -reservationStatus -phone -name')
    try
    {
        return res.status(200).json(appointments)
    }
    catch(err)
    {
            if(!err.statuscode)
                {
                    err.statuscode = 500
                }
                next(err)
    }

}
