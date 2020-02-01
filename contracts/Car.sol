pragma solidity ^0.5.0;

import "../node_modules/zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

/*
  The car contract keeps track of the car owner, car data and all the car events
  during the car life
*/
contract Car is ERC721Token {

  string make;

  string model;

  string chassisId;

  string manufacturingYear;

  string description;

  // IPFS uri for the picture
  string pictureURL;

  enum EventType { Revision, Reparation }

  struct CarEvent {
    EventType eventType;
    string createdAt;
    // IPFS uri for event file attached
    string attachmentUrl;
    string description;
  }
  
  // tokenId - carEvent
  mapping(uint => CarEvent) carEvents;

  event LogCarCreation(string model, string chassisId, string manufacturingYear, string description, string pictureURL);

  event LogEventCreation(EventType eventType, string createdAt, string attachmentUrl, string description);

  // Checks if the msg.sender has access to the token by checking token existence and ownership
  modifier hasAccessTo(uint tokenId) {
    require(exists(_tokenId));
    require(tokenOwner[_tokenId] == msg.sender);
  }

  // ERC721 functions
  /**
   * @dev Defines the Car token when creating the contract
   * @param name 
   * @param symbol 
   */
  constructor() ERC721Token("CarToken", "CAR") public { }

  /**
   * @dev Mints a token to the msg.sender address
   */
  function mint(string _make, string _model, string _chassisId, string _manufacturingYear, string _description, string _pictureURL) 
    public returns (uint){

      make = _make;
      model = _model;
      chassisId = _chassisId;
      manufacturingYear = _manufacturingYear;
      description = _description;
      pictureURL = _pictureURL;

      uint256 newTokenId = _getNextTokenId();
      _mint(msg.sender, newTokenId);      

      LogCarCreation(model, chassisId, manufacturingYear, description, pictureURL);

      return newTokenId;
  }

  /**
   * @dev Creates a new car event for a given car tokenId
   *
   * - The tokenId must exist.
   * - Only car owner can create car event.
   */
  function addCarEvent(uint _tokenId, EventType _eventType, string _createdAt, string _attachmentUrl, string _description) 
    public 
    hasAccessTo(_tokenId) {

    carEvents[tokenId] = CarEvent{
      eventType: _eventType,
      createdAt: _createdAt,
      attachmentUrl: _attachmentUrl,
      description: _description
    }

    LogEventCreation(_eventType, _createdAt, _attachmentUrl, _description);
  }

  /**
   * @dev Creates a new car event for a given car tokenId
   * 
   * - Only car owner can retrieve events
   */
   function getCarEvent(uint _tokenId) 
      public 
      view 
      hasAccessTo(_tokenId)
      returns (EventType, string, string, string) { 

     CarEvent evt = carEvents[_tokenId]; 

     return evt.eventType, evt.createdAt, evt.attachmentUrl, evt.description;     
   }


  /**
   * @dev calculates the next token ID based on totalSupply
   * @return uint256 for the next token ID
   */
  function _getNextTokenId() private view returns (uint256) {
    return totalSupply().add(1); 
  }

}
