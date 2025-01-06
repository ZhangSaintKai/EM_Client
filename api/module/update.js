import http from "@/api/request.js";

const api = {
	checkUpdate(payload, showLoading = true) {
		// return http.request("POST", "Update/Check", "检查更新", payload, showLoading);
	}
};

export default {
	...api
};