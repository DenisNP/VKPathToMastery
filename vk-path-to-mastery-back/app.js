const PORT = 3000;
const express = require('express');
const cors = require('cors');
const qs = require('querystring');
const crypto = require('crypto');
const handler = require('./handler');

// create app
const app = express();
app.use(express.json());
app.use(cors());
handler.init();

// static
app.use('/', express.static(path.join(__dirname, 'dist')));

// requests
app.get('/test', async (req, res) => {
    res.send('It works!');
});

app.post('/getUser/:userId', async (req, res) => {
    res.header('Content-Type', 'application/json');
    if (!checkParams(req.body)) res.send('{}');
    else res.send(await handler.getUser(req.params.userId));
});

app.post('/createEditPath/:userId', async (req, res) => {
    res.header('Content-Type', 'application/json');
    if (!checkParams(req.body)) res.send('{}');
    else res.send(await handler.createEditPath(req.params.userId, req.body));
});

app.post('/deletePath/:userId', async (req, res) => {
    res.header('Content-Type', 'application/json');
    if (!checkParams(req.body)) res.send('{}');
    else res.send(await handler.deletePath(req.params.userId, req.body));
});

app.post('/setDone/:userId', async (req, res) => {
    res.header('Content-Type', 'application/json');
    if (!checkParams(req.body)) res.send('{}');
    else res.send(await handler.setDone(req.params.userId, req.body));
});

app.post('/generateDemo/:userId', async (req, res) => {
    res.header('Content-Type', 'application/json');
    if (!checkParams(req.body)) res.send('{}');
    else res.send(await handler.generateDemo(req.params.userId, req.body));
});

const checkParams = ({ params, userId }) => {
    const urlParams = qs.parse(params);
    const ordered = {};
    Object.keys(urlParams).sort().forEach((key) => {
        if (key.slice(0, 3) === 'vk_') {
            ordered[key] = urlParams[key];
        }
    });

    const stringParams = qs.stringify(ordered);
    const paramsHash = crypto
        .createHmac('sha256', process.env.VK_PATH_TO_MASTERY_SECRET)
        .update(stringParams)
        .digest()
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=$/, '');

    return paramsHash === urlParams.sign && userId === ordered['vk_user_id'];
};

// start server
app.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`);
});
