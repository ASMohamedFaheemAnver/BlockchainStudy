const Blockchain = require("./blockchain");

const bitcoin = new Blockchain();

const previousBlockHash = "OOFAJFJIAFLLLLLLKJFKAFLKAFKAJ";
const currentBlockData = [
  {
    amount: 101,
    sender: "OOFAJFJIAFLLLLLLKJFKAFLKAFKAJ",
    recipient: "OOFAJFJIAFLLLLLLKJFKAFLKAFKAJ",
  },
  {
    amount: 200,
    sender: "OOFAJFJIAFLLLLLLKJFKAFLKAFKAJ",
    recipient: "OOFAJFJIAFLLLLLLKJFKAFLKAFKAJ",
  },
  {
    amount: 400,
    sender: "OOFAJFJIAFLLLLLLKJFKAFLKAFKAJ",
    recipient: "OOFAJFJIAFLLLLLLKJFKAFLKAFKAJ",
  },
];

const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
const hash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
console.log(hash);
