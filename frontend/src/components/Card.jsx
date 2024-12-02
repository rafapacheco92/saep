import React, { useState } from 'react';

function Card({ tarefa, buscarTarefas, usuarios }) {
  const [editedTarefa, setEditedTarefa] = useState({ ...tarefa });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const alterarStatus = async (novoStatus) => {
    await fetch(`http://localhost:3000/tarefas/${tarefa.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: novoStatus }),
    });
    buscarTarefas();
  };

  const editarTarefa = async () => {
    await fetch(`http://localhost:3000/tarefas/${tarefa.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedTarefa),
    });
    buscarTarefas();
    setIsEditModalOpen(false);
  };

  const deletarTarefa = async () => {
    const confirmed = window.confirm('Tem certeza de que deseja deletar esta tarefa?');
    if (confirmed) {
      await fetch(`http://localhost:3000/tarefas/${tarefa.id}`, { method: 'DELETE' });
      buscarTarefas();
    }
  };

  return (
    <div className="card">
      <h3>{tarefa.descricao}</h3>
      <p><strong>Setor:</strong> {tarefa.nome_setor}</p>
      <p><strong>Prioridade:</strong> {tarefa.prioridade}</p>
      <p>
        <strong>Usuário:</strong> {usuarios.find((u) => u.id === tarefa.usuario_id)?.nome || 'N/A'}
      </p>
      <p><strong>Status:</strong> {tarefa.status}</p>

      <div className="acoes">
        {['a_fazer', 'fazendo', 'pronto'].map((novoStatus) => (
          <button
            key={novoStatus}
            onClick={() => alterarStatus(novoStatus)}
            disabled={tarefa.status === novoStatus}
          >
            {novoStatus.replace('_', ' ')}
          </button>
        ))}
        <button onClick={() => setIsEditModalOpen(true)}>Editar</button>
        <button onClick={deletarTarefa}>Excluir</button>
      </div>

      {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar Tarefa</h2>
            <input
              value={editedTarefa.descricao}
              onChange={(e) => setEditedTarefa({ ...editedTarefa, descricao: e.target.value })}
              placeholder="Descrição"
            />
            <input
              value={editedTarefa.nome_setor}
              onChange={(e) => setEditedTarefa({ ...editedTarefa, nome_setor: e.target.value })}
              placeholder="Setor"
            />
            <select
              value={editedTarefa.prioridade}
              onChange={(e) => setEditedTarefa({ ...editedTarefa, prioridade: e.target.value })}
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
            <button onClick={editarTarefa}>Salvar</button>
            <button onClick={() => setIsEditModalOpen(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;
