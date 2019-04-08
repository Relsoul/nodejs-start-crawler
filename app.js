const express = require('express');
const app = express();

app.listen(8878, () => console.log('Example app listening on port 8878!'));

const mainFunc = require('./app/main.js');

mainFunc(app);
