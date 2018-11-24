const fs = require('fs');
const ini = require('ini');
const request = require('request-promise');
const locationConfPath = '../location.conf';
let config;
let manager;
let lastAltitude = 0;
let lastLatitude = 0;
let lastLongitude = 0;
const LocationComp = {
    init: (conf, mng) => {
        console.log('初始化location模块');
        if (conf) {
            config = {
                ak: conf.ak,
                service_id: conf.service_id,
                entity_name: conf.entity_name
            }
        } else {
            console.log('location配置不存在');
        }

        if (mng) {
            manager = mng
        }
    },
    getLocation: callback => {
        fs.exists(locationConfPath, exists => {
            if (!exists) {
                console.log('还没有定位信息...');
            } else {
                let location = ini.parse(fs.readFileSync(locationConfPath, 'utf-8'));
                let latitude = location.Location.latitude;
                let longitude = location.Location.longitude;
                let height = location.Location.height;
                lastAltitude = height;
                lastLongitude = longitude;
                lastLatitude = latitude;

                console.log(`latitude=${latitude},longitude=${longitude},height=${height}`);
                callback && callback(latitude, longitude, height);
            }
        });
    },
    reportLocation: (lat, lon, alt) => {
        if (!manager) {
            console.log('manager不存在');
            return;
        }
        let url = 'http://yingyan.baidu.com/api/v3/track/addpoint'
        let params = {
            ak: config.ak,
            service_id: config.service_id,
            entity_name: config.entity_name,
            latitude: lat,
            longitude: lon,
            loc_time: Math.round(new Date().getTime() / 1000),
            coord_type_input: 'bd09ll',
            height: alt,
        }

        request({
            method: 'POST',
            url: url,
            formData: params
        }).then(function (response) {
            manager.ledComp.flashWhite();
            console.log("经纬度上传成功");
        });
    },
    getlastAltitude: () => {
        return lastAltitude;
    },
    getLastLatitude: () => {
        return lastLatitude;
    },
    getLastLongitude: () => {
        return lastLongitude;
    }
}

module.exports = LocationComp;