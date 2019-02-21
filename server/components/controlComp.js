const rpio = require('rpio');
const pins = [35, 36, 37, 38];
const ControlComp = {
    FORWARD: 'forward',
    BACK: 'back',
    LEFT: 'left',
    RIGHT: 'right',
    _setHigh: arr => {
        arr.forEach((item, index) => {
            console.log(pins[index]+"---->"+item);
            item ? rpio.write(pins[index], rpio.HIGH) : rpio.write(pins[index], rpio.LOW)
        })
    },
    init: manager => {
        rpio.open(35, rpio.OUTPUT, rpio.LOW);
        rpio.open(37, rpio.OUTPUT, rpio.LOW);
        rpio.open(36, rpio.OUTPUT, rpio.LOW);
        rpio.open(38, rpio.OUTPUT, rpio.LOW);
        ControlComp.stop();
    },
    move: direc => {
        switch (direc) {
            case ControlComp.FORWARD:
                console.log('前进');
                ControlComp._setHigh([1, 0, 1, 0]);
                break;
            case ControlComp.BACK:
                console.log('后退');
                ControlComp._setHigh([0, 1, 0, 1]);
                break;
            case ControlComp.LEFT:
                console.log('左转');
                ControlComp._setHigh([0, 1, 1, 0]);
                break;
            case ControlComp.RIGHT:
                console.log('右转');
                ControlComp._setHigh([1, 0, 0, 1]);
                break;
        }
        rpio.msleep(200);
        ControlComp.stop();
    },
    stop: () => {
        ControlComp._setHigh([0, 0, 0, 0])
    }
}
module.exports = ControlComp;