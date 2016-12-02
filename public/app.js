var INTERVAL_TIMEOUTS_MS = 1000;
var RED_IF_OLDER_THAN_MS = 60 * 1000;
var RGB_REGEX = /^[RGB]+$/;


// Curent device
var currentDeviceComponent = new Vue({
    el: '#current-device-component',
    data: {
        device: null
    }
});

// Continuous job that fetches current device info
var initCurrentDevice = function() {
    setTimeout(function() {
        var currentDeviceId = (currentDeviceComponent.device 
            ? currentDeviceComponent.device.deviceId 
            : undefined);

        if (currentDeviceId) {
            jQuery.get('/device/' + currentDeviceId, {}, function(response) {
                currentDeviceComponent.device = response;
            });
        }

        initCurrentDevice();
    }, INTERVAL_TIMEOUTS_MS); 
};

initCurrentDevice();

// Initializing devices
var devicesComponent = new Vue({
    el: '#devices-component',
    data: {
        devices: []
    },
    methods: {
        isOld: function(device) {
            return new Date().getTime() - new Date(device.lastInteraction).getTime() > RED_IF_OLDER_THAN_MS;
        },
        selectDevice: function(device) {
            currentDeviceComponent.device = device;
        }
    }
});

// Continous job that fetches devices
var initDevices = function() {
    setTimeout(function() {
        jQuery.get('/devices', {}, function(response) {
            devicesComponent.devices = response;
            initDevices();
        });
    }, INTERVAL_TIMEOUTS_MS); 
};

initDevices();

// RGB Sequence changing form
var deviceUpdateComponent = new Vue({
    el: '#device-update-component',
    data: {
        newRGBSequence: null
    },
    methods: {
        submit: function() {
            if (currentDeviceComponent.device 
                    && this.newRGBSequence
                    && RGB_REGEX.test(this.newRGBSequence)) {

                var requestObject = {
                    deviceId: currentDeviceComponent.device.deviceId,
                    rgbSequence: this.newRGBSequence.toUpperCase()
                };

                jQuery.post('/device-rgb', requestObject);
                this.newRGBSequence = null;

            } else {
                alert('Something is wrong: either no device selected, no RGB sequence entered or it is not valid');
            }
        }
    }
});