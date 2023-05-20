const Doctor = require('../model/doctor')

exports.searchquery = async(req,res,next)=>
{
    //to limit number of doctor returned
    const currentPage = req.query.page || 1
    const prepage = 10
    try
    {
        
        let findDoctor = await Doctor
        .find(  
           
        {
            "userName" : { $regex:req.body.userName} ,
            "specialty": {$regex:req.body.specialty}
        })
        .select('userName photo specialty region city birthDate location phone calender raiting numReviews')
        .skip((currentPage -1 ) * prepage)
        .limit(prepage)
        .populate('calender')
        if(findDoctor==0)
        {
           return res.json({message:'sorry this doctors not found'})
        }
        return res.status(200).json({'message':'ok this doctors search',doctors:findDoctor,totalDoc:findDoctor.length})
       
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

exports.filterOnline = async(req,res,next)=>
{
    //to limit number of doctor returned
    const currentPage = req.query.page || 1
    const prepage = 10
    try
    {
        let findDoctor = await Doctor
        .find(    
            {
                "userName" : { $regex:req.body.userName} ,
                "specialty": {$regex:req.body.specialty}
            })
        .where('online').equals(true)
        .select('userName photo specialty region city birthDate location phone teleCalender raiting numReviews')
        .skip((currentPage -1 ) * prepage)
        .limit(prepage)
        .populate('teleCalender')
        if(findDoctor==0)
        {
           return res.json({message:'sorry this doctors not found'})
        }
        return res.status(200).json({'message':'ok this doctors search',doctors:findDoctor,totalDoc:findDoctor.length})
       
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