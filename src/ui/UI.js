import { TPL } from './templates.js';

export class UI {
  constructor({ onEdit, onDelete, onDragStateChange }) {
    this.onEdit = onEdit;
    this.onDelete = onDelete;
    this.onDragStateChange = onDragStateChange;

    this.cols = {
      pendiente: document.getElementById('col-pendiente'),
      en_progreso: document.getElementById('col-en_progreso'),
      completada: document.getElementById('col-completada'),
    };

    this.#setupDnD();
  }

  #setupDnD() {
    const droptargets = document.querySelectorAll('.droptarget');
    droptargets.forEach(dt => {
      dt.addEventListener('dragover', (e) => {
        e.preventDefault();
        dt.classList.add('over');
      });
      dt.addEventListener('dragleave', () => dt.classList.remove('over'));
      dt.addEventListener('drop', (e) => {
        e.preventDefault();
        dt.classList.remove('over');
        const id = e.dataTransfer.getData('text/plain');
        const newState = dt.dataset.estado;
        this.onDragStateChange(id, newState);
      });
    });
  }

  renderTasks(tasks, usersMap) {
    for (const state of Object.keys(this.cols)) {
      const col = this.cols[state];
      while (col.firstChild) col.removeChild(col.firstChild);
    }

    const fragByState = {
      pendiente: document.createDocumentFragment(),
      en_progreso: document.createDocumentFragment(),
      completada: document.createDocumentFragment(),
    };

    for (const t of tasks) {
      const node = TPL.taskCard.content.firstElementChild.cloneNode(true);
      node.dataset.id = t.id;

      node.classList.add(`state-${t.estado}`);
      node.setAttribute('title', `Estado: ${t.estado.replace('_',' ')}`);

      node.querySelector('.task-title').textContent = t.titulo;
      node.querySelector('.task-desc').textContent = t.descripcion || '';

      const u = usersMap.get(t.asignadoA);
      node.querySelector('.assign-badge').textContent = u ? `@${u.nombre}` : 'Sin asignar';
      node.querySelector('.due-badge').textContent = t.venceEn ? `Vence: ${t.venceEn}` : 'Sin fecha';

      node.querySelector('.btn-edit').addEventListener('click', () => this.onEdit(t.id));
      node.querySelector('.btn-del').addEventListener('click', () => this.onDelete(t.id));

      node.addEventListener('dragstart', (e) => {
        node.classList.add('dragging');
        e.dataTransfer.setData('text/plain', t.id);
      });
      node.addEventListener('dragend', () => node.classList.remove('dragging'));

      fragByState[t.estado].appendChild(node);
    }

    for (const state of Object.keys(this.cols)) {
      this.cols[state].appendChild(fragByState[state]);
    }
  }

  renderStats({ percentCompleted, byState, byUser }) {
  const area = document.getElementById('statsArea');
  while (area.firstChild) area.removeChild(area.firstChild);

  const top = byUser[0] || null;

  const items = [
    { key: 'percent', title: '% Completadas', sub: 'Sobre el total', val: `${percentCompleted}%` },
    { key: 'bystate', title: 'Por estado', sub: 'P / IP / C', val: `${byState.pendiente} / ${byState.en_progreso} / ${byState.completada}` },
    { key: 'top',      title: 'Top usuario', sub: top ? top.user.nombre : '—', val: top ? `${top.count}` : '—', compact: true },
  ];

  for (const it of items) {
    const card = TPL.statCard.content.firstElementChild.cloneNode(true);
    if (it.compact) card.classList.add('stat-compact');  

    card.querySelector('.stat-title').textContent = it.title;
    card.querySelector('.stat-sub').textContent = it.sub;
    card.querySelector('.stat-value').textContent = it.val;

    area.appendChild(card);
  }
}

}
