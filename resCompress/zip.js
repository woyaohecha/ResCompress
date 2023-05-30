const fs = require('fs');
const archiver = require('archiver');
var folderName = process.argv[2];
let zipFolder = function(sourceFolder, destZip, cb){
	let output = fs.createWriteStream(destZip);
	const archive = archiver('zip', {
	  zlib: { level: 9 } // Sets the compression level.
	});
	
	output.on('close', function() {
	  cb('\nzip压缩完成','已在根目录生成' + folderName +'.zip');
	});
	
	// good practice to catch this error explicitly
	archive.on('error', function(err) {
	  throw err;
	});
	
	archive.pipe(output);
	archive.directory(sourceFolder, false);
	archive.finalize();
}

let test = function(url) {
	let sourceFolder = __dirname + '/../' + folderName;
	let destZip = __dirname + '/../' + folderName + '.zip';
	zipFolder(sourceFolder, destZip, function(err, msg){
		console.log(err, msg);
	});
}
test();