export interface TaskData {
  id: string;
  title: string;
  completedPomodoros: number;
  estimatedPomodoros: number;
  done: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateTaskRequest = Pick<TaskData, 'title' | 'estimatedPomodoros'>;
export type UpdateTaskRequest = Pick<TaskData, 'id'> & Omit<TaskData, 'createdAt' | 'updatedAt'>;

export class Task {
  [key: string]: unknown;
  protected _id: string;
  protected _title: string;
  protected _completedPomodoros: number;
  protected _estimatedPomodoros: number;
  protected _done: boolean;
  protected _createdAt: string | undefined;
  protected _updatedAt: string | undefined;

  constructor(data: TaskData) {
    this._id = data.id;
    this._title = data.title;
    this._completedPomodoros = data.completedPomodoros;
    this._estimatedPomodoros = data.estimatedPomodoros;
    this._done = data.done;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
  }

  set id(id: string) {
    this._id = id;
  }

  set title(title: string) {
    this._title = title;
  }

  get id() {
    return this._id;
  }

  get title() {
    return this._title;
  }

  get completedPomodoros() {
    return this._completedPomodoros;
  }

  get estimatedPomodoros() {
    return this._estimatedPomodoros;
  }

  get done() {
    return this._done;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  incrementCompletedPomodoros() {
    this._completedPomodoros++;
    return this;
  }

  markAsDone() {
    this._done = true;
    return this;
  }

  markAsUndone() {
    this._done = false;
    return this;
  }

  updateFrom(data: Partial<TaskData>) {
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) continue;
      this[key] = value;
    }
  }

  toUpdateRequest() {
    return <UpdateTaskRequest>{
      id: this.id,
      title: this.title,
      completedPomodoros: this.completedPomodoros,
      estimatedPomodoros: this.estimatedPomodoros,
      done: this.done
    };
  }

  clone() {
    return new Task({
      id: this.id,
      title: this.title,
      completedPomodoros: this.completedPomodoros,
      estimatedPomodoros: this.estimatedPomodoros,
      done: this.done,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    });
  }
}
