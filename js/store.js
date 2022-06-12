export class TodoStore extends EventTarget {
    todos;
    localStorageKey;
    constructor(localStorageKey) {
        super();
        this.localStorageKey = localStorageKey;
        this._readStorage();
    }
    _readStorage () {
        this.todos = JSON.parse(window.localStorage.getItem(this.localStorageKey) || '[]');
    }
    _save () {
        window.localStorage.setItem(this.localStorageKey, JSON.stringify(this.todos));
        this.dispatchEvent(new CustomEvent('save'));
    }
    // MUTATE methods
    add(todo) {
        const { id, title, completed } = todo; 
        this.todos.push({ id, title, completed });
        this._save();
    }

    delete(todoId) {
        this.todos = this.todos.filter(todo => todo.id !== todoId);
        this._save();
    }
}