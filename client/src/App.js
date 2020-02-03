import React, { Component } from "react";
// import SimpleStorageContract from "./contracts/SimpleStorage.json";
// import getWeb3 from "./getWeb3";
import ipfs from './ipfs'
import data from './data.json'
import CarEvent from "./components/CarEvent";

import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'

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
      showCarCreationModal: false,
      showEventCreationModal: false,
      carIndexForEvent: 0,
      
      make: '',
      model: '',
      chassisId: '',
      manufacturedYear: '',
      description: '',

      eventType: '',
      createdAt: '',
      eventDescription: ''



      //account: null
    }

    // console.log(data.cars);
    this.captureCarFile = this.captureCarFile.bind(this);
    this.captureEventFile = this.captureEventFile.bind(this);
    this.onCarSubmit = this.onCarSubmit.bind(this);
    this.onEventSubmit = this.onEventSubmit.bind(this);


    this.handleInputChange = this.handleInputChange.bind(this);

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

  onCarSubmit(event) {
    event.preventDefault()
    console.log(this.state);
    ipfs.files.add(this.state.carPictureBuffer, (error, result) => {
      if (error) {
        console.error(error)
        return
      }
      console.log(result[0].hash);
      this.addNewCar('https://ipfs.io/ipfs/' + result[0].hash)
      this.handleHideCarCreationModal()      
    })
  }

  onEventSubmit(event) {
    event.preventDefault()
    console.log(this.state);
    ipfs.files.add(this.state.carEventBuffer, (error, result) => {
      if (error) {
        console.error(error)
        return
      }
      console.log(result[0].hash);
      this.addNewEvent('https://ipfs.io/ipfs/' + result[0].hash)
      this.handleHideEventCreationModal()
    })
  }


  addNewCar(pictureUrl) {
    const newCar = {
      make: this.state.make,
      model: this.state.model,
      chassisId: this.state.chassisId,
      manufacturedYear: this.state.manufacturedYear,
      pictureUrl: pictureUrl,
      events: []
    }   

    console.log(this.state.data.cars.concat(newCar))

    this.setState({
      data: {cars: this.state.data.cars.concat(newCar)}
    })    
  }

  addNewEvent(attachmentUrl) {
    const newEvent = {
      eventType: this.state.eventType,
      createdAt: this.state.createdAt,
      description: this.state.eventDescription,
      attachmentUrl: attachmentUrl
    }

    const carsCopy = [...this.state.data.cars]

    carsCopy[this.state.carIndexForEvent].events = carsCopy[this.state.carIndexForEvent].events.concat(newEvent)    

    console.log(carsCopy)
    this.setState({
      data: {
        cars: carsCopy
      }
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

  handleShowCarCreationModal = () => this.setState({showCarCreationModal: true})
  handleHideCarCreationModal = () => this.setState({showCarCreationModal: false})
  
  handleShowEventCreationModal = (e) => {    
    this.setState({
      showEventCreationModal: true,
      carIndexForEvent: parseInt(e.target.name, 10)
    })
  }

  handleHideEventCreationModal = () => this.setState({showEventCreationModal: false})

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
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
            <Button variant="primary" onClick={this.handleShowCarCreationModal}>New car</Button>
          </Container> 
        </Jumbotron>
        
        <Container>
            {this.state.data.cars.map((c, index) => (              
              <Row className = "d-flex justify-content-center" style={{marginTop: 1 + 'em'}} key={index}>
                <Card >            
                  <Card.Body>
                    <Row className="d-flex justify-content-center">
                      <a href={c.pictureUrl} target="_blank" rel="noopener noreferrer">
                        <img src={c.pictureUrl} width="128" height="128" alt=""></img>
                      </a> 

                    </Row>
                    <Card.Title>{c.make} {c.model}</Card.Title>
                    <Card.Text>
                      {
                        c.description
                      }
                    </Card.Text>

                    <h4>Car events: <Button variant="secondary" size="sm" name={index} onClick={this.handleShowEventCreationModal}>New</Button></h4>     
                    {c.events.map((e, index) => (
                      <div key={index}>
                        <CarEvent eventType={e.eventType} description={e.description} createdAt={e.createdAt} attachmentUrl={e.attachmentUrl}></CarEvent> 
                      </div>            
                    ))} 
                  </Card.Body>
                </Card>
              </Row>              
            ))}        
        </Container> 


        <Modal show={this.state.showCarCreationModal}>
          <Modal.Header>
            <Modal.Title>Creating new Car</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.onCarSubmit}>
              <Form.Group controlId="formMake">
                <Form.Label>Make</Form.Label>
                <Form.Control type="text" placeholder="Car Make" name="make" value={this.state.make} onChange={this.handleInputChange}  required />              
              </Form.Group>

              <Form.Group controlId="formModel">
                <Form.Label>Model</Form.Label>
                <Form.Control type="text" placeholder="Car Model" name="model" value={this.state.model} onChange={this.handleInputChange}  required />              
              </Form.Group>

              <Form.Group controlId="formChassisId">
                <Form.Label>Chassis number</Form.Label>
                <Form.Control type="text"  placeholder="Chassis number" name="chassisId" value={this.state.chassisId} onChange={this.handleInputChange}  required />              
              </Form.Group>

              <Form.Group controlId="formManufacturedYear">
                <Form.Label>Manufactured year</Form.Label>
                <Form.Control type="number" maxLength="4" placeholder="Year" name="manufacturedYear" value={this.state.manufacturedYear} onChange={this.handleInputChange}  required/>              
              </Form.Group>

              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>              
                <Form.Control as="textarea" rows="3"  placeholder="Description" name="description" value={this.state.description} onChange={this.handleInputChange}  required />
              </Form.Group>

              <Form.Group controlId="formFile">
                <Form.Label>Car picture</Form.Label>              
                <Form.Control type="file"  name="pictureUrl" onChange={this.captureCarFile}  required/>
              </Form.Group>

              <Button variant="primary" type="submit">Save car </Button>  &nbsp;&nbsp;
              <Button variant="secondary" onClick={this.handleHideCarCreationModal}> Cancel </Button> 

            </Form>
          </Modal.Body>
        </Modal>

          <Modal show={this.state.showEventCreationModal}>
            <Modal.Header>
              <Modal.Title>Creating new Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={this.onEventSubmit}>
                <Form.Group controlId="formEventType">
                  <Form.Label>Event type</Form.Label>
                  <Form.Control type="text" placeholder="Event type" name="eventType" value={this.state.eventType} onChange={this.handleInputChange}  required />              
                </Form.Group>

                <Form.Group controlId="formCreatedAt">
                  <Form.Label>Created at</Form.Label>
                  <Form.Control type="text" placeholder="Created at" name="createdAt" value={this.state.createdAt} onChange={this.handleInputChange}  required />              
                </Form.Group>   

                <Form.Group controlId="formEventDescription">
                  <Form.Label>Description</Form.Label>              
                  <Form.Control as="textarea" rows="3"  placeholder="eventDescription" name="eventDescription" value={this.state.eventDescription} onChange={this.handleInputChange}  required />
                </Form.Group>

                <Form.Group controlId="formEventFile">
                  <Form.Label>Event file attachment</Form.Label>              
                  <Form.Control type="file"  name="attachmentUrl" onChange={this.captureEventFile}  required/>
                </Form.Group>

                <Button variant="primary" type="submit">Save event </Button>  &nbsp;&nbsp;
                <Button variant="secondary" onClick={this.handleHideEventCreationModal}> Cancel </Button> 

              </Form>
            </Modal.Body>
          </Modal>    

      </div>
    );
  }
}

export default App;
