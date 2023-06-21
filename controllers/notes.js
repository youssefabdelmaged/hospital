const Notes = require('../model/notes')
const Users = require('../model/users') 
const Doctor = require('../model/doctor')
const {validationResult} = require('express-validator') 

exports.addNotes = async(req,res,next)=>
{
    try
    {
        const user = await Users.findById(req.params.userId)
        const errors = validationResult(req)
        if(!errors.isEmpty())
                {
                    return res.status(422).json({
                        errors:errors.array()
                    });
                }
        if(user.roles == 'doctor')
        {
            return res.json({message:'this notes arenot from doctor',status:422})  
        }
        const newNotes = new Notes({...req.body})
        await newNotes.save()
        user.notes.push(newNotes)
        await user.save()
        return res.status(200).json({message:'ok add new Notes',notesId:newNotes._id})
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


exports.getNotesUser = async(req,res,next)=>
{
    const userId = req.params.userId
    try
    {
        const spesficUser = await Users.findById(userId)
        .select('userName')
        .populate({
            path:'notes',
            select:'content user doctor ',
            populate:{
                path:'doctor',
                select:'userName specialty'
            }
        })
        if(!spesficUser)
        {
            return res.status(400).json({message:'validation error '})
        }
        return res.status(200).json(spesficUser)
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