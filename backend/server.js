const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('db.sqlite');
app.use(bodyParser.json());
app.use(express.static('public'));

require('dotenv').config();

app.use(session({
    secret: process.env.SECRET_KEY,  
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  
}));

app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'splash.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');  
});

app.get('/register', (req,res) => {
    res.sendFile(__dirname + '/register.html');
});

// Database creation
db.serialize( ()=>{      
    db.run(`
        CREATE TABLE IF NOT EXISTS tasks(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            due_date TEXT,
            priority TEXT,
            completed INTEGER DEFAULT 0
        )
        `);
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
       `);
});

// api for adding tasks
app.post('/addTask', (req, res) => {   
    const { title, description, dueDate, priority } = req.body;
    console.log('Adding task:', { title, description, dueDate, priority }); // Log the task data
    db.run(`INSERT INTO tasks (title, description, due_date, priority) VALUES (?, ?, ?, ?)`, [title, description, dueDate, priority], function(error) {
        if (error) {
            console.error('Error inserting task:', error.message);
            return res.status(500).send(error.message);
        }
        //const newTaskId = this.lastID;
        fetchTasks(res);
    });
});

// api for viewing tasks
app.get('/tasks',(req,res)=>{     
    fetchTasks(res);
});

function fetchTasks(res) {
    db.all('SELECT * FROM tasks', (error, rows) => {
        if (error) {
            console.error('Error fetching tasks:', error.message);
            return res.status(500).send(error.message);
        }

        const now = new Date();
        const upcomingTasks = rows.filter(task => {
            const dueDate = new Date(task.due_date);
            const timeDiff = dueDate - now;
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            return hoursDiff <= 24 && hoursDiff > 0;
        })


        console.log('Fetched tasks:', rows); 
        res.json({ tasks: rows, upcomingTasks });
    });
}

// api for deleting tasks
app.post('/deleteTask', (req, res) => {   
    const { id } = req.body;
    db.run(`DELETE FROM tasks WHERE id = ?`, [id], function(error) {
      if (error) {
        return res.status(500).send(error.message);
      }
      fetchTasks(res);
    });
  });

// api for editing tasks
app.get('/task/:id', (req, res) => {   
    const taskId = req.params.id;
    db.get('SELECT * FROM tasks WHERE id = ?', [taskId], (error, row) => {
        if (error) {
            console.error('Error fetching task:', error.message);
            return res.status(500).send(error.message);
        }
        res.json(row);
    });
});

// api for updating tasks
app.post('/updateTask', (req, res) => {      
    const { id, title, description, dueDate, priority } = req.body;
    db.run('UPDATE tasks SET title = ?, description = ?, due_date = ?, priority = ? WHERE id = ?', 
        [title, description, dueDate, priority, id], function(error) {
        if (error) {
            console.error('Error updating task:', error.message);
            return res.status(500).send(error.message);
        }
        fetchTasks(res);
    });
});

// api for task cpmpletion
app.post('/markCompleted', (req,res) =>{    
    const {id} = req.body;
    db.run('UPDATE tasks SET completed = 1 WHERE id=?', [id], function(error){
        if(error){
            console.error('Error marking task as completed:', error.message);
            return res.status(500).send(error.message);
        }
        fetchTasks(res);
    });
});

// api for user registration
app.post('/register', (req,res) => {  
    const {username, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password,10);
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function(error) {
        if (error) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }
        res.json({ success: true});
    });
});

// api for user login
app.post('/login', (req,res) =>{  
    const {username, password} = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], (error,user)=>{
        if(error||!user||!bcrypt.compareSync(password,user.password)){
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        req.session.userId = user.id;
        req.session.username = user.username;
        return res.status(200).json({success:true});
    });
});

function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
}

app.get('/app.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'app.html'));
});

// api for task search
app.get('/searchTasks', (req,res) => {   
    const query = `%${req.query.query}%`;
    db.all('SELECT * FROM tasks WHERE title LIKE ? OR description LIKE ?', [query, query], (error, rows) => {
        if (error) {
            console.error('Error searching tasks:', error.message);
            return res.status(500).send(error.message);
        }
        res.json({ tasks: rows });
    });
});


module.exports = {app,db};

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});