const express = require('express')
const routes = express.Router()
const Contactus = require('../controllers/contactus')

routes.post('/contactus',Contactus.addContactus)

routes.get('/allContactus',Contactus.getAllContactus)

module.exports = routes