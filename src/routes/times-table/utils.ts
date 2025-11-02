export function async delayed<T>(value: T, ms: number = 1500): Promise<T> {
	return new Promise((resolve) => {
		setTimeout(() => resolve(value), ms);
	});
}

export function async multiply(a: number, b: number): Promise<number> {
	return await delayed(a * b, 500);
}