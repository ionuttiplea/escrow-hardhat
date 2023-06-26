const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const escrows = [];

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/getContracts', function (req, res) {
    res.end( JSON.stringify(escrows) );
});

app.post('/postContract', function (req, res) {
    escrows.push(req.body);
    res.end(JSON.stringify(escrows));
});

app.post('/approve', function (req, res) {
    escrows.forEach( escrow => {
        if( escrow.address === req.body.address ) {
            escrow.approved = true;
            res.end('Approved');
        }
    })
});

const server = app.listen(8081, function() {
    const host = server.address().address;
    const port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});