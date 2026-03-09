const API_URL = "http://localhost:3000/tasks"; //local
// const API_URL = "en producción: https://MockAPI.com/tasks"; 

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const statusMessage = document.getElementById("statusMessage");


window.addEventListener("DOMContentLoaded", loadTasks);

function showMessage(text){
    statusMessage.textContent = text;

    setTimeout(() => {
        statusMessage.textContent = "";
    }, 60000);
}

// GET
async function loadTasks(){

    try{

        const response = await fetch(API_URL);

        if(!response.ok){
            throw new Error("Error al consultar la API");
        }

        const tasks = await response.json();

        taskList.innerHTML = "";

        if(tasks.length === 0){
            emptyMessage.style.display = "block";
            emptyMessage.textContent = "No hay tareas registradas";
            return;
        }

        emptyMessage.style.display = "none";

        tasks.forEach(task => {

            const li = document.createElement("li");

            li.innerHTML = `
                ${task.title}
                <button class="delete-btn" data-id="${task.id}">
                    Eliminar
                </button>
            `;

            taskList.appendChild(li);

        });

    }catch(error){

        showMessage("No se pudo conectar con la API.");

    }

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

    try{
        const response= await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newTask)
    });
    if(!response.ok){
            throw new Error("Error al agregar tarea");
        }

        showMessage("Tarea agregada correctamente.");

        taskInput.value="";

        loadTasks();

    }catch(error){

        showMessage("No se pudo agregar la tarea.");

    }

}

// DELETE
async function deleteTask(id){
    try{
        const response = await fetch(`${API_URL}/${id}`,{

            method:"DELETE"
        });

        if(!response.ok){
            throw new Error("Error al eliminar tarea");
        }

        showMessage("Tarea eliminada.");
        loadTasks();

    }catch(error){

        showMessage("No se pudo eliminar la tarea.");

    }

}


addBtn.addEventListener("click", addTask);

taskList.addEventListener("click", function(e){
    if(e.target.classList.contains("delete-btn")){
        const id = e.target.getAttribute("data-id");
        deleteTask(id);
    }
});