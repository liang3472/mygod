const mqtt = require('mqtt');
const RandomString = require('randomstring');
// 指令
const CMD_TAKE_PIC = 'CMD_TAKE_PIC';
const CMD_REBOOT = 'CMD_REBOOT';
const CMD_GET_TEMP = 'CMD_GET_TEMP';
const CMD_GET_LOCATION = 'CMD_GET_LOCATION';
const CMD_HORN = 'CMD_HORN';
const CMD_FORWARD = 'CMD_FORWARD';
const CMD_BACK = 'CMD_BACK';
const CMD_LEFT = 'CMD_LEFT';
const CMD_RIGHT = 'CMD_RIGHT';

const MqttComp = {
  init: (conf, manager) => {
    console.log('初始化mqtt模块');
    if (conf) {
      config = {
        server: 'tcp://69.171.79.169:1883',
        options: {
          clientId: 'test_mqtt_node_' + RandomString.generate()
        },
        topic: 'MyGodTopic'
      }

      MqttComp._connect(manager);
    } else {
      console.log('mqtt配置不存在');
    }
  },
  _connect: (manager) => {
    if (!manager) {
      console.log('manager不存在');
      return;
    }
    let mqttClient = mqtt.connect(config.server);
    console.log('Connecting to broker: ' + config.server);

    mqttClient.on('error', error => {
      console.error(error);
    });

    mqttClient.on('message', (topic, data) => {
      manager.ledComp.flashGreen();
      let msg = JSON.parse(data.toString());
      switch (msg.commend) {
        case CMD_TAKE_PIC:
          console.log('拍一张照片');
          manager.cameraComp.takePic(true);
          break;
        case CMD_GET_TEMP:
          console.log('获取温度');
          manager.temperatureComp.getTemperature(data => {
            console.log(`当前温度:${data}`);
          });
          break;
        case CMD_GET_LOCATION:
          console.log("获取经纬度");
          manager.locationComp.getLocation((latitude, longitude, height) => {
            manager.locationComp.reportLocation(latitude, longitude, height)
          });
          break;
        case CMD_HORN:
          console.log('嗡鸣响应');
          manager.hornComp.horn(5);
          break;
        case CMD_REBOOT:
          console.log('重启');
          setTimeout(() => {
            manager.cmdComp.exec('sudo reboot')
          }, 1000);
          break;
        case CMD_FORWARD:
          manager.controlComp.move(manager.controlComp.FORWARD);
          break;
        case CMD_BACK:
          manager.controlComp.move(manager.controlComp.BACK);
          break;
        case CMD_LEFT:
          manager.controlComp.move(manager.controlComp.LEFT);
          break;
        case CMD_RIGHT:
          manager.controlComp.move(manager.controlComp.RIGHT);
          break;
        default:
          console.log('unknow commend');
          break;
      }
    });

    mqttClient.on('connect', () => {
      manager.ledComp.flashGreen();
      console.log('Connected. Client id is: ' + config.options.clientId);
      mqttClient.subscribe(config.topic);
      console.log('Subscribed to topic: ' + config.topic)
    });
  }
};
module.exports = MqttComp;