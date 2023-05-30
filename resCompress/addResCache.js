const fs = require('fs');
const path = require('path');
var nameArr = ["png", "jpg", "mp3"];

function copyFile(imgName, imgType) {
    let desdirpath = __dirname + `/${imgType}Cache`;
    let oldpath = __dirname + `/${imgType}Temp/${imgName}`;
    let newfilepath = path.join(desdirpath, imgName); //合并名称
    if (!fs.existsSync(newfilepath)) {
        createFolder(desdirpath); //创建文件夹
        if (fs.existsSync(oldpath)) {
            fs.copyFileSync(oldpath, newfilepath); //拷贝文件
        } else {
            // console.error("加入本地缓存失败", oldpath);
        }
    } else {
        if (fs.existsSync(oldpath)) {
            fs.copyFileSync(oldpath, newfilepath); //拷贝文件
        } else {
            // console.error("加入本地缓存失败", oldpath);
        }
    }
}

// 增加文件夹
function createFolder(dirpath, dirname) {
    if (typeof dirname === "undefined") {
        if (fs.existsSync(dirpath)) {} else {
            createFolder(dirpath, path.dirname(dirpath));
        }
    } else {
        if (dirname !== path.dirname(dirpath)) {
            createFolder(dirpath);
            return;
        }
        if (fs.existsSync(dirname)) {
            fs.mkdirSync(dirpath)
        } else {
            createFolder(dirname, path.dirname(dirname));
            fs.mkdirSync(dirpath);
        }
    }
}

var mp3Temp = __dirname + "/mp3Temp";
var flag = false;
if (fs.existsSync(mp3Temp)) {
    files = fs.readdirSync(mp3Temp);
    for (let i = 0; i < files.length; i++) {
        if (files[i].indexOf('.mp3.mp3') >= 0) {
            flag = true;
            break;
        }
    }
}

//有压缩的MP3
if (flag) {
    var index = 0;
    files.forEach((file) => {
        let curPath = path.join(mp3Temp, file);
        if (file.indexOf('.mp3.mp3') >= 0) {
            let newPath = curPath.replace(".mp3", "");
            fs.rename(curPath, newPath, (err) => {
                index++;
                if (index == files.length / 2) {
                    startCopy();
                }
            });
        }
    });
} else {
    console.log("没有需要处理的MP3资源，跳过MP3处理");
    nameArr.pop();
    startCopy();
}

//开始处理资源缓存
function startCopy() {
    for (let i = 0; i < nameArr.length; i++) {
        let dirName = `${__dirname}/${nameArr[i]}CacheName.txt`;
        if (fs.existsSync(dirName)) {
            let resData = fs.readFileSync(dirName).toString();
            let resNameArr = resData.split("###");
            for (let j = 0; j < resNameArr.length - 1; j++) {
                let nameInfo = resNameArr[j].split("%%%");
                copyFile(nameInfo[0], nameArr[i]);
            }
        }else{
            console.log("名字映射不存在", dirName);
        }
    }
}