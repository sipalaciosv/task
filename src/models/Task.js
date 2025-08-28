export class Task {
    constructor({ id, titulo, descripcion = '', estado = 'pendiente', asignadoA, creadaEn = new Date().toISOString(), venceEn = null }) {
        this.id = id; 
        this.titulo = titulo; 
        this.descripcion = descripcion; 
        this.estado = estado;
        this.asignadoA = asignadoA; 
        this.creadaEn = creadaEn; 
        this.venceEn = venceEn; 
    }
}