import request from "@/api/request.js";

export default {
	getContactList() {
		return request("GET", "Contact/GetList", "获取联系人列表");
	},
	getContact() {
		return request("GET", "Contact/GetByID", "获取联系人");
	},
	checkContact(data) {
		return request("GET", "Contact/CheckContact", "获取联系人", data);
	},
	addContact(data) {
		return request("POST", "Contact/Create", "添加联系人", data, true);
	}
};