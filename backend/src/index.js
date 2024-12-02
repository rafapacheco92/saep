const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tarefas',
  password: 'senai',
  port: 5432,
});

app.use(cors());
app.use(express.json());

app.post('/usuario', async (req, res) => {
  const { nome, email } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO usuario (nome, email) VALUES ($1, $2) RETURNING *',
      [nome, email]
    );
    res.status(201).json(result.rows[0]); // Retorna o usuário criado
  } catch (error) {
    console.error('Erro ao criar usuário:', error.message);
    res.status(500).json({ error: 'Erro ao criar usuário.' });
  }
});

app.get('/usuario', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuario');
    res.json(result.rows); // Retorna todos os usuários
  } catch (error) {
    console.error('Erro ao buscar usuários:', error.message);
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
});

app.post('/tarefa', async (req, res) => {
  const { descricao, nome_setor, prioridade, usuario_id } = req.body;

  // Verificar se os campos necessários estão presentes
  if (!descricao || !nome_setor || !prioridade || !usuario_id) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO tarefa (descricao, nome_setor, prioridade, usuario_id, status) 
       VALUES ($1, $2, $3, $4, 'a_fazer') RETURNING *`,
      [descricao, nome_setor, prioridade, usuario_id]
    );
    res.status(201).json(result.rows[0]); // Retorna a tarefa criada
  } catch (error) {
    console.error('Erro ao criar tarefa:', error.message);
    res.status(500).json({ error: 'Erro ao criar tarefa.' });
  }
});

app.get('/tarefa', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tarefa');
    res.json(result.rows); // Retorna todas as tarefas
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error.message);
    res.status(500).json({ error: 'Erro ao buscar tarefas.' });
  }
});

app.put('/tarefa/:id', async (req, res) => {
  const { id } = req.params;
  const { prioridade, status } = req.body;

  if (!prioridade && !status) {
    return res.status(400).json({ error: 'Nada para atualizar!' });
  }

  try {
    const tarefaExistente = await pool.query('SELECT * FROM tarefa WHERE id = $1', [id]);
    if (!tarefaExistente.rows.length) {
      return res.status(404).json({ error: 'Tarefa não encontrada!' });
    }

    const updatedTarefa = await pool.query(
      `UPDATE tarefa 
       SET prioridade = COALESCE($1, prioridade), 
           status = COALESCE($2, status) 
       WHERE id = $3 RETURNING *`,
      [prioridade, status, id]
    );
    res.json(updatedTarefa.rows[0]); // Retorna a tarefa atualizada
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error.message);
    res.status(500).json({ error: 'Erro ao atualizar tarefa.' });
  }
});

app.delete('/tarefa/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const tarefaExistente = await pool.query('SELECT * FROM tarefa WHERE id = $1', [id]);
    if (!tarefaExistente.rows.length) {
      return res.status(404).json({ error: 'Tarefa não encontrada!' });
    }

    await pool.query('DELETE FROM tarefa WHERE id = $1', [id]);
    res.json({ message: 'Tarefa deletada com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error.message);
    res.status(500).json({ error: 'Erro ao deletar tarefa.' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
