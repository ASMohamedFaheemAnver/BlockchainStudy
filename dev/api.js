const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const rp = require("request-promise");

const Blockchain = require("./blockchain");
const requestPromise = require("request-promise");

const app = express();
const bitcoin = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const NODE_ADDRESS = uuidv4().split("-").join("");
const PORT = process.argv[2];

app.get("/blockchain", (req, res) => {
  res.send(bitcoin);
});

app.post("/transaction", (req, res) => {
  const blockIndex = bitcoin.addTransactionToPendingTransactions(req.body);
  return res.json({ note: blockIndex });
});

app.post("/btransaction", (req, res) => {
  const newTransaction = bitcoin.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  bitcoin.addTransactionToPendingTransactions(newTransaction);
  const reqPromises = [];
  bitcoin.networkNotes.forEach((networkNoteUrl) => {
    const requestOptions = {
      uri: networkNoteUrl + "/transaction",
      method: "POST",
      body: newTransaction,
      json: true,
    };
    reqPromises.push(rp(requestOptions));
  });
  Promise.all(reqPromises).then((data) => {
    res.json({ message: "200 OK!" });
  });
});

app.get("/mine", (req, res) => {
  const lastBlock = bitcoin.getLastBlock();
  const previousBlockHash = lastBlock.hash;
  const currentBlockData = {
    transactions: bitcoin.pendingTransactions,
    index: lastBlock.index + 1,
  };
  const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
  const hash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
  bitcoin.createNewTransaction(12.5, "00", NODE_ADDRESS);
  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, hash);
  res.json({
    block: newBlock,
  });
});

app.post("/rnbroadcast", (req, res) => {
  const newNodeUrl = req.body.url;
  if (bitcoin.networkNotes.indexOf(newNodeUrl) == -1) bitcoin.networkNotes.push(newNodeUrl);
  const regNodePromises = [];
  bitcoin.networkNotes.forEach((networkNoteUrl) => {
    const requestOptions = {
      uri: networkNoteUrl + "/register",
      method: "POST",
      body: { url: newNodeUrl },
      json: true,
    };
    regNodePromises.push(rp(requestOptions));
  });
  Promise.all(regNodePromises)
    .then((data) => {
      const bulkRegisterOpetions = {
        uri: newNodeUrl + "/registermn",
        method: "POST",
        body: { urls: [...bitcoin.networkNotes, bitcoin.crurrentNodeUrl] },
        json: true,
      };
      return rp(bulkRegisterOpetions);
    })
    .then((data) => {
      res.json({ message: "200 OK!", urls: bitcoin.networkNotes });
    });
});

app.post("/register", (req, res) => {
  const newNodeUrl = req.body.url;
  if (bitcoin.crurrentNodeUrl !== newNodeUrl) {
    if (bitcoin.networkNotes.indexOf(newNodeUrl) === -1) {
      bitcoin.networkNotes.push(newNodeUrl);
    }
  }
  return res.json({ message: "200 OK!", urls: bitcoin.networkNotes });
});

app.post("/registermn", (req, res) => {
  const allNetworkNodes = req.body.urls;
  bitcoin.networkNotes = allNetworkNodes.filter((url) => {
    return url !== bitcoin.crurrentNodeUrl;
  });
  return res.json({ message: "200 OK!", urls: bitcoin.networkNotes });
});

app.listen(PORT || 3000, () => {
  console.log("Server is up and running!");
});
