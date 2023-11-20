const express = require('express')
const{getTopics} = require('./controller.js')
const{handle404s,handleServerErrors} = require('../../errors/errors.js')

const app = express()
app.use(express.json())

app.get('/api/topics', getTopics)

app.all('*',handle404s)

app.use(handleServerErrors)


module.exports = app