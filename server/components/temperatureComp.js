let manager;
let lastTemperature = 0;
const TemperatureComp = {
    init: mng => {
        console.log('初始化temperature模块');
        if (mng) {
            manager = mng;
        }
    },
    getTemperature: callback => {
        if (!manager) {
            console.log('manager不存在');
            return;
        }
        let cmd = manager.cmdComp.exec('sudo python ./drive/mlx90614.py');
        cmd.stdout.on('data', data => {
            lastTemperature = data;
            callback && callback(data);
        });
    },
    getLastTemperature: () => {
        return lastTemperature;
    }
}

module.exports = TemperatureComp;