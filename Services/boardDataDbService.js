const boardDataModel = require('../Models/boardDataModel')
const logger = require('../util/logger')

module.exports = {
    insertData: async (data) => {
        try {
            await boardDataModel.create(data)
        } catch (error) {
            logger.error('Error from boardDbService insertData')
            throw new Error(error)
        }

    },
    getData: async () => {
        try {
            const data = await boardDataModel.findOne()
            return data
        } catch (error) {
            logger.error('Error from boardDbService getData')
            throw new Error(error)
        }
    },
    updateData: async (data) => {
        try {
            const result = await boardDataModel.findOneAndUpdate({}, { $set: { boardData: data } }, { new: true })
            return result
        }
        catch (error) {
            logger.error('Error from boardDbService updateData')
            throw new Error(error)
        }

    }
}