const Blockchain = require("./blockchain");

const bitcoin = new Blockchain();

bitcoin.createNewBlock(285, "DUMMYHASH0", "DUMMYHADH2");
bitcoin.createNewTransaction(100, "DUMMYHASH2", "DUMMYHADH3");
bitcoin.createNewBlock(123, "DUMMYHASH4", "DUMMYHADH5");
bitcoin.createNewTransaction(100, "DUMMYHASH2", "DUMMYHADH3");
bitcoin.createNewTransaction(100, "DUMMYHASH2", "DUMMYHADH3");
bitcoin.createNewTransaction(100, "DUMMYHASH2", "DUMMYHADH3");
bitcoin.createNewBlock(123, "DUMMYHASH4", "DUMMYHADH5");

console.log(JSON.stringify(bitcoin, null, 2));
