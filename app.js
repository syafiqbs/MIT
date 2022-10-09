const express = require('express');
const connection = require('./database.js');
const cors = require('cors');

const app = express();
const router = express.Router();

app.use(express.json());
app.use("/", router);
app.use(cors());

// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World!');
// }).listen(8080);

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// TO-DO:
// - validate input, return bad request

// get all wallets
router.get('/wallet', function (req, res) {
    connection.query('SELECT * FROM wallet', function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).json({
                "message": "Server error",
                "error": err
            });
        } else {
            if (!Array.isArray(result) || !result.length) {
                // array does not exist, is not an array, or is empty
                res.status(404).json({
                    "message": "Failed, no wallets found"
                });
            } else {
                array = [];
                for (const response of result) {
                    array.push(response.address);
                }

                res.status(200).json({
                    "message": "Success, wallets found",
                    "address": array
                });   
            }
        }
    })
});

// get 1 wallet using its address
router.get('/wallet/:address', function (req, res) {
    // retrieve address specified in the req params
    const address = req.params.address;

    connection.query(`SELECT * FROM wallet WHERE address='${address}'`, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).json({
                "message": "Server error",
                "error": err
            });
        } else {
            if (!Array.isArray(result) || !result.length) {
                // array does not exist, is not an array, or is empty
                res.status(404).json({
                    "message": "Failed, no wallet found"
                });
            } else {
                res.status(200).json({
                    "message": "Success, wallet found",
                    "address": result[0].address
                });   
            }
        }
    })
});

// insert 1 wallet
router.post('/wallet', function (req, res) {
    // console.log(req.body.address);
    const address = req.body.address; 
    connection.query(`INSERT into wallet VALUES ("${address}")`, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).json({
                "message": "Server error",
                "error": err
            });
        } else {
            if (Number(result.affectedRows) == 1) {
                console.log(`New wallet "${address}" created`);
                res.status(201).json({
                    "message": "Success, wallet created",
                    "address": address
                });  
            } else {
                res.status(500).json({
                    "message": "Failed, wallet not created"
                });  
            }
        }
    })
});

// get all transactions
router.get('/transaction', function (req, res) {
    connection.query('SELECT * FROM transaction', function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).json({
                "message": "Server error",
                "error": err
            });
        } else {
            if (!Array.isArray(result) || !result.length) {
                // array does not exist, is not an array, or is empty
                res.status(404).json({
                    "message": "Failed, no transactions found"
                });
            } else {
                res.status(200).json({
                    "message": "Success, transactions found",
                    "transaction": result
                });   
            }
        }
    })
});

// get all transactions for 1 wallet using its address
router.get('/transaction/:address', function (req, res) {
    const address = req.params.address;
    connection.query(`SELECT transaction_id FROM transaction WHERE wallet_address='${address}'`, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).json({
                "message": "Server error",
                "error": err
            });
        } else {
            if (!Array.isArray(result) || !result.length) {
                // array does not exist, is not an array, or is empty
                res.status(404).json({
                    "message": "Failed, no transaction found"
                });

                // insert new wallet into db, call solanafm api and insert into db
                res.redirect('/dashboard')

            } else {
                array = [];
                for (const response of result) {
                    array.push(response.transaction_id);
                }

                res.status(200).json({
                    "message": "Success, transactions found",
                    "transaction": array
                });   
            }
        }
    })
});

// insert 1 transaction
router.post('/transaction', function (req, res) {
    // address MUST exist in wallet table first because foreign key constraint
    const address = req.body.address;
    const transactionId = req.body.transaction_id; 
    connection.query(`INSERT into transaction VALUES ("${transactionId}", "${address}")`, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).json({
                "message": "Server error",
                "error": err
            });
        } else {
            if (Number(result.affectedRows) == 1) {
                console.log(`New transaction "${transactionId}" created`);
                res.status(201).json({
                    "message": "Success, transaction created",
                    "transaction_id": transactionId,
                    "wallet_address": address
                });  
            } else {
                res.status(500).json({
                    "message": "Failed, transaction not created"
                });  
            }
        }
    })
});

app.listen(8080, function () {
    console.log('Node app is being served on port: 8080')
})

module.exports = app;