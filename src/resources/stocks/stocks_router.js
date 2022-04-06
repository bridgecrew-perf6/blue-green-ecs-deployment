const express = require('express');
const stocksRouter = express.Router()
const stocksController = require('./stocks_controller');

stocksRouter.route('/').get(stocksController.getStocks);
stocksRouter.route('/').post(stocksController.addStock);
module.exports = stocksRouter;