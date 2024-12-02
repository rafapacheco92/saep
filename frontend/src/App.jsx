import React, { useState, useEffect } from "react";
import Card from './components/Card';

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [novoUsuario, setNovoUsuario] = useState({ nome: '', email: '' });
  const [novaTarefa, setNovaTarefa] = useState({
    descricao: '',
    nome_setor: '',
    prioridade: 'baixa',
    usuario_id: '',
  });

  // Função para buscar as tarefas
  const fetchTarefas = async () => {
    try {
      const response = await fetch("http://localhost:3000/tarefas");
      const data = await response.json();
      if (Array.isArray(data)) {
        setTarefas(data);
      } else {
        console.error("Erro ao buscar tarefas. Dados inválidos.");
        setTarefas([]);  // Caso a resposta não seja um array válido
      }
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      setTarefas([]);  // Garantir que o estado seja um array vazio em caso de erro
    }
  };

  // Função para buscar os usuários
  const fetchUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:3000/usuarios");
      const data = await response.json();
      if (Array.isArray(data)) {
        setUsuarios(data);
      } else {
        console.error("Erro ao buscar usuários. Dados inválidos.");
        setUsuarios([]);
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setUsuarios([]);  // Garantir que o estado seja um array vazio em caso de erro
    }
  };

  useEffect(() => {
    fetchTarefas();
    fetchUsuarios();
  }, []);

  // Função para cadastrar um novo usuário
  const cadastrarUsuario = async () => {
    if (!novoUsuario.nome || !novoUsuario.email) {
      alert("Todos os campos de usuário são obrigatórios!");
      return;
    }
    try {
      await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoUsuario),
      });
      setNovoUsuario({ nome: '', email: '' });
      fetchUsuarios();
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
    }
  };

  // Função para cadastrar uma nova tarefa
  const cadastrarTarefa = async () => {
    if (!novaTarefa.descricao || !novaTarefa.nome_setor || !novaTarefa.usuario_id) {
      alert("Todos os campos de tarefa são obrigatórios!");
      return;
    }
    try {
      await fetch("http://localhost:3000/tarefas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaTarefa),
      });
      setNovaTarefa({ descricao: '', nome_setor: '', prioridade: 'baixa', usuario_id: '' });
      fetchTarefas();
    } catch (error) {
      console.error("Erro ao cadastrar tarefa:", error);
    }
  };

  return (
    <div>
      <h1>Gerenciador de Tarefas</h1>

      <div className="form">
        <h2>Cadastrar Usuário</h2>
        <input
          type="text"
          placeholder="Nome"
          value={novoUsuario.nome}
          onChange={(e) => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
        />
        <input
          type="email"
          placeholder="E-mail"
          value={novoUsuario.email}
          onChange={(e) => setNovoUsuario({ ...novoUsuario, email: e.target.value })}
        />
        <button onClick={cadastrarUsuario}>Cadastrar Usuário</button>
      </div>

      <div className="form">
        <h2>Cadastrar Tarefa</h2>
        <input
          type="text"
          placeholder="Descrição"
          value={novaTarefa.descricao}
          onChange={(e) => setNovaTarefa({ ...novaTarefa, descricao: e.target.value })}
        />
        <input
          type="text"
          placeholder="Setor"
          value={novaTarefa.nome_setor}
          onChange={(e) => setNovaTarefa({ ...novaTarefa, nome_setor: e.target.value })}
        />
        <select
          value={novaTarefa.prioridade}
          onChange={(e) => setNovaTarefa({ ...novaTarefa, prioridade: e.target.value })}
        >
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>
        <select
          value={novaTarefa.usuario_id}
          onChange={(e) => setNovaTarefa({ ...novaTarefa, usuario_id: e.target.value })}
        >
          <option value="">Selecione um usuário</option>
          {Array.isArray(usuarios) && usuarios.map((usuario) => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.nome}
            </option>
          ))}
        </select>
        <button onClick={cadastrarTarefa}>Cadastrar Tarefa</button>
      </div>

      <div className="container">
        {["a_fazer", "fazendo", "pronto"].map((status) => (
          <div key={status} className="coluna">
            <h2>{status.replace("_", " ").toUpperCase()}</h2>
            {Array.isArray(tarefas) && tarefas
              .filter((tarefa) => tarefa.status === status)
              .map((tarefa) => (
                <Card
                  key={tarefa.id}
                  tarefa={tarefa}
                  buscarTarefas={fetchTarefas}
                  usuarios={usuarios}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
