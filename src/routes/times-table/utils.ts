export function delayed<T>(value: T, ms: number = 1500): Promise<T> {
	return new Promise((resolve) => {
		setTimeout(() => resolve(value), ms);
	});
}

export function multiply(a: number, b: number): Promise<number> {
	return delayed(a * b, 500);
}