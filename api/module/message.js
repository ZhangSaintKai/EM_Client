import http from "@/common/request-helper.js";

const api = {
	getPrivateMessageList(payload, showLoading = true) {
		return http.request("GET", "PrivateMessage/GetList", "获取私聊消息", payload, showLoading);
	},
	sendPrivateMessage(payload, showLoading = true) {
		return http.request("POST", "PrivateMessage/Send", "发送私聊消息", payload, showLoading);
	},
	readPrivateMessage(payload, showLoading = true) {
		return http.request("POST", "PrivateMessage/Read", "同步私聊消息", payload, showLoading);
	}
};

export default {
	...api
};