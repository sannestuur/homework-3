const Router = require('express').Event
const Event = require('./model')

const router = new Router()

//This method returns a list of only future events (including title, starting date and end date)
router.get('/events', (req, res) => {
  const Op = Sequelize.Op;
  const Now = new Date();

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
router.post('/events', (req, res) => {
  const event = req.body
  const Now = new Date();

  if (event.start_date < Now)
    {res.status(406).send({
      message: 'This event cannot be added because it started in the past'
    })
  }
  else if (event.start_date > event.end_date)
    {res.status(406).send({
      message: 'This event cannot be added because its start date is before its end date'
    })
  }
  else {
    Event.create(event)
      .then(entity => {
        res.status(201)
        res.json(entity)
      })
      .catch(err => {
        res.status(422)
        res.json({ message: err.message })
      })
  }
})

// Create method for updating events
router.put('/events/:id', (req, res) => {
  const updates = req.body

  Event.findById(req.params.id)
    .then(entity => {
      return entity.update(updates)
    })
    .then(final => {
      res.status(200).res.send(final)
    })
    .catch(error => {
      res.status(500).send({
        message: `Something went wrong`,
        error
      })
    })
})

// Create method for deleting events

router.delete('/events/:id', (req, res) => {
  Event.findById(req.params.id)
  .then(entity => {
    return entity.destroy()
  })
  .then(_ => {
    res.status(200).res.send({
      message: 'The event was deleted succesfully'
    })
  })
  .catch(error => {
    res.status(500).send({
      message: `Something went wrong`,
      error
    })
  })
})

module.exports = router
