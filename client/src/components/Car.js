import React from "react";
import CarEvent from "./CarEvent.js";

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

export default class Car extends React.Component {
  render() {    
    return (

      <Card >        
        <a href={this.props.pictureUrl} target="_blank">
          <img src={this.props.pictureUrl} width="128" height="128"></img>
        </a> 
        
        <Card.Body>
          <Card.Title>{this.props.make} {this.props.model}</Card.Title>
          <Card.Text>
            {
              this.props.description
            }
          </Card.Text>

          <h4>Car events: <Button variant="secondary" size="sm">New</Button></h4>     
          {this.props.events.map((e, index) => (
            <div key={index}>
              <CarEvent eventType={e.eventType} description={e.description} createdAt={e.createdAt} attachmentUrl={e.attachmentUrl}></CarEvent> 
            </div>            
          ))} 
        </Card.Body>
      </Card>
  );
}
}
