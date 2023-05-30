const fs = require('fs');
const path = require('path');
var dirName = ["jpg", "png", "mp3"];
let lookupDir = function (url) {
    if (!fs.existsSync(url)) {
        return;
    }
    fs.readdir(url, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }
        files.forEach((file) => {
            let curPath = path.join(url, file);
            fs.unlink(curPath, (err) => {
                if (!err) {
                    // console.log("清除临时缓存资源", curPath)
                }
            })
        });
    });
}

//删除临时拷贝文件
for (let i = 0; i < dirName.length; i++) {
    let fileUrl = __dirname + `/${dirName[i]}Temp`;
    fs.unlink(`${__dirname}/${dirName[i]}CacheName.txt`, (err) => {})
    lookupDir(fileUrl);
}