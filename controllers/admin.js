const Doctor = require('../model/doctor')
const {validationResult} = require('express-validator') 
const Orders = require('../model/appointment')
const Complaints = require('../model/complaints')
const cloud = require('../middleware/cloudinary')
exports.getVerfyDoctor = async(req,res,next)=>
{ 
    const doctor = await Doctor
    .find({isverfied:false },
        '_id userName photo email license title city gender specialty birthDate')
    res.status(200).json({message:'Doctors are not authorized ',data:doctor})
}


exports.postVerfyDoctor = async(req,res,next)=>
{
    try
    {
    const docId = req.body.userId //req.body
    const confirm = req.body.confirm //req.body
    const doctor = await Doctor.findById(docId)
    if(!doctor)
        {
            //Get the validation Error 
             const errors = validationResult(req)
             if(!errors.isEmpty())
                 {
                     return res.status(422).json({
                        message:"this account not exists"
                     });
                 }
        }
        if(confirm === true)
        {
            const accepted = await Doctor.findByIdAndUpdate(docId,{isverfied:true})
            res.status(201).json(
                {message:'ok this account is accepted',_id:accepted._id,email:accepted.email })
        }
        else
        {
            //delete photo from cloudinary
            await cloud.destroy(doctor.photoId);
            await cloud.destroy(doctor.licenseId);

            await Doctor.findByIdAndDelete(docId)
            res.status(200).json({message:'ok delete account '})
        }
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


exports.getAcceptedDoctors = async(req,res,next)=>
{
    try
    {
        const accepted = await Doctor
        .find(
            {isverfied:true},  
            '_id userName photo email license title city gender specialty birthDate raiting')
        
        res.status(200).json({message:'Doctors are accepts',data:accepted})
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


exports.filterSearch = async(req,res,next)=>
{
    //to limit number of doctor returned
    const currentPage = req.query.page || 1
    const prepage = 10
    try
    {
        let query = {}
        if(req.query.page)
        {
            query.page = currentPage
        }
        if(req.query.specialty)
        {
            query.specialty = req.query.specialty
        }
        if(req.query.userName)
        {
            query.userName = { $regex:req.query.userName} 
        }

        let findDoctor = await Doctor.find(query)
        .select('userName photo email specialty city birthDate gender raiting')
        .skip((currentPage -1 ) * prepage)
        .limit(prepage)
        .sort({raiting:-1})
        if(findDoctor==0)
        {
           return res.status(400).json({message:'sorry not exist this Doctor'})
        }
        return res.status(200).json({'message':'ok search Doctors',doctors:findDoctor,totalDoc:findDoctor.length})
       
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

exports.getAllDoctorsAccounts = async(req,res,next)=>
{
        const currentPage = req.query.page || 1
        const prepage = 10
    try
    {
        const allDoctors = await Doctor.find()
        .select('userName photo email specialty city birthDate gender raiting')
        .skip((currentPage -1 ) * prepage)
        .limit(prepage)
        .sort({raiting:-1})
        return res.status(200).json(allDoctors)
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

exports.getDoctorComplaints = async(req,res,next)=>
{
    const currentPage = req.query.page || 1
    const prePage = 10
    try
    {
        const allDoc = await Doctor.find()
        .select('userName photo email specialty city birthDate gender raiting complaintsMode')
        .where('complaintsMode').equals(true)
        .skip((currentPage-1)*prePage)
        .limit(prePage)
        .sort({raiting:-1})
        return res.status(200).json(allDoc)
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
exports.getComplaintsDoctor = async(req,res,next)=>
{
    const doctorId = req.params.doctorId
    try
    {
        const spesficDoc = await Doctor.findById(doctorId)
        .select('userName photo email specialty city birthDate gender raiting complaints')
        .populate({
            path:'complaints',
            select:'details user createdAt',
            populate:{
                path:'user',
                select:'userName'
            }
        })
        if(!spesficDoc)
        {
            return res.status(400).json({message:'validation error '})
        }
        return res.status(200).json(spesficDoc)
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

exports.deleteProfile = async(req,res,next)=>
{
    const docId = req.params.doctorId
    try
    {
        const deleteDoctor = await Doctor.findById(docId)
        .select('complaints')
        if(!deleteDoctor)
        {
           return res.status(400).json({message:'account not found'})
        }
        for(let i=0;i<deleteDoctor.complaints.length;i++)
        {
            await Complaints.findOneAndDelete({_id:deleteDoctor.complaints})
        }
        await deleteDoctor.remove()
        return res.json({message:'ok delete account'})
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


