const API_URL = "http://localhost:3000/tasks";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const message = document.getElementById("emptyMessage");

window.addEventListener("DOMContentLoaded", loadTasks);

// GET
async function loadTasks() {

    const response = await fetch(API_URL);
    const tasks = await response.json();

    taskList.innerHTML = "";

    if (tasks.length === 0) {
        emptyMessage.style.display = "block";
        message.textContent = "No hay tareas registradas";
        return;
    }
    emptyMessage.style.display = "none";
    tasks.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = `${task.title} 
        <button class="delete-btn" onclick="deleteTask(${task.id})">
            Eliminar</button>
        `;
        taskList.appendChild(li);
    });
}

// POST
async function addTask() {

    const title = taskInput.value;

    if (title.trim() === "") {
        alert("Por favor, ingresa una tarea válida.");
        return;
    }

    const newTask = {
        title: title,
        completed: false
    };

    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newTask)
    });
    taskInput.value = "";
    loadTasks();

}

addBtn.addEventListener("click", addTask);