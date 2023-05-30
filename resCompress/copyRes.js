const fs = require('fs');
var nameArr = ["jpg", "png", "mp3"];

function copyFile(imgName, tagDir, imgType) {
    let oldpath = __dirname + `/${imgType}Cache/${imgName}`;
    if (fs.existsSync(oldpath)) {
        fs.copyFileSync(oldpath, tagDir); //拷贝文件
    } else {
        // console.error("文件拷贝失败", oldpath);
    }
}

for (let i = 0; i < nameArr.length; i++) {
    let dirName = `${__dirname}/${nameArr[i]}CacheName.txt`;
    if (fs.existsSync(dirName)) {
        let resData = fs.readFileSync(dirName).toString();
        let resNameArr = resData.split("###");
        for (let j = 0; j < resNameArr.length - 1; j++) {
            let nameInfo = resNameArr[j].split("%%%");
            copyFile(nameInfo[0], nameInfo[1], nameArr[i]);
        }
    }
}

// //开始处理png
// let png = fs.readFileSync(pngFile).toString();
// let pngNameArr = png.split("###");
// for (let i = 0; i < pngNameArr.length - 1; i++) {
//     let nameInfo = pngNameArr[i].split("%%%");
//     copyFile(nameInfo[0], nameInfo[1], "png");
// }

// //开始处理jpg
// let jpg = fs.readFileSync(jpgFile).toString();
// let jpgNameArr = jpg.split("###");
// for (let i = 0; i < jpgNameArr.length - 1; i++) {
//     let nameInfo = jpgNameArr[i].split("%%%");
//     // console.log(nameInfo[0], ">>>>",nameInfo[1])
//     copyFile(nameInfo[0], nameInfo[1], "jpg");
// }