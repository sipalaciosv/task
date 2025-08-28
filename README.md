# TareaPorHacer (colaborativa)


Aplicación web simple para gestión de tareas colaborativas, desarrollada con **JavaScript moderno**, **orientación a objetos**, **orientación a eventos**, **programación asíncrona** (carga inicial desde MockAPI), **Bootstrap 5**, **localStorage** y **drag & drop nativo** para mover tareas entre estados.


## Características
- Registro/Login **simulados** (persisten en `localStorage`).
- CRUD de tareas: crear, editar, eliminar.
- Asignación de tarea a **un** usuario.
- Estados: `pendiente`, `en_progreso`, `completada`.
- Campo **venceEn** (fecha opcional).
- **Kanban** con **drag & drop** nativo.
- Panel de **estadísticas** (porcentaje completadas, conteo por estado, tareas por usuario).
- **Semillas** desde **MockAPI** (GET) para cargar tareas iniciales.


## Requisitos
- Navegador moderno.
- Servidor estático local (puede ser la extensión “Live Server” de VS Code o `npx serve`).


## Cómo ejecutar
1. Abre la carpeta del proyecto en VS Code.
2. Sirve los archivos de forma estática (por ejemplo, con **Live Server**) para que los módulos ES funcionen correctamente.
3. Abre `auth.html` en el navegador.
4. Regístrate o inicia sesión.
5. En `app.html`, usa **“Cargar tareas iniciales”** para importar 10 tareas desde MockAPI.
