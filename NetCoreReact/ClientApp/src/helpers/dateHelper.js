export function formatDate(date) {
	let time = new Date(date);
	return time.getMonth() + 1 + "/" + time.getDate() + "/" + time.getFullYear();
}

export function getUTCDateObject(date) {
	let utc = new Date(date);
	return new Date(utc.getTime() + utc.getTimezoneOffset() * 60000);
}