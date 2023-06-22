const express = require('express')

const router = express.Router()

const adminController = require('../controllers/admin')

const gaurd = require('../middleware/is-auth')

/*
@DESC To get all docotors that not veried yet 
*/
router.get('/verfy-doctors',gaurd,adminController.getVerfyDoctor)
/*
@DESC To accepet docotors that are veried or removed form db
*/
router.post('/verfy-doctors',gaurd,adminController.postVerfyDoctor)

/*
@DESC To get all docotors after veried
*/
router.get('/accepted-doctors',adminController.getAcceptedDoctors)

router.post('/search',gaurd,adminController.filterSearch)

router.get('/accounts/allDoctors',adminController.getAllDoctorsAccounts)

router.get('/complaints/allDoctors',gaurd,adminController.getDoctorComplaints)

router.get('/complaints/:doctorId',gaurd,adminController.getComplaintsDoctor)

router.delete('/deleteDoctor/:doctorId',gaurd,adminController.deleteProfile)



module.exports = router