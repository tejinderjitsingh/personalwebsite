/*
* File : To Do Task Manager Application
* Project : To Do Task Manager
* Programmer : Maruf Rasool
* First Version : 2025-08-04
* Description :
* The applicaiton is created to help user for daily task managment
*/

// User Authentication
const users = [
    { email: 'mras6187@gmail.com', password: 'Secret55', name: 'Maruf Rasool' }
];

let currentUser = null;

// DOM Elements
const getStartedBtn = document.getElementById('getStartedBtn');
const signInBtn = document.getElementById('signInBtn');
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const showLogin = document.getElementById('showLogin');
const showRegister = document.getElementById('showRegister');
const registerFormElement = document.getElementById('register');
const loginFormElement = document.getElementById('login');
const logoutBtn = document.getElementById('logoutBtn');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskModal = document.getElementById('taskModal');
const closeModal = document.querySelector('.close-modal');
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const taskSearch = document.getElementById('taskSearch');
const categoryFilter = document.getElementById('categoryFilter');
const priorityFilter = document.getElementById('priorityFilter');
const hideCompleted = document.getElementById('hideCompleted');
const clearFilters = document.getElementById('clearFilters');
const totalTasksSpan = document.getElementById('totalTasks');
const pendingTasksSpan = document.getElementById('pendingTasks');

// Task Data
let tasks = [];

// Check if we're on the landing page or main app
if (getStartedBtn && signInBtn) {
    // Landing Page Event Listeners
    getStartedBtn.addEventListener('click', () => {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        document.querySelector('.auth-forms').classList.remove('hidden');
    });

    signInBtn.addEventListener('click', () => {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        document.querySelector('.auth-forms').classList.remove('hidden');
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    });

    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    });

    // Form Submissions
    registerFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = registerFormElement.querySelector('input[type="text"]').value;
        const email = registerFormElement.querySelector('input[type="email"]').value;
        const password = registerFormElement.querySelector('input[type="password"]').value;

        // Check if user already exists
        if (users.some(user => user.email === email)) {
            alert('User with this email already exists!');
            return;
        }

        // Add new user
        users.push({ email, password, name });
        alert('Registration successful! Please login.');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        registerFormElement.reset();
    });

    loginFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginFormElement.querySelector('input[type="email"]').value;
        const password = loginFormElement.querySelector('input[type="password"]').value;

        // Find user
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            currentUser = user;
            // Store user in session
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            // Redirect to main app
            window.location.href = 'main.html';
        } else {
            alert('Invalid email or password!');
        }
    });

    // CTA Button
    document.getElementById('ctaButton')?.addEventListener('click', () => {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        document.querySelector('.auth-forms').classList.remove('hidden');
        window.scrollTo({
            top: document.querySelector('.auth-forms').offsetTop - 20,
            behavior: 'smooth'
        });
    });
}

