const express = require('express')
const apiRouter = require('./routes/api.router')
const cors = require('cors')

const{
    handle404s,
    handleServerErrors,
    handleCustomErrors,
    handlePsqErrors
} = require('./errors/errors')

const app = express()

app.use(cors())

app.use(express.json())

app.use('/api', apiRouter)

app.all('/*',handle404s)
app.use(handlePsqErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)


module.exports = app