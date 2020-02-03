import React from "react";

import Alert from 'react-bootstrap/Alert'

export default class CarEvent extends React.Component {
  render() {    
    return ( 
      <Alert variant="info">    
        {this.props.createdAt} - {this.props.eventType}: 
        {this.props.description}, &nbsp;
        <a href={this.props.attachmentUrl} target="_blank" rel="noopener noreferrer">Event Attachment</a>
      </Alert>     
    );
  }
}
