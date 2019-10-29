export function formatDate(date) {
	let time = new Date(date);
	return time.getUTCMonth()+1 + "/" + time.getUTCDate() + "/" + time.getUTCFullYear();
}

export function getUTCDateObject(date) {
	let utc = new Date(date);
	return new Date(utc.getTime() + utc.getTimezoneOffset() * 60000);
}