//const API_URL = "http://localhost:3000/tasks"; //local
const API_URL = "https://69aece6ac8b37f49983696e1.mockapi.io/tasks"; 

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const statusMessage = document.getElementById("statusMessage");

//autenticacion
const authSection = document.getElementById("authSection");
const mainApp = document.getElementById("mainApp");
const userInput = document.getElementById("userInput");
const passInput = document.getElementById("passInput");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

let messageTimer = null;

function checkAuth() {
    const token = localStorage.getItem("token");
     if (token) {
        authSection.style.display = "none";
        mainApp.style.display = "block";
        loadTasks(); 
    } else {
        authSection.style.display = "block";
        mainApp.style.display = "none";
        taskList.innerHTML = "";  
    }
}

async function login(){
    const user = userInput.value;
    const pass = passInput.value;

    if(user === "admin" && pass === "password"){
        const fakeToken = btoa(JSON.stringify({ user: user, date: Date.now() }));
        localStorage.setItem("token", fakeToken);
        
        userInput.value = "";
        passInput.value = "";
        showMessage("Login exitoso.");
        checkAuth();
    } else{
        showMessage("Credenciales incorrectas.");
    }
}

function logout(){
    localStorage.removeItem("token");
    showMessage("Has cerrado sesión.");
    checkAuth();
}



// GET
async function loadTasks(){
    const token= localStorage.getItem("token");

    if(!token){
        showMessage("Debes iniciar sesión para cargar las tareas.");
        return;
    }

    try{
        const response = await fetch(API_URL, {
            headers: {
                "Authorization": `Bearer ${token}` 
            }
        });

        if(!response.ok){
            throw new Error("Error al consultar la API");
        }

        const tasks = await response.json();

        renderTasks(tasks);
    } catch (error) {
        showMessage("No se pudieron cargar las tareas.");
    }
}

function renderTasks(tasks) {
    taskList.innerHTML = "";
    if (tasks.length === 0) {
        emptyMessage.style.display = "block";
        return;
    }
    emptyMessage.style.display = "none";

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${task.title}
            <button class="delete-btn" data-id="${task.id}">Eliminar</button>
        `;
        taskList.appendChild(li);
    });
}

// POST
async function addTask() {

    const title = taskInput.value;

    if (title.trim() === "") {
        showMessage("No puedes agregar una tarea vacía.");
        return;
    }

    const newTask = {
        title: title,
        completed: false
    };

    const token = localStorage.getItem("token");

    try{
        const response= await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newTask)
    });
    if (response.ok) {
            taskInput.value = "";
            loadTasks();
            showMessage("Tarea agregada.");
        }
    } catch (error) {
        showMessage("Error al agregar.");
    }

}

// DELETE
async function deleteTask(id) {
    const token = localStorage.getItem("token"); 
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` } 
        });

        if (response.ok) {
            loadTasks();
            showMessage("Tarea eliminada.");
        }
    } catch (error) {
        showMessage("Error al eliminar.");
    }
}

function showMessage(text){
    statusMessage.textContent = text;

    if(messageTimer){
        clearTimeout(messageTimer);
    }

    messageTimer=setTimeout(() => {
        statusMessage.textContent = "";
    }, 10000);
}

loginBtn.addEventListener("click", login);
logoutBtn.addEventListener("click", logout);
addBtn.addEventListener("click", addTask);
taskList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
        deleteTask(e.target.getAttribute("data-id"));
    }
});

window.addEventListener("DOMContentLoaded", checkAuth);