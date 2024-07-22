// app.js
const express = require('express');
const app = express();

app.use(express.json());

const notesRouter = require('./routes/notes');
app.use('/notes', notesRouter);

module.exports = app;
