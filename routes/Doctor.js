const express = require('express')
const routes = express.Router()
const controller = require('../controllers/doctor')
const upload = require('../middleware/multer')
const {updateProfileUser} = require('../middleware/validator')
const gaurd = require('../middleware/is-auth')


routes.get('/account/profile/:doctorId',gaurd,controller.getProfile)
routes.get('/account/photo/:doctorId',gaurd,controller.getDoctorPhoto)
routes.put('/account/updatePhoto/:doctorId',gaurd,upload.single('photo'),controller.updatePhoto)
routes.put('/account/changePassword/:doctorId',gaurd,controller.updatedPassword)
routes.put('/account/profile/:doctorId',gaurd,updateProfileUser(),controller.updateProfile)

routes.get('/getAllResrvationDay',gaurd,controller.getAllReservation)

routes.get('/getResrvationDay',gaurd,controller.getReservationDay)

routes.get('/getResrvationDay/:id',gaurd,controller.getReservationDayById)

routes.delete('/getResrvationDay/:id',gaurd,controller.deleteReservation)

module.exports = routes





