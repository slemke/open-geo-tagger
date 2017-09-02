const express = require('express')
const app = express()


app.use('/static', express.static(__dirname + '/assets'));
app.use(require('./modules'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});
