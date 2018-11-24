const TsdbDataClient = require('bce-sdk-js').TsdbDataClient;
const metrics = 'mygod';
const tag = 'mygod';
var config;
const DbComp = {
    init: (conf) => {
        console.log('初始化db模块');
        if (conf) {
            config = {
                endpoint: conf.url,
                credentials: {
                    ak: conf.ak,
                    sk: conf.sk
                }
            }
        } else {
            console.log('db配置不存在');
        }
    },
    _buildAltitudeData: altitude => {
        return {
            'metric': metrics,
            'field': 'altitude',
            'tags': {
                'host': tag,
            },
            'value': +altitude
        };
    },
    _buildLatitudeData: latitude => {
        return {
            'metric': metrics,
            'field': 'latitude',
            'tags': {
                'host': tag,
            },
            'value': +latitude
        };
    },
    _buildLongitudeData: longitude => {
        return {
            'metric': metrics,
            'field': 'longitude',
            'tags': {
                'host': tag,
            },
            'value': +longitude
        };
    },
    _buildTemperatureData: temperature => {
        return {
            'metric': metrics,
            'field': 'temperature',
            'tags': {
                'host': tag,
            },
            'value': +temperature
        }
    },
    reportDatapoints: (latitude = 0, longitude = 0, altitude = 0, temperature = 0, succ, fail) => {
        if (config) {
            let client = new TsdbDataClient(config);
            let datapoints = [
                DbComp._buildLatitudeData(latitude),
                DbComp._buildLongitudeData(longitude),
                DbComp._buildAltitudeData(altitude),
                DbComp._buildTemperatureData(temperature)
            ];

            client.writeDatapoints(datapoints)
                .then(response => succ && succ(response))
                .catch(error => fail && fail(error));
        } else {
            console.log("缺少配置文件!!");
            fail && fail(error)
        }
    }
}

module.exports = DbComp;