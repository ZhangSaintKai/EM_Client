import BaseUrl from "@/api/base-url.js";
import store from "@/store/index.js";


// 序列化对象内所有层次的纯字符串数组
function serializeStringArrays(obj) {
	function serialize(data) {
		if (Array.isArray(data)) {
			// 如果是纯字符串数组，则转换为逗号分隔的字符串
			if (data.every(e => typeof e === "string")) {
				return data.join(",");
			} else {
				// 否则对数组中的每一项进行递归处理
				return data.map(serialize);
			}
		} else if (typeof data === "object" && data !== null) {
			// 如果是对象，则递归处理每个属性
			for (const key in data) {
				data[key] = serialize(data[key]);
			}
		}
		return data;
	}
	return serialize(obj);
}

/**
 * 发起网络请求
 * @param {String} method 请求方法
 * @param {String} api 请求接口
 * @param {String} optionName 业务操作名称
 * @param {Object} data 请求的参数
 * @param {Boolean} postFromBody POST时接口是否使用FromBody从正文接收参数（此处指非JSON单参数值）
 * @return {Promise} resdata 响应数据
 */
async function request(method, api, optionName, data = null, postFromBody = false) {

	// 序列化纯字符串数组类型的参数
	data = serializeStringArrays(data);

	uni.addInterceptor("request", {
		// 请求失败拦截
		fail: (e) => {
			if (e.errMsg.includes("CertPathValidatorException")) return; // 不提示证书类错误
			setTimeout(() => {
				uni.showToast({
					title: "连接服务器失败，请联系开发者",
					icon: "none",
					duration: 3000
				});
			}, 600);
		},
		// 请求完成回调，无论成功或失败
		complete: () => {
			uni.removeInterceptor("request");
		}
	});

	const token = store.getters.getUserInfo?.token || "";

	if (method === "POST" && postFromBody) data = JSON.stringify(data);
	// JSON.stringify("zhangsan") 结果是 "\"zhangsan\""

	const [error, response] = await uni.request({
		method: method,
		url: `${BaseUrl.http}/${api}`,
		header: {
			"Authorization": token
		},
		data: data,
		// 无已备案域名,不能使用CA颁发的SSL证书,关闭验证
		sslVerify: false
	});

	// 请求失败（已在拦截器的失败回调中处理）
	if (error) return false;

	// 响应异常
	if (response.statusCode !== 200) {
		const mapErrMsg = {
			"404": "请求方法错误或路径不正确",
			"400": "请求语法错误或参数不正确",
			"401": token ? "登录失效，请重新登录" : "请登录",
			"403": "没有权限",
			"413": "Payload Too Large",
			"422": response.data,
			"500": response.data
		};
		if (!store.getters.getShowingModal) {
			store.commit("setShowingModal", true);
			await uni.showModal({
				title: optionName ? `${optionName}失败` : "",
				content: `${ mapErrMsg[`${response.statusCode}`] || "未定义错误类型" }`,
				showCancel: false
			});
		}
		return false;
	}

	// 响应正常，返回响应数据
	return response.data;

}
export default request;