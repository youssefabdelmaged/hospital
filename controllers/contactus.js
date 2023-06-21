const contactus = require('../model/contactus')

exports.addContactus = async(req,res,next)=>
{
    try
    {
        const newContactus = new contactus({
            details:req.body.details,
            userName:req.body.userName,
            email:req.body.email
        })
        await newContactus.save()
        return res.status(200).json({message:'ok add Contactus'})
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

exports.getAllContactus = async(req,res,next)=>
{
    try
    {
        const allContactus = await contactus.find()
        return res.status(200).json(allContactus)
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