'use strict';

module.exports = (app, configurationService) => {
    
    const Promise = require("bluebird");

    app.get('/configuration/:deviceId', (request, response) => {
        configurationService.initAndGetDeviceConfiguration(request.params.deviceId)
            .then(deviceConfiguration => {
                return response.json(deviceConfiguration)
            });
    });
}