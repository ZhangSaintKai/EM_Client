// 获取当前日期：yyyy-mm-dd
function getDate() {
	const date = new Date();
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();
	month = month > 9 ? month : "0" + month;
	day = day > 9 ? day : "0" + day;
	return `${year}-${month}-${day}`;
}

// 格式化日期时间：yyyy-mm-dd hh:mm:ss
function formatDateTime(timeString) {
	if (!timeString) return "";
	// timeString："2022-09-20T16:20:05.579"
	let parts = timeString.split("T");
	if (parts.length !== 2) return "-";
	let ymd = parts[0];
	let hms = parts[1];
	if (hms.split(".").length === 2) {
		hms = hms.split(".")[0];
	}
	return `${ymd} ${hms}`;
}

/**
 * 根据与当前时间的差距显示时间：
 * 大于一年，显示年、月、日、小时和分钟；
 * 大于一天，显示月、日、小时和分钟；
 * 小于一天，只显示小时和分钟
 * @param {Object} timeString
 */
function optimizeFormatDateTime(timeString) {
	if (!timeString) return "";
	const currentTime = new Date();
	const givenTime = new Date(timeString);
	const timeDiff = currentTime - givenTime;
	const oneYear = 365 * 24 * 60 * 60 * 1000;
	const oneDay = 24 * 60 * 60 * 1000;
	let formattedTime = "";
	if (timeDiff > oneYear) {
		const year = givenTime.getFullYear();
		const month = givenTime.getMonth() + 1;
		const day = givenTime.getDate();
		formattedTime += year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day) + " ";
	} else if (timeDiff > oneDay) {
		const month = givenTime.getMonth() + 1;
		const day = givenTime.getDate();
		formattedTime += (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day) + " ";
	}
	const hours = givenTime.getHours();
	const minutes = givenTime.getMinutes();
	formattedTime += (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes);
	return formattedTime;
}


module.exports = {
	getDate: getDate,
	formatDateTime: formatDateTime,
	optimizeFormatDateTime: optimizeFormatDateTime
};