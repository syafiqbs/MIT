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
                res.status(422).json({
                    "message": "Failed, wallet not created"
                });  
            }
        }
    })
});

// delete 1 wallet and all transactions
router.delete('/wallet/:address', function (req, res) {
    // retrieve address specified in the req params
    const address = req.params.address;

    // deletes all transactions relating to wallet address
    connection.query(`DELETE FROM transaction where wallet_address="${address}"`);

    connection.query(`DELETE FROM wallet where address="${address}"`, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).json({
                "message": "Server error",
                "error": err
            });
        } else {
            if (Number(result.affectedRows) == 1) {
                console.log(`Wallet "${address}" deleted`);
                res.status(200).json({
                    "message": "Success, wallet deleted",
                    "address": address
                });  
            } else {
                res.status(404).json({
                    "message": "Failed, wallet not deleted"
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

// get all transactions for 1 wallet using its address in descending order (latest to oldest)
router.get('/transaction/:address', function (req, res) {
    const address = req.params.address;
    connection.query(`SELECT transaction_id, datetime_retrieved FROM transaction WHERE wallet_address='${address}' ORDER BY datetime_retrieved DESC`, function (err, result) {
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
                res.status(200).json({
                    "message": "Success, transactions found",
                    "transaction": result
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
    connection.query(`INSERT into transaction (transaction_id, wallet_address) VALUES ("${transactionId}", "${address}")`, function (err, result) {
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

// delete 1 transaction using its transaction ID
router.delete('/transaction/:transaction_id', function (req, res) {
    // retrieve address specified in the req params
    const transaction_id = req.params.transaction_id;

    // deletes all transactions relating to wallet address
    connection.query(`DELETE FROM transaction where transaction_id="${transaction_id}"`, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).json({
                "message": "Server error",
                "error": err
            });
        } else {
            if (Number(result.affectedRows) == 1) {
                console.log(`Transaction "${transaction_id}" deleted`);
                res.status(200).json({
                    "message": "Success, transaction deleted",
                    "transaction_id": transaction_id
                });  
            } else {
                res.status(404).json({
                    "message": "Failed, transaction not deleted"
                });  
            }
        }
    })
});

// get all addresses tracked by 1 chat using its ID
router.get('/chat-wallet/address/:chat_id', function (req, res) {
    const chat_id = req.params.chat_id;
    connection.query(`SELECT address FROM chat_wallet WHERE chat_id='${chat_id}'`, function (err, result) {
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
                    "message": "Failed, no addresses found"
                });

            } else {
                res.status(200).json({
                    "message": "Success, addresses found",
                    "address": result
                });   
            }
        }
    })
});

// get all chats tracking 1 wallet using its address
router.get('/chat-wallet/chat-id/:address', function (req, res) {
    const address = req.params.address;
    connection.query(`SELECT chat_id FROM chat_wallet WHERE address='${address}'`, function (err, result) {
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
                    "message": "Failed, no chats found"
                });

            } else {
                res.status(200).json({
                    "message": "Success, chats found",
                    "chat": result
                });   
            }
        }
    })
});

app.listen(8080, function () {
    console.log('Node app is being served on port: 8080')
})

module.exports = app;