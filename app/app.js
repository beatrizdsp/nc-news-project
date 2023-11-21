const express = require('express')
const{getTopics} = require('../controllers/topics.controller')
const {getEndpoints} = require('../controllers/app.controller')
const{handle404s,handleServerErrors} = require('../errors/errors')

const app = express()

app.get('/api',getEndpoints)

app.get('/api/topics', getTopics)

app.all('*',handle404s)

app.use(handleServerErrors)


module.exports = app