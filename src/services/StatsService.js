export class StatsService {
  constructor(tasks, users) {
    this.tasks = tasks;
    this.users = users;
  }

  percentCompleted() {
    const total = this.tasks.length || 1;
    const done = this.tasks.filter(t => t.estado === 'completada').length;
    return Math.round((done / total) * 100);
  }

  byState() {
    return {
      pendiente: this.tasks.filter(t => t.estado === 'pendiente').length,
      en_progreso: this.tasks.filter(t => t.estado === 'en_progreso').length,
      completada: this.tasks.filter(t => t.estado === 'completada').length,
    };
  }

  byUser() {
    const map = new Map();
    for (const u of this.users) map.set(u.id, { user: u, count: 0 });
    for (const t of this.tasks) {
      if (map.has(t.asignadoA)) map.get(t.asignadoA).count++;
    }
    return Array.from(map.values())
      .sort((a,b) => b.count - a.count);
  }
}