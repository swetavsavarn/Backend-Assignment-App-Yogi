const mongoose = require('mongoose');
const logger = require('./logger');
require('dotenv').config();

const mongoConnectionInitializer = async () => {
    const mongooseURI = process.env.DB_CONNECTION_URI;
    if (!mongooseURI) {
        throw new Error('DB_CONNECTION_URI environment variable is not set');
    }
    try {
        await mongoose.connect(mongooseURI, {
            serverSelectionTimeoutMS: 5000,
        });
    } catch (error) {
        logger.error(`Error from mongoConnectionInitializer: ${error}`);
        throw error;
    }
};

module.exports = mongoConnectionInitializer;
