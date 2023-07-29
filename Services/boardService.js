const logger = require("../util/logger")
const boardUser = require('./boardUserDbService')
const boardData = require('./boardDataDbService')
const R = require('ramda')
const { getUnixTimeStamp } = require('./timeService')
const Sys = require('../util/cacheInitializer')


module.exports = {

    checkTakeControlStatus: async () => {
        try {
            let response = { action: true, userHavingControl: '' }
            const activeUserUsingBoard = await boardUser.getData()
            if (!R.isNil(activeUserUsingBoard)) {
                const { userId, userActionTime } = activeUserUsingBoard

                const unixTime = getUnixTimeStamp(new Date())

                if ((userActionTime + 120) >= unixTime)
                    response = { action: false, userHavingControl: userId }
                else
                    await boardUser.deleteData()

                return response
            }
            return response

        } catch (error) {
            logger.error(`Error from checkTakeControlStatus ${error}`)
            throw new Error(error)
        }

    },
    processTakeControl: async (userId) => {
        try {
            const data = {
                userId,
                userActionTime: getUnixTimeStamp(new Date())
            }
            await boardUser.insertData(data)

            Sys.controlSessionId = setTimeout(async () => {
                Sys.Socket.emit(('destroyControlSession', {
                    userId,
                    message: 'Control has been removed from' + userId
                }))
                await boardUser.deleteData()
                Sys.controlSessionId = null
            }, (120 * 1000))

        } catch (error) {
            logger.error(`Error from processTakeControl ${error}`)
            throw new Error(error)

        }

    },
    setInitialBoardData: async (data) => {
        try {
            const boardDataInDb = await boardData.getData()
            if (!R.isNil(boardDataInDb))
                return { action: false, message: 'data is already present' }
            await boardData.insertData(data)
            return { action: 'success', message: 'Initial data has been saved' }
        }
        catch (error) {
            logger.error(`Error from setInitialBoardData ${error}`)
            throw new Error(error)
        }
    },

    getBoardStatusService: async () => {
        try {
            const boardDataInDb = await boardData.getData()
            return { action: 'success', message: boardDataInDb }
        } catch (error) {
            logger.error(`Error from getBoardStatus ${error}`)
            throw new Error(error)
        }
    },
    checkUserHavingControlService: async (user) => {
        try {
            const activeUserUsingBoard = await boardUser.getData()
            if (R.isNil(activeUserUsingBoard) || activeUserUsingBoard.userId != user || (activeUserUsingBoard.activeUserUsingBoard + 120) < getUnixTimeStamp(new Date()))
                return { action: 'false', message: 'control session is not active' }
            return { action: 'success' }

        } catch (error) {
            logger.error(`Error from checkUserHavingControlService ${error}`)
            throw new Error(error)

        }
    },

    processChangeBoardStatus: async (user, userAction) => {
        try {
            const boardDataInDb = await this.getBoardStatusService()
            if (boardDataInDb?.message?.white.includes(userAction)) {
                const index = boardDataInDb?.message?.white.findIndex((data) => data == userAction)
                boardDataInDb?.message?.white.splice(index, 1)
                boardDataInDb.message[Sys.userActionColour[user]] = userAction
            }
            else if (boardDataInDb?.message?.yellow.includes(userAction)) {
                if (Sys.userActionColour[user] == 'yellow') {
                    const index = boardDataInDb?.message?.yellow.findIndex((data) => data == userAction)
                    boardDataInDb?.message?.yellow.splice(index, 1)
                    boardDataInDb.message['white'] = userAction
                }
                else {
                    const index = boardDataInDb?.message?.yellow.findIndex((data) => data == userAction)
                    boardDataInDb?.message?.yellow.splice(index, 1)
                    boardDataInDb.message[Sys.userActionColour[user]] = userAction
                }

            }
            else if (boardDataInDb?.message?.red.includes(userAction)) {
                if (Sys.userActionColour[user] == 'red') {
                    const index = boardDataInDb?.message?.red.findIndex((data) => data == userAction)
                    boardDataInDb?.message?.red.splice(index, 1)
                    boardDataInDb.message['white'] = userAction
                }
                else {
                    const index = boardDataInDb?.message?.red.findIndex((data) => data == userAction)
                    boardDataInDb?.message?.red.splice(index, 1)
                    boardDataInDb.message[Sys.userActionColour[user]] = userAction
                }

            }
            const updatedData = await boardData.updateData(boardDataInDb.message)

            if (!R.isNil(Sys.controlSessionId)) {
                clearTimeout(Sys.controlSessionId)
                Sys.controlSessionId = null
            }
            await boardUser.deleteData()
            return { action: 'success', message: updatedData }

        } catch (error) {
            logger.error(`Error from processChangeBoardStatus ${error}`)
            throw new Error(error)
        }


    }

}