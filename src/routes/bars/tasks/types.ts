export type Filter = 'all' | 'todo' | 'done';

export type Task = {
  id: string;
  title: string;
  done: boolean;
};

export type PROPS = {
  tasks: Task[];
  toggleDone: (task: Task) => void;
  removeTask: (id: string) => void;
};
