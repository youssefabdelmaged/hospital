const express = require('express')
const routes = express.Router()
const reviewController = require('../controllers/reviews')
const gaurd = require('../middleware/is-auth')
const router = require('./admin')

routes.post('/doctor/:doctorId/review',gaurd,reviewController.postReview)

routes.delete('/doctor/:doctorId/review/:reviewId',gaurd,reviewController.deleteReview)

routes.post('/doctor/complaints/:doctorId',gaurd,reviewController.addComplaints)

module.exports = routes