/**
 * Todo App - Vanilla JavaScript
 * A clean, lightweight todo application with localStorage persistence
 */

class TodoApp {
    constructor() {
        this.todos = this.loadTodos();
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
        this.updateStats();
    }

    bindEvents() {
        const form = document.getElementById('todoForm');
        const todoList = document.getElementById('todoList');

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTodo();
        });

        // Event delegation for todo interactions
        todoList.addEventListener('click', (e) => {
            const todoItem = e.target.closest('.todo-item');
            if (!todoItem) return;

            const todoId = parseInt(todoItem.dataset.id);

            if (e.target.classList.contains('todo-checkbox')) {
                this.toggleTodo(todoId);
            } else if (e.target.classList.contains('delete-btn')) {
                this.deleteTodo(todoId);
            }
        });

        // Input validation
        const input = document.getElementById('todoInput');
        input.addEventListener('input', (e) => {
            if (e.target.value.length > 100) {
                e.target.value = e.target.value.substring(0, 100);
                this.showMessage('Task description limited to 100 characters', 'warning');
            }
        });
    }

    addTodo() {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();

        if (!text) {
            this.showMessage('Please enter a task description', 'error');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.unshift(todo);
        this.saveTodos();
        this.render();
        this.updateStats();
        
        input.value = '';
        input.focus();
        
        this.showMessage('Task added successfully!', 'success');
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
            this.updateStats();
        }
    }

    deleteTodo(id) {
        const todoItem = document.querySelector(`[data-id="${id}"]`);
        if (todoItem) {
            todoItem.classList.add('removing');
            setTimeout(() => {
                this.todos = this.todos.filter(t => t.id !== id);
                this.saveTodos();
                this.render();
                this.updateStats();
            }, 300);
        }
    }

    render() {
        const todoList = document.getElementById('todoList');
        const emptyState = document.getElementById('emptyState');

        if (this.todos.length === 0) {
            todoList.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        
        todoList.innerHTML = this.todos.map(todo => `
            <li class="todo-item" data-id="${todo.id}">
                <div class="todo-checkbox ${todo.completed ? 'checked' : ''}"></div>
                <span class="todo-text ${todo.completed ? 'completed' : ''}">${this.escapeHtml(todo.text)}</span>
                <button class="delete-btn" title="Delete task">🗑️</button>
            </li>
        `).join('');
    }

    updateStats() {
        const totalCount = document.getElementById('totalCount');
        const completedCount = document.getElementById('completedCount');
        
        const completed = this.todos.filter(todo => todo.completed).length;
        
        totalCount.textContent = this.todos.length;
        completedCount.textContent = completed;
    }

    saveTodos() {
        try {
            localStorage.setItem('todoApp_todos', JSON.stringify(this.todos));
        } catch (error) {
            console.error('Error saving todos:', error);
            this.showMessage('Error saving tasks', 'error');
        }
    }

    loadTodos() {
        try {
            const saved = localStorage.getItem('todoApp_todos');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading todos:', error);
            return [];
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showMessage(message, type = 'info') {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Add toast styles
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            backgroundColor: type === 'error' ? '#e74c3c' : 
                           type === 'success' ? '#27ae60' : 
                           type === 'warning' ? '#f39c12' : '#3498db'
        });

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
