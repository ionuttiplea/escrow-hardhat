# Decentralized Escrow Application

This is an Escrow Dapp built with [Hardhat](https://hardhat.org/).

## Project Layout

There are three top-level folders:

1. `/app` - contains the front-end application
2. `/contracts` - contains the solidity contract
3. `/tests` - contains tests for the solidity contract

## Setup

Install dependencies in the top-level directory with `npm install`.

After you have installed hardhat locally, you can use commands to test and compile the contracts, among other things. To learn more about these commands run `npx hardhat help`.

Compile the contracts using `npx hardhat compile`. The artifacts will be placed in the `/app` folder, which will make it available to the front-end. This path configuration can be found in the `hardhat.config.js` file.

## Front-End

`cd` into the `/app` directory and run `npm install`

To run the front-end application run `npm start` from the `/app` directory. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## My Work
All the work until here has been done by Alchemy University, check their repo here : https://github.com/alchemyplatform/escrow-hardhat.git

Checkout the course here : https://university.alchemy.com/course/ethereum

First thing : I used metamask for the wallet, Apex didn't work properly for me.

### Challenge 1
 Deploying a contract works out of the box since the react application connects to the ethereum provider that already exists on the window. It will connect to the network that the wallet is connected to.

### Challenge 2
 I just modified the styling a bit, I don't really have artistic sense.

### Challenge 3
 I used `ethers.utils.parseEther` in order to convert the ether into wei before deploying the contract. I replaced 'wei' with 'ether' wherever it was present in the front-end.

### Challenge 4 
This was quite challenging I must say, I created a node server in `./app/src/persistence.js`. </br>
It has 3 routes : </br>
    <li>`/getContracts` - to retrieve all the created contracts so far</li>
    <li>`/postContract` - to add a new contract to the existing contracts</li>
    <li>`/approve`      - to change the approval state of the contract( used for displaying the proper element in front-end and keep track of approved contracts)</li>

To run the server run `npx hardhat run /app/src/persistence.js`
The server runs on  `http://localhost:8081`, this can be changed to whatever port you might like.

### Challenge 5
This one is actually related to challenge 4 , most likely I could have done this better with time is kind of low so this is the final product.

Is not something too complicated but I had to find a way to define the function `handleApprove()` after retrieving the contracts from the server since on the server I only stored some data about the contract and not the contract itself. 

To do this I added another function in `deploy.js` called `getContract` that receives 2 parameters, the contract address and the current signer/provider that would initiate the next transaction. It would get an instance of the contract with the given address and connect the signer to it.