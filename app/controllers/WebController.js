'use strict';

module.exports = (app, configurationService, frontendAppLocation) => {

    const express = require('express');
    const path = require('path');


    app.use('/static', express.static(frontendAppLocation));

    app.get('/', (request, response) => {
        response.sendFile(path.join(frontendAppLocation + '/index.html'));
    });

    app.get('/devices', (request, response) => {
        configurationService.getAllDevicesConfigurations()
            .then(devices => {
                return response.json(devices);
            });
    });

    app.get('/device/:id', (request, response) => {
        configurationService.getDeviceConfiguration(request.params.id)
            .then(configuration => {
                return response.json(configuration);
            });
    });

    app.post('/device-rgb', (request, response) => {
        configurationService.submitNewRGBConfiguration(
                request.body.deviceId,
                request.body.rgbSequence)
            .then(() => {
                response.sendStatus(200);
            });
    });
}