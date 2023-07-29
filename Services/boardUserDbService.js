const boardUserModel = require('../Models/boardUserModel')
const logger = require('../util/logger')

module.exports = {
    insertData: async (data) => {
        try {
            await boardUserModel.create(data)
        } catch (error) {
            logger.error('Error from boardDbService insertData')
            throw new Error(error)
        }

    },
    getData: async () => {
        try {
            const data = await boardUserModel.findOne()
            return data
        } catch (error) {
            logger.error('Error from boardDbService getData')
            throw new Error(error)
        }
    },
    deleteData: async () => {
        try {
            await boardUserModel.deleteOne()
        } catch (error) {
            logger.error('Error from boardDbService')
            throw new Error(error)
        }
    }
}