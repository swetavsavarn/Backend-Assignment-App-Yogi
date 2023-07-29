const { checkTakeControlStatus, processTakeControl, setInitialBoardData, getBoardStatusService, checkUserHavingControlService, processChangeBoardStatus } = require('../Services/boardService')
const logger = require('../util/logger')
const R = require('ramda')
module.exports = {
    takeControl: async (req, res) => {
        try {
            const { user } = req.query
            if (R.isNil(user))
                return res.status(500).json({ actionStatus: 'fail', message: 'user cannot be empty' })

            const isTakeControlActionAllowed = await checkTakeControlStatus()
            if (isTakeControlActionAllowed?.action == false)
                return res.status(405).json({ actionStatus: 'fail', message: `${isTakeControlActionAllowed.userHavingControl} already have control` })

            if (isTakeControlActionAllowed?.action == true) {
                await processTakeControl(user)
                return res.status(200).json({ actionStatus: 'success', message: `${user} is now having control` })
            }
        } catch (error) {
            logger.error(`Error from takeControl ${error}`)
            throw new Error(error)
        }
    },
    setInitialBoard: async (req, res) => {
        try {
            const { boardData } = req.body
            if (R.isNil(boardData))
                return res.status(500).json({ actionStatus: 'fail', message: 'boardData cannot be empty' })
            const response = await setInitialBoardData(boardData)
            if (response.action == 'fail') {
                return res.status(405).json({ actionStatus: response.action, message: response.message })
            }
            else
                return res.status(200).json({ actionStatus: response.action, message: response.message })
        } catch (error) {
            logger.error(`Error from setInitialBoard ${error}`)
            throw new Error(error)

        }
    },
    getBoardStatusController: async (req, res) => {
        try {
            const response = await getBoardStatusService()
            return res.status(200).json({ actionStatus: response.action, message: response.message })

        } catch (err) {
            logger.error(`Error from getBoardStatusController ${err}`)
            throw new Error(err)
        }
    },
    changeBoardStatus: async (req, res) => {
        try {
            const { user } = req.query
            if (R.isNil(user))
                return res.status(500).json({ actionStatus: 'fail', message: 'user cannot be empty' })

            const { userAction } = req.body
            if (R.isNil(user))
                return res.status(500).json({ actionStatus: 'fail', message: 'userAction cannot be empty' })

            const isSameUserHavingControl = await checkUserHavingControlService(user)
            if (isSameUserHavingControl.action == 'false')
                return res.status(405).json({ actionStatus: isSameUserHavingControl.action, message: isSameUserHavingControl.message })

            const response = await processChangeBoardStatus(user, userAction)
            return res.status(200).json({ actionStatus: response.action, message: response.message })
        } catch (error) {
            logger.error(`Error from changeBoardStatus ${err}`)
            throw new Error(err)
        }
    }

}