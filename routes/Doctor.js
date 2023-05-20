const express = require('express')
const routes = express.Router()
const controller = require('../controllers/doctor')
const upload = require('../middleware/multer')
const {updateProfileUser} = require('../middleware/validator')
const gaurd = require('../middleware/is-auth')


routes.get('/account/profile/:doctorId',controller.getProfile)
routes.get('/account/photo/:doctorId',controller.getDoctorPhoto)
routes.put('/account/updatePhoto/:doctorId',upload.single('photo'),controller.updatePhoto)
routes.put('/account/changePassword/:doctorId',controller.updatedPassword)
routes.put('/account/profile/:doctorId',updateProfileUser(),controller.updateProfile)

routes.get('/getAllResrvationDay',controller.getAllReservation)

routes.get('/getResrvationDay',controller.getReservationDay)

routes.get('/getResrvationDay/:id',controller.getReservationDayById)

routes.delete('/getResrvationDay/:id',controller.deleteReservation)

module.exports = routes





