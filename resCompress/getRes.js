const fs = require('fs');
const path = require('path');
var folderName = process.argv[2];
var sourcePath = __dirname + "/../" + folderName; //资源目录
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
			let stat = fs.statSync(curPath);
			if (stat.isDirectory()) {
				lookupDir(curPath); // 遍历目录
			} else {
				if (file.indexOf('.jpg') >= 0) {
					let arr = curPath.split("\\");
					copyFile(curPath, 'jpg', arr[arr.length - 1]);
				} else if (file.indexOf('.png') >= 0) {
					let arr = curPath.split("\\");
					copyFile(curPath, 'png', arr[arr.length - 1]);
				} else if (file.indexOf(".mp3") >= 0) {
					let arr = curPath.split("\\");
					copyFile(curPath, 'mp3', arr[arr.length - 1]);
				}
			}
		});
	});
}

if (!path.isAbsolute(sourcePath)) {
	sourcePath = path.join(__dirname, sourcePath)
}

fs.unlink(`${__dirname}/pngCacheName.txt`, (err) => {
	fs.unlink(`${__dirname}/jpgCacheName.txt`, (err) => {
		fs.unlink(`${__dirname}/mp3CacheName.txt`, (err) => {
			lookupDir(sourcePath);
		})
	})
})

// 复制文件
function copyFile(oldpath, resType, filename) {
	let desdirpath = __dirname + `/${resType}Temp`;
	if (fs.existsSync(oldpath)) {
		let newfilepath = path.join(desdirpath, filename); //合并名称
		addName(filename + "%%%" + oldpath, resType);
		//查询是否有压缩缓存
		if (fs.existsSync(__dirname + `/${resType}Cache/${filename}`)) {
			console.log(`${filename}   该资源已有压缩缓存，压缩时会跳过该资源`);
		} else {
			if (!fs.existsSync(newfilepath)) {
				createFolder(desdirpath); //创建文件夹
				fs.copyFileSync(oldpath, newfilepath); //拷贝文件
			} else {
				console.log(`${newfilepath}   该资源被构建出多份，请自行检查项目资源引用...`);
			}
		}
	} else {
		console.log("要拷贝的文件不存在", oldpath);
	}
}

//添加名字映射
function addName(imgName, resType) {
	let fileName = __dirname + `/${resType}CacheName.txt`;
	if (fs.existsSync(fileName)) {
		fs.appendFileSync(fileName, imgName + "###", {
			encoding: "utf8"
		});
	} else {
		fs.writeFileSync(fileName, imgName + "###", {
			encoding: "utf8"
		});
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