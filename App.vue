<script>
import BaseUrl from "@/api/base-url.js";
import store from "./store";
export default {
	onLaunch: async () => {
		const [errCheck, resCheck] = await uni.request({
			url: BaseUrl.http + "/Client/CheckUpdate",
			method: "GET",
			data: {
				version: plus.runtime.version
			},
			sslVerify: false
		});
		if (errCheck) {
			console.log(JSON.stringify(errCheck));
			return;
		}
		const checkdata = resCheck?.data;
		if (!checkdata?.update) return;
		const result = await uni.showModal({
			title: "请使用新版本：" + checkdata.version,
			content: checkdata.description || "",
			showCancel: false,
			confirmText: "更新"
		});
		// if (!result.confirm) return;
		const downloadTask = uni.downloadFile({
			url: BaseUrl.http + "/Client/GetPkgWgt",
			success: (resDownload) => {
				uni.hideLoading();
				console.log(JSON.stringify(resDownload));
				if (resDownload.statusCode !== 200) return;
				uni.showLoading({
					title: "更新中",
					mask: true
				});
				plus.runtime.install(
					resDownload.tempFilePath,
					{
						force: false
					},
					() => {
						uni.hideLoading();
						uni.showToast({
							icon: "none",
							title: "更新完成",
							mask: true,
							duration: 600
						});
						setTimeout(() => {
							// 热重启
							plus.runtime.restart();
						}, 1000);
					},
					(e) => {
						uni.hideLoading();
						uni.showModal({
							title: "更新失败",
							content: JSON.stringify(e),
							showCancel: false
						});
					}
				);
			},
			fail: (e) => {
				uni.hideLoading();
				uni.showModal({
					title: "下载失败",
					content: JSON.stringify(e),
					showCancel: false
				});
			}
		});

		// const payload = {progress:0}
		// plus.push.createMessage("本地推送消息", payload);

		downloadTask.onProgressUpdate((res) => {
			if (res.progress % 5 === 0) {
				if (res.progress !== 0) uni.hideLoading();
				uni.showLoading({
					title: `正在下载${res.progress}%`,
					mask: true
				});
			}
			// 满足测试条件，取消下载任务。
			if (res.progress > 50) {
				downloadTask.abort();
			}
		});

		//
		uni.connectSocket({
			url: BaseUrl.ws + "/WebSocket/Connect"
		});
		uni.onSocketError((e) => {
			// uni.showToast({
			// 	icon: "none",
			// 	title: "WS连接异常\n消息接收可能不及时"
			// });
			setTimeout(() => {
				// uni.showToast({
				// 	icon: "none",
				// 	title: "WS正在重连"
				// });
				uni.connectSocket({
					url: BaseUrl.ws + "/WebSocket/Connect"
				});
			}, 3000);
		});
		uni.onSocketClose((res) => {
			// uni.showToast({
			// 	icon: "none",
			// 	title: `WS意外关闭[${res.code}${res.reason}]\n消息接收可能不及时`
			// });
			setTimeout(() => {
				// uni.showToast({
				// 	icon: "none",
				// 	title: "WS正在重连"
				// });
				uni.connectSocket({
					url: BaseUrl.ws + "/WebSocket/Connect"
				});
			}, 3000);
		});
		uni.onSocketMessage((res) => {
			//同样的监听，后定义的生效
			// console.log("全局接收", res.data);
		});
		uni.onSocketOpen((header) => {
			// console.log("WS连接已打开");
			const userInfo = store.getters.getUserInfo;
			uni.sendSocketMessage({
				data: userInfo?.token || ""
			});
		});
		// uni.clearStorage();
	},
	onShow: () => {},
	onHide: () => {}
};
</script>

<style lang="scss">
/*每个页面公共css */
.root {
	/* #ifdef H5 */
	min-height: 94.8vh;
	/* #endif */
	/* #ifndef H5 */
	min-height: 100vh;
	/* #endif */
	font-size: 14px;
	background: $color-background;
}

input {
	border-radius: 2em;
	background: #ffffff;
	margin: 4rpx;
	padding: 0.3em 0.8em;
}

.button {
	border-radius: 2em;
	padding: 0.5em;
	margin: 4rpx;
	text-align: center;
	color: #ffffff;
	background: $color-primary;
	font-weight: 500;

	&_white {
		color: #000000;
		background: #ffffff;
	}
}

.flex {
	display: flex;
}

.flex-center {
	display: flex;
	justify-content: center;
}

.flex-around {
	display: flex;
	justify-content: space-around;
}

.flex-between {
	display: flex;
	justify-content: space-between;
}

.flex-y-center {
	display: flex;
	align-items: center;
}

.flex-xy-center {
	display: flex;
	justify-content: center;
	align-items: center;
}

.flex-column-center {
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.flex-column-around {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
}

.flex-column-between {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.flex-column-x-center {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.flex-column-xy-center {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
</style>
