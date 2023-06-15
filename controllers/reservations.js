const appointment = require('../model/appointment')
var moment = require('moment');
const User = require('../model/users')
const Doctor = require('../model/doctor')
const stripe = require("stripe")(process.env.STRIPE_SECERT);


exports.create = async(req,res,next)=>
{
    let convert = moment(req.body.start, ["h:mm a"]).format("HH:mm")
    let createAppointment
    const time = req.body.time
    const start = moment(req.body.start,'h:mm a').format('h:mm a') 
   const meetingStart = moment.utc(Math.floor(new Date(time+'T'+convert).getTime() / 1000))
    try{
        const patient = await User.findById(req.body.patient)
        const doctor = await Doctor.findById(req.body.doctor)
        if(req.body.type === 'online')
        {
        if(!(req.body.start && req.body.time))
        {
            return res.status(401).json({message:'enter time and date'})
        }
        const foundApppoitment = await appointment.find({
            "doctor":req.body.doctor
            ,"start":start,"time":moment(time).format("YYYY-MM-DD"),"isPaid":true})
        .where('reservationPlace').equals('video call')
        if(foundApppoitment)
            {
                return res.status(400).json({message:'this Apppoitment not found'})
            } 
        createAppointment = new appointment({
                ...req.body,
                start:start,
                patient:patient,
                reservationPlace:'video call',
          meetingStart:meetingStart,
                time:moment(time).format("YYYY-MM-DD")
            })
        }

    if(patient.roles != 'user')
        {
        return res.status(401).json({message:'can not create'})
        }

    else
        { 
            await createAppointment.save()
            const appointmentId = await appointment.findById(createAppointment._id)
            return res.status(201).json({message:'ok createAppointment',createAppointment,id:createAppointment._id})
        }
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

exports.cheeckOutSession = async(req,res,next)=>
{

    try{
        //get reservation Id and price of docotr
        const appointmentId = await appointment.findById(req.params.id)
        .populate('doctor','price')
        .populate('patient','userName email')
        if(!appointmentId)
        {
            return res.json({
                message:'appointment not found',
                status:404}) 
        }
        const name= appointmentId.patient.userName ;
        const price=appointmentId.doctor.price *100 ;

        const session = await stripe.
        checkout.sessions.create({
            line_items: [{
                price_data: {
                    currency:'egp',
               product_data: {
                name:name },
               unit_amount:price ,
              },
                quantity:1
              },
            ],
            mode: 'payment',
            success_url: `${req.protocol}://${req.get('host')}/user/reservation`,
            cancel_url: `${req.protocol}://${req.get('host')}/createReservation`,
            customer_email:appointmentId.patient.email,
            client_reference_id:appointmentId._id.toString()
          });

        return res.status(200).json({status:'success',session})
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



const createMeeting = async(session)=>
{
   
    const reservationId = session.client_reference_id
    const totalPaid = session.amount_total / 100
    const appointmentId = await appointment.findById(reservationId)
    appointmentId.totalPaid = totalPaid
    appointmentId.paidAt = moment(Date.now()).format('YYYY-MM-DD hh:mm z')
    appointmentId.isPaid = true
    appointmentId.save()
}

exports.webhookCheckOut = async(req,res,next)=>
{
   
        const sig = req.headers['stripe-signature'];
        let event;
        try {
          event = stripe.webhooks.constructEvent(req.body, sig, process.env.WEBHOOK_SECRET_STRIPE);
        } catch (err) {
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }      
        if(event.type === 'checkout.session.completed')
        {
           createMeeting(event.data.object)
        }
        return res.json({recived:true})
    
}

exports.getSpesficReservation = async(req,res,next)=>
{
    const id = req.params.id
    try
    {
    const appointmentId = await appointment
    .findById(id)
    .select('-reservationStatus -meetingName -meetingStart ')
    .populate({
        path: "doctor",
        select: "userName photo city specialty location region"
      })
    .populate(
        {
         path: "patient",
         select: "userName "
        })
    if(!appointmentId)
    {
        return res.status(404).json({message:"not found"})
    }
    res.status(200).json(appointmentId)
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

exports.updateReservation = async(req,res,next)=>
{
    const id = req.params.id
    try
    { 
        const start = moment(req.body.start,'h:mm a').format('h:mm a') 
        const {doctor,name,time} = req.body
        const appointmentId = await appointment.findById(id)
        const checktime = await appointment.find
        ({"start":start,
        "time":moment(time).format("YYYY-MM-DD")})
        if(!appointmentId)
        {
            return res.status(404).json({message:"not found"})       
        } 
        if(!checktime)
        {
            return res.status(401).json({message:'this appointment not found'})
        }
        appointmentId.doctor = doctor
        appointmentId.name= name
        appointmentId.start = start
        appointmentId.time = moment(time).format("YYYY-MM-DD")
        await appointmentId.save()
        return res.status(201).json(appointmentId)
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

exports.cancel = async(req,res,next)=>
{
    const id = req.params.id
    try{

        const findReservationId = await appointment.findById(id)
        if(!findReservationId)
        {
            return res.status(404).json({message:'this appointment not found '})
        }
        const appointmentId = await appointment.findByIdAndRemove(id)
        res.status(200).json({message:'ok delete appointment'})
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
