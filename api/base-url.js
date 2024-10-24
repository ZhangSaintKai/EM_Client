module.exports = (() => {

	/* aliyun */
	// const http = "https://119.23.51.178:26400";
	// const ws = "wss://119.23.51.178:26400";

	//MuMu模拟器IP 10.0.2.2 对应电脑IP 127.0.0.1

	/* .NET6.0 WebAPI */
	const http = "https://10.0.2.2:7275";
	const ws = "wss://10.0.2.2:7275";

	/* .NET6.0 WebAPI */
	// const http = "http://192.168.110.105:5244";
	// const ws = "ws://192.168.110.105:5244";

	/* Node Express */
	// const http = "https://192.168.110.105:26400";
	// const ws = "wss://192.168.110.105:26400";

	const file = `${http}/File/GetFile?fileId=`;
	// 					  File/GetFile?fileId=xxxxxxxxx&fileToken=xxxxxxxxxx

	return {
		http,
		ws,
		file
	};

})();