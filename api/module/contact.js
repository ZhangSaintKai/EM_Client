import http from "@/common/request-helper.js";

const api = {
	getContactList(payload = null, showLoading = true) {
		return http.request("GET", "Contact/GetList", "获取联系人列表", payload, showLoading);
	},
	getContact(payload = null, showLoading = true) {
		return http.request("GET", "Contact/GetByID", "获取联系人", payload, showLoading);
	},
	getContactBy2UserID(payload = null, showLoading = true) {
		return http.request("GET", "Contact/GetBy2UserID", "获取联系人", payload, showLoading);
	},
	addContact(payload, showLoading = true) {
		return http.request("POST", "Contact/Create", "添加联系人", payload, showLoading);
	}
};

export default {
	...api
};