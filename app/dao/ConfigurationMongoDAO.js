'use strict';

module.exports = (connectionUrl) => {

    const Promise = require("bluebird");
    const MongoClient = Promise.promisifyAll(require('mongodb').MongoClient);

    const COLLECTION_NAME = 'configurations';

    const getConnection = () => {
        return MongoClient.connect(connectionUrl)
            .then((connection) => {
                return connection;
            });
    };

    const disconnect = (connection) => {
        return connection.close();
    }

    const wrapWithConnection = (dbAction) => {
        return getConnection()
            .then(connection => {
                return Promise.props({
                    dbActionResult: dbAction(connection),
                    connection: connection
                });
            })
            .then(result => {
                return Promise.props({
                    response: disconnect(result.connection),
                    dbActionResult: result.dbActionResult
                })
            })
            .then(result => {
                return result.dbActionResult;
            })
            .catch(error => Promise.reject(error));
    };

    const get = (id) => {
        return wrapWithConnection(connection =>
            connection.collection(COLLECTION_NAME).findOne({ deviceId: id }));
    };

    const getAll = () => {
        return wrapWithConnection(connection =>
            connection.collection(COLLECTION_NAME).find({}).toArray());
    }

    const saveAndGet = (id, updateObject) => {
        return wrapWithConnection(connection => connection
                .collection(COLLECTION_NAME)
                .update(
                    { deviceId: id }, 
                    { $set: Object.assign(updateObject, { deviceId: id }) }, 
                    { upsert: true })
            )
            .then(() => get(id));
    };

    return {
        get: get,
        getAll: getAll,
        saveAndGet: saveAndGet
    };
};
