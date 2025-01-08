import request from "@/api/request.js";

export default {
	checkUpdate(data) {
		return request("GET", "Client/CheckUpdate", "检查更新", data);
	}
};