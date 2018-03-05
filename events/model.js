const Sequelize = require('sequelize')
const sequelize = require('../db')

const Event = sequelize.define('event', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
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
  userId: {
  type: Sequelize.INTEGER,
  field: 'user_id'
  }
},  {
  tableName: 'events',
  timestamps: false
})

module.exports = Event
