const express = require('express')
const usersControllers = require('../controllers/users')
const router = express.Router()
const{updateProfileUser} = require('../middleware/validator')
const upload = require('../middleware/multer')
const gaurd = require('../middleware/is-auth')

router.get('/account/profile/:id',gaurd,usersControllers.getProfilePatient)

router.put('/account/profile/:id',gaurd,updateProfileUser(),usersControllers.updateProfile)

router.put('/account/changePassword/:id',gaurd,usersControllers.updatedPassword)

router.delete('/account/profile/:id',gaurd,usersControllers.deleteProfile)

router.get('/reservation',gaurd,usersControllers.getAllReservation)

module.exports = router
