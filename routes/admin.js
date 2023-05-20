const express = require('express')

const router = express.Router()

const adminController = require('../controllers/admin')

const gaurd = require('../middleware/is-auth')

/*
@DESC To get all docotors that not veried yet 
*/
router.get('/verfy-doctors',adminController.getVerfyDoctor)
/*
@DESC To accepet docotors that are veried or removed form db
*/
router.post('/verfy-doctors',adminController.postVerfyDoctor)

/*
@DESC To get all docotors after veried
*/

router.get('/accepted-doctors',adminController.getAcceptedDoctors)

router.post('/search',adminController.filterSearch)

router.get('/accounts/allDoctors',adminController.getAllDoctorsAccounts)

router.get('/accounts/:doctorId',adminController.getAccounts)

router.get('/complaints/allDoctors',adminController.getDoctorComplaints)

router.get('/complaints/:doctorId',adminController.getComplaintsDoctor)

router.delete('/deleteDoctor/:doctorId',adminController.deleteProfile)



module.exports = router