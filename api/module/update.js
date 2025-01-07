import request from "@/api/request.js";

export default {
	checkUpdate(data) {
		return request("POST", "Update/Check", "检查更新", data);
	}
};