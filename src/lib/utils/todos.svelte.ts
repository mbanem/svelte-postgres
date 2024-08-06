export type TodoStates = Array<boolean>;
export type TodoContents = Array<string>;

export class Todos {
	private _length = 0;
	private _done = $state<TodoStates>([]);
	private _text = $state<TodoContents>([]);

	constructor() {}

	get length() {
		return this._length;
	}
	get = (ix: number) => {
		return { text: this._text[ix], done: this._done[ix] };
	};
	set = (ix: number, text: string, done: boolean) => {
		if (!this._text[ix]) {
			// not updated item increments length
			this._length++;
		}
		this._done[ix] = done;
		this._text[ix] = text;
	};
	asArray = () => {
		const arr = [];
		for (let i = 0; i < this._done.length; i++) {
			arr.push({ text: this._text[i], done: this._done[i] });
		}
		return arr;
	};
}

let _globalTodos: Todos;
export const getGlobalTodos = () => {
	if (!_globalTodos) {
		_globalTodos = new Todos();
	}
	return _globalTodos;
};
