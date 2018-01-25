/**
 * ADiSys - Advanced Dispensaries System
 * by Ivan Khromov with ❤️
 * 2018
 */
// Require all needed dependencies:
const express = require('express')
require('dotenv').config()
const hbs = require('hbs')
const app = express()
const mongoose = require('mongoose')

// Logger:
const morgan = require('morgan')
const logger  = require('./misc/logger')
app.use(morgan('tiny'))

// Connect to MongoDB:
// WARNING: don't forget to put .env file into root directory!
mongoose.connect(process.env.DB_DSN)
	.then(() => logger.info('DB connection succesful'))
	.catch((err) => logger.error(err.message))

// Handlebars. Register all needed functionality.
// All templates are in ./views/ directory
// All partials were placed at /views/partials
hbs.registerPartials(__dirname + '/views/partials')

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.set('view options', { layout: 'layout/app' })

app.use('/static', express.static(__dirname + '/static'));
app.use('/twbs', express.static(__dirname + '/node_modules/bootstrap/dist'))
app.use('/jq', express.static(__dirname + '/node_modules/jquery/dist'))

// Set application default route, which performs 301 redirect
// for browser. New location is /patients/list.
// TODO: Check auth in future!
app.get('/', (req, res) => res.redirect(301, '/patients/list/'))

// Patients:
app.use('/patients', require('./routes/patients.js'))

app.listen(process.env.PORT, () => logger.info(`ADiSys listening on port ${process.env.PORT}!`))
