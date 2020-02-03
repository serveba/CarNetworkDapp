import React, {useState} from "react";

import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

export default class CarCreationModal extends React.Component {
  render() {    
    // const [setShowCarCreationModal] = useState(false);
  
    // const handleClose = () => setShowCarCreationModal(false);

    const handleClose = () => console.log('handleClose');

    return (
      <Modal show={this.props.show}>
        <Modal.Header closeButton onHide={handleClose}>
          <Modal.Title>Creating new Car</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group controlId="formMake">
              <Form.Label>Make</Form.Label>
              <Form.Control type="text" name="make"  placeholder="Car Make" required />              
            </Form.Group>

            <Form.Group controlId="formModel">
              <Form.Label>Model</Form.Label>
              <Form.Control type="text" name="model"  placeholder="Car Model" required />              
            </Form.Group>

            <Form.Group controlId="formChassisId">
              <Form.Label>Chassis number</Form.Label>
              <Form.Control type="text" name="chassisId"  placeholder="Chassis number" required />              
            </Form.Group>

            <Form.Group controlId="formManufacturedYear">
              <Form.Label>Manufactured year</Form.Label>
              <Form.Control type="number" maxLength="4" name="manufacturedYear"  placeholder="Year" required/>              
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>              
              <Form.Control as="textarea" rows="3"  name="description"  placeholder="Description" required />
            </Form.Group>

            <Form.Group controlId="formFile">
              <Form.Label>Car picture</Form.Label>              
              <Form.Control type="file"  name="pictureUrl" required/>
            </Form.Group>

            <Button variant="primary" type="submit">
              Save car
            </Button>            
             
             <Button onClick={handleClose}>Cancel</Button>

          </Form>
        </Modal.Body>

      </Modal>      
    );
  }
}
