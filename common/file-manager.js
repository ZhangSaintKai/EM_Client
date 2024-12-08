import BaseUrl from "@/api/base-url.js";
import store from "@/store/index.js";
import {
	v4 as uuidv4
} from "uuid";
// #ifdef APP-PLUS
// wgt升级只对js、css生效，uts代码无法热更新
import utsFileSelect from "@/uni_modules/lemon-filePicker";
// #endif


/**
 * 选择图片方法
 * @param {Number} count 可选图片张数
 * @param {Boolean} compress 是否压缩图片
 * @param {Boolean} keepScale 是否保持宽高比压缩
 * @returns {Array} 所选的图片文件数组
 */
async function chooseImage(count = 1, compress = false, keepScale = false) {
	if (count > 9 || count < 1) {
		uni.showToast({
			icon: "none",
			title: "只能选择1-9张图片"
		});
		return false;
	}
	let [err, res] = await uni.chooseImage({
		count: count
	});
	if (err) {
		// uni.showToast({
		// 	icon: "none",
		// 	title: "打开图片选择失败"
		// });
		return false;
	}
	if (compress) {
		for (let i = 0; i < res.tempFiles.length; i++) {
			let [errcp, rescp] = await uni.compressImage({
				src: res.tempFiles[i].path,
				width: "512px",
				height: keepScale ? "auto" : "512px"
			});
			if (errcp) return false;
			res.tempFiles[i].path = rescp.tempFilePath;
		}
	}
	let files = [];
	res.tempFiles.forEach(elm => {
		let file = {
			idinclient: uuidv4(),
			url: elm.path,
			sizeMB: compress ? "AlreadyCompressed" : (elm.size / 1024 / 1024).toFixed(4)
		};
		let splitPath = elm.path.split("/");
		file.name = splitPath[splitPath.length - 1];
		file.type = "image";
		files.push(file);
	});
	// 图片添加宽高信息
	for (let i = 0; i < files.length; i++) {
		let [errinfo, resinfo] = await uni.getImageInfo({
			src: files[i].url
		});
		files[i].width = resinfo.width;
		files[i].height = resinfo.height;
	}
	return files;
}

/**
 * 选择视频方法
 * @returns {Object} 所选的视频文件对象
 */
async function chooseVideo() {
	let [err, res] = await uni.chooseVideo({
		compressed: false
	});
	if (err) return false;
	let file = {
		idinclient: uuidv4(),
		url: res.tempFilePath,
		sizeMB: (res.size / 1024 / 1024).toFixed(4)
	};
	let splitPath = res.tempFilePath.split("/");
	file.name = splitPath[splitPath.length - 1];
	file.type = "video";
	return file;
}

/**
 * 录音部分
 */
const recorderManager = uni.getRecorderManager();
const innerAudioContext = uni.createInnerAudioContext();

function startRecordAudio() {
	console.log("开始录音");
	recorderManager.start();
}

recorderManager.onStop(function(res) {
	innerAudioContext.src = res.tempFilePath;
});

function stopRecordAudio() {
	console.log("录音结束");
	recorderManager.stop();
}

function playRecordAudio() {
	innerAudioContext.play();
	console.log("播放录音");
}


function chooseFile() {
	return new Promise((resolve, reject) => {
		// 弹出对话框，请求授权
		// plus.android.requestPermissions(
		// 	["android.permission.READ_EXTERNAL_STORAGE"],
		// 	(e) => {
		// console.log(JSON.stringify(e));
		//打开文件选择器
		utsFileSelect({
			success: (res) => {
				let splitPath = res.filePath.split(".");
				let file = {
					idinclient: uuidv4(),
					url: res.filePath,
					name: res.fileName,
					type: res.fileExt,
					sizeMB: (res.fileSize / 1024 / 1024).toFixed(4)
				};
				resolve(file);
			},
			fail: (err) => {
				uni.showModal({
					title: "选择文件失败",
					content: "请检查本应用是否具有所选文件的访问权限",
					showCancel: false
				});
				reject();
			}
		});
		// 	},
		// 	(e) => {
		// 		console.log("请求授权错误：" + JSON.stringify(e));
		// 		reject();
		// 	}
		// );
	});
}



/**
 * 文件上传方法
 * @param {Object} file	{name: string, url: string} 文件信息对象
 * @param {String} ownerId 文件所属Id
 * @param {Number} ownerType 文件所属类型 (0：公开，无限制，1：指定会话内，2：指定会话成员，3：指定用户)
 * @returns {Promise} 文件上传执行结果
 */
