const currentDate = document.getElementById("currentDate");
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");

const today = new Date();

currentDate.textContent = today.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
});

let tasks = [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}

function addTask(title) {
    const task = {
        id: Date.now(),
        title: title,
        completed: false
    };

    tasks.push(task);

    saveTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    saveTasks();
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(function(task) {
            return !task.completed;
        });
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(function(task) {
            return task.completed;
        });
    }

    filteredTasks.forEach(function(task) {
        const taskItem = document.createElement("div");

        taskItem.className = "task-item";

        taskItem.innerHTML = `
            <div class="task-content">
                <input type="checkbox" ${task.completed ? "checked" : ""}>

                <p class="task-title ${task.completed ? "completed" : ""}">
                    ${task.title}
                </p>
            </div>

            <div class="task-actions">
                <button class="btn btn-warning btn-sm edit-btn">
                    Edit
                </button>

                <button class="btn btn-danger btn-sm delete-btn">
                    Delete
                </button>
            </div>
        `;

        const checkbox = taskItem.querySelector("input");
        const editButton = taskItem.querySelector(".edit-btn");
        const deleteButton = taskItem.querySelector(".delete-btn");

        checkbox.addEventListener("change", function() {
            task.completed = checkbox.checked;

            saveTasks();
            renderTasks();
        });

        deleteButton.addEventListener("click", function() {
            deleteTask(task.id);
        });

        editButton.addEventListener("click", function() {
            const content = taskItem.querySelector(".task-content");

            content.innerHTML = `
                <input type="text" class="form-control edit-input" value="${task.title}">
            `;

            const actions = taskItem.querySelector(".task-actions");

            actions.innerHTML = `
                <button class="btn btn-success btn-sm save-btn">
                    Save
                </button>

                <button class="btn btn-secondary btn-sm cancel-btn">
                    Cancel
                </button>
            `;

            const editInput = content.querySelector(".edit-input");
            const saveButton = actions.querySelector(".save-btn");
            const cancelButton = actions.querySelector(".cancel-btn");

            saveButton.addEventListener("click", function() {
                const newTitle = editInput.value.trim();

                if (newTitle === "") {
                    return;
                }

                task.title = newTitle;

                saveTasks();
                renderTasks();
            });

            cancelButton.addEventListener("click", function() {
                renderTasks();
            });

            editInput.focus();
        });

        taskList.appendChild(taskItem);
    });
}

filterButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        renderTasks();
    });
});
taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = taskInput.value.trim();

    if (title === "") {
        return;
    }

    addTask(title);

    renderTasks();

    taskInput.value = "";
});

loadTasks();
renderTasks();