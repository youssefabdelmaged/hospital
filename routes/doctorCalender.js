const express = require('express')
const gaurd = require('../middleware/is-auth')
const routes = express.Router()
const controller = require('../controllers/doctorCalender')

routes.post('/create',controller.create)

routes.get('/workingHours/:id',controller.getWorkingHours)

routes.get('/spesficDay/:id',controller.getSpesficDay)

routes.put('/spesficDay/:id',controller.update)


module.exports = routes