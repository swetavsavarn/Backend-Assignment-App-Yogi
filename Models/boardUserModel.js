const mongoose = require('mongoose')
const boardUserModel = new mongoose.Schema({
    userId: {
        type: 'number'
    },
    userActionTime: {
        type: 'number'
    }
})

module.exports = mongoose.model('boardUser', boardUserModel)