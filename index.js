document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');

    let taskIdCounter = 1; // Counter to generate unique IDs

    // Load tasks from local storage
    loadTasks();

    // Add Task Event Listener
    addTaskButton.addEventListener('click', () => {
        const taskDescription = taskInput.value.trim();
        if (taskDescription) {
            addTask(taskDescription);
            taskInput.value = '';
        } else {
            alert('Please enter a task description.');
        }
    });

    // Function to add a task
    function addTask(description) {
        const id = taskIdCounter++;
        const task = {
            id: id,
            description: description
        };

        const li = document.createElement('li');
        li.setAttribute('data-id', id);
        li.innerHTML = `
            <span>${description}</span>
            <div>
                <button onclick="editTask(${id})">Edit</button>
                <button onclick="deleteTask(${id})">Delete</button>
            </div>
        `;
        taskList.appendChild(li);

        // Save task to local storage
        saveTaskToLocalStorage(task);
    }

    // Function to save task to local storage
    function saveTaskToLocalStorage(task) {
        const tasks = getTasksFromLocalStorage();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to load tasks from local storage
    function loadTasks() {
        const tasks = getTasksFromLocalStorage();
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.setAttribute('data-id', task.id);
            li.innerHTML = `
                <span>${task.description}</span>
                <div>
                    <button onclick="editTask(${task.id})">Edit</button>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                </div>
            `;
            taskList.appendChild(li);
        });

        // Set the task ID counter to the next available ID
        taskIdCounter = tasks.length ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
    }

    // Function to get tasks from local storage
    function getTasksFromLocalStorage() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    // Function to delete a task
    window.deleteTask = function(id) {
        const tasks = getTasksFromLocalStorage();
        const updatedTasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));

        const taskElement = document.querySelector(`li[data-id="${id}"]`);
        if (taskElement) {
            taskElement.remove();
        }
    };

    // Function to edit a task
    window.editTask = function(id) {
        const newDescription = prompt('Edit task description:');
        if (newDescription) {
            const taskElement = document.querySelector(`li[data-id="${id}"]`);
            if (taskElement) {
                taskElement.querySelector('span').textContent = newDescription;
                updateTaskInLocalStorage(id, newDescription);
            }
        }
    };

    // Function to update a task in local storage
    function updateTaskInLocalStorage(id, newDescription) {
        const tasks = getTasksFromLocalStorage();
        const updatedTasks = tasks.map(task => {
            if (task.id === id) {
                task.description = newDescription;
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
});
