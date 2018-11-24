const rpio = require('rpio');
const green = 12;
const white = 18;

rpio.open(green, rpio.OUTPUT, rpio.LOW);
rpio.open(white, rpio.OUTPUT, rpio.LOW);

const LedComp = {
    _flash: (led, count, delay = 300) => {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                rpio.write(led, rpio.HIGH);
                rpio.msleep(100);

                rpio.write(led, rpio.LOW);
            }, i * delay);
        }
    },
    flashGreen: (count=1)=>{
        LedComp._flash(green, count);
    },
    flashWhite: (count=1)=>{
        LedComp._flash(white, count);
    }
}

module.exports = LedComp;