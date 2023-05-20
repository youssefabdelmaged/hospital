const express = require('express')
const gaurd = require('../middleware/is-auth')
const usersController = require('../controllers/reservations')
const router = express.Router()

router.post('/createReservation', usersController.create) 

router.get('/checkout-session/:id',usersController.cheeckOutSession)

router.get('/reservation/:id',usersController.getSpesficReservation)

router.put('/reservation/:id',usersController.updateReservation)

router.delete('/reservation/:id',usersController.cancel)

module.exports= router