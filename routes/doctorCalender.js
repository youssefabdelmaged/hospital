const express = require('express')
const gaurd = require('../middleware/is-auth')
const routes = express.Router()
const controller = require('../controllers/doctorCalender')

routes.post('/create',gaurd,controller.create)

routes.get('/workingHours/:id',gaurd,controller.getWorkingHours)

routes.get('/spesficDay/:id',gaurd,controller.getSpesficDay)

routes.put('/spesficDay/:id',gaurd,controller.update)


module.exports = routes