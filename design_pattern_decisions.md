# Design Pattern Decissions

The application contains an smart contract that inherits from ERC721Full contract from openzeppelin library.

I use the pattern "Fail early and fail loud" using one custom modifier "hasAccessTo" in several functions. This idea encourages failing early and aborting execution ASAP.

Also a circuit breaker (emergency stop) pattern for freezing the contract with unit tests included.
