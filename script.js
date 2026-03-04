const API_URL = "http://localhost:3000/tasks";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const message = document.getElementById("message");

document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
});

function loadTasks() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            taskList.innerHTML = "";

            if (data.length === 0) {
                message.textContent = "No hay tareas registradas";
            } else {
                message.textContent = "";
                data.forEach(task => {
                    addTaskToDOM(task);
                });
            }
        })
        .catch(error => {
            console.log("Error al cargar tareas:", error);
        });
}

addBtn.addEventListener("click", () => {
    const title = taskInput.value.trim();

    if (title === "") {
        alert("Escribe una tarea");
        return;
    }

    const newTask = {
        title: title,
        completed: false
    };

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newTask)
    })
    .then(response => response.json())
    .then(data => {
        addTaskToDOM(data);
        taskInput.value = "";
        message.textContent = "";
    })
    .catch(error => {
        console.log("Error al agregar tarea:", error);
    });
});

function addTaskToDOM(task) {
    const li = document.createElement("li");

    li.textContent = task.title;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Eliminar";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", () => {
        deleteTask(task.id);
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

function deleteTask(id) {
    fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    })
    .then(() => {
        loadTasks();
    })
    .catch(error => {
        console.log("Error al eliminar tarea:", error);
    });
}