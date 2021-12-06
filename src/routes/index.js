const express = require('express');
const productsRouter = require ('./productsRouter');
const suppliersRouter = require ('./suppliersRouter');

const router = express.Router();

router.use('/products', productsRouter);
router.use('/proveedores', suppliersRouter);

module.exports = router;