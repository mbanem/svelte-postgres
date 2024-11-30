export class CounterState {
	value = $state(0);

	increment() {
		this.value += 1;
	}
	decrement() {
		this.value -= 1;
	}
}

export function createState() {
	let value = $state(0);

	function increment() {
		value += 1;
	}
	function decrement() {
		value -= 1;
	}

	// return just getter, setter and increment
	return {
		get value() {
			return value;
		},
		set value(newValue) {
			value = newValue;
		},
		increment,
		decrement
	};
}
