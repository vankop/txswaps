require('dotenv').config();
const fs = require('fs');
const path = require('path');
const ethers = require('ethers');
const provider = new ethers.JsonRpcProvider(process.env.NODE_URL);

const fixturesPath = path.resolve(__dirname, 'tests', 'fixtures');
const TRANSACTIONS = [
  '0xa91fa21893a99ca5c46eb900f6c37aff33f3ecae98b4be14a2a80bbaa21a3e2c',
  // '0xc0cb410db3a7dcc612b49d43ab8e5b5a3caa0cb9be3a83546ad288037803450f',
  // '0x4b80fb07b0bdeecb6546cff91a570913b4e3b640f84d2bed3ccea2b7a8c84299',
  // '0x400342224488519eaadc4a01ff03868f1c263b4797fa3746721ea9eca732f932',
  // '0x59b82259f1211c3a02cd2c42805544e9aed0aac1e0a12b78bf6fa14939a94cd3',
  // '0xf24d55cb97389fed04dbadd98227a782c557466ee073d5da43c2c122842eb49c',
  // '0x59b82259f1211c3a02cd2c42805544e9aed0aac1e0a12b78bf6fa14939a94cd3',
  // '0x2ae835ac525e51e7895839ac8c8e8f160361de6c308ad567ef4c023bdc32aa99',
  // '0xaf37e501f5c4e8c19a346785f79b2e0c9977d781120c89960b2eb7c5b50050cf'
];

async function main() {
  for (const txhash of TRANSACTIONS) {
    const tx = await provider.getTransaction(txhash);
    const receipt = await provider.getTransactionReceipt(txhash);
    const data = {
      transaction: {
        hash: tx.hash,
        data: tx.data,
        from: tx.from,
        to: tx.to,
        value: tx.value
      },
      receipt: {
        logs: Array.from(receipt)
      }
    };
    fs.promises.writeFile(path.resolve(fixturesPath, `${tx.hash}.json`), JSON.stringify(data, (key, value) =>
      typeof value === 'bigint'
        ? value.toString()
        : value // return everything else unchanged
    ));
  }
}

main();

