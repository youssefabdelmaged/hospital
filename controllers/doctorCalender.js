const Doctor = require('../model/doctor')
const moment = require('moment')
const calender = require('../model/doctorCalender')
const teleCalender = require('../model/teleCalender')

exports.create = async(req,res,next)=>
{
    const startAt = moment(req.body.startAt,'h:mm a');
    const endAt = moment(req.body.endAt,'h:mm a')
    const timeDiff = moment.duration(endAt.diff(startAt)).asMinutes()
     try{
        if (!(timeDiff ===30 ||timeDiff===60 ))
        {
            return res.json({message:'error of the time',status:422})  
        }
        let hoursworking
        if(req.body.type === 'online')
        {
             hoursworking = new teleCalender({
                weekday:req.body.weekday,
                 startAt:startAt.format('h:mm a'),
                 endAt:endAt.format('h:mm a'),
                 duration:timeDiff,
                 doctor:req.body.doctor
             })
            await hoursworking.save()
            await Doctor.findByIdAndUpdate({_id:req.body.doctor},{$push:{teleCalender:hoursworking}})
        }
      
        return res.status(201).json({message:"data was recorded",workingHoursId:hoursworking._id})
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

exports.getWorkingHours = async(req,res,next)=>
{
    try
    {
        const workingHours = await calender.find({doctor:req.userId})
        .where('calender').ne('TeleCalender')
        if(req.body.type === 'online')
        {
            const workingHours = await teleCalender.find({doctor:req.userId})
            return res.status(200).json(workingHours)
        }
        return res.status(200).json(workingHours)
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
exports.getSpesficDay =async(req,res,next)=>
{
    var id = req.params.id;
    try{
        const spesficDay = await calender.findById(id)
        if(!spesficDay)
        {
            return res.status(404).json({message: 'not found appointments'});
        }
        return res.status(200).json(spesficDay);
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
exports.update = async(req,res,next)=>
{
    var id = req.params.id;
    try{
        const updated = await calender.findById({_id:id})
        if(!updated)
        {
            return res.status(404).json({message:'not found appointments'});
        }
        const startAt = moment(req.body.startAt,'h:mm a')
        const endAt = moment(req.body.endAt,'h:mm a')
        const timeDiff =  moment.duration(endAt.diff(startAt)).asMinutes()
        if (!(timeDiff ===30 ||timeDiff===60 ))
           {
            return res.json({message:'error of the time',status:422}) 
           }
        updated.weekday = req.body.weekday
        updated.startAt = startAt.format('h:mm a');
        updated.endAt = endAt.format('h:mm a');
        updated.duration = timeDiff
        await updated.save()
       return res.status(200).json({message:'update appointment',updated})
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


