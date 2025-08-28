import { storage } from '../../utils/storage.js';
import { Task } from '../models/Task.js';

export class TaskRepository {
  constructor() {
    this.state = storage.load();
  }

  #persist() { storage.save(this.state); }

  list() {
    this.state = storage.load();
    return this.state.tasks.map(t => new Task(t));
  }

  get(id) {
    this.state = storage.load();
    const found = this.state.tasks.find(t => t.id === id);
    return found ? new Task(found) : null;
  }

  create({ titulo, descripcion, asignadoA, venceEn, estado = 'pendiente' }) {
    if (!titulo || titulo.trim().length < 3) throw new Error('Título inválido');
    if (!asignadoA) throw new Error('Falta asignatario');
    const task = new Task({ id: crypto.randomUUID(), titulo: titulo.trim(), descripcion: (descripcion||'').trim(), asignadoA, venceEn: venceEn || null, estado });
    this.state.tasks.push(task);
    this.#persist();
    return task;
  }

  update(id, patch) {
    const idx = this.state.tasks.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('No encontrada');
    const updated = { ...this.state.tasks[idx], ...patch };
    this.state.tasks[idx] = updated;
    this.#persist();
    return new Task(updated);
  }

  remove(id) {
    const before = this.state.tasks.length;
    this.state.tasks = this.state.tasks.filter(t => t.id !== id);
    if (this.state.tasks.length === before) throw new Error('No encontrada');
    this.#persist();
  }

  seed(tasksArray = []) {
    const existingIds = new Set(this.state.tasks.map(t => t.id));
    const toAdd = tasksArray.filter(t => t && !existingIds.has(t.id)).map(t => new Task(t));
    this.state.tasks.push(...toAdd);
    this.#persist();
    return toAdd.length;
  }
}