import request from "@/api/request.js";

export default {
	getPrivateMessageList(data) {
		return request("GET", "PrivateMessage/GetList", "获取私聊消息", data);
	},
	sendPrivateMessage(data) {
		return request("POST", "PrivateMessage/Send", "发送私聊消息", data);
	},
	readPrivateMessage(data) {
		return request("POST", "PrivateMessage/Read", "同步私聊消息", data, true);
	}
};