// Main App Functionality
if (logoutBtn) {
    // Check if user is logged in
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
    } else {
        // Redirect to login if not authenticated
        window.location.href = 'index.html';
    }

    // Logout
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });

    // Task Modal
    addTaskBtn.addEventListener('click', () => {
        taskModal.classList.remove('hidden');
        document.getElementById('modalTitle').textContent = 'Add New Task';
        taskForm.reset();
        taskForm.dataset.mode = 'add';
    });

    closeModal.addEventListener('click', () => {
        taskModal.classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
        if (e.target === taskModal) {
            taskModal.classList.add('hidden');
        }
    });

    // Task Form Submission
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const dueDate = document.getElementById('taskDueDate').value;
        const priority = document.getElementById('taskPriority').value;
        const category = document.getElementById('taskCategory').value;
        
        if (taskForm.dataset.mode === 'add') {
            // Add new task
            const newTask = {
                id: Date.now(),
                title,
                description,
                dueDate,
                priority,
                category,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            tasks.push(newTask);
        } else {
            // Update existing task
            const taskId = parseInt(taskForm.dataset.taskId);
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            
            if (taskIndex !== -1) {
                tasks[taskIndex] = {
                    ...tasks[taskIndex],
                    title,
                    description,
                    dueDate,
                    priority,
                    category
                };
            }
        }
        
        saveTasks();
        renderTasks();
        taskModal.classList.add('hidden');
    });

    // Filter and Search
    categoryFilter.addEventListener('change', renderTasks);
    priorityFilter.addEventListener('change', renderTasks);
    hideCompleted.addEventListener('change', renderTasks);
    taskSearch.addEventListener('input', renderTasks);
    clearFilters.addEventListener('click', () => {
        categoryFilter.value = 'all';
        priorityFilter.value = 'all';
        hideCompleted.checked = false;
        taskSearch.value = '';
        renderTasks();
    });

    // Load tasks from localStorage
    function loadTasks() {
        const savedTasks = localStorage.getItem(`tasks_${currentUser.email}`);
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
        }
    }

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem(`tasks_${currentUser.email}`, JSON.stringify(tasks));
    }

    // Render tasks based on filters
    function renderTasks() {
        const searchTerm = taskSearch.value.toLowerCase();
        const category = categoryFilter.value;
        const priority = priorityFilter.value;
        const hideCompletedChecked = hideCompleted.checked;
        
        let filteredTasks = tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchTerm) || 
                                task.description.toLowerCase().includes(searchTerm);
            const matchesCategory = category === 'all' || task.category === category;
            const matchesPriority = priority === 'all' || task.priority === priority;
            const matchesCompleted = !hideCompletedChecked || !task.completed;
            
            return matchesSearch && matchesCategory && matchesPriority && matchesCompleted;
        });
        
        // Sort by due date (soonest first), then by priority
        filteredTasks.sort((a, b) => {
            if (a.dueDate && b.dueDate) {
                return new Date(a.dueDate) - new Date(b.dueDate);
            } else if (a.dueDate) {
                return -1;
            } else if (b.dueDate) {
                return 1;
            }
            
            const priorityOrder = { high: 1, medium: 2, low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        
        // Update task stats
        totalTasksSpan.textContent = tasks.length;
        const pendingTasks = tasks.filter(task => !task.completed).length;
        pendingTasksSpan.textContent = pendingTasks;
        
        // Render tasks
        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<p class="empty-state">No tasks found. Add your first task to get started!</p>';
        } else {
            taskList.innerHTML = '';
            filteredTasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
                taskElement.innerHTML = `
                    <div class="task-info">
                        <h4 class="task-title">${task.title}</h4>
                        ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
                        <div class="task-meta">
                            <span class="task-category">${task.category}</span>
                            <span class="task-priority priority-${task.priority}">${task.priority}</span>
                            ${task.dueDate ? `<span class="task-due-date">Due: ${formatDate(task.dueDate)}</span>` : ''}
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="edit-task" data-id="${task.id}">✏️</button>
                        <button class="delete-task" data-id="${task.id}">🗑️</button>
                        <button class="toggle-complete" data-id="${task.id}">${task.completed ? '↩️' : '✓'}</button>
                    </div>
                `;
                taskList.appendChild(taskElement);
            });
            
            // Add event listeners to action buttons
            document.querySelectorAll('.edit-task').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const taskId = parseInt(e.target.dataset.id);
                    editTask(taskId);
                });
            });
            
            document.querySelectorAll('.delete-task').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const taskId = parseInt(e.target.dataset.id);
                    deleteTask(taskId);
                });
            });
            
            document.querySelectorAll('.toggle-complete').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const taskId = parseInt(e.target.dataset.id);
                    toggleTaskComplete(taskId);
                });
            });
        }
    }

    // Format date for display
    function formatDate(dateString) {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Edit task
    function editTask(taskId) {
        const task = tasks.find(task => task.id === taskId);
        if (task) {
            document.getElementById('modalTitle').textContent = 'Edit Task';
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description || '';
            document.getElementById('taskDueDate').value = task.dueDate || '';
            document.getElementById('taskPriority').value = task.priority;
            document.getElementById('taskCategory').value = task.category;
            
            taskForm.dataset.mode = 'edit';
            taskForm.dataset.taskId = taskId;
            taskModal.classList.remove('hidden');
        }
    }

    // Delete task
    function deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(task => task.id !== taskId);
            saveTasks();
            renderTasks();
        }
    }

    // Toggle task completion
    function toggleTaskComplete(taskId) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            saveTasks();
            renderTasks();
        }
    }

    // Initialize the app
    loadTasks();
    renderTasks();
}
