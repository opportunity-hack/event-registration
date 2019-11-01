export function formatDate(date) {
	let time = new Date(date);
	return time.getMonth() + 1 + "/" + time.getDate() + "/" + time.getFullYear();
}