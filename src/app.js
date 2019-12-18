var express = require('express');
var app = express();
const todoJSON = require('../build/contracts/TodoList.json')
const truffleContract = require('truffle-contract');

app.use(express.static("./"));

app.get('/', (req,res) => {
    res.send('index.html');
})

app.get('/todoJSON', (req,res) => {
    res.send(todoJSON);
})

app.get('/truffleContract', (req,res) => {
    res.send(truffleContract);
})

app.listen(3000, () => {
    console.log('Server started at 3000');
})