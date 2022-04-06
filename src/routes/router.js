const express = require('express')
const router = express.Router()

const stocksRouter = require('../resources/stocks/stocks_router');

router.use('/stocks', stocksRouter);
module.exports = router;