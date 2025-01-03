/**
 * 调用匿名函数
 * (function (param?){
 * statement
 * }(param?))
 */
module.exports = (() => {

	//MuMu模拟器IP 10.0.2.2 对应电脑IP 127.0.0.1

	/* .NET6.0 WebAPI */
	// let http = "https://10.0.2.2:7275";
	// let ws = "wss://10.0.2.2:7275";

	/* .NET6.0 WebAPI */
	// let http = "http://10.0.2.2:5244";
	// let ws = "ws://10.0.2.2:5244";

	/* aliyun */
	// let http = "https://127.0.0.1:26400";
	// let ws = "wss://127.0.0.1:26400";

	/* TencentCloud */
	let http = "https://127.0.0.1:26400";
	let ws = "wss://127.0.0.1:26400";

	if (process.env.NODE_ENV === "development") {
		http = http.replace("26400", "25500");
		ws = ws.replace("26400", "25500");
	}

	let file = `${http}/File/GetFile?fileId=`;
	const userInfo = uni.getStorageSync("userInfo");
	file = file.replace("fileId=", `fileToken=${userInfo?.fileToken}&fileId=`);

	return {
		http,
		ws,
		file
	};

})();