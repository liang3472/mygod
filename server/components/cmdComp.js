var process = require('child_process');
const CmdComp = {
    exec: (cmd, befor, after) => {
        befor && befor();
        return process.exec(cmd, () => {
            after && after();
        });
    }
}

module.exports = CmdComp;