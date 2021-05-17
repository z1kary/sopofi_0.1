const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
require('dotenv').config({ path: './config/.env' })
require('./config/db')
const { fetchJwt, fetchUlc } = require('./middleware/authMiddleware')
const cors = require('cors')

const userRoutes = require('./routes/user.routes')
const themesRoutes = require('./routes/themes.routes')

const app = express()

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}
app.use(cors(corsOptions))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/jwtid', fetchJwt, (req, res) => {
  res.status(200).send(res.locals.user)
})
app.get('/ulcid', fetchUlc, (req, res) => {
  res.status(200).send(res.locals.ulc)
})

app.use('/api/user', userRoutes)
app.use('/api/themes', themesRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Listening on port : ${process.env.PORT}`);
})