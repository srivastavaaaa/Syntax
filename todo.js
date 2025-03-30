// Store tasks in localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Initialize the to-do list
function initTodoList() {
    const todoList = document.getElementById('todo-list');
    const todoPreview = document.querySelector('.todo-preview');
    
    if (todoList) {
        // Main todo list in tools page
        renderMainTodoList();
        
        // Add event listeners for the main todo list
        const todoInput = document.getElementById('todo-input');
        const addButton = document.getElementById('add-todo');
        
        addButton.addEventListener('click', () => addTask(todoInput.value));
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTask(todoInput.value);
            }
        });

        // Add filter functionality
        const filterButtons = document.querySelectorAll('.todo-filters button');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                filterTasks(button.dataset.filter);
            });
        });
    }
    
    if (todoPreview) {
        // Quick tasks preview in home page
        renderQuickTasks();
    }
}

// Add a new task
function addTask(text) {
    if (!text.trim()) return;

    const task = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.unshift(task);
    saveTasks();
    
    // Clear input
    const todoInput = document.getElementById('todo-input');
    if (todoInput) todoInput.value = '';
    
    // Update both views
    renderMainTodoList();
    renderQuickTasks();
}

// Toggle task completion
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderMainTodoList();
        renderQuickTasks();
    }
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderMainTodoList();
    renderQuickTasks();
}

// Filter tasks
function filterTasks(filter) {
    const todoList = document.getElementById('todo-list');
    if (!todoList) return;

    const filteredTasks = tasks.filter(task => {
        if (filter === 'active') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true;
    });

    renderMainTodoList(filteredTasks);
}

// Render the main todo list
function renderMainTodoList(filteredTasks = tasks) {
    const todoList = document.getElementById('todo-list');
    if (!todoList) return;

    todoList.innerHTML = '';
    
    filteredTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `todo-item ${task.completed ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <div class="todo-content">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
                <span class="todo-text">${task.text}</span>
            </div>
            <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        todoList.appendChild(taskElement);
    });
}

// Render quick tasks in home page
function renderQuickTasks() {
    const todoPreview = document.querySelector('.todo-preview');
    if (!todoPreview) return;

    todoPreview.innerHTML = '';
    
    // Show only first 3 active tasks
    const activeTasks = tasks.filter(task => !task.completed).slice(0, 3);
    
    activeTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'todo-item';
        taskElement.innerHTML = `
            <input type="checkbox" id="task-${task.id}" onchange="toggleTask(${task.id})">
            <label for="task-${task.id}">${task.text}</label>
        `;
        todoPreview.appendChild(taskElement);
    });
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initTodoList); 