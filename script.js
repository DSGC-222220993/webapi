//const API_URL = "http://localhost:3000/tasks"; //local
const API_URL = "https://69aece6ac8b37f49983696e1.mockapi.io/tasks"; 
const USERS_URL = "https://69aece6ac8b37f49983696e1.mockapi.io/users";

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

async function login() {
    const typedUser = userInput.value;
    const typedPass = passInput.value;

    if (!typedUser || !typedPass) {
        showMessage("Por favor, ingresa usuario y contraseña.");
        return;
    }

    try {
        const response = await fetch(USERS_URL);
        const users = await response.json();

        const validUser = users.find(u => (u.user === typedUser || u.email === typedUser) && u.password === typedPass);

        if (validUser || (typedUser === "admin" && typedPass === "password")) {
            const sessionName = validUser ? (validUser.user || validUser.email) : "admin";
            const sessionId = validUser ? validUser.id : "0";

            const fakeToken = btoa(JSON.stringify({ 
                user: sessionName, 
                userId: sessionId, 
                exp: Date.now() + 3600000 
            }));

            localStorage.setItem("token", fakeToken);
            
            userInput.value = "";
            passInput.value = "";
            showMessage(`¡Bienvenido, ${sessionName}!`);
            checkAuth();
        } else {
            showMessage("Credenciales incorrectas.");
        }
    } catch (error) {
        showMessage("Error al conectar con el servidor de usuarios.");
    }
}

function logout(){
    localStorage.removeItem("token");
    showMessage("Has cerrado sesión.");
    checkAuth();
}

// GET
async function loadTasks() {
    const token = localStorage.getItem("token");
    if (!token) return;

    const userData = JSON.parse(atob(token));
    const userId = userData.userId;

    try {
        const response = await fetch(`${API_URL}?userId=${userId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        showMessage("Error al cargar tus tareas.");
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
    if (!title.trim()) return;

    const token = localStorage.getItem("token");
    const userData = JSON.parse(atob(token));

    const newTask = { 
        title: title, 
        completed: false,
        userId: userData.userId 
    };

    try {
        await fetch(API_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(newTask)
        });
        taskInput.value = "";
        loadTasks();
    }catch (error) {
        showMessage("Error al guardar.");
    }
}

// DELETE
async function deleteTask(id) {
    const token = localStorage.getItem("token");
    try {
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        loadTasks();
        showMessage("Eliminado.");
    } catch (error) {
        showMessage("Error al borrar.");
    }
}

function showMessage(text) {
    statusMessage.textContent = text;
    if (messageTimer) clearTimeout(messageTimer);
    messageTimer = setTimeout(() => statusMessage.textContent = "", 4000);
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