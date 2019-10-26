const express = require('express')
const uuidv4 = require('uuid/v4');


const validateProduct = require('./products.validate');

let products = require('../../db').products;
const logger = require('../lib/logger');
const productsRoutes = express.Router()

productsRoutes.get('/', (req, res) => {
  res.json(products);
  logger.info('Se obtuvieron todos los productos');
});

productsRoutes.post('/', validateProduct, (req, res) => {
  const newProduct = { ...req.body, id: uuidv4() };
  products.push(newProduct);
  res.json(newProduct);
  logger.info('Se agrego nuevo producto ' + newProduct.name);
})

///products/098as908asd098asd089
productsRoutes.put('/:id', (req, res) => {
  const filterProduct = products.filter(product => product.id === req.params.id)[0];

  const updatedProduct = { ...filterProduct, ...req.body  };

  res.json(updatedProduct);
  logger.info('Producto ' + updatedProduct.name + ' se ha modificado');
})

// DESTROY

productsRoutes.delete('/:id', (req, res) => {
  const filterProduct = products.filter(product => product.id === req.params.id)[0];

  const productsWithoutSelected = products.filter(product => product.id !== req.params.id)[0];

  products = productsWithoutSelected;

  res.json(filterProduct);
  logger.info('Se ha eliminado el producto ' + filterProduct.name);
});


module.exports = productsRoutes;
