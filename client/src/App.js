import React, { Component } from "react";
// import SimpleStorageContract from "./contracts/SimpleStorage.json";
// import getWeb3 from "./getWeb3";
import ipfs from './ipfs'
import data from './data.json'
import Car from "./components/Car";
import CarCreationModal from "./components/CarCreationModal";

import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'


import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {      
      web3: null,
      carPictureBuffer: null,
      carEventBuffer: null,
      data: data,
      showCarCreationModal: false
      //account: null
    }

    // console.log(data.cars);
    this.captureCarFile = this.captureCarFile.bind(this);
    this.captureEventFile = this.captureEventFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  captureCarFile(event) {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({
        carPictureBuffer: Buffer(reader.result)
      })
      console.log('buffer', this.state.carPictureBuffer)
    }
  }

  captureEventFile(event) {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({
        carEventBuffer: Buffer(reader.result)
      })
      console.log('buffer', this.state.carEventBuffer)
    }
  }

  onSubmit(event) {
    event.preventDefault()
    ipfs.files.add(this.state.carPictureBuffer, (error, result) => {
      if (error) {
        console.error(error)
        return
      }
      console.log(result[0].hash);
    })
  }

  // state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    // try {
    //   // Get network provider and web3 instance.
    //   const web3 = await getWeb3();

    //   // Use web3 to get the user's accounts.
    //   const accounts = await web3.eth.getAccounts();

    //   // Get the contract instance.
    //   const networkId = await web3.eth.net.getId();
    //   const deployedNetwork = SimpleStorageContract.networks[networkId];
    //   const instance = new web3.eth.Contract(
    //     SimpleStorageContract.abi,
    //     deployedNetwork && deployedNetwork.address,
    //   );

    //   // Set web3, accounts, and contract to the state, and then proceed with an
    //   // example of interacting with the contract's methods.
    //   this.setState({ web3, accounts, contract: instance }, this.runExample);
    // } catch (error) {
    //   // Catch any errors for any of the above operations.
    //   alert(
    //     `Failed to load web3, accounts, or contract. Check console for details.`,
    //   );
    //   console.error(error);
    // }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  setShowCarCreationModal = (show) => {
    this.setState({
      showCarCreationModal: show
    })
  }

  render() {
    // if (!this.state.web3) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }
    return (


      <div className="App">
        <Jumbotron>
          <Container> 
            <h1>Welcome to Car Network Dapp!</h1> 
 
            <p>This decentralized application helps you for <b>tracking your car maintenance record on a secure way.</b> <br/>
            The Dapp uses Ethereum Test Network and IPFS for storing the data and the files respectively.</p>

            <p>This is my final Project for Consensys Ethereum Developer Bootcamp 2019.</p>

            <p> <b>*NOTE: </b>Because this is a proof of the concepts acquired through the course, the UI is very basic. </p> 
            <Button variant="primary" onClick={this.displayCarCreationModal}>New car</Button>
          </Container> 
        </Jumbotron>
        
        < CarCreationModal show={this.state.showCarCreationModal} ></CarCreationModal>        

        {/* 
        
        <div>
          <form onSubmit={this.onSubmit} >            
            <input type='file' onChange={this.captureFile} />
            <input type='submit' />
          </form>
        </div>
        */}

        <Container>
            {data.cars.map((c, index) => (              
              <Row key={index}>
                <Car                 
                    make={c.make} 
                    model={c.model} 
                    chassisId={c.chassisId} 
                    manufacturedYear={c.manufacturedYear} 
                    description={c.description} 
                    pictureUrl={c.pictureUrl}
                    events={c.events} >
                </Car>                               
              </Row>
            ))}        
        </Container>

                          

        
      </div>
    );
  }
}

export default App;
