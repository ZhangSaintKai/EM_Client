/**
 * 防抖：一定时间内，只有最后一次操作生效，再过wait毫秒后才执行函数，例：延迟显示输入框值
 * @param {Function} func 需要防抖的函数  (箭头函数的this绑定是在创建时确定的，而不是在调用时)
 * @param {Number} wait 延迟的时间
 * @return {Function} 带有防抖效果的函数
 */
function debounce(func, wait = 500) {
	let timeout = null;
	return function(...args) {
		// 清除定时器
		if (timeout !== null) clearTimeout(timeout);
		// 重新计时
		timeout = setTimeout(() => {
			typeof func === "function" && func.apply(this, args);
		}, wait);
	};
}

export default debounce;