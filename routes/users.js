const express = require('express')
const usersControllers = require('../controllers/users')
const router = express.Router()
const{updateProfileUser} = require('../middleware/validator')
const upload = require('../middleware/multer')
const gaurd = require('../middleware/is-auth')

router.get('/account/profile/:id',usersControllers.getProfilePatient)

router.put('/account/updatePhoto/:id',upload.single('photo'),usersControllers.updatePhoto)

router.get('/account/photo/:id',usersControllers.getDoctorPhoto)

router.put('/account/profile/:id',updateProfileUser(),usersControllers.updateProfile)

router.put('/account/changePassword/:id',usersControllers.updatedPassword)

router.delete('/account/profile/:id',usersControllers.deleteProfile)

router.get('/reservation',usersControllers.getAllReservation)

module.exports = router
