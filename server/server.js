#!/usr/bin/env node
const fs = require('fs');
const ini = require('ini');
// const MqttComp = require('./components/mqttComp');
const MqttComp = require('./components/mqttLocalComp');
const CameraComp = require('./components/cameraComp');
const CmdComp = require('./components/cmdComp');
const FileUploadComp = require('./components/fileUploadComp');
const TemperatureComp = require('./components/temperatureComp');
const LocationComp = require('./components/locationComp');
const HornComp = require('./components/hornComp');
const LedComp = require('./components/ledComp');
const DbComp = require('./components/dbComp');
const ControlComp = require('./components/controlComp');

const configPath = '../config.conf';
const LOOP_TAKE_PIC = 60 * 1000;
let config;

const manager = {
    mqttComp: MqttComp,
    cameraComp: CameraComp,
    cmdComp: CmdComp,
    fileUploadComp: FileUploadComp,
    temperatureComp: TemperatureComp,
    locationComp: LocationComp,
    hornComp: HornComp,
    ledComp: LedComp,
    dbComp: DbComp,
    controlComp: ControlComp
}

console.log('检测配置文件');
fs.exists(configPath, exists => {
    if (exists) {
        console.log('读取配置文件...');
        config = ini.parse(fs.readFileSync('../config.conf', 'utf-8'));
        MqttComp.init(config.Mqtt, manager);
        CameraComp.init(manager);
        FileUploadComp.init(config.QiNiu);
        TemperatureComp.init(manager);
        LocationComp.init(config.Location, manager);
        DbComp.init(config.Tsdb);
        ControlComp.init(manager);
    } else {
        console.log('缺少配置文件');
    }
});

// 每次运行时，清理之前的缓存照片
if (manager.cmdComp) {
    manager.cmdComp.exec(`rm -r -f ../photos && mkdir ../photos`);
}

setInterval(() => {
    if (manager.cameraComp) {
        manager.cameraComp.takePic();
    }
    if (manager.locationComp) {
        manager.locationComp.getLocation();
    }
    if (manager.temperatureComp) {
        manager.temperatureComp.getTemperature();
    }
    if (manager.dbComp) {
        manager.dbComp.reportDatapoints(
            manager.locationComp.getLastLatitude(),
            manager.locationComp.getLastLongitude(),
            manager.locationComp.getlastAltitude(),
            manager.temperatureComp.getLastTemperature(),
            response => {
                manager.ledComp.flashWhite();
                console.log('数据上传成功');
                console.log(response);
            }, error => {
                console.log('数据上传失败');
                console.log(error);
            });
    }
}, LOOP_TAKE_PIC);