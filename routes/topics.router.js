const express = require('express')

const{getTopics} = require('../controllers/topics.controller')

topicsRouter = express.Router()


topicsRouter
.get('/', getTopics)

module.exports = topicsRouter