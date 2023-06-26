import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import {deploy, getContract} from './deploy';
import Escrow from './Escrow';
import axios from 'axios';

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

async function postContract( data ){
  axios.post('http://localhost:8081/postContract', data)
    .then( response => {
      console.log(response);
    })
    .catch ( error => {
      console.log(error);
    })
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    // this can be done better, the logic is kind of hard to grasp this way
    async function getContracts(){
      axios.get('http://localhost:8081/getContracts')
        .then( response => {
          const data = response.data;
          data.forEach( async escrow => {
            const escrowContract = await getContract(escrow.address, signer);

            escrow.handleApprove = async () => {
              escrowContract.on('Approved', () => {
                document.getElementById(escrowContract.address).className =
                  'complete';
                document.getElementById(escrowContract.address).innerText =
                  "✓ It's been approved!";
              });

              await approve(escrowContract, signer);

              axios.post('http://localhost:8081/getContracts', {address : escrow.address});
            };
          });
          setEscrows(response.data);
        })
        .catch ( error => {
          console.log(error);
        })
    }

    getAccounts();
    getContracts();
  }, [account]);

  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    const value = document.getElementById('ether').value;
    const escrowContract = await deploy(signer, arbiter, beneficiary, ethers.utils.parseEther(value));

    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      approved : false,
      handleApprove: async () => {
        escrowContract.on('Approved', () => {
          document.getElementById(escrowContract.address).className =
            'complete';
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!";
          axios.post('http://localhost:8081/approve', {address : escrowContract.address});
        });

        await approve(escrowContract, signer);
      },
    };

    setEscrows([...escrows, escrow]);
    postContract(escrow);
  }

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in Ether)
          <input type="text" id="ether" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>
    </>
  );
}

export default App;
