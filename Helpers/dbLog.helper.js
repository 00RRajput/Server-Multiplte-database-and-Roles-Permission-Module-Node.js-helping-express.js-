const Log = require('../Database/Models/log.model');
const DB = require('./crud.helper');

/**
 * 
 * @param {object} data 
 * @param {objectId} data.user auth user id
 * @param {objectId} data.vendor created vendor id
 * @param {objectId} data.by log created by
 * @param {Date} data.created_at Date of creation
 * @returns generated log/error
 */

const makeLog = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const log = await DB.create(Log, data);
            resolve(log);
        } catch (error) {
            reject(error);
        }
    })
}

/**
 * 
 * @param {object} query query to fetch log
 * @param {object} sort sorting object
 * @returns logs
 */
const readLog = async (query, sort = { _id: -1 }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const log = await DB.population(Log, {
                queryString: query,
                queryExclude: { __v: 0 },
                popString: 'user vendor',
                popExclude: {  _id: 1, name: 1, first_name: 1, last_name: 1 }
            }, {}, sort);
            resolve(log);
        } catch (error) {   
            reject(error);
        }
    })
}

module.exports = {
    makeLog,
    readLog
}