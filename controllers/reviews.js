const Doctor = require('../model/doctor')
const Reviews = require('../model/reviews')
const complaints = require('../model/complaints')
const moment = require('moment')

exports.postReview = async(req,res,next)=>
{
    const doctorId = req.params.doctorId
    const spesficDoc = await Doctor
    .findById(doctorId)
    .populate('reviews','user rating')
    //population to alllow me to access user in reviews 

    const newReview = new Reviews({
        name:req.body.name,
        rating:Math.round(req.body.rating),
        comment:req.body.comment,
        user:req.userId,
        doctor:spesficDoc._id,
        time:moment(Date.now()).format('L')
    })
    try
    {
        //Don't allow more than one review per user
        for(var i=0;i<spesficDoc.reviews.length;i++)
        {
            if(spesficDoc.reviews[i].user === req.userId)
            {
                return res.status(401).json({message:'I have already review'})
            }
        }
        // Don't allow the doctor to post a review on himself.
        if(req.userId === spesficDoc._id)
        {
            return res.status(401).json({message:'sorry not possible the review '})
        }
        spesficDoc.reviews.push(newReview)

        //calculate the total num of reviews 
        spesficDoc.numReviews = spesficDoc.reviews.length

        //calculate the average of raiting
        for(var i=0;i<spesficDoc.reviews.length;i++)
        {
            spesficDoc.raiting = spesficDoc.reviews
            .reduce((acc,item)=> acc + item.rating,0) /spesficDoc.reviews.length
        }
        await spesficDoc.save()
        await newReview.save()
        res.status(201).json({ message: 'ok add reviw '})
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

exports.deleteReview = async(req,res,next)=>
{
    const doctorId = req.params.doctorId
    const reviewId = req.params.reviewId

    const review = await Reviews.findById(reviewId)

    const spesficDoc = await Doctor
    .findById(doctorId)
    .populate('reviews','user rating')
    try
    {
        //if not found the id of review
        if(!review)
        {
            return res.status(404).json({message:'this review not found'})
        }
        //to ensure that user has delted own review only
        if(review.user === req.userId)
        {
            //to remove relation between doctor and reviews
            spesficDoc.reviews.pull(review._id)

            //to edit the number of total reviews after delete one
            spesficDoc.numReviews = spesficDoc.reviews.length

            //to remove review
            review.remove()

            //to recalculate reviews affter delete one
            //in this loop i<=length to enter in the loop and check if condtion
            for(var i=0;i<=spesficDoc.reviews.length;i++)
            {
                if(spesficDoc.reviews.length == 0)
                {
                    //if no reviews on doctor model then average raiting = 0
                    spesficDoc.raiting = 0
                }
                else
                {
                    //recalualte after delete one
                    spesficDoc.raiting = spesficDoc.reviews
                    .reduce((acc,item)=> acc + item.rating,0) / 
                    spesficDoc.reviews.length
                }
            }
            //save spesficDoc after remove review and edit average raitng
            await spesficDoc.save()
            return res.status(200).json({message:'ok delete review'})
        }
        else
        {
            //if user on review collection !== req.userId
            return res.status(401).json({message:'sorry cant delete this review'})
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

exports.addComplaints = async(req,res,next)=>
{
    try
    {
        const doctorId = req.params.doctorId
        const spesficDoc = await Doctor.findById(doctorId)
        if(!spesficDoc)
        {
            return res.status(400).json({message:'this doctor not found'})
        }
        const newComplaint = new complaints({
            details:req.body.details,
            user:req.userId,
            doctor:spesficDoc._id
        })
        await newComplaint.save()
        spesficDoc.complaintsMode =true
        spesficDoc.complaints.push(newComplaint)
        await spesficDoc.save()
        return res.status(200).json({message:'ok add Complaint'})
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