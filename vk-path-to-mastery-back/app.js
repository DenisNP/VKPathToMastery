const PORT = 3000;
const express = require('express');
const firebase = require('./firebase');

// create app
const app = express();
app.use(express.json());
firebase.init();

// requests
app.get('/test', async (req, res) => {
    res.send(JSON.stringify(d));
});

// start server
app.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`);
});