const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',  
  database: 'todolist'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// POST /tasks - Create a new task
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const sql = 'INSERT INTO tasks (title, description) VALUES (?, ?)';
  db.query(sql, [title, description], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(201).json({
      id: result.insertId,
      title,
      description,
      completed: false,
      created_at: new Date()
    });
  });
});


app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});



app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  const sql = 'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?';
  db.query(sql, [title, description, completed, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Task not found' });

    res.status(200).json({ id: Number(id), title, description, completed });
  });
});


app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM tasks WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Task not found' });

    res.status(204).send();
  });
});


app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
