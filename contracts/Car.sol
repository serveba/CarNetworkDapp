pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";

import "@openzeppelin/contracts/ownership/Ownable.sol";

/*
  The car contract keeps track of the car owner, car data and all the car events
  during the car life
*/
contract Car is ERC721Full, Ownable {

  // for circuit breaker pattern
  bool private stopped = false;

  struct CarEvent {
    string eventType;
    string createdAt;
    // IPFS uri for event file attached
    string attachmentUrl;
    string description;
  }

  struct CarData {
    string make; 
    string model; 
    string chassisId; 
    uint manufacturingYear; 
    string description; 
    // IPFS uri for the picture
    string pictureUrl; 
    
    uint totalEvents;
    mapping(uint => CarEvent) events;    
  }

  mapping(address => uint) totalUserCars;  

  mapping(address => CarData[]) cars;  

  event LogCarCreation(string model, string chassisId, uint manufacturingYear, string description, string pictureUrl);

  event LogEventCreation(string eventType, string createdAt, string attachmentUrl, string description);

  /**
   * @dev Checks if the msg.sender has access to the token by checking token existence and ownership
   * @param tokenId identificator of the token
   */
  modifier hasAccessTo(uint tokenId) {
    require(_exists(tokenId));
    require(ownerOf(tokenId) == msg.sender);
    _;
  }

  modifier stopInEmergency { require(!stopped); _; }

  // ERC721 functions
  /**
   * @dev Defines the Car token when creating the contract 
   */
  constructor() ERC721Full("CarToken", "CAR") public { }

  /**
   * Circuit breaker pattern
   */
  function freeze() 
    public
    onlyOwner() 
     {
       stopped = true;    
  }

  /**
   * Circuit breaker pattern
   */
  function unfreeze() 
    public
    onlyOwner() 
     {
       stopped = false;    
  }

  /**
   * @dev Mints a token to the msg.sender address
   *
   * Anyone can mint a token
   */
  function mint(string memory _make, string memory _model, string memory _chassisId, uint _manufacturingYear, string memory _description, string memory _pictureUrl) 
    public
    stopInEmergency() {

      cars[msg.sender].push(CarData({
        make: _make,
        model: _model,
        chassisId: _chassisId,
        manufacturingYear: _manufacturingYear,
        description: _description,
        pictureUrl: _pictureUrl,
        totalEvents: 0
      }));

      totalUserCars[msg.sender] = totalUserCars[msg.sender] + 1;

      uint256 newTokenId = _getNextTokenId();
      _mint(msg.sender, newTokenId);      

      emit LogCarCreation(_model, _chassisId, _manufacturingYear, _description, _pictureUrl);
  }


  /**
   * @dev Creates a new car event for a given car tokenId
   * 
   * - Only car owner can retrieve events
   */
   function getCarData(uint _carIndex) 
      public 
      view 
      returns (string memory, string memory, string memory, uint, string memory, string memory) { 

        CarData storage c = cars[msg.sender][_carIndex];

        return (c.make, c.model, c.chassisId, c.manufacturingYear, c.description, c.pictureUrl);
   }

  /**
   * @dev Creates a new car event for a given car tokenId
   *
   * - The tokenId must exist.
   * - Only car owner can create car event.
   */
  function addCarEvent(uint _tokenId, string memory _eventType, string memory _createdAt, string memory _attachmentUrl, string memory _description) 
    public 
    hasAccessTo(_tokenId) 
    stopInEmergency() {

    uint totalEvents = cars[msg.sender][_tokenId-1].totalEvents;

    CarEvent memory evt = CarEvent({
      eventType: _eventType,
      createdAt: _createdAt,
      attachmentUrl: _attachmentUrl,
      description: _description
    });

    cars[msg.sender][_tokenId-1].events[totalEvents] = evt;

    cars[msg.sender][_tokenId-1].totalEvents = totalEvents + 1;

    emit LogEventCreation(_eventType, _createdAt, _attachmentUrl, _description);
  }


  function carEventsCount(uint _tokenId) 
      public 
      view 
      hasAccessTo(_tokenId)
      returns (uint) {

    return cars[msg.sender][_tokenId-1].totalEvents;
  }

  

  /**
   * @dev Creates a new car event for a given car tokenId
   * 
   * - Only car owner can retrieve events
   */
   function getCarEvent(uint _tokenId, uint _eventIndex) 
      public 
      view 
      hasAccessTo(_tokenId)
      returns (string memory, string memory, string memory, string memory) { 
     
     CarEvent storage evt = cars[msg.sender][_tokenId-1].events[_eventIndex];

     return (evt.eventType, evt.createdAt, evt.attachmentUrl, evt.description);     
   }


  /**
   * @dev calculates the next token ID based on totalSupply
   * @return uint256 for the next token ID
   */
  function _getNextTokenId() private view returns (uint256) {
    return totalSupply().add(1); 
  }

}
