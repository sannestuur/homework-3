const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())


var Sequelize = require('sequelize')
var sequelize = new Sequelize('postgres://postgres:secret@localhost:5432/postgres')

app.listen(4001, () => console.log('Express API listening on port 4001'))

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
  next()
})

const Event = sequelize.define('event', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  start_date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  end_date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }

},  {
  tableName: 'events',
  timestamps: false
})

//This method returns a list of only future events (including title, starting date and end date)
app.get('/events', (req, res) => {
  const Op = Sequelize.Op;
  const Now = Date.now();

  Event.findAll({
    attributes: ['title', 'start_date', 'end_date'],
    where: {
      start_date: {
        [Op.gt]: Now
      }
    },
  })
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      res.status(500)
      res.json({message: 'Something went wrong'})
    })
})

// This method allows you to create new events
app.post('/events', (req, res) => {
  const event = req.body

  Event.create(event)
    .then(entity => {
      res.status(201)
      res.json(entity)
    })
    .catch(err => {
      res.status(422)
      res.json({ message: err.message })
    })
})

// Create method for updating events


// Create method for deleting events
