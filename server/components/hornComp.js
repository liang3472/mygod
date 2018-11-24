const rpio = require('rpio');
const hornPin = 16;
rpio.open(hornPin, rpio.OUTPUT, rpio.LOW);

const HornComp = {
    horn: (count, delay=1000) => {
        for(let i=0; i<count; i++) {
            setTimeout(()=>{
                rpio.write(hornPin, rpio.HIGH);
                rpio.msleep(500);
            
                rpio.write(hornPin, rpio.LOW);
            }, i * delay);
        }
    }
}

module.exports = HornComp;