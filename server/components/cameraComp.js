let isTaking = false;
let manager;
const CameraComp = {
    init: mng => {
        console.log('初始化camera模块');
        if (mng) {
            manager = mng;
        }
    },
    takePic: (isUpload) => {
        if(!manager){
            console.log('manager不存在');
            return;
        }

        if (isTaking) {
            console.log('正在拍照中...');
            return;
        }

        let time = Date.now();
        manager.cmdComp.exec(`sudo raspistill -o ../photos/${time}.jpg`, () => {
            isTaking = true;
            console.log('开始拍照');
        }, () => {
            isTaking = false;
            console.log('拍照完成');

            if (isUpload) {
                console.log('上传图片');
                manager.fileUploadComp.uploadImg(`../photos/${time}.jpg`, data => {
                    console.log(data);
                    manager.ledComp.flashWhite();
                }, err => {
                    console.log(err);
                });
            }
        });
    }
}

module.exports = CameraComp;