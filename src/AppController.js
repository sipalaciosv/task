import { AuthService } from './services/AuthService.js';
import { TaskRepository } from './services/TaskRepository.js';
import { StatsService } from './services/StatsService.js';
import { ApiClient } from './services/ApiClient.js';
import { UI } from './ui/UI.js';
import { showToast } from './services/Toasts.js';

export class AppController {
  constructor() {
    this.auth = new AuthService();
    this.repo = new TaskRepository();
    this.ui = new UI({
      onEdit: (id) => this.#openEdit(id),
      onDelete: (id) => this.#delete(id),
      onDragStateChange: (id, estado) => this.#move(id, estado),
    });

    this.$user = document.getElementById('currentUser');
    this.$btnNew = document.getElementById('btnNewTask');
    this.$btnSeed = document.getElementById('btnSeed');
    this.$btnLogout = document.getElementById('btnLogout');

    this.modalEl = document.getElementById('taskModal');
    this.modal = new bootstrap.Modal(this.modalEl);
    this.form = document.getElementById('taskForm');

    this.$taskId = document.getElementById('taskId');
    this.$titulo = document.getElementById('taskTitulo');
    this.$desc = document.getElementById('taskDescripcion');
    this.$asignado = document.getElementById('taskAsignadoA');
    this.$vence = document.getElementById('taskVenceEn');
    this.$estado = document.getElementById('taskEstado');

    this.api = new ApiClient('https://68af6fcab91dfcdd62bc509d.mockapi.io/api/v1'); // <- reemplaza por tu endpoint real creado en MockAPI

    this.#guard();
    this.#bind();
    this.#renderAll();
  }

  #guard() {
    const user = this.auth.currentUser();
    if (!user) {
      window.location.href = 'auth.html';
      return;
    }
    this.currentUser = user;
    this.$user.textContent = `Conectado como @${user.nombre} • ${user.email}`;
    this.#reloadUsersSelect();
  }

  #bind() {
    this.$btnNew.addEventListener('click', () => this.#openCreate());

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!this.form.checkValidity()) {
        this.form.classList.add('was-validated');
        return;
      }
      const data = {
        titulo: this.$titulo.value.trim(),
        descripcion: this.$desc.value.trim(),
        asignadoA: this.$asignado.value,
        venceEn: this.$vence.value || null,
        estado: this.$estado.value,
      };
      const id = this.$taskId.value;
      try {
        if (id) {
          this.repo.update(id, data);
          showToast('Actualizada', 'La tarea fue modificada', 'primary');
        } else {
          this.repo.create(data);
          showToast('Creada', 'La tarea fue agregada', 'success');
        }
        this.modal.hide();
        this.form.reset();
        this.form.classList.remove('was-validated');
        this.#renderAll();
      } catch (err) {
        showToast('Error', err.message, 'danger');
      }
    });

    this.$btnSeed.addEventListener('click', () => this.#seed());
    this.$btnLogout.addEventListener('click', () => {
      this.auth.logout();
      window.location.href = 'auth.html';
    });
  }

  #reloadUsersSelect() {
    const users = this.auth.allUsers();
    while (this.$asignado.firstChild) this.$asignado.removeChild(this.$asignado.firstChild);
    for (const u of users) {
      const opt = document.createElement('option');
      opt.value = u.id;
      opt.textContent = `${u.nombre} • ${u.email}`;
      this.$asignado.appendChild(opt);
    }
    const me = users.find(u => u.id === this.currentUser.id);
    if (me) this.$asignado.value = me.id;
  }

  #renderAll() {
    const tasks = this.repo.list();
    const users = this.auth.allUsers();
    const usersMap = new Map(users.map(u => [u.id, u]));

    this.ui.renderTasks(tasks, usersMap);

    const stats = new StatsService(tasks, users);
    this.ui.renderStats({
      percentCompleted: stats.percentCompleted(),
      byState: stats.byState(),
      byUser: stats.byUser(),
    });
  }

  #openCreate() {
    this.$taskId.value = '';
    this.$titulo.value = '';
    this.$desc.value = '';
    this.$vence.value = '';
    this.$estado.value = 'pendiente';
    this.#reloadUsersSelect();
    document.getElementById('taskModalLabel').textContent = 'Nueva tarea';
    this.modal.show();
  }

  #openEdit(id) {
    const t = this.repo.get(id);
    if (!t) return;
    this.$taskId.value = t.id;
    this.$titulo.value = t.titulo;
    this.$desc.value = t.descripcion || '';
    this.$vence.value = t.venceEn || '';
    this.$estado.value = t.estado;
    this.#reloadUsersSelect();
    this.$asignado.value = t.asignadoA;

    document.getElementById('taskModalLabel').textContent = 'Editar tarea';
    this.modal.show();
  }

  #delete(id) {
    if (!confirm('¿Eliminar esta tarea?')) return;
    try {
      this.repo.remove(id);
      showToast('Eliminada', 'La tarea fue borrada', 'warning');
      this.#renderAll();
    } catch (err) {
      showToast('Error', err.message, 'danger');
    }
  }

  #move(id, newState) {
    try {
      this.repo.update(id, { estado: newState });
      this.#renderAll();
    } catch (err) {
      showToast('Error', err.message, 'danger');
    }
  }

  async #seed() {
    try {
      const users = this.auth.allUsers();
      if (users.length < 2) {
        const extra = [
          { nombre: 'Ana', email: 'ana@example.com' },
          { nombre: 'Luis', email: 'luis@example.com' },
        ];
        for (const u of extra) {
          try { this.auth.register(u); } catch {}
        }
      }

      const api = this.api; 
      const raw = await api.getInitialTasks();

      const allUsers = this.auth.allUsers();
      const ids = allUsers.map(u => u.id);
      for (const r of raw) {
        if (!r.asignadoA && ids.length) {
          r.asignadoA = ids[Math.floor(Math.random()*ids.length)];
        }
      }

      const added = this.repo.seed(raw);
      showToast('Importadas', `${added} tareas agregadas desde MockAPI`, 'success');
      this.#renderAll();
    } catch (err) {
      showToast('Error', err.message, 'danger');
    }
  }
}