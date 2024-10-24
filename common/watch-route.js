export default {
	// 取pages下的一级目录作为当前模块 → 作为底部导航栏判断依据（20220924：未开发）
	onShow() {
		let pages = getCurrentPages();
		if (pages.length === 0) return;
		let tabs = pages[pages.length - 1].route.split("/");
		if (tabs.length === 0) return;
		// console.log("当前模块：" + tabs[1]);
	}
};