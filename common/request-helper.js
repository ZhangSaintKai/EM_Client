import BaseUrl from "@/api/base-url.js";
import store from "@/store/index.js";

module.exports = {
	async request(method, api, optionName, payload, showLoading) {

		// 指明不需要加载，或者正在显示模态弹框时，不显示加载中
		if (!showLoading || store.getters.getShowingModal) {
			uni.hideLoading();
		} else {
			uni.showLoading({
				title: "加载中",
				mask: true
			});
		}

		uni.addInterceptor("request", {
			// 请求失败拦截
			fail: (e) => {
				console.log("【请求】失败：" + e.errMsg);
				let tip = "连接服务器失败，请联系开发者";
				if (!store.getters.getNetworkStatus) tip = "当前无网络连接，请联网";
				setTimeout(() => {
					uni.showToast({
						title: tip,
						icon: "none",
						duration: 3000
					});
				}, 600);
			},
			// 请求完成回调，无论成功或失败
			complete: () => {
				uni.removeInterceptor("request");
				if (showLoading) uni.hideLoading();
			}
		});

		let userInfo = store.getters.getUserInfo;
		let token = "";
		if (userInfo) token = userInfo.token;
		let [error, response] = await uni.request({
			method: method,
			url: `${BaseUrl.http}/${api}`,
			header: {
				"Authorization": token
			},
			data: payload,
			// 没有已备案的域名,无法使用CA颁发的SSL证书,只能关闭验证
			sslVerify: false
		});

		// 请求失败（已在拦截器的失败回调中处理）
		if (error) return false;
		
		// 响应异常
		if (response.statusCode !== 200) {
			let content = "";
			switch (response.statusCode) {
				case 404:
					content = "请求方法错误或路径不正确，请联系开发者";
					break;
				case 400:
					content = "请求语法错误或参数不正确，请联系开发者";
					break;
					// 未认证
				case 401: {
					if (store.getters.getShowingModal) break;
					let [err, result] = await uni.showToast({
						icon: "none",
						title: token ? "登录失效，请重新登录" : "请登录",
						mask: true
					});
					// 获取登录前路径和参数
					let pages = getCurrentPages();
					let beforeLoginPath = pages[pages.length - 1].$page.fullPath;
					setTimeout(() => {
						uni.redirectTo({
							url: "/pages/user/login/login?beforeLoginPath=" +
								beforeLoginPath
						});
					}, 800);
					return false;
				}
				// 该登录用户没有访问当前资源的权限
				case 403:
					content = "没有权限";
					break;
					// 请求体超大
				case 413:
					content = "Payload Too Large";
					break;
					// 业务错误、内部错误
				case 422:
				case 500:
					content = response.data;
					break;
				default:
					content = `[${response.statusCode}]未定义的错误类型`;
					break;
			}
			if (!store.getters.getShowingModal) {
				store.commit("setShowingModal", true);
				let [err, result] = await uni.showModal({
					title: optionName + "失败",
					content: content,
					showCancel: false
				});
				store.commit("setShowingModal", false);
			}
			return false;
		}

		// #ifdef APP-PLUS
		// let unnormal = JSON.stringify(response.header["Content-Type"].startsWith("text/html"));
		// if (unnormal) {
		// 	if (!store.getters.getShowingModal) {
		// 		store.commit("setShowingModal", true);
		// 		let [err, result] = await uni.showModal({
		// 			title: optionName + "失败",
		// 			content: response.data,
		// 			showCancel: false
		// 		});
		// 		store.commit("setShowingModal", false);
		// 	}
		// }
		// #endif

		// 响应正常，返回响应数据
		return response.data;

	}
};