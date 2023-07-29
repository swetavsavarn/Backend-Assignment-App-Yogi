const Router = require('express').Router()
const { takeControl, setInitialBoard, getBoardStatusController, changeBoardStatus } = require('../Controllers/operationController')

Router.post('/take-control', takeControl)
Router.post('/set-initial-board', setInitialBoard)
Router.get('/getBoardStatus', getBoardStatusController)
Router.post('/user/changeBoardStatus', changeBoardStatus)

module.exports = Router