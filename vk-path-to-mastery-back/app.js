const PORT = 3000;
const express = require('express');
const cors = require('cors');
const handler = require('./handler');

// create app
const app = express();
app.use(express.json());
app.use(cors());
handler.init();

// requests
app.get('/test', async (req, res) => {
    res.send('It works!');
});

app.post('/getUser/:userId', async (req, res) => {
    res.header('Content-Type', 'application/json');
    res.send(await handler.getUser(req.params.userId));
});

app.post('/createEditPath/:userId', async (req, res) => {
    res.header('Content-Type', 'application/json');
    res.send(await handler.createEditPath(req.params.userId, req.body));
});

app.post('/deletePath/:userId', async (req, res) => {
    res.header('Content-Type', 'application/json');
    res.send(await handler.deletePath(req.params.userId, req.body));
});

app.post('/setDone/:userId', async (req, res) => {
    res.header('Content-Type', 'application/json');
    res.send(await handler.setDone(req.params.userId, req.body));
});

// start server
app.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`);
});
