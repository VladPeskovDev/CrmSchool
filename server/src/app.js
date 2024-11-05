const express = require('express');
const morgan = require('morgan');
const lessonsRouter = require('./routes/lessonsRouter');

const app = express();




app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/lessons', lessonsRouter);

module.exports = app;