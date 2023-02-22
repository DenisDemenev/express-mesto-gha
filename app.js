const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const NOT_FOUND = 404;

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => console.log('Успешное подключение к БД'))
  .catch((err) => console.log(`Ошибка подключения к БД: ${err}`));

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '63f459b22bd6a28d2c1da224',
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен, порт: ${PORT}`);
});
