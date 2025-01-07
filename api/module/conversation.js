import request from "@/api/request.js";

export default {
	getPrivateConversationList() {
		return request("GET", "PrivateConversation/GetList", "获取私聊列表");
	},
	getPrivateConversation() {
		return request("GET", "PrivateConversation/GetByID", "获取私聊");
	},
	addPrivateConversation(data) {
		return request("POST", "PrivateConversation/Create", "创建私聊", data, true);
	}
};