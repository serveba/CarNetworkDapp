# Car Network Dapp

## Car ownership, maintenance and revisions traceable through smart contracts. Files are stored on a decentralized way through IPFS

This application allows users to create cars (ERC721 tokens) and add events with facts and proofs that demonstrates the record of maintanance of a given car.

- It uses [open-zeppelin ERC721](https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/token/ERC721) safe implementation and builds the contract on top of that.

- The contract has custom modifiers and events.

- It has truffle support.

- The contract is well tested.

- Documents are stored in IPFS. The urls of the files are stored in the smart contract state variables.

## User stories

1. A user logs into the web app, linked with the Ethereum account.

2. The user can type car data and upload a car picture and mint a new token. File is stored on IPFS.

3. The user can add a new car event with fields and a file attached to the event.

4. The user can see its cars.

5. The user can see its car events.

## Code Commands

```bash
  Compile:        truffle compile
  Migrate:        truffle migrate
  Test contracts: truffle test
```

## Code Commands

Running the project:
```bash
  # run ganache locally at port 8545
  truffle test
  truffle migrate
  cd client
  yarn start
```
