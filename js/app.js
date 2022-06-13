
import { TodoStore } from './store.js';

export class TodoApp {
    $;
    constructor() {
        console.log('constructor');
        this.todoStore = new TodoStore('todoApp');
        this.attachToDom();
        this.init();
    }
    attachToDom() {
        this.$ = {
            main: document.querySelector('.main'),
            footer: document.querySelector('.footer'),
            input: document.querySelector('.new-todo'),
            toggleAll: document.querySelector('.toggle-all'),
            clear: document.querySelector('.clear-completed'),
            list: document.querySelector('.todo-list'),
            count: document.querySelector('.todo-count')
        }
    }
    init() {
        this.todoStore.addEventListener('save', this.render.bind(this));
        this.$.input.addEventListener('keyup', e => {
            if (e.key === 'Enter' && e.target.value.length > 0) {
                this.addTodo("id_" + Date.now(), e.target.value, false);
            }
        });
    }
    render() {
        while (this.$.list.hasChildNodes()) {
            this.$.list.removeChild(this.$.list.lastChild);
        }
        if (this.todoStore.todos.length) {
            this.$.main.classList.remove('hidden');
            this.todoStore.todos.forEach(todo => {
                this.$.list.appendChild(new Todo(todo.id, todo.title, todo.completed).render());
            });
            this.$.list.addEventListener('todo:delete', e => this.todoStore.delete(e.detail.id));
            this.$.list.addEventListener('todo:edit', e => this.todoStore.update(e.detail));
        } else {
            this.$.main.classList.add('hidden');
        }
        
    }
    addTodo(id, value, completed) {
        this.todoStore.add(new Todo(id, value, completed));
        this.$.input.value = '';
        this.render();
    }
}

class Todo {
    constructor(id, title, completed) {
        console.log(`id: ${id}, title: ${title}, completed: ${completed}`);
        this.id = id;
        this.title = title;
        this.completed = completed;
    }
    getPropsAsObj() {
        return { id: this.id, title: this.title, completed: this.completed };
    }
    render() {
        const li = document.createElement('li');
		li.dataset.id = this.id;
		if (this.completed) { li.classList.add('completed'); }
		li.insertAdjacentHTML('afterBegin', `
			<div class="view">
				<input class="toggle" type="checkbox" ${this.completed ? 'checked' : ''}>
				<label></label>
				<button class="destroy"></button>
			</div>
			<input class="edit">
		`);
        li.querySelector('label').textContent = this.title;
        li.querySelector('label').addEventListener('dblclick', e => {
            li.classList.add('editing');
        });
        li.querySelector('.edit').value = this.title;
        li.querySelector('.edit').addEventListener('keyup', e => {
            if (e.key === 'Enter' && e.target.value.length > 0) {
                e.preventDefault();
                this.title = e.target.value;
                const editedEvent = new CustomEvent('todo:edit', { bubbles: true, detail: this.getPropsAsObj() });
                e.target.dispatchEvent(editedEvent);
                li.classList.remove('editing');
            }
        });
        li.querySelector('.destroy').addEventListener('click', e => {
            e.preventDefault();
            const deleteEvent = new CustomEvent('todo:delete', { bubbles: true, detail: { id: this.id } });
            e.target.dispatchEvent(deleteEvent);
        });
		return li;
    }
}