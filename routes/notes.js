const express = require('express')
const routes = express.Router()
const Notes = require('../controllers/notes')
const isAuth = require('../middleware/is-auth')

routes.post('/createNotes/:userId',Notes.addNotes)

routes.get('/Notes/:userId',Notes.getNotesUser)

module.exports = routes