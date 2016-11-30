'use strict';

module.exports = (dao) => {

    const Promise = require("bluebird");

    const submitNewRGBConfiguration = (deviceId, rgbSequence) => {
        return dao.saveAndGet(deviceId, { rgbSequence: rgbSequence });
    };

    const initAndGetDeviceConfiguration = (deviceId) => {
        return dao.saveAndGet(deviceId, { lastInteraction: new Date() });
    };

    const getDeviceConfiguration = (deviceId) => {
        return dao.get(deviceId);
    };

    const getAllDevicesConfigurations = () => {
        return dao.getAll();
    };

    return {
        submitNewRGBConfiguration: submitNewRGBConfiguration,
        getDeviceConfiguration: getDeviceConfiguration,
        getAllDevicesConfigurations: getAllDevicesConfigurations,
        initAndGetDeviceConfiguration: initAndGetDeviceConfiguration
    };
};