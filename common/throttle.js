/**
 * 节流：在一定时间内，只能触发一次，例：短时间内多次点击按钮只提交第一次
 * @param {Function} func 需要节流的函数
 * @param {Number} wait 冷却的时间
 * @return {Function} 带有节流效果的函数
 */
function throttle(func, wait = 500) {
	let throttleTimer;
	return function(...args) {
		if (!throttleTimer) {
			throttleTimer = setTimeout(() => {
				throttleTimer = null;
			}, wait);
			typeof func === "function" && func.apply(this, args);
		}
	};
}

export default throttle;