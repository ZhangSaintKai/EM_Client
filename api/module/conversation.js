import http from "@/api/request.js";

const api = {
	getPrivateConversationList(payload = null, showLoading = true) {
		return http.request("GET", "PrivateConversation/GetList", "获取私聊列表", payload, showLoading);
	},
	getPrivateConversation(payload = null, showLoading = true) {
		return http.request("GET", "PrivateConversation/GetByID", "获取私聊", payload, showLoading);
	},
	addPrivateConversation(payload, showLoading = true) {
		return http.request("POST", "PrivateConversation/Create", "创建私聊", payload, showLoading);
	}
};

export default {
	...api
};