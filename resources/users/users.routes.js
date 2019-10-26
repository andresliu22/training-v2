const express = require('express')
const uuidv4 = require('uuid/v4');

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken');

let users = require('../../db').users;
const logger = require('../lib/logger');

const usersRoutes = express.Router()

usersRoutes.get('/', (req, res) => {
  res.json(users);
  logger.info('Se obtuvieron todos los usuarios);
});

usersRoutes.post('/', (req, res) => {
  const hp = bcrypt.hashSync(req.body.password, 10)

  const newUser = { ...req.body, id: uuidv4(), password: hp };

  users.push(newUser);
  res.json(newUser);
  logger.info('Se agrego el usuario ' + newUser.name);
})

usersRoutes.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = users.filter(user => user.username === username)[0]

  const isAuthenticated = bcrypt.compareSync(password, user.password);

  if (isAuthenticated) {
    const token = jwt.sign({ id: user.id }, 'SECRET_KEY', { expiresIn: '10h' })

    res.json({ token })
    logger.info('Se inicio sesion correctamente');
  } else {
    logger.info('Error al iniciar sesion');
    res.status(401).send('Verifica tu password');
  }
})


module.exports = usersRoutes;
