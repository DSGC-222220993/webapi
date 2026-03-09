# Descripción de la pagina web:

Este proyecto consiste en una aplicación web sencilla para la gestión de tareas que consume una Web API. La interfaz permite al usuario agregar nuevas tareas, eliminarlas y visualizar las tareas registradas mediante solicitudes HTTP a una API REST.

Actualmente la API funciona de manera local utilizando json-server, lo cual permite simular un backend durante el desarrollo. En una fase posterior se planea utilizar una API pública como MockAPI para permitir el funcionamiento de la aplicación una vez desplegada en internet. (La WebApi ya cuenta con API online, cambios realizados 08/03/2026).

---

# Usos de la aplicación

- Escribir una tarea en el campo de texto.
- Presionar el botón Agregar.
- La tarea se envía a la API.
- La lista de tareas se actualiza automáticamente.

Si no existen tareas registradas, se mostrará un mensaje indicando que no hay tareas pendientes.

- Presionar botón eliminar para cada tarea.

---

# Tecnologías utilizdas

- HTML5 → estructura de la página
- CSS3 → estilos 
- JavaScript (Vanilla JS) → lógica y consumo de API
- json-server → simulación de API REST local
- Live Server (VS Code) → ejecución local del frontend
- Mock API 

Nada de frameworks ni librerias externas.

---

# Diseño

Diseño responsivo, centrado vertical y horizontalmentes en la pantallas.

---

# Ejecución de la API local

Copiar y pegar en terminal

1. Inicializar Node: npm init -y
2. Instalar json-server: npm install json-server
3. Ejecutar la API: npx json-server task-manager-api/db.json --port 3000

API disponible en: http://localhost:3000/tasks

---

# Ejecución de la API online

1. Crear proyecto.
2. Dentro del proyecto creado agregar Resource.
3. En Resource se agregan los mismos campos usados en db.json.
4. Guardar cambios y obtener el endpoint
5. Agrgar API_URL al script.

---
# Ejecución desde el frontend

1. Descargar o clonar repositorio.
2. Abrir archivo index.
3. Click derecho.
4. Seleccionar Open with Live Server.

---

# NOTA (Cambios ya realizados 09/03/2026)

Actualmente el proyecto aún se encuentra en desarrollo.
Las siguientes funcionalidades serán implementadas:

- Lista dinámica de tareas.
- Botón Eliminar por cada tarea.
- Endpoint DELETE para eliminar tareas,
- Integración con MockAPI para despliegue en producción.
- Mejorar estilos de la interfaz.
- Desplegar la API en un servidor público y publicar el frontend.

---

# Licencia

Proyecto realizado con fines educativos.

---

# Checklist de diagnóstico:

1. Titulo principal h1

2. Dos contenedores

3. Un campo de entrada Input

4. Botones para agregar y eliminar tareas

5. Una lista de tareas y un párrafo p
