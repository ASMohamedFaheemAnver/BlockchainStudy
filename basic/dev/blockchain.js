const sha256 = require("sha256");
const { v4: uuidv4 } = require("uuid");
const CURRENT_NODE_URL = process.argv[3];

function Blockchain() {
  this.chain = [];
  this.pendingTransactions = [];
  this.crurrentNodeUrl = CURRENT_NODE_URL;
  this.networkNotes = [];
  this.createNewBlock(0, "0", "0");
}

Blockchain.prototype.createNewBlock = function (nonce, previousBlockHash, hash) {
  const newBlock = {
    index: this.chain.length,
    timestamp: Date.now(),
    transactions: this.pendingTransactions,
    nonce: nonce,
    hash: hash,
    previousBlockHash: previousBlockHash,
  };
  this.pendingTransactions = [];
  this.chain.push(newBlock);
  return newBlock;
};

Blockchain.prototype.getLastBlock = function () {
  return this.chain[this.chain.length - 1];
};

Blockchain.prototype.createNewTransaction = function (amount, sender, recipient) {
  const newTransactions = {
    transactionId: uuidv4().split("-").join(""),
    amount,
    sender,
    recipient,
  };
  return newTransactions;
};

Blockchain.prototype.addTransactionToPendingTransactions = function (newTransaction) {
  this.pendingTransactions.push(newTransaction);
  return this.getLastBlock().index + 1;
};

Blockchain.prototype.hashBlock = function (previousBlockHash, currentBlockData, nonce) {
  const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
  const hash = sha256(dataAsString);
  return hash;
};

Blockchain.prototype.proofOfWork = function (previousBlockHash, currentBlockData) {
  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  while (!hash.startsWith("0000")) {
    nonce++;
    hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  }
  return nonce;
};

module.exports = Blockchain;
