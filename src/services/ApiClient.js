export class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl; 
  }

  async getInitialTasks() {
    const url = `${this.baseUrl}/tasks`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.slice(0, 10).map((item) => ({
      id: String(item.id),
      titulo: item.titulo || item.title || `Tarea ${item.id}`,
      descripcion: item.descripcion || item.description || '',
      estado: ['pendiente','en_progreso','completada'][Math.floor(Math.random()*3)],
      asignadoA: item.asignadoA || null,
      creadaEn: item.creadaEn || new Date().toISOString(),
      venceEn: item.venceEn || null,
    }));
  }
}