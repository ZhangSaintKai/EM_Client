import request from "@/api/request.js";

export default {
	login(data) {
		return request("POST", "User/Login", "登录", data);
	},
	register(data) {
		return request("POST", "User/Register", "注册", data);
	},
	getSelfUserInfo() {
		return request("GET", "User/GetSelfInfo", "获取用户信息");
	},
	searchUser(data) {
		return request("GET", "User/Search", "搜索", data);
	},
	getUserProfileByID(data) {
		return request("GET", "User/GetProfile", "获取用户简介", data);
	},
	updateUserAvatar(data) {
		return request("POST", "User/UpdateAvatar", "更新头像", data, true);
	},
	updateUserNickName(data) {
		return request("POST", "User/UpdateNickName", "修改昵称", data, true);
	},
	updateUserEMID(data) {
		return request("POST", "User/UpdateEMID", "修改EMID", data, true);
	},
	updateUserPassword(data) {
		return request("POST", "User/UpdatePassword", "修改密码", data);
	},
	updateUserPublicKey(data) {
		return request("POST", "User/UpdatePublicKey", "更新公钥", data, true);
	},
	logout() {
		return request("GET", "User/Logout", "退出登录");
	}
};