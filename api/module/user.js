import http from "@/api/request.js";

const api = {
	login(payload, showLoading = true) {
		return http.request("POST", "User/Login", "登录", payload, showLoading);
	},
	register(payload, showLoading = true) {
		return http.request("POST", "User/Register", "注册", payload, showLoading);
	},
	getSelfUserInfo(payload = null, showLoading = true) {
		return http.request("GET", "User/GetSelfInfo", "获取用户信息", payload, showLoading);
	},
	searchUser(payload, showLoading = true) {
		return http.request("GET", "User/Search", "搜索", payload, showLoading);
	},
	getUserProfileByID(payload, showLoading = true) {
		return http.request("GET", "User/GetProfile", "获取用户简介", payload, showLoading);
	},
	updateUserAvatar(payload, showLoading = true) {
		return http.request("POST", "User/UpdateAvatar", "更新头像", payload, showLoading);
	},
	updateUserNickName(payload, showLoading = true) {
		return http.request("POST", "User/UpdateNickName", "修改昵称", payload, showLoading);
	},
	updateUserEMID(payload, showLoading = true) {
		return http.request("POST", "User/UpdateEMID", "修改EMID", payload, showLoading);
	},
	updateUserPassword(payload, showLoading = true) {
		return http.request("POST", "User/UpdatePassword", "修改密码", payload, showLoading);
	},
	updateUserPublicKey(payload, showLoading = true) {
		return http.request("POST", "User/UpdatePublicKey", "更新公钥", payload, showLoading);
	},
	logout(payload = null, showLoading = true) {
		return http.request("GET", "User/Logout", "退出登录", payload, showLoading);
	}
};

export default {
	...api
};