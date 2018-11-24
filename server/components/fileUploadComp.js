const qiniu = require("qiniu");
let config;
const FileUploadComp = {
    init: (conf) => {
        console.log('初始化fileupload模块');
        if (conf) {
            config = {
                bucket: conf.bucket,
                ak: conf.accessKey,
                sk: conf.secretKey
            }
        } else {
            console.log('fileupload配置不存在');
        }
    },
    uploadImg: (path, succ, fail) => {
        if (config) {
            let mac = new qiniu.auth.digest.Mac(config.ak, config.sk);
            let options = {
                scope: config.bucket,
            }
            let putPolicy = new qiniu.rs.PutPolicy(options);
            let uploadToken = putPolicy.uploadToken(mac);
            let qiniuConfig = new qiniu.conf.Config();
            let formUploader = new qiniu.form_up.FormUploader(qiniuConfig);
            let putExtra = new qiniu.form_up.PutExtra();
            formUploader.putFile(uploadToken, null, path, putExtra, (respErr, respBody, respInfo) => {
                if (respErr) {
                    fail && fail();
                    throw respErr;
                }

                if (respInfo.statusCode == 200) {
                    succ && succ(respBody);
                } else {
                    fail && fail(respBody);
                }
            });
        } else {
            console.log('缺少配置文件!!');
            fail && fail(error)
        }
    }
}
module.exports = FileUploadComp;