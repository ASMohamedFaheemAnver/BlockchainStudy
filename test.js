const Blockchain = require("./blockchain");

const bitcoin = new Blockchain();

bitcoin.createNewBlock(285, "DUMMYHASH0", "DUMMYHADH2");
bitcoin.createNewBlock(280, "DUMMYHASH2", "DUMMYHADH3");
bitcoin.createNewBlock(288, "DUMMYHASH3", "DUMMYHADH4");

console.log(bitcoin);