function upload(file, ownerId, ownerType = 0) {
	console.log(file);
	return new Promise((resolve, reject) => {
		let userInfo = store.getters.getUserInfo;
		// 此API不限制上传文件大小
		const uploadTask = uni.uploadFile({
			url: `${BaseUrl.http}/File/Upload?ownerId=${ownerId}&ownerType=${ownerType}`,
			header: {
				"Authorization": userInfo && userInfo.token || ""
			},
			filePath: file.url,
			// formData:{
			// 	ownerId: ownerId,
			// 	ownerType:ownerType
			// },
			name: "EM_Client_File",
			timeout: 10 * 60 * 1000, // 超时时间设置为十分钟
			// 如果希望返回一个uploadTask对象，需要至少传入success/fail/complete参数中的一个
			success: (res) => {
				if (res.statusCode === 200) {
					// 上传成功
					let resFile = JSON.parse(res.data);
					resolve(resFile);
				} else {
					let message = "未知错误\n请联系开发者";
					if (res.statusCode === 404) message = "地址错误";
					if (res.statusCode === 400) message = "请求参数错误";
					if (res.statusCode === 401) message = "未通过Token身份验证";
					if (res.statusCode === 422 || res.statusCode === 500) message = res.data;
					if (res.statusCode === 413) message = `${file.name}文件过大`;
					uni.showToast({
						icon: "none",
						title: `上传失败，${message}`,
						duration: 5000
					});
					setTimeout(() => {
						file.progress = false;
					}, 50);
					reject();
					// console.log(JSON.stringify(res));
				}
			},
			fail: (error) => {
				uni.showToast({
					icon: "none",
					title: "上传API调用失败\n请联系开发者"
				});
				setTimeout(() => {
					file.progress = false;
				}, 50);
				reject();
			}
		});
		// 监听上传进度变化
		uploadTask.onProgressUpdate((res) => {
			file.progress = res.progress;
		});
	});

}

function cancelUpload(file) {

}

/**
 * 将消息文件缓存于应用沙盒目录
 */
function cache(item) {
	if (item.localUrl || item.caching) return;
	item.caching = true;
	return new Promise((resolve, reject) => {
		uni.downloadFile({
			url: BaseUrl.file + item.source,
			success: resD => {
				if (resD.statusCode === 200) {
					uni.saveFile({
						tempFilePath: resD.tempFilePath,
						success: resS => {
							item.caching = false;
							console.log(resD.statusCode, "已缓存至", resS.savedFilePath);
							item.localUrl = resS.savedFilePath;
							resolve(true);
						},
						fail: (e) => {
							reject();
						}

					});
				} else {
					reject();
				}
			},
			fail: (e) => {
				reject();
			}
		});
	});
}

/**
 * 消息文件下载方法
 * @param {Object} {localUrl: string, source: string, Content: string} 文件信息对象
 * @returns {Promise} 文件下载执行结果
 */
function download(item) {
	if (item.progress > 0 && item.progress < 100) {
		// 避免重复下载同一文件
		return;
	}
	return new Promise((resolve, reject) => {
		let isCache = item.localUrl && !item.localUrl.includes("EncryptedMessage");
		plus.io.resolveLocalFileSystemURL(
			isCache ? "" : item.localUrl,
			(exist) => {
				// 获取到已下载的文件
				resolve(true);
			}, (e) => {
				// 未下载
				let sourceUrl = BaseUrl.file + item.source;
				// 保存路径file:///storage/emulated/0/就是用户文件管理器能看到的根目录
				let destinationUrl =
					`file:///storage/emulated/0/EncryptedMessage/download/${item.messageType}/${item.content}`;
				let downloadTask = plus.downloader.createDownload(
					sourceUrl, {
						filename: destinationUrl,
						timeout: 6,
						retry: 1,
						retryInterval: 6
					},
					(file, status) => {
						//file为下载的文件对象
						if (status == 200) {
							item.localUrl = file.filename;
							resolve(true);
						} else {
							uni.showToast({
								icon: "none",
								title: `${item.Content}下载失败`,
								duration: 3000
							});
							item.progress = 0;
							reject();
						}
					});
				item.downloadid = downloadTask.id;
				let userInfo = store.getters.getUserInfo;
				downloadTask.setRequestHeader("Authorization", userInfo && userInfo.token || "");
				downloadTask.addEventListener("statechanged", (download, status) => {
					// 监听下载进度
					item.progress = parseInt((download.downloadedSize / download.totalSize) * 100);
				});
				downloadTask.start();
			});
	});
}

function cancelDownload(id) {
	plus.downloader.enumerate((list) => {
		let download = list.find(d => d.id === id);
		download.abort();
	});
}


module.exports = {
	startRecordAudio: startRecordAudio,
	stopRecordAudio: stopRecordAudio,
	playRecordAudio: playRecordAudio,
	chooseImage: chooseImage,
	chooseVideo: chooseVideo,
	chooseFile: chooseFile,
	upload: upload,
	cancelUpload: cancelUpload,
	cache: cache,
	download: download,
	cancelDownload: cancelDownload
};