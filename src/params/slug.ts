export function match(str: string) {
	return /^[a-z0-9]+(?:-[a-z0-9]+)*$/gim.test(str);
}
