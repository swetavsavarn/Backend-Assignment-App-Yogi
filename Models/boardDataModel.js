const mongoose = require('mongoose')
const boardDataModel = new mongoose.Schema({
    boardData: {
        type: 'object',
        default: {}
    },
})

module.exports = mongoose.model('boardData', boardDataModel)