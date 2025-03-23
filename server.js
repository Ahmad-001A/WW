const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'users.json');

app.use(cors());
app.use(express.json());

// Функция загрузки данных
const loadUsers = () => {
    if (fs.existsSync(DATA_FILE)) {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
    return [];
};

// Функция сохранения данных
const saveUsers = (users) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
};

// Получение всех пользователей
app.get('/users', (req, res) => {
    res.json(loadUsers());
});

// Регистрация нового пользователя
app.post('/register', (req, res) => {
    const { instagram, site, password } = req.body;
    if (!instagram || !password) {
        return res.status(400).json({ error: 'Все поля обязательны!' });
    }

    const users = loadUsers();
    users.push({ instagram, site, password, date: new Date().toISOString() });
    saveUsers(users);

    res.json({ message: 'Пользователь зарегистрирован!' });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер работает на порту ${PORT}`);
});
